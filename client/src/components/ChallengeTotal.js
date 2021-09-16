import React, { useState, useEffect } from "react";

const ChallengeTotal = ({ setAuth, challenge, setCalculating, reader }) => {
  const [total, setTotal] = useState("...");
  console.log("ChallengeTotal challenge prop:" + challenge.challenge);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const getTotals = async () => {
      const challenge_id = challenge.id;
      try {
        const getTotal = await fetch(
          `http://localhost:5000/challenge-dashboard/challenge-total/${challenge_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              token: localStorage.token,
            },
          }
        );
        const parseRes = await getTotal.json();
        console.log(parseRes);
        setTotal(parseRes.total);
        setCalculating(false);
      } catch (err) {
        console.error(err.message);
      }
    };
    getTotals();
    setProgress((total / challenge.goal) * 100);
  }, [
    total,
    challenge.goal,
    challenge.id,
    reader.chapters_read,
    reader.books_read,
    reader.verses_memorized,
  ]);
  console.log(progress);

  return (
    <div>
      <div>
        <div className="progress">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
        {/* <meter id="goal" min="0" max={challenge.goal} value={total} /> */}
      </div>
      <h3>
        Goal: {total} / {challenge.goal} {challenge.challenge}
      </h3>
    </div>
  );
};

export default ChallengeTotal;
