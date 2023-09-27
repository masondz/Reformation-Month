import React, { Fragment, useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const SearchResultsContainer = ({challengeList, selectedChallenge, setSelectedChallenge)} => {
   const [narrowingList, setNarrowingList] = useState(challengeList);
    
    let output;
    if(narrowingList.length > 0) {
        output = narrowingList.map((challenge) => {
            return <SearchResults challenge={challenge} />
        })
    };
    return <div>{output}</div>
};

const SearchResults = ({ challenge, setSelectedChallenge }) => {
    function onClick() {
        setSelectedChallenge({
            challenge_name: challenge.challenge_name,
            id: challenge.id,
        })
    }

    return (
        <div className="challeng-option">
            <h5>{challenge.challenge_name}</h5>
            <h6>{challenge.goal}</h6>
        </div>
    )
}



const FindChallenge = ({
    setAuth,
    inReadingChallenge,
    setInReadingChallenge,
    setReadersChallenges,
    readersChallenges,
    checkChallenge,
    toggleFC,
    setFindingChallenge,
}) => {
    const [challengeList, setChallengeList] = useState([])
    const [selectedChallenge, setSelectedChallenge] = useState({challenge_name: "", id: ""});
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
    // useEffect(() => {
    //     const updateInputs = () => {
    //         for (let i = 0; i < challengeList.length; i++) {
    //             if (challengeList[i].challenge_name === inputs.challenge_name) {
    //                 setInputs({
    //                     challenge_name: challengeList[i].challenge_name,
    //                     organization: challengeList[i].organization,
    //                     id: challengeList[i].id,
    //                 })
    //             }
    //         }
    //     }
    //     updateInputs()
    // }, [challenge_name, challengeList])
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
        let narrowWords = challengeList.filter((challenge) => {
            return (
                challenge.challenge_name.includes(e.target.value) ||
                challenge.challenge_name.includes(e.target.value.toLowerCase())
            )
        });
        setInputs({ ...inputs, challenge_name: e.target.value })
        if(e.target.value === "" || e.target.value === " ") {
            setChallengeList([]);
        } else {
            setChallengeList(narrowWords);
    }
    };

    const [verb, setVerb] = useState('')

    //   return statement
    return (
        <Fragment>
            <form className="" onSubmit={onSubmit}>
                {inReadingChallenge ? (
                    <p
                        onClick={() => setFindingChallenge(false)}
                        className="FC-close"
                    >
                        +
                    </p>
                ) : (
                    <p
                        onClick={() => setFindingChallenge(false)}
                        className="FC-close"
                        style={{ visibility: 'hidden' }}
                    >
                        +
                    </p>
                )}
                <div className="container">
                    <label htmlFor="chal-list">Find a reading Challenge</label>

                    <div className="input-group">
                        <input
                            id="chal-list"
                            className="form-control mr-sm-2"
                            type="search"
                            placeholder="Search"
                            name="chal-list"
                            aria-label="Search"
                            onKeyUp={(e) => onChange(e)}
                        />
                    </div>
                    <div className="form-control" id="chal-options">
                        {challengeList.length > 0 && (
                            <SearchResultsContainer
                                challengeList={challengeList}
                                selectedChallenge={selectedChallenge}
                                setSelectedChallenge={setSelectedChallenge}
                            />
                        )}
                    </div>

                    <button className="btn btn-outline-success my-2">
                        Join
                    </button>
                </div>

            </form>
        </Fragment>
    )
}

export default FindChallenge
