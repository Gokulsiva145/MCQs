import { Navigate } from "react-router-dom";
import { getUserEmail } from "./Common";

const PrivateRoute = ({ children }) => {
  return getUserEmail() != null ? children : <Navigate to="/" />;
};

export default PrivateRoute;
