import React, { Fragment, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import ChallengeTotal from './ChallengeTotal'

import Leaderboard from './Leaderboard.js'

import EditChallenge from './EditChallenge'
import EditChallenge2 from './EditChallenge2'

const ReaderChallenges = ({
    setAuth,
    reader,
    readersChallenges,
    setReadersChallenges,
    setInReadingChallenge,
    displayTotal,
}) => {
    // console.log(readersChallenges);
    console.log('ReadeChallenges.js:displayTotal -' + displayTotal)
    const {
        //destructer reader that is passed down by props from Dashboard
        first_name,
        last_name,
        chapters_read,
        books_read,
        versus_memorized,
        id,
    } = reader

    const [calculating, setCalculating] = useState(false)
    const toggleCa = () => {
        calculating === true ? setCalculating(false) : setCalculating(true)
    }

    const [total, setTotal] = useState('...')

    //Remove reader from reading challenge
    const removeReader = async (reader_id, challenge_id) => {
        try {
            const readerChallenge = await fetch(
                `/reader-dashboard/reader-challenge-id/?reader_id=${reader_id}&challenge_id=${challenge_id}`,
                {
                    method: 'DELETE',
                    headers: {
                        token: localStorage.token,
                    },
                }
            )
            await setReadersChallenges(
                readersChallenges.filter(
                    (challenge) => challenge.id !== challenge_id
                )
            )
            toast.warning('You have left the reading challenge.')
            if (readersChallenges.length === 0) {
                setInReadingChallenge(false)
            }
        } catch (err) {
            console.error(err.message)
        }
    }

    useEffect(() => {
        if (readersChallenges.length === 0) {
            setInReadingChallenge(false)
        }
    })

    return (
        <div className="my-2">
            {readersChallenges.map((challenge, index) => {
                return (
                    <Fragment key={challenge.id.toString()}>
                        <div className="challenge-card">
                            <div className="challenge-content">
                                <div className="challenge-titles">
                                    <p>{challenge.organization}</p>
                                    <h3 value={challenge.id} key={110}>
                                        {challenge.challenge_name}
                                    </h3>
                                    <div
                                        key={(
                                            challenge.challege_id + 1
                                        ).toString()}
                                    >
                                        {calculating ? (
                                            '...'
                                        ) : (
                                            <ChallengeTotal
                                                reader={reader}
                                                setAuth={setAuth}
                                                challenge={challenge}
                                                setTotal={setTotal}
                                                setCalculating={setCalculating}
                                                displayTotal={displayTotal}
                                            />
                                        )}
                                    </div>
                                </div>
                                {reader.id !== challenge.challenge_admin ? (
                                    <div className="leave-challenge">
                                        <p
                                            onClick={() =>
                                                removeReader(
                                                    reader.id,
                                                    challenge.id
                                                )
                                            }
                                        >
                                            +
                                        </p>
                                    </div>
                                ) : (
                                    <Fragment key={challenge.id.toString()}>
                                        <Leaderboard
                                            setAuth={setAuth}
                                            challenge={challenge}
                                        />
                                        <EditChallenge2
                                            challenge={challenge}
                                            reader={reader}
                                            setReadersChallenges={
                                                setReadersChallenges
                                            }
                                            readersChallenges={
                                                readersChallenges
                                            }
                                        />
                                    </Fragment>
                                )}
                            </div>
                        </div>
                    </Fragment>
                )
            })}
        </div>
    )
}

export default ReaderChallenges
