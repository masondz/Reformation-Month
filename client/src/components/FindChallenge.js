import React, { Fragment, useState } from "react";

const FindChallenge = () => {
  const [challengeList, setChallengeList] = useState([]);

  return (
    <Fragment>
      <label for="chal-list">Find a reading Challenge</label>
      <input list="challenge-list" name="chal-list" id="chal-list" />
      <datalist id="challenge-list">
        <option value="Challenge A" />
        <option value="Challenge B" />
        <option value="Third Challenge" />
      </datalist>
    </Fragment>
  );
};

export default FindChallenge;
