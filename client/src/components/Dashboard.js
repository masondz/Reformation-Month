import React, { Fragment, useState, useEffect } from "react";
import { toast } from "react-toastify";

import FindChallenge from "./FindChallenge";
import ReaderChallenges from "./ReaderChallenges";

const Dashboard = ({ setAuth }) => {
  const [reader, setReader] = useState("");
  const [inReadingChallenge, setInReadingChallenge] = useState(false);
  const [readersChallenges, setReadersChallenges] = useState([]);

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
        setReadersChallenges(parseRes);
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
      <h1>Welcome {reader.first_name}</h1>
      {!inReadingChallenge ? (
        <FindChallenge setAuth={setAuth} />
      ) : (
        <div>
          <ReaderChallenges
            reader={reader}
            getReader={getReader}
            setAuth={setAuth}
            readersChallenges={readersChallenges}
          />
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
