import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import { AuthContext } from "../../context/authContext";
import loginImage from '../../assets/login.webp'
import "./login.scss";

const Login = () => {
  const { user, setUser } = useState('')

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch('http://127.0.0.1:8000/api/user', {
      method: 'POST'
    })
  };

  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>Chào mừng đến với...</h1>
          <p style={{ fontSize: "1.2rem" }}>
            Thư viện online xin kính chào!
            Hãy vui lòng đăng nhập để có thể hưởng được nhiều đặc quyền hơn!!
          </p>
          <span>Bạn chưa có tài khoản?</span>
          <Link to="/register">
            <button>Đăng ký</button>
          </Link>
        </div>


        <div className="right">
          <h1>Login</h1>
          <form>
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="Password" />
            <button onClick={handleLogin}>Login</button>
          </form>
        </div>


      </div>
    </div>
  );
};

export default Login;
