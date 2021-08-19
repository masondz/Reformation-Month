import React, { Fragment, useEffect, useState } from "react";

const FamilyGroup = ({ setAuth, reader }) => {
  const [inFamGroup, setInFamGroup] = useState(false);

  useEffect(() => {
    //get reader's family group
  });

  const toggleFG = () => {
    inFamGroup === false ? setInFamGroup(true) : setInFamGroup(false);
  };

  return (
    <Fragment>
      <h3>{reader.first_name}'s Family Group Component</h3>
      {!inFamGroup ? (
        <div>
          <h4>You are not in a family Group yet</h4>
          <button onClick={() => toggleFG()}>Join Family Group</button>
        </div>
      ) : (
        <div>
          <h3>Your Family Group</h3>
          <button onClick={() => toggleFG()}>Exit</button>
        </div>
      )}
    </Fragment>
  );
};

export default FamilyGroup;
