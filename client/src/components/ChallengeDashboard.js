import React, { Fragment, useState, useEffect } from "react";
import { toast } from "react-toastify";

const ChallengeDashboard = ({ setAuth }) => {
  const [inputs, setInputs] = useState({
    challenge_name: "",
    organization: "",
    challenge_type: "none",
    goal: 0,
  });
  //variables from state
  const { challenge_name, organization, challenge_type, goal } = inputs;

  //input fields for from
  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  //radio buttons for challenge-type
  const onRadioClick = (e) => {
    setInputs({ ...inputs, challenge_type: e.target.value });
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = { challenge_name, organization, challenge_type, goal };
      const response = await fetch(
        "http://localhost:5000/challenge-dashboard",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.token,
          },
          body: JSON.stringify(body),
        }
      );
      const parseRes = await response.json();
      console.log(parseRes);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <h3>Create or Change Challenge</h3>
      <form onSubmit={onSubmitForm}>
        <input
          className="form-control my-3"
          type="text"
          name="challenge_name"
          placeholder="Challenge Name"
          value={challenge_name}
          onChange={(e) => onChange(e)}
        />
        <input
          className="form-control my-3"
          type="text"
          name="organization"
          placeholder="Organization (church name, bible study, facebook group etc.)"
          value={organization}
          onChange={(e) => onChange(e)}
        />
        <h3>Select Challenge Type</h3>
        <div className="form-check-inline">
          <label className="form-check-label" htmlFor="chapters">
            <input
              id="chapters"
              className="form-check-input"
              type="radio"
              name="challenge-type"
              onClick={(e) => onRadioClick(e)}
              value="chapters"
            />
            Read Chapters
          </label>
          <label className="form-check-label my-3 mx-3" htmlFor="chapters">
            <input
              id="chapters"
              className="form-check-input"
              type="radio"
              name="challenge-type"
              value="books"
              onClick={(e) => onRadioClick(e)}
            />
            Read Books
          </label>
          <label className="form-check-label" htmlFor="chapters">
            <input
              id="chapters"
              className="form-check-input"
              type="radio"
              name="challenge-type"
              value="versus"
              onClick={(e) => onRadioClick(e)}
            />
            Memorize Versus
          </label>
        </div>
        <input
          className="form-control my-3"
          type="number"
          name="goal"
          placeholder="Challenge Goal"
          value={goal}
          onChange={(e) => onChange(e)}
        />
        <button className="btn btn-success btn-block">Submit</button>
      </form>
    </Fragment>
  );
};

export default ChallengeDashboard;
