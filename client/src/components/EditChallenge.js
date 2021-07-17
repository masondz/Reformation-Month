import React, { Fragment, useState } from "react";

const EditChallenge = ({ challenge, reader }) => {
  const challengeName = challenge.challenge_name;
  console.log(challengeName);
  const [inputs, setInputs] = useState({
    challenge_name: challenge.challenge_name,
    organization: challenge.challenge_organization,
    challenge_type: challenge.challenge_type,
    goal: challenge.goal,
  });

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  return (
    <Fragment>
      <button
        type="button"
        class="btn btn-primary"
        data-toggle="modal"
        data-target="#exampleModalCenter"
      >
        Launch demo modal
      </button>

      <div
        class="modal fade"
        id="exampleModalCenter"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">
                Modal title
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">...</div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button type="button" class="btn btn-primary">
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
