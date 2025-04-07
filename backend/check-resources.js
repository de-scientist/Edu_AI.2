import prisma from "./prisma/db.js";

async function checkResources() {
  try {
    console.log("Checking resources in the database...");
    const resources = await prisma.resource.findMany();
    console.log(`Found ${resources.length} resources:`);
    console.log(JSON.stringify(resources, null, 2));
  } catch (error) {
    console.error("Error checking resources:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkResources(); 