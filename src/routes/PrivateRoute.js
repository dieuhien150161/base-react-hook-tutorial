import { useSelector } from "react-redux";

const PrivateRoute = (props) => {
  const user = useSelector((state) => state.user.account);
  if (!user?.auth) {
    return <>You don't have permisson to access this route</>;
  }
  return <>{props.children}</>;
};

export default PrivateRoute;
