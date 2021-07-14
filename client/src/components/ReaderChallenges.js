import React, { Fragment, useState, useEffect } from "react";
import { toast } from "react-toastify";

const ReaderChallenges = ({ setAuth, reader, readersChallenges }) => {
  console.log(readersChallenges);
  const {
    first_name,
    last_name,
    chapters_read,
    books_read,
    versus_memorized,
    id,
  } = reader;

  const onClick = (e) => {
    console.log(e.value);
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
                <button value={challenge.id} onClick={onClick}>
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
