import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase/firebase"; // adjust the path if needed
import {doc,getDoc,updateDoc} from "firebase/firestore";
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
        setSupplier(docSnap.data());
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

      {/* Product List */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Products</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {supplier?.products?.map((product, idx) => (
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
                  <button
                    onClick={handleSaveEdit}
                    className="bg-green-600 text-white px-3 py-1 rounded mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingIndex(null)}
                    className="bg-gray-400 text-white px-3 py-1 rounded"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <p className="font-medium">{product.name}</p>
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
      </div>
    </div>
  );
};

export default SupplierDashboard;
