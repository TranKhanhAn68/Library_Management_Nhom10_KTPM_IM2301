import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./register.scss"
import { AuthContent } from '../../utils/AuthContext';
import Loading from '../../components/Loading';

const EMAIL_REGEX = /^\S+@\S+\.\S+$/
const USER_REGEX = /^[A-Za-z][0-9A-Za-z]{5,15}$/
const PWD_REGEX = /^[A-Za-z](?=.*?[0-9])(?=.*?[A-Za-z]).{8,24}$/

const Register = () => {
  const { register } = useContext(AuthContent)

  const userRef = useRef()
  const errRef = useRef()

  const [firstname, setFirstname] = useState("")
  const [focusFirstname, setFocusFirstname] = useState(false)

  const [lastname, setLastname] = useState("")
  const [focusLastname, setFocusLastname] = useState(false)

  const [email, setEmail] = useState("")
  const [validEmail, setValidEmail] = useState(false)
  const [focusEmail, setFocusEmail] = useState(false)

  const [username, setUsername] = useState("")
  const [validName, setValidName] = useState(false)
  const [focusUsername, setFocusUsername] = useState(false)

  const [pwd, setPwd] = useState("")
  const [validPwd, setValidPwd] = useState(false)
  const [focusPwd, setFocusPwd] = useState(false)

  const [matchPwd, setMatchPwd] = useState("")
  const [validMatch, setValidMatch] = useState(false)
  const [focusMatch, setFocusMatch] = useState(false)

  const [errMsg, setErrMsg] = useState(null)
  const [done, setDone] = useState(false)

  const [message, setMessage] = useState(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    userRef.current.focus()
  }, [])

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email))
  }, [email])

  useEffect(() => {
    setValidName(USER_REGEX.test(username))
  }, [username])

  useEffect(() => {
    const isValidPwd = PWD_REGEX.test(pwd)
    setValidPwd(isValidPwd)

    if (!isValidPwd) {
      setErrMsg("Mật khẩu phải ≥ 8 ký tự, gồm chữ và số")
      setValidMatch(false)
    }
    else {
      const isMatch = pwd === matchPwd;
      setValidMatch(isMatch)
      if (!isMatch)
        setErrMsg("Mật khẩu không khớp")
      else
        setErrMsg(null)
    }
  }, [pwd, matchPwd])

  const checkAllInput = () => {
    if (!firstname || !lastname || !validEmail || !validName || !validPwd || !validMatch)
      return true
    return false
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // inputRef.current.focus();
    setLoading(true)

    try {
      const data = await register(firstname, lastname, email, username, pwd);
      setMessage(data.message)
      setIsSuccess(data.success)
      setTimeout(() => {
        navigate('/login')
      }, 1500);
    } catch (err) {
      setMessage(errw)
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="d-flex vh-100 bg-light justify-content-center align-items-center">
      {loading && <Loading loading={loading} />}
      <div className="card p-4" style={{ width: '100%', maxWidth: '500px' }}>
        <div className="card-body">

          <h1 className="text-center display-6 fw-bold py-3">
            Chào mừng đến với <span className="text-primary">Thư viện Online</span>
          </h1>

          <div className="mb-4">
            <h2 className="h5 fw-semibold">Đăng ký</h2>

            <form className="d-flex flex-column gap-3" onSubmit={handleSubmit}>

              <div className="d-flex gap-2">
                <input
                  type="text"
                  placeholder="Nhập tên"
                  ref={userRef}
                  onChange={(e) => setFirstname(e.target.value)}
                  onBlur={() => setFocusFirstname(true)}
                  className={`form-control 
                    ${focusFirstname ? (firstname.trim().length > 0 ? "is-valid" : "is-invalid") : ""}`}
                />

                <input
                  type="text"
                  placeholder="Nhập họ"
                  onChange={(e) => setLastname(e.target.value)}
                  onBlur={() => setFocusLastname(true)}
                  className={`form-control 
                    ${focusLastname ? (lastname.trim().length > 0 ? "is-valid" : "is-invalid") : ""}`}
                />
              </div>

              <input
                type="email"
                placeholder="Nhập email"
                onChange={e => setEmail(e.target.value)}
                onBlur={() => setFocusEmail(true)}
                className={`form-control 
                    ${focusEmail ? (validEmail ? "is-valid" : "is-invalid") : ""}`}
              />

              <p className={(focusEmail && !validEmail && email) ? "instructions" : "offscreen"}>
                Sai định dạng email
              </p>

              <input
                type="text"
                placeholder="Tên đăng nhập"
                autoComplete="off"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                onBlur={() => setFocusUsername(true)}
                className={`form-control 
                    ${focusUsername ? (validName ? "is-valid" : "is-invalid") : ""}`}
              />

              <p className={(focusUsername && !validName && username) ? "instructions" : "offscreen"}>
                6–16 ký tự, bắt đầu bằng chữ cái.
              </p>

              <input
                type="password"
                placeholder="Mật khẩu"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                onBlur={() => setFocusPwd(true)}
                className={`form-control 
                    ${focusPwd ? (validPwd ? "is-valid" : "is-invalid") : ""}`}
              />

              <p className={(focusPwd && !validPwd && pwd) ? "instructions" : "offscreen"}>
                8–24 ký tự, gồm chữ và số.
              </p>

              <input
                type="password"
                placeholder="Nhập lại mật khẩu"
                onChange={(e) => setMatchPwd(e.target.value)}
                value={matchPwd}
                onBlur={() => setFocusMatch(true)}
                className={`form-control 
                    ${focusMatch ? (validMatch ? "is-valid" : "is-invalid") : ""}`}
              />

              <p className={(focusMatch && !validMatch && matchPwd) ? "instructions" : "offscreen"}>
                {errMsg && errMsg}
              </p>

              {message && (
                <p className={`${isSuccess ? "bg-success" : "bg-danger"} text-white small p-2 rounded`}>{message}</p>
              )}

              <button type="submit" className="btn btn-primary fw-bold" disabled={checkAllInput()}>
                Đăng ký
              </button>
            </form>
          </div>

          <div className="text-center mt-3">
            <span>Đã có tài khoản? </span>
            <Link className="text-primary fw-bold" to="/login">
              Đăng nhập ngay
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Register;