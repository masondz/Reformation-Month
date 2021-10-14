import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const AdReadFindChall = ({
    setAuth,
    adReader,
    setChallenges,
    challenges,
    getAdReaderChallenges,
}) => {
    const [challengeList, setChallengeList] = useState([])

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

    //Submit challenge_id and reader_id to readers_reading_challenges table in database
    // /additiona-readers/challenges  ...  use req.body
    const onSubmit = async (e) => {
        e.preventDefault()
        try {
            const ad_reader_id = adReader.ad_reader_id
            const challenge_id = id
            const body = { ad_reader_id, challenge_id }
            const response = await fetch('/additional-readers/challenges', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: localStorage.token,
                },

                body: JSON.stringify(body),
            })
            if (response.status === 200) {
                console.log(challenges)
                toast.success('Member added to challenge!')
                // window.location = '/'
                getAdReaderChallenges()
            } else if (response.status === 403) {
                toast.warning('Member already in reading challenge!')
            }
        } catch (err) {
            toast.warning('Member already in reading challenge!')
            console.error(err.message)
        }
    }

    const [inputs, setInputs] = useState({
        challenge_name: '',
        id: '',
        organization: '',
    })

    const { challenge_name, id, organization } = inputs //destructure reading-challenge info
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

    const onChange = (e) => {
        setInputs({ ...inputs, challenge_name: e.target.value })
    }
    return (
        <div>
            <form onSubmit={onSubmit} id="adreader-find-challenge">
                <input
                    // onChange={(e) => onChange(e)}
                    value={challenge_name}
                    onChange={(e) => onChange(e)}
                    list="challenge-list"
                    name="chal-list"
                    id="chal-list"
                    placeholder="Search for reading challenge"
                />
                <datalist id="challenge-list">
                    {/* <option>Coming Soon!</option>
                    <option>Coming Soon!</option> */}

                    {challengeList.map((challenge) => {
                        return (
                            <option
                                value={challenge.challenge_name}
                                key={challenge.id}
                            >
                                Read {challenge.goal} Chapters
                            </option>
                        )
                    })}
                </datalist>
                <button className="adreader-join">Join</button>
            </form>
        </div>
    )
}

export default AdReadFindChall
