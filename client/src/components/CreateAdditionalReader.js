import React, { useState } from "react";

const CreateAdditionalReader = ({ setAuth, reader }) => {
  // const { name } = req.body
  const [inputs, setInputs] = useState({
    name: "",
  });

  const name = inputs.name;

  return (
    <div>
      {/* Button trigger modal  */}
      <button
        type="button"
        class="btn btn-outline-primary"
        data-bs-toggle="modal"
        data-bs-target="#make-additional-reader"
      >
        Create Family Group Member
      </button>

      {/* // <!-- Modal --> */}
      <div
        class="modal fade"
        id="make-additional-reader"
        tabindex="-1"
        aria-labelledby="make-additional-readerLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="make-additional-readerLabel">
                Create a new Family Group Member
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                // onClick={() => resetInputs()}
              ></button>
            </div>
            <div class="modal-body">
              <form onSubmit={onSubmitForm} id="make-additional-readerform">
                <lable
                  htmlFor="familyName"
                  className="bg-light text-black form-control"
                >
                  Name the new member.
                  <input
                    className=" form-control mt-1 mb-1"
                    type="character"
                    name="name"
                    placeholder=""
                    value={name}
                    onChange={(e) => onChange(e)}
                  />
                </lable>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={() => resetInputs()}
              >
                Close
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                form="make-additional-readerform"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAdditionalReader;
