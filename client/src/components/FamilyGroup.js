import React, { Fragment, useEffect, useState } from "react";

const FamilyGroup = ({ setAuth, reader }) => {
  const [inFamGroup, setInFamGroup] = useState(false);
  const [famGroup, setFamGroup] = useState({});

  //get reader's family group
  const getFamilyGroup = async () => {
    try {
      const familyGroup = await fetch("http://localhost:5000/family-group", {
        method: "GET",
        headers: { token: localStorage.token },
      });
      if (familyGroup.status === 401) {
        console.log("You are not in a family group");
        return;
      }
      const parseRes = await familyGroup.json();
      setFamGroup(parseRes);
      setInFamGroup(true);
      console.log(parseRes);
    } catch (err) {
      console.error(err.message);
    }
  };

  //Get Additional Readers: ...

  useEffect(() => {
    getFamilyGroup();
  }, []);

  const toggleFG = () => {
    inFamGroup === false ? setInFamGroup(true) : setInFamGroup(false);
  };

  return (
    <Fragment>
      <h4>Family Group</h4>
      {!inFamGroup ? (
        <div>
          <h4>You are not in a family Group yet</h4>
          <button onClick={() => toggleFG()}>Join Family Group</button>
        </div>
      ) : (
        <div>
          <h3>{famGroup.family_name}</h3>
          {famGroup.additional_reader_ids.map((id) => (
            <h4>{id}</h4>
          ))}
          <button onClick={() => toggleFG()}>Exit</button>
        </div>
      )}
    </Fragment>
  );
};

export default FamilyGroup;
