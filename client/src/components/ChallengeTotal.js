import React, { useState, useEffect } from "react";

const ChallengeTotal = ({
  setAuth,
  challenge,
  setCalculating,
  reader,
  displayTotal,
}) => {
  const [total, setTotal] = useState("...");
  console.log("ChallengeTotal challenge prop:" + challenge.challenge);
  console.log("displayTotal challenge prop:" + displayTotal);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const getTotals = async () => {
      const challenge_id = challenge.id;
      const challenge_type = challenge.challenge;
      try {
        const getTotal = await fetch(
          `http://localhost:5000/challenge-dashboard/challenge-total/${challenge_id}/${challenge_type}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              token: localStorage.token,
            },
          }
        );
        const parseRes = await getTotal.json();
        console.log("getTotal query" + parseRes);
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
    displayTotal.chapters_read,
    displayTotal.books_read,
    displayTotal.verses_memorized,
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
