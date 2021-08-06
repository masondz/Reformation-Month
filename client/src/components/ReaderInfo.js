import React, { Fragment, useState, useEffect } from "react";

const ReaderInfo = ({ setAuth, reader }) => {
  const { chapters_read, books_read, verses_memorized } = reader;
  console.log(chapters_read);
  console.log(reader);
  return (
    <Fragment>
      <h2>{reader.first_name}'s Info Goes Here</h2>
      <div>
        <h3>
          Chapters: {reader.chapters_read} Books: {reader.books_read} Verses:{" "}
          {reader.verses_memorized}
        </h3>
      </div>
    </Fragment>
  );
};

// stats={stats}
//         setStats={setStats}

export default ReaderInfo;
