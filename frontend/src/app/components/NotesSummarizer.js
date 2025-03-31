"use client";

import React, { useState } from "react";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";
import axios from "axios";

const NotesSummarizer = () => {
  const [summary, setSummary] = useState("");

  const handleUpload = (file) => {
    const formData = new FormData();
    formData.append("file", file[0]);

    axios.post("http://localhost:5000/summarize", formData).then((res) => {
      setSummary(res.data.summary);
    });
  };

  return (
    <div>
      <h2>📜 Upload Lecture Notes</h2>
      <FilePond allowMultiple={false} onupdatefiles={(file) => handleUpload(file)} />
      {summary && <div><h3>📝 Summary:</h3><p>{summary}</p></div>}
    </div>
  );
};

export default NotesSummarizer;
