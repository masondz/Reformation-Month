// inputs may need to be defined by the recieved data in the parent state, then passed as props to EditChallenge.js

import React, { Fragment, useState } from "react";
import { toast } from "react-toastify";
//third test
const EditChallenge = ({ challenge, reader }) => {
  // console.log(reader);
  // console.log(challenge);
  const [inputs, setInputs] = useState({
    challenge_name: challenge.challenge_name,
    organization: challenge.organization,
    goal: challenge.goal,
    challenge_type: challenge.challenge,
    id: challenge.id,
  });
  console.log(inputs.challenge_type);
  const originalInputs = {
    challenge_name: challenge.challenge_name,
    organization: challenge.organization,
    goal: challenge.goal,
    challenge_type: challenge.challenge,
    id: challenge.id,
  };

  const onDelete = async () => {
    const choice = window.confirm("Are you sure you want to delete challenge?");
    try {
      if (choice === true) {
        console.log("going to delete the challenge");
        const reader_id = reader.id;
        const challenge_name = inputs.challenge_name;
        console.log(challenge_name);
        const body = { reader_id, challenge_name };
        const deleteChallenge = await fetch(
          "http://localhost:5000/challenge-dashboard/",
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json", //this is needed since we're sending over body content
              token: localStorage.token,
            },
            body: JSON.stringify(body),
          }
        );
        const response = await deleteChallenge.json();
        console.log(response);
        if (deleteChallenge.status === 202) {
          toast.success("Challenge deleted successfully.");
        } else if (deleteChallenge.status === 401) {
          toast.error("Challenge already doesn't exist.");
        } else if (deleteChallenge.status === 403) {
          toast.error("You are not authorized to delete this challenge.");
        }
      } else {
        toast.warning("Challenge not deleted.");
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const onChange = (e) => {
    e.preventDefault();
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const onRadioClick = (e) => {
    console.log("radio clicked");
    setInputs({ ...inputs, challenge_type: e.target.value });
  };

  //work on submitting changes
  // console.log(inputs);
  const updateChallenge = async (e) => {
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
      console.log(body);
      const response = await fetch(
        "http://localhost:5000/challenge-dashboard/",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.token,
          },
          body: JSON.stringify(body),
        }
      );
      if (response.status === 403) {
        return toast.error("You are not authorized to change this challenge");
      }
      window.location = "/dashboard";
      toast.success("Reading Challenge updated!");
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
        className="modal fade"
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
                <div className="form-control bg-warning text-white">
                  <lable htmlFor="goal" className="mr-2">
                    Goal:
                  </lable>
                  <input
                    className="form-control mt-1"
                    type="number"
                    name="goal"
                    onChange={(e) => onChange(e)}
                    value={inputs.goal}
                  />
                </div>
                <br></br>
                <lable
                  htmlFor="organization"
                  className="bg-warning text-white form-control"
                >
                  Organization:
                  <input
                    className=" form-control mt-1"
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
                <div className="form-check">
                  <input
                    defaultChecked
                    autoComplete="off"
                    id="chapters"
                    className="btn-check"
                    type="radio"
                    name="challenge-type"
                    onClick={(e) => onRadioClick(e)}
                    value="chapters"
                  />
                  <label className="btn btn-outline-primary" htmlFor="chapters">
                    Read Chapters
                  </label>
                  <input
                    autoComplete="off"
                    id="books"
                    className="btn-check"
                    autoComplete="off"
                    type="radio"
                    name="challenge-type"
                    value="books"
                    onClick={(e) => onRadioClick(e)}
                  />
                  <label
                    className="btn btn-outline-primary my-3 mx-3"
                    htmlFor="books"
                  >
                    Read Books
                  </label>
                  <input
                    autoComplete="off"
                    id="versus"
                    className="btn-check"
                    type="radio"
                    name="challenge-type"
                    value="versus"
                    onClick={(e) => onRadioClick(e)}
                  />
                  <label className="btn btn-outline-primary" htmlFor="versus">
                    Memorize Versus
                  </label>
                </div>
                <p>{inputs.challenge_type}</p>
                <br></br>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-primary"
                onClick={(e) => updateChallenge(e)}
              >
                Save changes
              </button>
              <button
                type="button"
                class="btn btn-danger"
                data-bs-dismiss="modal"
                data-dismiss="modal"
                onClick={() => {
                  onDelete();
                  window.location = "/dashboard";
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default EditChallenge;
