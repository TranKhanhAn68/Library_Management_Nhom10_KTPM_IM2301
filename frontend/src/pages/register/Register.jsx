import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import "./register.scss"
const EMAIL_REGEX = /^\S+@\S+\.\S+$/
const USER_REGEX = /^[A-Za-z][0-9A-Za-z]{5,15}$/
const PWD_REGEX = /^[A-Za-z](?=.*?[0-9])(?=.*?[A-Za-z]).{8,24}$/
const Register = () => {

  const userRef = useRef()
  const errRef = useRef()

  const [firstname, setFirstname] = useState("")
  const [focusFirstname, setFocusFirstname] = useState(false)
  const [lastname, setLastname] = useState("")
  const [focusLastname, setFocusLastname] = useState(false)


  const [email, setEmail] = useState("")
  const [validEmail, setValidEmail] = useState(false)
  const [emailFocus, setEmailFocus] = useState(false)

  const [username, setUsername] = useState("")
  const [validName, setValidName] = useState(false)
  const [userFocus, setUserFocus] = useState(false)

  const [pwd, setPwd] = useState("")
  const [validPwd, setValidPwd] = useState(false)
  const [pwdFocus, setPwdFocus] = useState(false)

  const [matchPwd, setMatchPwd] = useState("")
  const [validMatch, setValidMatch] = useState(false)
  const [matchFocus, setMatchFocus] = useState(false)

  const [errMsg, setErrMsg] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    userRef.current.focus()
  }, [])

  useEffect(() => {
    const result = EMAIL_REGEX.test(email)
    setValidEmail(result)
  }, [email])

  useEffect(() => {
    const result = USER_REGEX.test(username)
    console.log(result)
    console.log(username)
    setValidName(result)
  }, [username])

  useEffect(() => {
    const result = PWD_REGEX.test(pwd)
    console.log(result)
    console.log(pwd)
    setValidPwd(result)
    const match = pwd === matchPwd
    setValidMatch(match)
  }, [pwd, matchPwd])

  useEffect(() => {
    setErrMsg('')
  }, [username, pwd, matchPwd])

  return (

    <div className="d-flex vh-100 bg-light justify-content-center align-items-center">
      <div className="card p-4" style={{ width: '100%', maxWidth: '500px' }}>
        <div className="card-body">
          <h1 className="text-center display-6 fw-bold py-3">
            Welcome to <span className="text-primary">Online Library</span>
          </h1>

          <div className="mb-4">
            <h2 className="h5 fw-semibold">Sign Up</h2>
            <form className="d-flex flex-column gap-3" onSubmit="">
              <div className="d-flex gap-2 personal">
                <input
                  type="text"
                  placeholder="Enter first name"
                  ref={userRef}
                  onChange={(e) => setFirstname(e.target.value)}
                  onBlur={() => setFocusFirstname(true)}
                  className={`
                  form-control flex-grow-2
                  ${focusFirstname ? firstname.trim().length > 0 ? "is-valid" : "is-invalid" : ""}
                  ` }
                />
                <input
                  type="text"
                  placeholder="Enter last name"
                  onChange={(e) => setLastname(e.target.value)}
                  onBlur={() => setFocusLastname(true)}
                  className={`
                    form-control flex-grow-1
                    ${focusLastname ? lastname.trim.length > 0 ? "is-valid" : "is-invalid" : ""}
                      `}
                />
              </div>

              <input
                type="email"
                placeholder="Enter the email"
                className="form-control"
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setEmailFocus(true)}
                onBlur={() => set}
              />

              <input
                type="text"
                placeholder="Enter the username"
                className={`form-control ${!username
                  ? ''
                  : validName
                    ? 'is-valid'
                    : 'is-invalid'
                  }`}
                id="username"
                autoComplete="off"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                required
                aria-invalid={validName ? "false" : "true"}
                onFocus={() => setUserFocus(true)}
                onBlur={() => setUserFocus(false)}
              />
              <p
                id="usnnote"
                className={
                  (userFocus && !validName && username) ? "instructions" : "offscreen"
                }
              >
                <i className="fa-solid fa-circle-info" ></i>
                6 to 16 characters.
                Must begin with a letter.
                Letters, numbers, underscores, hyphens allowed.
              </p>
              <input
                type="password"
                placeholder="Enter the password"
                className={`form-control ${!pwd ? '' : validPwd ? 'is-valid' : 'is-invalid'
                  }`}
                id="password"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                required
                aria-invalid={validPwd ? 'false' : 'true'}
                aria-describedby="pwdnode"
                onFocus={() => setPwdFocus(true)}
                onBlur={() => setPwdFocus(false)}
              />
              <p
                id="pwdnode"
                className={
                  (pwdFocus && !validPwd && pwd) ? "instructions" : "offscreen"
                }
              >
                <i className="fa-solid fa-circle-info" ></i>
                6 to 16 characters.
                Must begin with a letter.
                Letters, numbers, underscores, hyphens allowed.
              </p>
              <input
                type="password"
                placeholder="Enter the password again"
                className={`form-control ${!matchPwd ? '' : validMatch ? 'is-valid' : 'is-invalid'
                  }`}
                id="confirmPassword"
                onChange={(e) => setMatchPwd(e.target.value)}
                value={matchPwd}
                required
                aria-invalid={validMatch ? 'false' : 'true'}
                aria-describedby="confirmnote"
                onFocus={() => setMatchFocus(true)}
                onBlur={() => setMatchFocus(false)}
              />

              <p
                id="confirmnote"
                className={
                  (matchFocus && matchPwd && matchPwd !== pwd) ? "instructions" : "offscreen"
                }
              >
                <i className="fa-solid fa-circle-info" ></i>
                Mật khẩu không khớp
              </p>

              {/* Checkbox */}
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="remember" />
                <label className="form-check-label small" htmlFor="remember">
                  Remember Me
                </label>
              </div>

              <button type="submit" className="btn btn-primary fw-bold">
                Sign Up
              </button>
            </form>
          </div>

          <div className="text-center mt-3">
            <span>Return login page </span>
            <Link className="text-primary fw-bold" to="/login">
              Login now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
