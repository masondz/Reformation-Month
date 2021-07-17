import React, { Fragment, useState, useEffect } from "react";
import { toast } from "react-toastify";

import EditChallenge from "./EditChallenge";

const ReaderChallenges = ({
  setAuth,
  reader,
  readersChallenges,
  setReadersChallenges,
  setInReadingChallenge,
}) => {
  console.log(readersChallenges);
  console.log(reader);
  const {
    //destructer reader that is passed down by props from Dashboard
    first_name,
    last_name,
    chapters_read,
    books_read,
    versus_memorized,
    id,
  } = reader;

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
    <div>
      <h2>Here are your reading challenges:</h2>
      {readersChallenges.map((challenge, index) => {
        return (
          <Fragment key={index}>
            <ul>
              <h3 style={{ background: "tan" }} value={challenge.id}>
                {console.log(reader.id, challenge.challenge_admin)}
                {challenge.challenge_name} - <i>{challenge.organization}</i>
                {reader.id !== challenge.challenge_admin ? (
                  <button
                    className="btn btn-danger"
                    onClick={() => removeReader(reader.id, challenge.id)}
                  >
                    Leave Challenge
                  </button>
                ) : (
                  <Fragment>
                    <EditChallenge challenge={challenge} reader={reader} />
                  </Fragment>
                )}
              </h3>
              <h3>
                Goal: current count / {challenge.goal} {challenge.challenge}
              </h3>
            </ul>
          </Fragment>
        );
      })}
    </div>
  );
};

export default ReaderChallenges;
