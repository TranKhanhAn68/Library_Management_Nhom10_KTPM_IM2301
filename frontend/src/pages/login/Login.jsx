import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContent } from '../../utils/AuthContext';
import Loading from '../../components/Loading';


const Login = () => {
  const inputRef = useRef()
  const { login, setToken, setReload } = useContext(AuthContent)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false)
  const [activeRemember, setActiveRemember] = useState(false)
  const navigate = useNavigate()
  const [err, setErr] = useState(null)

  useEffect(() => {
    const storedUsername = localStorage.getItem('storedUsername')
    if (storedUsername)
      setUsername(storedUsername)
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    inputRef.current.focus();

    if (username.trim().length === 0 || password.trim().length === 0) {
      setErr('Không được bỏ trống')
      return
    }

    setLoading(true)

    try {
      const result = await login(username, password);
      const token = result?.token
      localStorage.setItem('storedUsername', username);
      localStorage.setItem('token', token)
      setToken(token)
      setReload(prev => !prev)
      navigate('/');

    } catch (err) {
      setErr(err?.message || err || "Login failed");
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="d-flex vh-100 bg-light justify-content-center align-items-center">
      {loading && <Loading loading={loading} />}

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
                ref={inputRef}
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

              <button type="submit" className="btn btn-primary fw-bold">
                Đăng nhập
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
