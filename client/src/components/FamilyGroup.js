import React, { useEffect, useState } from "react";
import ReportAdReaderReading from "./ReportAdReaderReading";

const FamilyGroup = ({ setAuth, reader }) => {
  const [inFamGroup, setInFamGroup] = useState(false);
  const [famGroup, setFamGroup] = useState({});
  const [adReaders, setAdReaders] = useState([
    {
      name: undefined,
      chapters_read: "",
      books_read: "",
      verses_memorized: "",
    },
  ]);

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
      console.log(familyGroup);
      const parseRes = await familyGroup.json();
      setFamGroup(parseRes);
      setInFamGroup(true);
      console.log(parseRes);
    } catch (err) {
      console.error(err.message);
    }
  };
  useEffect(() => {
    getFamilyGroup();
  }, []);

  //Get Additional Readers: ...
  const getAdditionalReader = async () => {
    try {
      const getAdditionalReader = await fetch(
        "http://localhost:5000/additional-readers",
        {
          method: "GET",
          headers: { token: localStorage.token },
        }
      );
      const parseRes = await getAdditionalReader.json();
      setAdReaders(parseRes);
      console.log(parseRes);
    } catch (err) {
      console.error(err.message);
    }
  };
  useEffect(() => {
    getAdditionalReader();
  }, []);

  // console.log(adReaders);
  const toggleFG = () => {
    inFamGroup === false ? setInFamGroup(true) : setInFamGroup(false);
  };

  return (
    <div className="form-control">
      <h4>
        <i>Family Group</i>
      </h4>
      {!inFamGroup ? (
        <div>
          <h4>You are not in a family Group yet</h4>
          <button onClick={() => toggleFG()}>Join Family Group</button>
        </div>
      ) : (
        <div>
          <h3>{famGroup.family_name}</h3>
          {console.log(adReaders)}
          {adReaders.map((adReader, index) => (
            <ul>
              <h4 key={index} style={{ background: "lightgreen" }}>
                {adReader.name}:
              </h4>
              <h5>
                <ReportAdReaderReading adReader={adReader} />
              </h5>
            </ul>
          ))}
        </div>
      )}
    </div>
  );
};

export default FamilyGroup;
