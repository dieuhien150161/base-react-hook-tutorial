import { React, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { handleLoginRedux } from "../redux/actions/userAction";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const isLoading = useSelector((state) => state.user.isLoading);
  const account = useSelector((state) => state.user.account);
  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Email/Password is required!!!");
      return;
    }
    dispatch(handleLoginRedux(email, password));
  };

  const handleRollback = () => {
    navigate("/");
  };

  const handlePressEnter = (event) => {
    if (event?.key === "Enter") {
      handleLogin();
    }
  };

  useEffect(() => {
    if (account && account.auth === true) {
      navigate("/");
    }
  }, [account]);

  return (
    <div className="login-container col-12 col-sm-4">
      <div className="title">Login</div>
      <div className="text">Email or username(eve.holt@reqres.in)</div>
      <input
        type="text"
        placeholder="Email or username..."
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        onKeyDown={(event) => handlePressEnter(event)}
      />
      <div className="input-2">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          onKeyDown={(event) => handlePressEnter(event)}
        />
        <i
          className={showPassword ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}
          onClick={() => setShowPassword(!showPassword)}
        ></i>
      </div>
      <button
        className={email && password ? "active" : ""}
        disabled={email && password ? false : true}
        onClick={() => handleLogin()}
      >
        {isLoading && <i class="fas fa-spinner fa-spin"></i>} &nbsp; Login
      </button>
      <div className="back">
        <i className="fa-solid fa-backward"></i>{" "}
        <span onClick={() => handleRollback()}>Go back</span>
      </div>
    </div>
  );
};

export default Login;
