import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, updateDoc, getDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const RateSupplier = () => {
  const [rating, setRating] = useState(null);
  const [comment, setComment] = useState("");
  const [thankYou, setThankYou] = useState(false);

  const navigate = useNavigate();
  const { supplierId } = useParams();

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!rating || !supplierId) return;

  try {
    const supplierRef = doc(db, "suppliers", supplierId);
    const supplierSnap = await getDoc(supplierRef);

    if (supplierSnap.exists()) {
      const data = supplierSnap.data();
      const prevSum = data.ratingSum || 0;
      const prevCount = data.ratingCount || 0;

      const newSum = prevSum + parseInt(rating);
      const newCount = prevCount + 1;
    
      await updateDoc(supplierRef, {
  ratingSum: newSum,
  ratingCount: newCount,
  comments: data.comments
    ? [...data.comments, { text: comment || "" }]
    : [{ text: comment || "" }],
});


      setThankYou(true);
      setComment("");
      setRating(null);
      setTimeout(() => navigate("/vendor-dashboard"), 1500);
    }
  } catch (err) {
    console.error("Error rating supplier:", err);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg text-center">
        <h2 className="text-3xl font-bold text-blue-700 mb-2">Rate This Supplier 🧑‍💼</h2>
        <p className="text-sm text-gray-600 mb-6">Help others by rating your experience.</p>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-3xl ${rating >= star ? "text-yellow-400" : "text-gray-300"} hover:scale-110 transition`}
              >
                ★
              </button>
            ))}
          </div>

          <p className="text-sm text-gray-500 italic mb-4">Tap to rate ⭐</p>

          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 resize-none"
            rows="4"
            placeholder="Optional comments... 💬"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
            disabled={!rating}
          >
            Submit Feedback 📤
          </button>
        </form>

        {thankYou && (
          <div className="mt-4 text-green-600 font-medium">🎉 Thanks for your feedback!</div>
        )}
      </div>
    </div>
  );
};

export default RateSupplier;
