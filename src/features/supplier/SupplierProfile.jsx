import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";

const SupplierProfile = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState("");
  const [newRate, setNewRate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      const docRef = doc(db, "suppliers", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setName(data.name || "");
        setLocation(data.location || "");
        setProducts(data.products || []);
      }
    };
    fetchProfile();
  }, []);

  const handleAddProduct = () => {
    if (newProduct && newRate) {
      setProducts((prev) => [...prev, { name: newProduct, rate: Number(newRate) }]);
      setNewProduct("");
      setNewRate("");
    }
  };

  const handleSave = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    await setDoc(doc(db, "suppliers", uid), {
      name,
      location,
      products: products,
      rating: 0,
      trustScore: 0,
    }, { merge: true });
    navigate("/supplier/dashboard");
  };

  const handleRemoveProduct = (index) => {
    const updated = [...products];
    updated.splice(index, 1);
    setProducts(updated);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">Supplier Profile</h1>
        <p className="text-sm text-center text-gray-500 mb-4">
          Update your name, location and the products you sell.
        </p>

        <input
          className="w-full mb-4 p-3 border border-gray-300 rounded"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full mb-4 p-3 border border-gray-300 rounded"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <h2 className="text-lg font-semibold mb-2">Products</h2>
        <div className="flex mb-4 gap-2">
          <input
            className="flex-1 p-2 border border-gray-300 rounded"
            placeholder="New Product"
            value={newProduct}
            onChange={(e) => setNewProduct(e.target.value)}
          />
          <input
            className="w-32 p-2 border border-gray-300 rounded"
            placeholder="Rate"
            value={newRate}
            onChange={(e) => setNewRate(e.target.value)}
            type="number"
          />
          <button
            onClick={handleAddProduct}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add
          </button>
        </div>

        <ul className="mb-4">
          {products.map((item, i) => (
            <li
              key={i}
              className="flex justify-between items-center border-b py-2 text-gray-700"
            >
              <span>{item.name} - ₹{item.rate}/kg</span>
              <button
                className="text-red-500 text-sm hover:underline"
                onClick={() => handleRemoveProduct(i)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white w-full py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
};

export default SupplierProfile;
