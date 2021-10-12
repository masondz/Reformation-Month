import React, {useState, useEffect} from 'react';

const AdReadChallList = ({ setAuth, challenges }) => {
//   const [challenges, setChallenges] = useState([]);
  
 
  
//    {challenges.map((challenge) => (
//         <p>{Object.entries(challenge)}</p>
//       ))} 
  
  return( 
    <div>
    {challenges.map((challenge) => (
      <p>{challenge.challenge_name}</p>
    )}
    </div>
  )
}

export default AdReadChallList;
