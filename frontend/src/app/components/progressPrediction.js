import React, { useState } from "react";
import axios from "axios";

const ProgressPrediction = ({ week, pastProgress }) => {
  const [prediction, setPrediction] = useState(null);

  const predict = async () => {
    try {
      const response = await axios.get("http://localhost:5000/predict-progress", {
        params: { week, past_progress: pastProgress },
      });
      setPrediction(response.data.predictedProgress);
    } catch (error) {
      console.error("Prediction error:", error);
    }
  };

  return (
    <div>
      <h2>🔮 Predict Student Progress</h2>
      <button onClick={predict}>Predict</button>
      {prediction && <p>📈 Predicted Progress: {prediction.toFixed(2)}%</p>}
    </div>
  );
};

export default ProgressPrediction;
