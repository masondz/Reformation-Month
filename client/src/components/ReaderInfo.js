import React, { Fragment, useState, useEffect } from "react";

const ReaderInfo = ({ setAuth, reader }) => {
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
      <button className="btn btn-outline-primary">Report Reading</button>
    </Fragment>
  );
};

export default ReaderInfo;
