import React, { Fragment, useState, useEffect } from "react";

const FindChallenge = () => {
  const [challengeList, setChallengeList] = useState([]);

  async function getChallenges() {
    try {
      const response = await fetch(
        "http://localhost:5000/dashboard/find-challenges",
        {
          method: "GET",
          headers: { token: localStorage.token },
        }
      );

      const parseRes = await response.json();
      setChallengeList(parseRes);
      console.log(parseRes);
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    getChallenges();
  }, []);

  return (
    <Fragment>
      <label for="chal-list">Find a reading Challenge</label>
      <input
        className="form-control"
        list="challenge-list"
        name="chal-list"
        id="chal-list"
      />
      <datalist id="challenge-list">
        {challengeList.map((challenge) => {
          return <option value={challenge.challenge_name} />;
        })}
      </datalist>
    </Fragment>
  );
};

export default FindChallenge;
