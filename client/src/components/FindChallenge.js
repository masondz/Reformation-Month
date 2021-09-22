import React, { Fragment, useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const FindChallenge = ({
    setAuth,
    setInReadingChallenge,
    setReadersChallenges,
    readersChallenges,
    checkChallenge,
}) => {
    const [challengeList, setChallengeList] = useState([])
    const [inputs, setInputs] = useState({
        challenge_name: '',
        id: '',
        organization: '',
    })

    const { challenge_name, id, organization } = inputs //destructure reading-challenge info
    //
    //
    //
    //Get all of the Challenges //
    async function getChallenges() {
        try {
            const response = await fetch('/find-challenges', {
                method: 'GET',
                headers: { token: localStorage.token },
            })

            const parseRes = await response.json()
            setChallengeList(parseRes)
        } catch (err) {
            console.error(err.message)
        }
    }

    useEffect(() => {
        getChallenges()
    }, [])
    //
    //
    //
    //Get the reader's ID
    const [readerId, setReaderId] = useState('Blank id')

    useEffect(() => {
        async function getReaderId() {
            try {
                const response = await fetch('/dashboard/', {
                    method: 'GET',
                    headers: { token: localStorage.token },
                })

                const parseRes = await response.json()

                setReaderId(parseRes.id)
            } catch (err) {
                console.error(err.message)
            }
        }
        getReaderId()
    }, [readerId])
    //
    //
    //
    //update inputs
    useEffect(() => {
        const updateInputs = () => {
            for (let i = 0; i < challengeList.length; i++) {
                if (challengeList[i].challenge_name === inputs.challenge_name) {
                    setInputs({
                        challenge_name: challengeList[i].challenge_name,
                        organization: challengeList[i].organization,
                        id: challengeList[i].id,
                    })
                }
            }
        }
        updateInputs()
    }, [challenge_name, challengeList])
    //
    //
    //
    //Submit challenge_id and reader_id to readers_reading_challenges table in database
    const onSubmit = async (e) => {
        e.preventDefault()
        try {
            const reader_id = readerId
            const challenge_id = id
            const body = { reader_id, challenge_id }
            const response = await fetch('/find-challenges', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: localStorage.token,
                },

                body: JSON.stringify(body),
            })
                .then((response) => {
                    response.json().then((results) => console.log(results))
                    if (response.status === 200) {
                        toast.success(
                            `You have joined the ${challenge_name} challenge!`
                        )
                        setInReadingChallenge(true)
                        checkChallenge()
                    } else if (response.status === 401) {
                        toast.error(
                            `You have already joined challenge: ${challenge_name}`
                        )
                    } else if (response.status === 400) {
                        toast.error(`${challenge_name} does not exists`)
                    }
                })
                .then(
                    setInputs({ challenge_name: '', id: '', organization: '' })
                )
        } catch (err) {
            console.error(err.message)
        }
    }
    //
    //
    //
    //onChange function
    const onChange = (e) => {
        setInputs({ ...inputs, challenge_name: e.target.value })
    }

    const [verb, setVerb] = useState('')

    //   return statement
    return (
        <Fragment>
            <form onSubmit={onSubmit}>
                <label htmlFor="chal-list">Find a reading Challenge</label>
                <input
                    value={challenge_name}
                    onChange={(e) => onChange(e)}
                    className="form-control"
                    list="challenge-list"
                    name="chal-list"
                    id="chal-list"
                    placeholder="Search for reading challenge"
                />
                <datalist id="challenge-list">
                    {challengeList.map((challenge) => {
                        return (
                            <option
                                value={challenge.challenge_name}
                                key={challenge.id}
                            >
                                {challenge.challenge}: {challenge.goal}
                            </option>
                        )
                    })}
                </datalist>
            </form>
        </Fragment>
    )
}

export default FindChallenge
