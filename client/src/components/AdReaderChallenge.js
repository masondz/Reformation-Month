import React, {useState, useEffect} from 'react';
// import AdReadChallList from './AdReadChallList';

const AdReaderChallenges = ({setAuth, adReader}) => {
  const [challenges, setChallenges] = useState([]);
  const [adReaderName, setAdReaderName] = useState('member');
  const adReaderId = adReader.ad_reader_id;
  
  const getChallenges = async () => {
      try {
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
  
  useEffect(() => {
    getChallenges();
    console.log(challenges)
  },[])
  
  useEffect(() => {
    if (adReader.name === undefined) {
      console.log('The additional reader wasn't passed')
      return;
    }
      setAdReaderName(adReader.name);
  },[])
  
//    {challenges.map((challenge) => (
//         <p>{Object.entries(challenge)}</p>
//       ))} 
  
  return( 
    <div>
     <p><i>Modify {adReaderName}'s challenge coming soon!</i></p>
    </div>
  )
}

export default AdReaderChallenges;
