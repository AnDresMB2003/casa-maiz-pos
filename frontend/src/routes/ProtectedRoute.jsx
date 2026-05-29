import {
  Navigate,
} from "react-router-dom";

import useAuth from "../context/useAuth";

function ProtectedRoute({
  children,
}) {

  const {
    user,
  } = useAuth();

  // NOT AUTHENTICATED
  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // AUTHENTICATED
  return children;
}

export default ProtectedRoute;