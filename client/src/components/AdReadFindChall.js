import React, { useState } from "react";

const AdReadFindChall = ({ setAuth, adReader }) => {
  const [searchChallenge, setSearchChallenge] = useState(false);

  const onSubmit = () => {
    console.log("you submitted something.");
  };

  const onClick = (e) => {
    e.preventDefault();
    if (searchChallenge) {
      return setSearchChallenge(false);
    }
    setSearchChallenge(true);
  };

  return (
    <div>
      {!searchChallenge ? (
        <button onClick={(e) => onClick(e)} className=" btn-sm btn-secondary">
          + Reading Challenge
        </button>
      ) : (
        <form onSubmit={onSubmit} className="form-control">
          <input
            // onChange={(e) => onChange(e)}
            className="form-control"
            list="challenge-list"
            name="chal-list"
            id="chal-list"
            placeholder="Search for reading challenge"
          />
          <datalist id="challenge-list">
            <option>hello</option>
            <option>world</option>

            {/* {challengeList.map((challenge) => {
              return (
                <option value={challenge.challenge_name} key={challenge.id}>
                  Read {challenge.goal} Chapters
                </option>
              );
            })} */}
          </datalist>
          <button onClick={(e) => onClick(e)}>cancel</button>
        </form>
      )}
    </div>
  );
};

export default AdReadFindChall;
