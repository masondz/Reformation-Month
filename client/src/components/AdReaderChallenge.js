import React, { useState, useEffect } from 'react'
import AdReadFindChall from './AdReadFindChall'

const AdReaderChallenges = ({ setAuth, adReader }) => {
    const [challenges, setChallenges] = useState([])
    const [adReaderName, setAdReaderName] = useState('member')
    const [editChallenges, setEditChallenges] = useState(false)

    const toggleEdit = () => {
        if (editChallenges) {
            setEditChallenges(false)
        } else {
            setEditChallenges(true)
        }
    }

    const adReaderId = adReader.ad_reader_id
    const getAdReaderChallenges = async () => {
        try {
            const challenges = await fetch(
                `/additional-readers/challenges/${adReaderId}`,
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
        } catch (err) {
            console.error(err.message)
        }
    }

    const onClick = () => {
        setAdReaderName(adReader.name)
        getAdReaderChallenges()
        toggleEdit()
    }

    const onRemove = async (adreader_id, challengeId) => {
        try {
            let ad_reader_id = adreader_id
            let challenge_id = challengeId
            let body = { ad_reader_id, challenge_id }
            console.log(body)
            const readerChallenge = await fetch(
                `/additional-readers/challenges`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        token: localStorage.token,
                    },

                    body: JSON.stringify(body),
                }
            )
            setChallenges(
                challenges.filter((challenge) => challenge.id !== challenge_id)
            )
        } catch (err) {
            console.error(err.message)
        }
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

    return (
        <div>
            {!editChallenges ? (
                <button
                    className="adreader-button"
                    type="button"
                    onClick={() => onClick()}
                >
                    Edit Challenges
                </button>
            ) : (
                <div className="adreader-challenges">
                    {challenges.map((challenge) => (
                        <div className="challenges-container">
                            <p>
                                {challenge.challenge_name} |
                                <button
                                    id={challenge.challenge_id}
                                    className="adreader-remove"
                                    onClick={() => {
                                        onRemove(
                                            adReader.ad_reader_id,
                                            challenge.id
                                        )
                                    }}
                                >
                                    Remove
                                </button>
                            </p>
                        </div>
                    ))}
                    <div>
                        <AdReadFindChall
                            setAuth={setAuth}
                            adReader={adReader}
                            setChallenges={setChallenges}
                            challenges={challenges}
                            getAdReaderChallenges={getAdReaderChallenges}
                        />
                    </div>
                    <button
                        className="adreader-button"
                        type="button"
                        onClick={() => toggleEdit()}
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    )
}

export default AdReaderChallenges
