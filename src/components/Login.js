import { useState, React, useEffect } from "react";
import { loginApi } from "../services/UserService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    // eve.holt@reqres.in
    let res = await loginApi(email, password);
    if (res?.token) {
      localStorage.setItem("token", res.token);
      navigate("/");
    } else {
      if (res?.status === 400) {
        toast.error(res.data.error);
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="login-container col-12 col-sm-4">
      <div className="title">Login</div>
      <div className="text">Email or username(eve.holt@reqres.in)</div>
      <input
        type="text"
        placeholder="Email or username..."
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <div className="input-2">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
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
        <i className="fa-solid fa-backward"></i> Go back
      </div>
    </div>
  );
};

export default Login;
