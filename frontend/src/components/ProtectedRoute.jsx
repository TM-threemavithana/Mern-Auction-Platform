import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const location = useLocation();
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (roles?.length && !roles.includes(user?.role)) return <Navigate to="/" replace />;
  return children;
};

ProtectedRoute.propTypes = { children: PropTypes.node.isRequired, roles: PropTypes.arrayOf(PropTypes.string) };
export default ProtectedRoute;
