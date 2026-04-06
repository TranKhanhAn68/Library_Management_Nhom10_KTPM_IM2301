import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContent } from '../../utils/AuthContext';


const Login = () => {
  const { login, setUser, setStatus, setToken } = useContext(AuthContent)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('');

  const navigate = useNavigate()
  const [err, setErr] = useState("")


  useEffect(() => {
    const storedUsername = localStorage.getItem('storedUsername');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (username.trim().length === 0 || password.trim().length === 0) {
      setErr('Không được bỏ trống')
      return
    }

    const authUser = await login(username, password);

    if (authUser?.status) {
      setErr("")
      localStorage.setItem('storedUsername', username);
      localStorage.setItem('authUser', JSON.stringify(authUser))
      setUser(authUser.user)
      setStatus(authUser.status)
      setToken(authUser.token)
      navigate('/dashboard');
    } else {
      setErr("Username hoặc password sai!");
      return (
        <div>Loading...</div>
      )
    }
    console.log(JSON.parse(localStorage.getItem('authUser')))

  }
  return (
    <div className="d-flex vh-100 bg-light justify-content-center align-items-center">
      <div className="card p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="card-body">
          <h1 className="text-center display-6 fw-bold py-3">
            Welcome to <span className="text-primary">Online Library </span>
          </h1>

          <div className="mb-4">
            <h2 className="h5 fw-semibold">Sign In</h2>
            <form className="d-flex flex-column gap-3" onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Enter the username"
                value={username}
                className="form-control"
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Enter the password"
                value={password}
                className="form-control"
                onChange={(e) => setPassword(e.target.value)}
              />
              {err && (
                <p className="bg-danger text-white small p-2 rounded">{err}</p>
              )}

              <div className="d-flex justify-content-between align-items-center">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="rememberMe" />
                  <label className="form-check-label small" htmlFor="rememberMe">
                    Remember Me
                  </label>
                </div>
              </div>

              <button type="submit" className="btn btn-primary fw-bold">
                Sign in
              </button>
            </form>
          </div>

          <div className="text-center mt-3">
            <span>Don't you have any account? </span>
            <Link className="text-primary fw-bold" to="/register">
              Register Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
