import React, { Fragment, useState, useEffect } from "react";

const ReaderInfo = ({ setAuth, reader }) => {
  const { chapters_read, books_read, verses_memorized } = reader;
  console.log(chapters_read);
  console.log(reader);
  return (
    <Fragment>
      <div>
        <div className="d-flex justify-content-lg-start align-items-center">
          <h2 className="pe-3">Chapters: {reader.chapters_read}</h2>
          <h2 className="pe-3">Books: {reader.books_read}</h2>
          <h2 className="pe-3">Verses: {reader.verses_memorized}</h2>
        </div>
      </div>
    </Fragment>
  );
};

export default ReaderInfo;
