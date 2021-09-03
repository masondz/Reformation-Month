//Trying to allow values to change in report modal.
//To do this, values of the inputs must have their own state, that reset to 0 after form is submitted.
//I've started an initialValue state, and began coding a function. Good Luck.

//if adReader is true, set reader to adReader?
//if adReader is true, set endPoint to additional-reader?
//else, set endPoint to submit-report?

import React, { Fragment, useEffect, useState } from "react";

const ReportAdReaderReading = ({ setAuth, adReader }) => {
  const { name, chapters_read, books_read, verses_memorized } = adReader;
  console.log(chapters_read);

  const [reporting, setReporting] = useState(false);
  const [chaptersTotal, setChaptersTotal] = useState("");
  const [booksTotal, setBooksTotal] = useState("");
  const [versesTotal, setVersesTotal] = useState("");
  const [challengeType, setChallengeType] = useState("");
  const resetAll = () => {
    setChaptersTotal(0);
    setBooksTotal(0);
    setVersesTotal(0);
  };
  const [initialValue, setInitialValue] = useState({
    //this is to set the initail value of the form's inputs to zero.
    chapters_total: 0,
    books_total: 0,
    verses_total: 0,
  });

  useEffect(() => {
    setChaptersTotal(chapters_read);
    setBooksTotal(books_read);
    setVersesTotal(verses_memorized);
  }, []);

  // const updateTotals = (total, challengeType) => {
  //   let newTotal = adReader[challengeType] + Number(total);
  //   setAdReader({
  //     ...adReader,
  //     [challengeType]: newTotal,
  //   });
  // };

  const updateInitialValues = (total, challengeType) => {
    let newTotal = "?"; //must pick the challenge type somehow.
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setChallengeType(e.target.name);
    try {
      const thisChallengeType = challengeType;
      const challenge_type = challengeType;
      const ad_reader_id = adReader.ad_reader_id;
      let total;
      // check which challenge type it is
      if (thisChallengeType === "chapters_read") {
        total = chaptersTotal;
        // updateTotals(total, challengeType);
      } else if (thisChallengeType === "books_read") {
        total = booksTotal;
        // updateTotals(total, challengeType);
      } else {
        total = versesTotal;
        // updateTotals(total, challengeType);
      }
      const body = { challenge_type, total, ad_reader_id };
      const response = await fetch(`http://localhost:5000/additional-readers`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.token,
        },
        body: JSON.stringify(body),
      });
      const res = await response.json();
      console.log(res);
      // resetAll();
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

  const jsxId = `id${adReader.ad_reader_id}`;
  const targetId = `#id${adReader.ad_reader_id}`;

  return (
    <Fragment>
      <h5>
        Chapters: {chaptersTotal} Books: {booksTotal} Verses: {versesTotal}
      </h5>
      <button
        type="button"
        class="btn btn-primary btn-sm"
        data-toggle="modal"
        data-target={targetId}
      >
        Report Reading
      </button>
      <div
        className="modal fade"
        id={jsxId}
        tabindex="-1"
        aria-labelledby="edit-challenge"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h3 class="modal-title" id={jsxId}>
                Report Reading for: {name}
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
                      value={initialValue.chapters_total}
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
                    value={initialValue.books_total}
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
                      value={initialValue.verses_total}
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

export default ReportAdReaderReading;
