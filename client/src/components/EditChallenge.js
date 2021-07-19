import React, { Fragment, useState } from "react";

const EditChallenge = ({ challenge, reader }) => {
  const { challenge_name, organization, challenge_type, goal, id } = challenge;
  const [inputs, setInputs] = useState({
    challenge_name: challenge.challenge_name,
    organization: challenge.challenge_organization,
    challenge_type: challenge.challenge,
    goal: challenge.goal,
    id: challenge.id,
  });
  console.log(challenge.challenge);
  console.log(inputs.challenge_type);

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const onRadioClick = (e) => {
    setInputs({ ...inputs, challenge_type: e.target.value });
  };

  return (
    <Fragment>
      <button
        type="button"
        class="btn btn-warning"
        data-toggle="modal"
        data-target={`#id${challenge.id}`}
      >
        Edit
      </button>

      <div
        class="modal"
        id={`id${challenge.id}`}
        onClick={() =>
          setInputs({
            challenge_name: challenge.challenge_name,
            organization: challenge.challenge_organization,
            challenge_type: challenge.challenge,
            goal: challenge.goal,
            id: challenge.id,
          })
        }
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">Edit Challenge {challenge.id}</h4>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                onClick={() =>
                  setInputs({
                    challenge_name: challenge.challenge_name,
                    organization: challenge.challenge_organization,
                    challenge_type: challenge.challenge,
                    goal: challenge.goal,
                    id: challenge.id,
                  })
                }
              >
                &times;
              </button>
            </div>

            <div class="modal-body">
              <input //update challenge name
                value={inputs.challenge_name}
                onChange={(e) => onChange(e)}
                className="form-control"
                name="challenge_name"
                placeholder={challenge_name}
              />
              <p>{inputs.challenge_name}</p>
              <input //update organization
                value={inputs.organization}
                onChange={(e) => onChange(e)}
                className="form-control"
                name="organization"
                placeholder={organization}
              />
              <p>{inputs.organization}</p>
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
                <label className="form-check-label my-3 mx-3" htmlFor="books">
                  <input
                    id="books"
                    className="form-check-input"
                    type="radio"
                    name="challenge-type"
                    value="books"
                    onClick={(e) => onRadioClick(e)}
                  />
                  Read Books
                </label>
                <label className="form-check-label" htmlFor="versus">
                  <input
                    id="versus"
                    className="form-check-input"
                    type="radio"
                    name="challenge-type"
                    value="versus"
                    onClick={(e) => onRadioClick(e)}
                  />
                  Memorize Versus
                </label>
              </div>
              <p>{inputs.challenge_type}</p>
              <input //update goal
                value={inputs.goal}
                onChange={(e) => onChange(e)}
                className="form-control"
                name="goal"
                placeholder={goal}
              />
              <p>{inputs.goal}</p>
            </div>

            <div class="modal-footer">
              <button
                type="button"
                className="btn btn-warning"
                data-dismiss="modal"
                //update
              >
                Update
              </button>
              <button
                type="button"
                className="btn btn-danger"
                data-dismiss="modal"
                onClick={() =>
                  setInputs({
                    challenge_name: challenge.challenge_name,
                    organization: challenge.challenge_organization,
                    challenge_type: challenge.challenge_type,
                    goal: challenge.goal,
                    id: challenge.id,
                  })
                }
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default EditChallenge;
