const tf = require("@tensorflow/tfjs-node");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");

// Create model directory if it doesn't exist
const modelDir = path.join(__dirname, "model");
if (!fs.existsSync(modelDir)) {
  fs.mkdirSync(modelDir, { recursive: true });
}

async function fetchData() {
  try {
    console.log("Fetching progress data from database...");
    const progressData = await prisma.progress.findMany();
    console.log(`Found ${progressData.length} progress entries`);
    
    if (progressData.length === 0) {
      throw new Error("No progress data found in the database");
    }

    return progressData.map((entry) => ({
      input: [entry.week || 0, entry.past_progress || 0],
      output: [entry.progress || 0],
    }));
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

async function trainModel() {
  try {
    console.log("Starting model training...");
    
    // Create a sequential model
    const model = tf.sequential();
    
    // Add layers
    model.add(tf.layers.dense({ units: 16, inputShape: [2], activation: "relu" }));
    model.add(tf.layers.dense({ units: 8, activation: "relu" }));
    model.add(tf.layers.dense({ units: 1 }));

    // Compile the model
    model.compile({ 
      optimizer: "adam", 
      loss: "meanSquaredError",
      metrics: ["accuracy"]
    });

    // Fetch and prepare data
    const data = await fetchData();
    console.log("Data prepared for training");
    
    // Convert data to tensors
    const xs = tf.tensor2d(data.map((d) => d.input));
    const ys = tf.tensor2d(data.map((d) => d.output));

    // Train the model
    console.log("Training model...");
    await model.fit(xs, ys, { 
      epochs: 100,
      batchSize: 32,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch + 1}: loss = ${logs.loss.toFixed(4)}, accuracy = ${logs.acc.toFixed(4)}`);
        }
      }
    });

    // Save the model
    console.log("Saving model...");
    await model.save(`file://${modelDir}`);
    console.log(`✅ Model trained & saved to ${modelDir}!`);
    
    // Clean up tensors
    xs.dispose();
    ys.dispose();
    
    return true;
  } catch (error) {
    console.error("Error training model:", error);
    return false;
  } finally {
    // Disconnect from Prisma
    await prisma.$disconnect();
  }
}

// Run the training
trainModel()
  .then(success => {
    if (success) {
      console.log("Model training completed successfully");
      process.exit(0);
    } else {
      console.error("Model training failed");
      process.exit(1);
    }
  })
  .catch(error => {
    console.error("Unhandled error:", error);
    process.exit(1);
  });
