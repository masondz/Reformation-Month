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
      {challenges[0].challenge_name 
        ? <p><i>Modify member's challenges coming soon!</i></p>
        :  <p> challenge_name is false </p>
}
    </div>
  )
}

export default AdReaderChallenges;
