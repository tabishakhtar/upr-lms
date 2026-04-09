import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {

 const userRole = localStorage.getItem("role");

 // ❌ NOT LOGGED IN
 if (!userRole) {
  return <Navigate to="/" />;
 }

 // ✅ NEW: SUPPORT MULTIPLE ROLES
 if (role) {

  // if role is array → check includes
  if (Array.isArray(role)) {
   if (!role.includes(userRole)) {
    return <Navigate to="/" />;
   }
  }

  // if single role → old behavior
  else {
   if (userRole !== role) {
    return <Navigate to="/" />;
   }
  }

 }

 return children;
}

export default ProtectedRoute;