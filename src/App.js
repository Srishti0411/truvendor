import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./features/auth/Signup";
import Login from "./features/auth/login";
import SupplierProfile from "./features/supplier/SupplierProfile";
import SupplierDashboard from "./features/supplier/SupplierDashboard";
import VendorDashboard from "./features/vendor/VendorDashboard";
import RateSupplier from "./features/vendor/RateSupplier";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/supplier-profile" element={<SupplierProfile />} />
        <Route path="/supplier/dashboard" element={<SupplierDashboard />} />
        <Route path="/vendor-dashboard" element={<VendorDashboard />} />
        <Route path="/rate-supplier/:supplierId" element={<RateSupplier />} />
      </Routes>
    </Router>
  );
};

export default App;
