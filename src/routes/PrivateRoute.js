import { Routes, Route } from "react-router-dom";
import TableUsers from "../components/TableUsers";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const PrivateRoute = (props) => {
  const { user } = useContext(UserContext);
  if (!user?.auth) {
    return <>You don't have permisson to access this route</>;
  }
  return <>{props.children}</>;
};

export default PrivateRoute;
