import React, {useState, useEffect} from "react";

const ChallengeTotal = ({ setAuth, challenge }) => {
  
  const [total, setTotal] = useState("...");
  
  const getTotals = () => {
    return total;
  }
  
  return <>{challenge.challenge_name} total</>;
};

export default ChallengeTotal;
