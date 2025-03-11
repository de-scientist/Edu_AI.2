const tf = require("@tensorflow/tfjs-node");
const natural = require("natural");
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");

const prisma = new PrismaClient();
const tokenizer = new natural.WordTokenizer();

async function fetchMaterials() {
  return await prisma.material.findMany();
}

async function trainModel() {
  const materials = await fetchMaterials();

  const corpus = materials.map((m) => tokenizer.tokenize(m.description).join(" "));
  const vectorizer = new natural.TfIdf();
  
  corpus.forEach((doc) => vectorizer.addDocument(doc));

  fs.writeFileSync("tfidf_model.json", JSON.stringify(corpus));
  console.log("✅ NLP Model Trained & Saved!");
}

trainModel();
