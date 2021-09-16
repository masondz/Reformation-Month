import React, {useState, useEffect} from "react";

const ChallengeTotal = ({ setAuth, challenge }) => {
  
  const [total, setTotal] = useState("...");
  
  const getTotals = () => {
    const const challenge_id = challeng.id
    try{
      const body = {challenge_id};
      const getTotal = await fetch('https://localhost:5000/challenge-dashboard/challenge-total',
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.token,
          },
          body: JSON.stringify(body),
        }
      const parseRes = getTotal.json();
      setTotal(parseRes);
    }catch(err){
      console.error(err.message)
    }
  }
  
  return <>{challenge.challenge_name} total</>;
};

export default ChallengeTotal;
