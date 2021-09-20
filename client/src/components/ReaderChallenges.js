import React, { Fragment, useState, useEffect } from "react";
import { toast } from "react-toastify";
import ChallengeTotal from "./ChallengeTotal";

import EditChallenge from "./EditChallenge";
import EditChallenge2 from "./EditChallenge2";

const ReaderChallenges = ({
  setAuth,
  reader,
  readersChallenges,
  setReadersChallenges,
  setInReadingChallenge,
  displayTotal,
}) => {
  // console.log(readersChallenges);
  console.log("ReadeChallenges.js:displayTotal -" + displayTotal);
  const {
    //destructer reader that is passed down by props from Dashboard
    first_name,
    last_name,
    chapters_read,
    books_read,
    versus_memorized,
    id,
  } = reader;

  const [calculating, setCalculating] = useState(false);
  const toggleCa = () => {
    calculating === true ? setCalculating(false) : setCalculating(true);
  };

  const [total, setTotal] = useState("...");

  //Remove reader from reading challenge
  const removeReader = async (reader_id, challenge_id) => {
    try {
      const readerChallenge = await fetch(
        `http://localhost:5000/reader-dashboard/reader-challenge-id/?reader_id=${reader_id}&challenge_id=${challenge_id}`,
        {
          method: "DELETE",
          headers: {
            token: localStorage.token,
          },
        }
      );
      await setReadersChallenges(
        readersChallenges.filter((challenge) => challenge.id !== challenge_id)
      );
      toast.warning("You have left the reading challenge.");
      if (readersChallenges.length === 0) {
        setInReadingChallenge(false);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (readersChallenges.length === 0) {
      setInReadingChallenge(false);
    }
  });

  return (
    <div className="form-control">
      <h2>Reading challenges:</h2>
      {readersChallenges.map((challenge, index) => {
        return (
          <Fragment key={challenge.id.toString()}>
            <ul>
              <div className="card p-3">
                <div
                  style={{ backgroundColor: "lightgreen" }}
                  className="d-flex justify-content-between"
                >
                  <h3 value={challenge.id} key={110}>
                    {console.log(reader.id, challenge.challenge_admin)}
                    {challenge.challenge_name} - <i>{challenge.organization}</i>
                  </h3>
                  {reader.id !== challenge.challenge_admin ? (
                    <button
                      className="btn btn-danger btn-sm px-3"
                      onClick={() => removeReader(reader.id, challenge.id)}
                    >
                      Leave Challenge
                    </button>
                  ) : (
                    <Fragment key={challenge.id.toString()}>
                      <EditChallenge2
                        challenge={challenge}
                        reader={reader}
                        setReadersChallenges={setReadersChallenges}
                        readersChallenges={readersChallenges}
                      />
                    </Fragment>
                  )}
                </div>
                <div key={(challenge.challege_id + 1).toString()}>
                  {calculating ? (
                    "..."
                  ) : (
                    <ChallengeTotal
                      reader={reader}
                      setAuth={setAuth}
                      challenge={challenge}
                      setTotal={setTotal}
                      setCalculating={setCalculating}
                      displayTotal={displayTotal}
                    />
                  )}
                </div>
              </div>
            </ul>
          </Fragment>
        );
      })}
    </div>
  );
};

export default ReaderChallenges;
