const tf = require("@tensorflow/tfjs-node");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");

async function fetchData() {
  const progressData = await prisma.progress.findMany();

  return progressData.map((entry) => ({
    input: [entry.week, entry.past_progress],
    output: [entry.progress],
  }));
}

async function trainModel() {
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 10, inputShape: [2], activation: "relu" }));
  model.add(tf.layers.dense({ units: 1 }));

  model.compile({ optimizer: "adam", loss: "meanSquaredError" });

  const data = await fetchData();
  const xs = tf.tensor2d(data.map((d) => d.input));
  const ys = tf.tensor2d(data.map((d) => d.output));

  await model.fit(xs, ys, { epochs: 50 });

  await model.save(`file://./model`);
  console.log("✅ Model trained & saved!");
}

trainModel();
