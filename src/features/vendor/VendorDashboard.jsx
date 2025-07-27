import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';

const VendorDashboard = () => {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'suppliers'));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSuppliers(data);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    };

    fetchSuppliers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-12">
      <h1 className="text-5xl font-bold mb-10 text-center text-blue-700">
        Vendor Dashboard
      </h1>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {suppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <h2 className="text-2xl font-semibold text-gray-800">{supplier.name}</h2>
            <p className="text-gray-600 text-sm mt-1">📍 {supplier.location || "Not Provided"}</p>

            <div className="mt-4">
              <h3 className="font-semibold text-md text-gray-700 mb-1">Products:</h3>
              {Array.isArray(supplier.products) && supplier.products.length > 0 ? (
                <ul className="text-sm text-gray-600 list-disc list-inside">
                  {supplier.products.map((product, idx) => (
                    <li key={idx}>
                      {product.name} - ₹{product.rate}/kg
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 italic">No products listed.</p>
              )}
            </div>

            <p className="mt-4 text-sm">
              <span className="font-medium text-gray-700">Rating: </span>
              <span className="font-bold text-blue-600">{supplier.rating || 'N/A'}</span>
            </p>

            {supplier.fssaiURL && (
              <a
                href={supplier.fssaiURL}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-3 text-blue-500 text-sm hover:underline"
              >
                🔗 View FSSAI Certificate
              </a>
            )}

            <button className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl transition">
              ⭐ Rate Supplier
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorDashboard;
