import React, { Fragment, useState, useEffect } from "react";
import { toast } from "react-toastify";

import FindChallenge from "./FindChallenge";

const Dashboard = ({ setAuth }) => {
  const [reader, setReader] = useState("");
  const [inReadingChallenge, setInReadingChallenge] = useState(false);

  //Get the Reader's info
  async function getReader() {
    try {
      const response = await fetch("http://localhost:5000/dashboard/", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseRes = await response.json();
      console.log(parseRes);
      setReader(parseRes);
      console.log(reader);
    } catch (err) {
      console.error(err.message);
    }
  }

  //Check if reader is in challenge
  async function checkChallenge() {
    try {
      const response = await fetch(
        "http://localhost:5000/reader-dashboard/reader-challenge-id/",
        {
          method: "GET",
          headers: { token: localStorage.token },
        }
      );

      const parseRes = await response.json();
      console.log(parseRes);
      if (parseRes.length !== 0) {
        setInReadingChallenge(true);
      }
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
    getReader();
    checkChallenge();
  }, []);

  return (
    <Fragment>
      <h1>Welcome {reader.id}</h1>
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
