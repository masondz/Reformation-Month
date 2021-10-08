import React, {useState, useEffect} from 'react';

const AdReaderChallenges = ({setAuth, adReader}) => {
  const [challenges, setChallenges] = useState([]);
  
  useEffect(() => {
    const getChallenges = async (adReaderId) => {
      try {
        const adReaderId = adReader.ad_reader_id;
        const challenges = await fetch('/additional-readers/${adReaderId}',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              token: localStorage.token,
            },
          }
        )
        let parseRes = await challenges.json()
        setChallenges(parseRes)
        console.log(parseRes)
      } catch (err){
        console.error(err.message);
      }
    }
  })
  
  
  
  return( 
    <div>
    <p><i>Modify member's challenges coming soon!</i></p>
      {challenges.map((challenge) => {
        <p>{challenge.challenge_name}</p>
      })}
    </div>
  )
}

export default AdReaderChallenges;
