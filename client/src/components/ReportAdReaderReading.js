//Trying to allow values to change in report modal.
//To do this, values of the inputs must have their own state, that reset to 0 after form is submitted.
//I've started an initialValue state, and began coding a function. Good Luck.

//if adReader is true, set reader to adReader?
//if adReader is true, set endPoint to additional-reader?
//else, set endPoint to submit-report?

import React, { Fragment, useEffect, useState } from "react";

const ReportAdReaderReading = ({ setAuth, adReader }) => {
  const { name, chapters_read, books_read, verses_memorized } = adReader;
  const [displayTotal, setDisplayTotal] = useState({
    chapters_read: "",
    books_read: "",
    verses_memorized: "",
  });
  const [inputs, setInputs] = useState({
    chapters_read: 0,
    books_read: 0,
    verses_memorized: 0,
  });
  const [challengeType, setChallengeType] = useState("");

  useEffect(() => {
    setDisplayTotal({
      chapters_read: chapters_read,
      books_read: books_read,
      verses_memorized: verses_memorized,
    });
  }, [name, chapters_read, books_read, verses_memorized]); //needed something to get the first reader in the list to display stuff

  const updateTotals = (total, challengeType) => {
    console.log(`${challengeType}: ${displayTotal[challengeType]}`);
    let newTotal = Number(inputs[challengeType]) + Number(total); //I think this should change displayed totals
    console.log(newTotal);
    setDisplayTotal({
      ...displayTotal,
      [challengeType]: newTotal,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setChallengeType(e.target.name);
    try {
      const thisChallengeType = challengeType; //for display totals
      const challenge_type = challengeType; //for fetch request
      const ad_reader_id = adReader.ad_reader_id;
      let total;
      if (thisChallengeType === "chapters_read") {
        total = displayTotal.chapters_read;
        updateTotals(total, challengeType);
      } else if (thisChallengeType === "books_read") {
        total = displayTotal.books_read;
        updateTotals(total, challengeType);
      } else {
        total = displayTotal.verses_memorized;
        updateTotals(total, challengeType);
      }
    } catch (err) {
      console.error(err.message);
    }
    resetInputs();
  };

  const onChange = (e) => {
    //this allows the inputs values to change
    e.preventDefault();
    setChallengeType(e.target.name);
    if (e.target.name === "chapters_read") {
      return setInputs({
        ...inputs,
        chapters_read: e.target.value,
      });
    } else if (e.target.name === "books_read") {
      return setInputs({ ...inputs, books_read: e.target.value });
    } else {
      setInputs({ ...inputs, verses_memorized: e.target.value });
    }
    console.log("you changed something");
  };

  const resetInputs = () => {
    setInputs({
      chapters_read: 0,
      books_read: 0,
      verses_memorized: 0,
    });
  };

  let jsxId = `ad${adReader.ad_reader_id}`;
  let targetId = `#ad${adReader.ad_reader_id}`;

  return (
    <>
      <h3>
        Chapters: {displayTotal.chapters_read} Books: {displayTotal.books_read}{" "}
        Verses: {displayTotal.verses_memorized}
      </h3>
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
                onClick={() => resetInputs()}
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
                      value={inputs.chapters_read}
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
                    value={inputs.books_read}
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
                      value={inputs.verses_memorized}
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
    </>
  );
};

/*const [chaptersTotal, setChaptersTotal] = useState("");
  const [booksTotal, setBooksTotal] = useState("");
  const [versesTotal, setVersesTotal] = useState("");
  const [challengeType, setChallengeType] = useState("");
  const resetAll = () => {
    setChaptersTotal(0);
    setBooksTotal(0);
    setVersesTotal(0);
  };

  useEffect(() => {
    setChaptersTotal(chapters_read);
    setBooksTotal(books_read);
    setVersesTotal(verses_memorized);
  }, [chaptersTotal]);

  // const updateTotals = (total, challengeType) => {
  //   let newTotal = adReader[challengeType] + Number(total);
  //   setAdReader({
  //     ...adReader,
  //     [challengeType]: newTotal,
  //   });
  // };

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
      } else if (thisChallengeType === "books_read") {
        total = booksTotal;
      } else {
        total = versesTotal;
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
                // onClick={() => resetAll()}
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
                    value={adReader.books_read}
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
                      value={adReader.verses_total}
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
                  <p>{challengeType}</p>
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
*/
export default ReportAdReaderReading;
