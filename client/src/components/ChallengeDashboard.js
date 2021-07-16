import React, { Fragment, useState, useEffect } from "react";
import { toast } from "react-toastify";

const ChallengeDashboard = ({ setAuth, setCreateChallenge, reader }) => {
  const [inputs, setInputs] = useState({
    challenge_name: "",
    organization: "",
    challenge_type: "chapters",
    goal: "Goal",
  });
  const [newChallengeId, setNewChallengeId] = useState("");

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

  const addReader = async () => {
    const reader_id = reader.id;
    const challenge_id = newChallengeId;
    const body = { reader_id, challenge_id };
    const response = await fetch("http://localhost:5000/find-challenges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.token,
      },

      body: JSON.stringify(body),
    });
    console.log(`reader_id: ${reader_id} challenge_id: ${challenge_id}`);
    return response.json();
  };

  useEffect(() => {
    if (newChallengeId) {
      console.log("newChallengeId state is not falsey");
      addReader();
    }
  }, [newChallengeId]);

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
      if (response.status === 401) {
        return toast.error("Challenge Name already exists");
      }
      await response
        .json()
        .then((response) => setNewChallengeId(response.id))
        .then(() => console.log(newChallengeId))
        .then(() => addReader());

      //   const parseSecond = await addReadertoChallenge.json();
      console.log(newChallengeId);
      setInputs({
        challenge_name: "",
        organization: "",
        challenge_type: "chapters",
        goal: "",
      });
    } catch (err) {
      console.error(err.message);
      toast.error(err.message);
    }
  };

  return (
    <Fragment>
      <h3>Create or Change Challenge</h3>
      <form onSubmit={onSubmitForm}>
        <input
          required
          className="form-control my-3"
          type="text"
          name="challenge_name"
          placeholder="Challenge Name"
          value={challenge_name}
          onChange={(e) => onChange(e)}
        />
        <input
          required
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
              defaultChecked
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
          required
          className="form-control my-3"
          type="number"
          name="goal"
          placeholder="Challenge Goal"
          value={goal}
          onChange={(e) => onChange(e)}
        />
        <button className="btn btn-outline-success btn-lg mx-2">Submit</button>
        <button
          className="btn btn-outline-danger btn-lg my-2"
          onClick={() => setCreateChallenge(false)}
        >
          Cancel
        </button>
      </form>
      <p>{newChallengeId}</p>
    </Fragment>
  );
};

export default ChallengeDashboard;