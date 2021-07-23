import React, { Fragment, useState } from "react";
import { toast } from "react-toastify";
// import { inputs } from "../../../server/routes/readerDashboard";
//testing switching things
const EditChallenge = ({ challenge, reader }) => {
  // console.log(reader);
  console.log(challenge);
  const [inputs, setInputs] = useState({
    challenge_name: challenge.challenge_name,
    organization: challenge.organization,
    goal: challenge.goal,
    challenge: challenge.challenge,
    id: challenge.id,
  });

  const originalInputs = {
    challenge_name: challenge.challenge_name,
    organization: challenge.organization,
    goal: challenge.goal,
    challenge: challenge.challenge,
    id: challenge.id,
  };

  const onClick = () => {
    console.log("clicked");
  };

  const onChange = (e) => {
    e.preventDefault();
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  //work on submitting changes

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const reader_id = reader.id;
      const { challenge_name, organization, challenge_type, goal, id } = inputs;
      const body = {
        reader_id,
        challenge_name,
        organization,
        challenge_type,
        goal,
        id,
      };
      const response = await fetch(
        "http://localhost:5000/challenge-dashboard/",
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            token: localStorage.token,
          },
          body: JSON.stringify(body),
        }
      );
      if (response.status === 401) {
        return toast.error("Challenge name already exists");
      } else if (response.status === 403) {
        return toast.error("You are not authorized to change this challenge");
      }
      await response.json().then((response) =>
        setInputs({
          ...inputs,
          challenge_name: response.challenge_name,
          organization: response.organization,
          challenge: response.challenge,
          goal: response.goal,
        })
      );
    } catch (err) {
      console.error(err.messages);
    }
  };

  return (
    <Fragment>
      <button
        type="button"
        class="btn btn-info btn-sm"
        data-toggle="modal"
        data-target={`#id${challenge.id}`}
      >
        Edit
      </button>
      <div
        class="modal fade"
        id={`id${challenge.id}`}
        tabindex="-1"
        aria-labelledby="edit-challenge"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id={`id${challenge.id}`}>
                Edit Challenge Details
              </h5>
              <button
                type="button"
                className="btn-close close"
                data-bs-dismiss="modal"
                aria-label="Close"
                data-dismiss="modal"
                onClick={() => setInputs(originalInputs)}
              ></button>
            </div>
            <div class="modal-body">
              <form className="form-control">
                <lable htmlFor="challenge_name">
                  Challenge Name:
                  <input
                    className="form-control mt-2"
                    type="text"
                    name="challenge_name"
                    value={inputs.challenge_name}
                    onChange={(e) => onChange(e)}
                  />
                </lable>
                <br></br>
                <lable htmlFor="organization">
                  Organization:
                  <input
                    className="form-control mt-2"
                    type="text"
                    name="organization"
                    value={inputs.organization}
                    onChange={(e) => onChange(e)}
                  />
                </lable>
                <br></br>
                <lable className="my-4" htmlFor="challenge">
                  Challenge Type:{" "}
                </lable>
                <br></br>
                <div
                  className="btn-group mt-2"
                  role="group"
                  aria-label="Basic radio toggle button group"
                >
                  <label htmlFor="chapters" className="btn btn-outline-primary">
                    {" "}
                    Chapters
                    <input
                      autocomplete="off"
                      className="btn-check "
                      type="radio"
                      id="chapters"
                      name="challenge"
                      value="chapters"
                      onChange={(e) => onChange(e)}
                    ></input>
                  </label>
                  <label htmlFor="books" className="btn btn-outline-primary">
                    {" "}
                    Books
                    <input
                      autocomplete="off"
                      className="btn-check"
                      onChange={(e) => onChange(e)}
                      type="radio"
                      id="books"
                      name="challenge"
                      value="books"
                    ></input>
                  </label>
                  <label htmlFor="verses" className="btn btn-outline-primary">
                    {" "}
                    Verses
                    <input
                      autocomplete="off"
                      className="btn-check m-3"
                      type="radio"
                      id="verses"
                      name="challenge"
                      value="verses"
                      onChange={(e) => onChange(e)}
                    ></input>
                  </label>
                </div>
                <br></br>
                <lable htmlFor="goal">Goal:</lable>
                <br></br>
                <input
                  className="mt-2"
                  type="number"
                  name="goal"
                  onChange={(e) => onChange(e)}
                  value={inputs.goal}
                />
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
                data-dismiss="modal"
                onClick={() => setInputs(originalInputs)}
              >
                Close
              </button>
              <button
                type="button"
                class="btn btn-primary"
                onSubmit={() => onSubmit()}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default EditChallenge;
