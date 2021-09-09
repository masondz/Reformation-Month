//add adreader to adreader_reading_challenge table.
//add adreader when:  A: adreader is created. B: When reader joins a reading challenge
//A: ad_reader_id, reader_id

const addReaderReadingChallenge = async (adReaderId, challengeId, readerId) => {
  let ad_reader_id = adReaderId;
  let reader_id = readerId;
  console.log("attempting to hit adreader_reading_challenges");
  console.log(ad_reader_id);
  try {
    const body = { ad_reader_id, reader_id };
    const adReader = await fetch(
      "http://localhost:5000/find-challenges/add-additional-reader",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.token,
        },
        body: JSON.stringify(body),
      }
    );
    const parseRes = await adReader.json();
    console.log(parseRes);
  } catch (err) {
    console.log(err.message);
  }
};

export default addReaderReadingChallenge;
