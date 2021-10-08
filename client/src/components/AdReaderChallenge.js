import React, {useState, useEffect} from 'react';

const AdReaderChallenges = ({setAuth, adReader}) => {
  const adReaderId = adReader.ad_reader_id;
  
  useEffect(() => {
    const adReaderId = adReader.ad_reader_id;
    const getChallenges = async (adReaderId) => {
      try {
        const challenges = await fetch('/additional-readers/${adReaderId}', (req, res) => {
          
        })
      } catch (err){
        console.error(err.message);
      }
    }
  })
  
  return <p><i>Modify member's challenges coming soon!</i></p>
}

export default AdReaderChallenges;
