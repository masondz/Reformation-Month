import React, { Fragment, useState, useEffect } from 'react'
// import { Link } from "react-router-dom";
import './Dashboard.css'
import { toast } from 'react-toastify'

import FindChallenge from './FindChallenge'
import ReaderChallenges from './ReaderChallenges'
import ChallengeDashboard from './ChallengeDashboard'
import ReaderInfo from './ReaderInfo'
import ReportReading from './ReportReading'
import FamilyGroup from './FamilyGroup'

const Dashboard = ({ setAuth }) => {
    const [reader, setReader] = useState('')
    const [inReadingChallenge, setInReadingChallenge] = useState(false)
    const [readersChallenges, setReadersChallenges] = useState([])
    const [createChallenge, setCreateChallenge] = useState(false)
    const [familyGroupState, setFamilyGroupState] = useState(false)
    //Get the Reader's info
    console.log(readersChallenges)
    async function getReader() {
        try {
            const response = await fetch('/dashboard/', {
                method: 'GET',
                headers: { token: localStorage.token },
            })

            const parseRes = await response.json()
            setReader(parseRes)
        } catch (err) {
            console.error(err.message)
        }
    }

    //Check if reader is in challenge
    async function checkChallenge() {
        try {
            const response = await fetch(
                '/reader-dashboard/reader-challenge-id/',
                {
                    method: 'GET',
                    headers: { token: localStorage.token },
                }
            )

            const parseRes = await response.json()
            if (parseRes.length !== 0) {
                setInReadingChallenge(true)
                setReadersChallenges(parseRes)
            }
        } catch (err) {
            console.error(err.message)
        }
    }

    const logout = (e) => {
        e.preventDefault()
        localStorage.removeItem('token')
        setAuth(false)
        toast.success('You logged out successfully!')
    }

    useEffect(() => {
        getReader()
        checkChallenge()
    }, [inReadingChallenge])

    const toggleFG = () => {
        familyGroupState === false
            ? setFamilyGroupState(true)
            : setFamilyGroupState(false)
    }

    const [displayTotal, setDisplayTotal] = useState({
        chapters_read: '',
        books_read: '',
        verses_memorized: '',
    })

    return (
        <Fragment>
            <nav className="nav-container">
                <ReaderInfo reader={reader} />
                <div>
                    <ReportReading
                        setAuth={setAuth}
                        reader={reader}
                        setReader={setReader}
                        toggleFG={() => toggleFG()}
                    />
                </div>
            </nav>
            <main>
                {familyGroupState && (
                    <FamilyGroup
                        setAuth={setAuth}
                        reader={reader}
                        setDisplayTotal={setDisplayTotal}
                        displayTotal={displayTotal}
                    />
                )}
                {!createChallenge && inReadingChallenge && (
                    <>
                        <ReaderChallenges
                            reader={reader}
                            getReader={getReader}
                            setAuth={setAuth}
                            readersChallenges={readersChallenges}
                            setReadersChallenges={setReadersChallenges}
                            setInReadingChallenge={setInReadingChallenge}
                            displayTotal={displayTotal}
                        />
                    </>
                )}

                {!createChallenge && !inReadingChallenge (
                    <Fragment>
                        <div className="form-control mb-5">
                            <FindChallenge
                                setAuth={setAuth}
                                readersChallenges={readersChallenges}
                                setReadersChallenges={setReadersChallenges}
                                setInReadingChallenge={setInReadingChallenge}
                                checkChallenge={checkChallenge}
                            />
                        </div>
                        <button
                            className="btn btn-outline-info"
                            onClick={() => setCreateChallenge(true)}
                        >
                            Create Challenge
                        </button>
                    </Fragment>
                )}
                <div className="mt-5">
                    {createChallenge && (
                        <ChallengeDashboard
                            setAuth={setAuth}
                            setCreateChallenge={setCreateChallenge}
                            reader={reader}
                        />
                    )}
                </div>
                {/* <Link to={"/challenge-dashboard"}>Create Challenge</Link> */}

                <button
                    className="btn btn-warning text-white btn-sm mb-5"
                    onClick={(e) => logout(e)}
                >
                    Logout
                </button>
            </main>
        </Fragment>
    )
}

export default Dashboard
