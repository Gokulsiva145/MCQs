import { Navigate } from "react-router-dom";
import { getUserTypeId } from "./Common";

export const PrivateRouteUser = ({ children }) => {
  return getUserTypeId() !== 3 ? children : <Navigate to="/" />;
};

export const PrivateRouteStudent = ({ children }) => {
  return getUserTypeId() === 3 ? children : <Navigate to="/" />;
};
