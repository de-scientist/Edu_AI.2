import React, { useRef } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const StudentReport = ({ studentId }) => {
  const [studentData, setStudentData] = useState(null);
  const reportRef = useRef();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`http://localhost:5000/progress?studentId=${studentId}`);
        setStudentData(response.data);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    }

    fetchData();
  }, [studentId]);

  const generatePDF = () => {
    html2canvas(reportRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 10, 10, 180, 0);
      pdf.save(`Student_Report_${studentId}.pdf`);
    });
  };

  if (!studentData) return <p>Loading...</p>;

  return (
    <div>
      <h2>📜 Student Progress Report</h2>
      <div ref={reportRef} style={{ padding: "20px", background: "white" }}>
        <h3>Student ID: {studentId}</h3>
        <ul>
          {studentData.map((entry) => (
            <li key={entry.id}>
              <b>Course:</b> {entry.courseId} - <b>Progress:</b> {entry.progress}%
            </li>
          ))}
        </ul>
      </div>
      <button onClick={generatePDF}>Download Report</button>
    </div>
  );
};

export default StudentReport;
