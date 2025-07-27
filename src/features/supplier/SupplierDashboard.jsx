import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const SupplierDashboard = () => {
  const [supplier, setSupplier] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedProduct, setEditedProduct] = useState({ name: "", rate: "" });

  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const fetchSupplierData = async () => {
      const docRef = doc(db, "suppliers", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setSupplier({
          ...data,
          products: data.products || [],
          comments: data.comments || [],
          rating: data.rating || 0,
          ratingCount: data.ratingCount || 0,
        });
      } else {
        console.log("No supplier profile found!");
      }
    };

    fetchSupplierData();
  }, [user]);

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditedProduct(supplier.products[index]);
  };

  const handleDelete = async (index) => {
    const updatedProducts = [...supplier.products];
    updatedProducts.splice(index, 1);

    await updateDoc(doc(db, "suppliers", user.uid), {
      products: updatedProducts,
    });

    setSupplier((prev) => ({ ...prev, products: updatedProducts }));
  };

  const handleSaveEdit = async () => {
    const updatedProducts = [...supplier.products];
    updatedProducts[editingIndex] = editedProduct;

    await updateDoc(doc(db, "suppliers", user.uid), {
      products: updatedProducts,
    });

    setSupplier((prev) => ({ ...prev, products: updatedProducts }));
    setEditingIndex(null);
    setEditedProduct({ name: "", rate: "" });
  };

  if (!supplier) {
    return <div className="text-center mt-10 text-gray-600">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-5xl font-bold text-center text-blue-700 mb-6">
        Supplier Dashboard
      </h1>

      {/* Profile Summary */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Profile Summary</h2>
        <p><strong>Name:</strong> {supplier.name}</p>
        <p><strong>Location:</strong> {supplier.location}</p>
        <button
          onClick={() => navigate("/supplier-profile")}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Edit Profile
        </button>
      </div>

      {/* Rating & Comments */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
  <h2 className="text-xl font-semibold mb-2 text-gray-800">Your Rating</h2>

  {typeof supplier.ratingSum === "number" && supplier.ratingCount > 0 ? (
    <p className="text-gray-700 text-lg mb-4">
      <span className="font-bold text-yellow-500">
        {(supplier.ratingSum / supplier.ratingCount).toFixed(1)} ★
      </span>{" "}
      from <span className="font-semibold">{supplier.ratingCount}</span> ratings
    </p>
  ) : (
    <p className="text-gray-500 italic mb-4">
      You haven’t received any ratings yet.
    </p>
  )}


        <h3 className="text-lg font-semibold text-gray-800 mb-2">Recent Comments</h3>
        {supplier.comments && supplier.comments.length > 0 ? (
          <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
            {supplier.comments
              .slice(-3)
              .reverse()
              .map((comment, index) => (
                <li key={index} className="border-l-4 border-blue-500 pl-3">
                  {comment.text}
                </li>
              ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No comments yet.</p>
        )}
      </div>

      {/* Product List */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Products</h2>

        {supplier.products.length === 0 ? (
          <p className="text-gray-500">No products added yet.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {supplier.products.map((product, idx) => (
              <div key={idx} className="border p-4 rounded-md shadow-sm bg-gray-50">
                {editingIndex === idx ? (
                  <>
                    <input
                      type="text"
                      value={editedProduct.name}
                      onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
                      className="border p-1 rounded w-full mb-2"
                      placeholder="Product name"
                    />
                    <input
                      type="number"
                      value={editedProduct.rate}
                      onChange={(e) => setEditedProduct({ ...editedProduct, rate: Number(e.target.value) })}
                      className="border p-1 rounded w-full mb-2"
                      placeholder="Rate per kg"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveEdit}
                        className="bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingIndex(null)}
                        className="bg-gray-400 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-lg">{product.name}</p>
                    <p className="text-sm text-gray-600">₹{product.rate} per kg</p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleEdit(idx)}
                        className="text-sm bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(idx)}
                        className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierDashboard;
