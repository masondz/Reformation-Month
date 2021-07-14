import React, { Fragment, useState, useEffect } from "react";
import { toast } from "react-toastify";

const ReaderChallenges = ({
  setAuth,
  reader,
  readersChallenges,
  setReadersChallenges,
}) => {
  console.log(readersChallenges);
  const {
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
      console.log(reader_id);
      console.log(challenge_id);

      const readerChallenge = await fetch(
        `http://localhost:5000/reader-dashboard/reader-challenge-id/`,
        {
          method: "DELETE",
          headers: { token: localStorage.token },
          query: { reader_id: reader_id, challenge_id: challenge_id },
        }
      );
      setReadersChallenges(
        readersChallenges.filter((challenge) => challenge.id !== challenge_id)
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div>
      <h2>Here are your reading challenges:</h2>
      {readersChallenges.map((challenge, index) => {
        return (
          <Fragment>
            <ul>
              <h3
                key={index}
                style={{ background: "tan" }}
                value={challenge.id}
              >
                {challenge.challenge_name} - <i>{challenge.organization}</i>
                <button
                  className="btn btn-danger"
                  onClick={() => removeReader(reader.id, challenge.id)}
                >
                  Leave Challenge
                </button>
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
