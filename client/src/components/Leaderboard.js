import React, { Fragment, useState, useEffect } from 'react'

const Leaderboard = ({ setAuth, challenge }) => {
    const [board, setBoard] = useState([])

    useEffect(() => {        
        const getLeaderboard = async () => {
            try {
                const challenge_id = challenge.id
                const leaderboard = await fetch(
                    `/challenge-dashboard/reader-leaderboard/${challenge_id}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            token: localStorage.token,
                        },
                    }
                )
                let parseRes = await leaderboard.json()
                let values = Object.values(parseRes); 
                console.log('leaderboard?' + values)
                setBoard(parseRes)
            } catch (err) {
                console.error(err.message)
            }
        }
        getLeaderboard()
    }, [challenge.id])

    return (
        {board.map(reader => {
         <p>{reader.first_name} {reader.last_name}: {reader.chapters_read}</p>
        }
//         <p>
//             <i>Leaderboard coming soon!</i>
//         </p>
    )
}

export default Leaderboard
