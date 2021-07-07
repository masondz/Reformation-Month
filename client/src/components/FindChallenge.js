import React, { Fragment, useState, useEffect } from "react";

const FindChallenge = () => {
  const [challengeList, setChallengeList] = useState([]);
  const [inputs, setInputs] = useState({
    challenge_name: "",
    id: "",
    organization: "",
  });

  const { challenge_name, id, organization } = inputs; //reading-challenge info

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

  const [readerId, setReaderId] = useState("");

  async function getReaderId() {
    try {
      const response = await fetch("http://localhost:5000/dashboard/", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseRes = await response.json();

      setReaderId(parseRes.id);
      console.log(readerId);
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    getReaderId();
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(e.target);
  };

  const onChange = (e) => {
    setInputs({ ...inputs, challenge_name: e.target.value });
  };

  console.log(challenge_name);
  return (
    <Fragment>
      <form onSubmit={onSubmit}>
        <label htmlFor="chal-list">Find a reading Challenge</label>
        <input
          value={challenge_name}
          onChange={(e) => onChange(e)}
          className="form-control"
          list="challenge-list"
          name="chal-list"
          id="chal-list"
          placeholder="Search for reading challenge"
        />
        <datalist id="challenge-list">
          {challengeList.map((challenge) => {
            return (
              <option value={challenge.challenge_name} key={challenge.id}>
                Read {challenge.goal} Chapters
              </option>
            );
          })}
        </datalist>
      </form>
    </Fragment>
  );
};

export default FindChallenge;
