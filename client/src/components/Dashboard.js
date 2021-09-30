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
    const [findingChallenge, setFindingChallenge] = useState(false)
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

    const toggleFC = () => {
        findingChallenge === false
            ? setFindingChallenge(true)
            : setFindingChallenge(false)
    }

    const findChallenge = (
        <Fragment>
            <div className="form-control mb-2">
                <FindChallenge
                    setAuth={setAuth}
                    readersChallenges={readersChallenges}
                    setReadersChallenges={setReadersChallenges}
                    setInReadingChallenge={setInReadingChallenge}
                    checkChallenge={checkChallenge}
                    toggleFC={() => toggleFC()}
                    findingChallenge={findingChallenge}
                    setFindingChallenge={setFindingChallenge}
                />
                <button
                    className="btn btn-outline-info"
                    onClick={() => setCreateChallenge(true)}
                >
                    Create Challenge
                </button>
            </div>
        </Fragment>
    )

    const navButton = {
        margin: '5px',
        minWidth: '150px',
        padding: '3px',
        border: 'double 5px rgb(245, 105, 2)',
        backgroundColor: 'white',
        color: 'rgb(255, 75, 82)',
    }

    // 1. have find-challenge component and create challenge button loaded if reader not in any challenges.
    // 2. hide find-challenge compenent and create challenge button if in a challenge
    // 3. load both after pushing/clicking challenge button

    // a. Put a button in nav that toggles inReadingChallenge to false
    // b. Put an exit button in Find Challenge component that toggles inReadingChallenge to true
    // c. Put join button in Find Challenge component

    return (
        <Fragment>
            <nav className="nav-container">
                <ReaderInfo reader={reader} />
                <div className="nav-buttons">
                    <ReportReading
                        setAuth={setAuth}
                        reader={reader}
                        setReader={setReader}
                        toggleFG={() => toggleFG()}
                        toggleFC={() => toggleFC()}
                        findingChallenge={findingChallenge}
                    />
                </div>
            </nav>
            <main>
                {!createChallenge && !inReadingChallenge
                    ? findChallenge
                    : findingChallenge && findChallenge}
                <div className="mt-5">
                    {createChallenge && (
                        <ChallengeDashboard
                            setAuth={setAuth}
                            setCreateChallenge={setCreateChallenge}
                            reader={reader}
                        />
                    )}
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
                </div>
                {/* <Link to={"/challenge-dashboard"}>Create Challenge</Link> */}
            </main>
            <button
                className="btn btn-warning text-white btn-sm mb-5"
                onClick={(e) => logout(e)}
            >
                Logout
            </button>
        </Fragment>
    )
}

export default Dashboard
