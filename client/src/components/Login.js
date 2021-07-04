import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
const Login = ({ setAuth }) => {
  const [inputs, setInputs] = useState({
    email: "",
    user_password: "",
  });

  const { email, user_password } = inputs;

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = { email, user_password };
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();
      localStorage.setItem("token", parseRes.token);
      setAuth(true);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <h1 className="text-center my-5">Login</h1>
      <form onSubmit={onSubmitForm}>
        <input
          className="form-control my-3"
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => onChange(e)}
        />
        <p>{email}</p>
        <input
          className="form-control"
          type="password"
          name="user_password"
          placeholder="Password"
          value={user_password}
          onChange={(e) => onChange(e)}
        />
        <p>{user_password}</p>
        <button className="btn btn-success btn-block">Submit</button>
      </form>
      <Link to="/register">Register</Link>
    </Fragment>
  );
};

export default Login;
