import React, {useState, useEffect} from 'react';
import AdReadFindChall from './AdReadFindChall';

const AdReaderChallenges = ({setAuth, adReader}) => {
  const [challenges, setChallenges] = useState([]);
  const [adReaderName, setAdReaderName] = useState('member');
  const [editChallenges, setEditChallenges] = useState(false);
  
  const toggleEdit = () => {
    if (editChallenges){
      setEditChallenges(false)
    } else {
      setEditChallenges(true)
    }
  };
  
  
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
  
  const onClick =() => {
    setAdReaderName(adReader.name);
    getChallenges();
    toggleEdit();
  }
  
//   useEffect(() => {
//     getChallenges();
//     console.log(challenges)
//   },[])
  
//   useEffect(() => {
//     if (adReader.name === undefined) {
//       console.log('The additional reader was not passed')
//       return;
//     }
//       setAdReaderName(adReader.name);
//   },[])
  
//    {challenges.map((challenge) => (
//         <p>{Object.entries(challenge)}</p>
//       ))} 
  
  return( 
    <div>
    {!editChallenges
     ? <button className="adreader-button" type="button" onClick={()=>onClick()}>Edit Challenge</button>
     : (
        <div className="adreader-challenges">
          <h5><i>Modify {adReaderName}'s challenges coming soon!</i></h5>
            {challenges.map((challenge) => (
              <p>{challenge.challenge_name}</p>  
            ))} 
            <div>
              <AdReadFindChall setAuth={setAuth} adReader={adReader} />
            </div>
          <button className="adreader-button" type="button" onClick={()=> toggleEdit()}>Close</button>  
        </div>
      )}
    </div>
  )
}

export default AdReaderChallenges;
