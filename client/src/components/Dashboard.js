import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import FindChallenge from "./FindChallenge";
import ReaderChallenges from "./ReaderChallenges";
import ChallengeDashboard from "./ChallengeDashboard";

const Dashboard = ({ setAuth }) => {
  const [reader, setReader] = useState("");
  const [inReadingChallenge, setInReadingChallenge] = useState(false);
  const [readersChallenges, setReadersChallenges] = useState([]);
  const [createChallenge, setCreateChallenge] = useState(false);
  //Get the Reader's info
  async function getReader() {
    try {
      const response = await fetch("http://localhost:5000/dashboard/", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseRes = await response.json();
      setReader(parseRes);
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
  }, [inReadingChallenge]);

  //   useEffect(() => {
  //   const hideComponents = (e) => {
  //     if (createChallenge) {
  //       e.target.style={{display: hidden}}
  //     }
  //   }
  // });

  return (
    <Fragment>
      <h1>Welcome {reader.first_name}</h1>
      <div>
        {!createChallenge && inReadingChallenge && (
          <ReaderChallenges
            reader={reader}
            getReader={getReader}
            setAuth={setAuth}
            readersChallenges={readersChallenges}
            setReadersChallenges={setReadersChallenges}
            setInReadingChallenge={setInReadingChallenge}
          />
        )}
        {!createChallenge && (
          <Fragment>
            <FindChallenge
              setAuth={setAuth}
              readersChallenges={readersChallenges}
              setReadersChallenges={setReadersChallenges}
              setInReadingChallenge={setInReadingChallenge}
              checkChallenge={checkChallenge}
            />
            <button className="btn" onClick={() => setCreateChallenge(true)}>
              Create Challenge
            </button>
          </Fragment>
        )}
      </div>
      {createChallenge && <ChallengeDashboard setAuth={setAuth} />}
      {/* <Link to={"/challenge-dashboard"}>Create Challenge</Link> */}
      <br></br>

      <br></br>
      <button className="btn btn-primary" onClick={(e) => logout(e)}>
        Logout
      </button>
    </Fragment>
  );
};

export default Dashboard;
