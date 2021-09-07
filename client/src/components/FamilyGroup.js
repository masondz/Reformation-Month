import React, { useEffect, useState } from "react";
import ReportAdReaderReading from "./ReportAdReaderReading";
import JoinFamilyGroup from "./JoinFamilyGroup";
import CreateFamilyGroup from "./CreateFamilyGroup";

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
  
  const deleteAdReader = async (e) => { //possible delete adReader from list
    e.preventDefault();
    
    try {
      const body.reader_id = reader.id;
      const body.ad_reader_id = adReader.ad_reader_id;
      const request = await fetch("http://localhost:5000/additional-readers", {
        method: "DELETE",
        headers: {"Content-Type": "application/json",
        token: localStorage.token},
        body: JSON.stringify(body),
      });
    } catch (err){
      console.error(err.message)
    }
    const adReaderList = adReaders;
    const newList = readers.filter(reader => reader.ad_reader_id === adReaderId);
    setAdReaders(newList); //will this work??
    
  }
  
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
  }, []); //might try adding adReaders to dependencies, so that it refreshes with an ad_reader_id?

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
          <h4>
            You are not in a family Group yet. Family Groups allows you to
            report for readers who are not able to make reading reports for
            themselves (such as children)
          </h4>
          <div>
            <JoinFamilyGroup setAuth={setAuth} reader={reader} />
            <CreateFamilyGroup setAuth={setAuth} reader={reader} />
          </div>
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
                <ReportAdReaderReading adReader={adReader} adReaders={adReaders} setAdReaders={setAdReaders}/> <button type='button' 
                    onClick={(e)=>deleteAdReader(e)}> Delete Reader </button>
              </h5>
            </ul>
          ))}
        </div>
      )}
    </div>
  );
};

export default FamilyGroup;
