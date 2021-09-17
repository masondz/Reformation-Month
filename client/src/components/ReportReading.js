//add adReader to ReportReading parameters. [X]
//if adReader is undefined, leave reader to reader and set endPoint to '/submit-report' [X]
//else, set reader to adReader [X]
//set endPoint to '/additional-readers' [ ]

import React, { Fragment, useEffect, useState } from "react";

const ReportReading = ({ setAuth, reader, setReader }) => {
  const [reporting, setReporting] = useState(false);
  const [chaptersTotal, setChaptersTotal] = useState("");
  const [booksTotal, setBooksTotal] = useState("");
  const [versesTotal, setVersesTotal] = useState("");
  const [challengeType, setChallengeType] = useState("");

  const [endPoint, setEndPoint] = useState("");

  const resetAll = () => {
    setChaptersTotal("");
    setBooksTotal("");
    setVersesTotal("");
  };

  const updateTotals = (total, challengeType) => {
    let newTotal = reader[challengeType] + Number(total);
    setReader({
      ...reader,
      [challengeType]: newTotal,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setChallengeType(e.target.name);
    try {
      const thisChallengeType = challengeType;
      const challenge_type = challengeType;
      const reader_id = reader.id;
      let total;
      // check which challenge type it is
      if (thisChallengeType === "chapters_read") {
        total = chaptersTotal;
        updateTotals(total, challengeType);
      } else if (thisChallengeType === "books_read") {
        total = booksTotal;
        updateTotals(total, challengeType);
      } else {
        total = versesTotal;
        updateTotals(total, challengeType);
      }
      const body = { challenge_type, total, reader_id };
      const response = await fetch(`http://localhost:5000/submit-report/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.token,
        },
        body: JSON.stringify(body),
      });
      const res = await response.json();
      console.log(res);
      resetAll();
    } catch (err) {
      console.error(err.message);
    }
  };

  const onChange = (e) => {
    e.preventDefault();
    setChallengeType(e.target.name);
    if (e.target.name === "chapters_read") {
      return setChaptersTotal(e.target.value);
    } else if (e.target.name === "books_read") {
      return setBooksTotal(e.target.value);
    } else {
      setVersesTotal(e.target.value);
    }
  };

  return (
    <Fragment>
      <button
        type="button"
        class="btn btn-primary"
        data-toggle="modal"
        data-target="#thing"
      >
        Report Reading
      </button>
      <div
        className="modal fade"
        id="thing"
        tabindex="-1"
        aria-labelledby="edit-challenge"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h3 class="modal-title" id="thing">
                Report Reading for {reader.first_name}
              </h3>
              <button
                type="button"
                className="btn-close close"
                data-bs-dismiss="modal"
                aria-label="Close"
                data-dismiss="modal"
                onClick={() => resetAll()}
              ></button>
            </div>
            <div class="modal-body">
              <form className="form-control">
                <div className="form-control bg-light text-black">
                  <lable htmlFor="Chapters" className="mr-2">
                    Chapters Read
                    <input
                      className="form-control mt-1"
                      type="number"
                      name="chapters_read"
                      placeholder="0"
                      onChange={(e) => onChange(e)} //don't change state inside JSX event listener; use callback function.
                      value={chaptersTotal}
                    />
                    <button
                      type="button"
                      name="chapters_read"
                      htmlFor="chapters_memorized"
                      className="btn btn-primary"
                      data-dismiss="modal"
                      onClick={(e) => onSubmit(e)}
                    >
                      Save changes
                    </button>
                  </lable>
                </div>
                <br></br>
                <lable
                  htmlFor="books_read"
                  className="bg-light text-black form-control"
                >
                  Books Read
                  <input
                    className="form-control mt-1"
                    type="number"
                    name="books_read"
                    value={booksTotal}
                    placeholder="0"
                    onChange={(e) => onChange(e)} //don't change state inside JSX event listener; use callback function.
                  />
                  <button
                    data-dismiss="modal"
                    type="button"
                    name="books_read"
                    htmlFor="books_read"
                    className="btn btn-primary"
                    onClick={(e) => onSubmit(e)}
                  >
                    Save changes
                  </button>
                </lable>
                <br></br>
                <form>
                  <lable
                    htmlFor="verses_memorized"
                    className="bg-light text-black form-control"
                  >
                    Verses Memorized
                    <input
                      className=" form-control mt-1"
                      type="number"
                      name="verses_memorized"
                      value={versesTotal}
                      placeholder="0"
                      onChange={(e) => onChange(e)} //don't change state inside JSX event listener; use callback function.
                    />
                    <button
                      data-dismiss="modal"
                      type="button"
                      name="verses_memorized"
                      htmlFor="verses_memorized"
                      className="btn btn-primary"
                      onClick={(e) => onSubmit(e)}
                    >
                      Save changes
                    </button>
                  </lable>
                </form>
                <div class="modal-footer"></div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ReportReading;
