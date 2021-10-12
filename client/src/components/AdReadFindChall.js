import React, { useState } from "react";

const AdReadFindChall = ({ setAuth, adReader }) => {
  const [searchChallenge, setSearchChallenge] = useState(false);
  const [input, setInput] = useState("");
  
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
        <form onSubmit={onSubmit} id="adreader-find-challenge">
          <input
            // onChange={(e) => onChange(e)}
            
            list="challenge-list"
            name="chal-list"
            id="chal-list"
            placeholder="Search for reading challenge"
          />
          <datalist id="challenge-list">
            <option>Coming Soon!</option>
            <option>Coming Soon!</option>

            {/* {challengeList.map((challenge) => {
              return (
                <option value={challenge.challenge_name} key={challenge.id}>
                  Read {challenge.goal} Chapters
                </option>
              );
            })} */}
          </datalist>
          <input type="submit" value="Submit">
        </form>
      )}
    </div>
  );
};

export default AdReadFindChall;
