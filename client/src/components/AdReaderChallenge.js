import React, {useState, useEffect} from 'react';

const AdReaderChallenges = ({setAuth, adReader}) => {
  const [challenges, setChallenges] = useState([]);
  
  useEffect(() => {
    const getChallenges = async () => {
      try {
        const adReaderId = adReader.ad_reader_id;
        const challenges = await fetch(`/additional-readers/challenges/${adReaderId}`,
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
    };
    getChallenges();
    console.log(challenges)
  },[])
  
  
  
  return( 
    <div>
    <p><i>Modify member's challenge coming soon!</i></p>
    {challenges.map(challenge => console.log(Object.keys(challenge))} 
    </div>
  )
}

export default AdReaderChallenges;
