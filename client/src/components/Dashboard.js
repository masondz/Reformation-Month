import React, { Fragment, useState, useEffect } from "react";
import { toast } from "react-toastify";

import FindChallenge from "./FindChallenge";

const Dashboard = ({ setAuth }) => {
  const [firstName, setFirstName] = useState("");
  const [inReadingChallenge, setInReadingChallenge] = useState(false);

  async function checkChallenge() {
    try {
      const response = await fetch("http://localhost:5000/dashboard/", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseRes = await response.json();
      if (parseRes.reading_challenges.length !== 0) {
        setInReadingChallenge(true);
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  async function getName() {
    try {
      const response = await fetch("http://localhost:5000/dashboard/", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseRes = await response.json();

      setFirstName(parseRes.first_name);
    } catch (err) {
      console.error(err.message);
    }
  }

  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    setAuth(false);
    toast.success("You logged out successfully!");
  };

  useEffect(() => {
    getName();
    checkChallenge();
  }, []);

  return (
    <Fragment>
      <h1>Welcome {firstName}</h1>
      {!inReadingChallenge ? (
        <FindChallenge setAuth={setAuth} />
      ) : (
        <div>
          <h2>show challenge</h2>
          <h2>Join another challenge:</h2>
        </div>
      )}
      <br></br>

      <br></br>
      <button className="btn btn-primary" onClick={(e) => logout(e)}>
        Logout
      </button>
    </Fragment>
  );
};

export default Dashboard;
