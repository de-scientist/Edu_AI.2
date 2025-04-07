import { PrismaClient } from "@prisma/client";
import { authenticate } from "../middleware/auth.js";

const prisma = new PrismaClient();

/**
 * AI System Tuning routes
 * @param {import('fastify').FastifyInstance} fastify - Fastify instance
 */
export default async function aiSystemTuningRoutes(fastify) {
  // Get AI metrics
  fastify.get("/api/admin/ai/metrics", {
    preHandler: authenticate,
    handler: async (request, reply) => {
      try {
        // Check if user is admin
        if (request.user.role !== "ADMIN") {
          return reply.status(403).send({ error: "Unauthorized: Admin access required" });
        }
        
        const { timeRange = "24h" } = request.query;
        const startTime = new Date();
        
        // Calculate start time based on time range
        switch (timeRange) {
          case "1h":
            startTime.setHours(startTime.getHours() - 1);
            break;
          case "24h":
            startTime.setHours(startTime.getHours() - 24);
            break;
          case "7d":
            startTime.setDate(startTime.getDate() - 7);
            break;
          case "30d":
            startTime.setDate(startTime.getDate() - 30);
            break;
          default:
            startTime.setHours(startTime.getHours() - 24);
        }
        
        const metrics = await prisma.aIMetrics.findMany({
          where: {
            timestamp: {
              gte: startTime
            }
          },
          orderBy: {
            timestamp: "asc"
          }
        });
        
        if (metrics.length === 0) {
          // Return mock data for development
          return Array.from({ length: 10 }, (_, i) => ({
            accuracy: 85 + Math.random() * 10,
            responseTime: 100 + Math.random() * 200,
            errorRate: Math.random() * 5,
            usageCount: 100 + Math.random() * 900,
            timestamp: new Date(Date.now() - (9 - i) * 3600000).toISOString()
          }));
        }
        
        return metrics;
      } catch (error) {
        console.error("Error fetching AI metrics:", error);
        reply.status(500).send({ error: "Failed to fetch AI metrics" });
      }
    }
  });

  // Get AI settings
  fastify.get("/api/admin/ai/settings", {
    preHandler: authenticate,
    handler: async (request, reply) => {
      try {
        // Check if user is admin
        if (request.user.role !== "ADMIN") {
          return reply.status(403).send({ error: "Unauthorized: Admin access required" });
        }
        
        const settings = await prisma.aISettings.findFirst();
        
        if (!settings) {
          // Return default settings if none exist
          return {
            modelVersion: "gpt-4",
            temperature: 0.7,
            maxTokens: 2048,
            topP: 1,
            frequencyPenalty: 0,
            presencePenalty: 0,
            systemPrompt: "You are a helpful AI assistant."
          };
        }
        
        return settings;
      } catch (error) {
        console.error("Error fetching AI settings:", error);
        reply.status(500).send({ error: "Failed to fetch AI settings" });
      }
    }
  });

  // Update AI settings
  fastify.put("/api/admin/ai/settings", {
    preHandler: authenticate,
    handler: async (request, reply) => {
      try {
        // Check if user is admin
        if (request.user.role !== "ADMIN") {
          return reply.status(403).send({ error: "Unauthorized: Admin access required" });
        }
        
        const { 
          modelVersion, 
          temperature, 
          maxTokens, 
          topP, 
          frequencyPenalty, 
          presencePenalty, 
          systemPrompt 
        } = request.body;
        
        // Validate required fields
        if (!modelVersion || temperature === undefined || maxTokens === undefined) {
          return reply.status(400).send({ error: "Missing required fields" });
        }
        
        // Update or create settings
        const settings = await prisma.aISettings.upsert({
          where: {
            id: (await prisma.aISettings.findFirst())?.id || "default"
          },
          update: {
            modelVersion,
            temperature,
            maxTokens,
            topP,
            frequencyPenalty,
            presencePenalty,
            systemPrompt
          },
          create: {
            modelVersion,
            temperature,
            maxTokens,
            topP,
            frequencyPenalty,
            presencePenalty,
            systemPrompt
          }
        });
        
        return settings;
      } catch (error) {
        console.error("Error updating AI settings:", error);
        reply.status(500).send({ error: "Failed to update AI settings" });
      }
    }
  });

  // Get model parameters
  fastify.get("/api/admin/ai/parameters", {
    preHandler: authenticate,
    handler: async (request, reply) => {
      try {
        // Check if user is admin
        if (request.user.role !== "ADMIN") {
          return reply.status(403).send({ error: "Unauthorized: Admin access required" });
        }
        
        const { modelType = "recommendation" } = request.query;
        
        const parameters = await prisma.modelParameter.findMany({
          where: {
            modelType
          }
        });
        
        if (parameters.length === 0) {
          // Return default parameters if none exist
          return [
            {
              name: "Learning Rate",
              value: 0.001,
              min: 0.0001,
              max: 0.01,
              description: "Controls how quickly the model adapts to new data",
              modelType
            },
            {
              name: "Batch Size",
              value: 32,
              min: 8,
              max: 128,
              description: "Number of samples processed before model update",
              modelType
            },
            {
              name: "Training Epochs",
              value: 10,
              min: 1,
              max: 50,
              description: "Number of complete passes through the training dataset",
              modelType
            },
            {
              name: "Dropout Rate",
              value: 0.2,
              min: 0.1,
              max: 0.5,
              description: "Prevents overfitting by randomly dropping neurons",
              modelType
            }
          ];
        }
        
        return parameters;
      } catch (error) {
        console.error("Error fetching model parameters:", error);
        reply.status(500).send({ error: "Failed to fetch model parameters" });
      }
    }
  });

  // Update model parameters
  fastify.put("/api/admin/ai/parameters", {
    preHandler: authenticate,
    handler: async (request, reply) => {
      try {
        // Check if user is admin
        if (request.user.role !== "ADMIN") {
          return reply.status(403).send({ error: "Unauthorized: Admin access required" });
        }
        
        const { modelType, parameters } = request.body;
        
        if (!modelType || !parameters || !Array.isArray(parameters)) {
          return reply.status(400).send({ error: "Invalid request body" });
        }
        
        // Delete existing parameters for this model type
        await prisma.modelParameter.deleteMany({
          where: {
            modelType
          }
        });
        
        // Create new parameters
        const createdParameters = await Promise.all(
          parameters.map(param => 
            prisma.modelParameter.create({
              data: {
                name: param.name,
                value: param.value,
                min: param.min,
                max: param.max,
                description: param.description,
                modelType
              }
            })
          )
        );
        
        return createdParameters;
      } catch (error) {
        console.error("Error updating model parameters:", error);
        reply.status(500).send({ error: "Failed to update model parameters" });
      }
    }
  });

  // Start model training
  fastify.post("/api/admin/ai/train", {
    preHandler: authenticate,
    handler: async (request, reply) => {
      try {
        // Check if user is admin
        if (request.user.role !== "ADMIN") {
          return reply.status(403).send({ error: "Unauthorized: Admin access required" });
        }
        
        const { modelType = "recommendation" } = request.body;
        
        // Check if there's already a training process running
        const existingTraining = await prisma.modelTraining.findFirst({
          where: {
            modelType,
            status: "training"
          }
        });
        
        if (existingTraining) {
          return reply.status(400).send({ 
            error: "Training already in progress",
            trainingId: existingTraining.id
          });
        }
        
        // Create a new training record
        const training = await prisma.modelTraining.create({
          data: {
            modelType,
            status: "training",
            totalSamples: 1000,
            trainingSet: 800,
            validationSet: 200
          }
        });
        
        // Simulate training completion (in a real app, this would be a background job)
        setTimeout(async () => {
          await prisma.modelTraining.update({
            where: {
              id: training.id
            },
            data: {
              status: "completed",
              endTime: new Date(),
              accuracy: 0.85 + Math.random() * 0.1,
              loss: 0.1 + Math.random() * 0.2
            }
          });
        }, 5000);
        
        return { 
          message: "Training started",
          trainingId: training.id
        };
      } catch (error) {
        console.error("Error starting model training:", error);
        reply.status(500).send({ error: "Failed to start model training" });
      }
    }
  });

  // Get training status
  fastify.get("/api/admin/ai/training-status", {
    preHandler: authenticate,
    handler: async (request, reply) => {
      try {
        // Check if user is admin
        if (request.user.role !== "ADMIN") {
          return reply.status(403).send({ error: "Unauthorized: Admin access required" });
        }
        
        const { modelType = "recommendation" } = request.query;
        
        const training = await prisma.modelTraining.findFirst({
          where: {
            modelType
          },
          orderBy: {
            startTime: "desc"
          }
        });
        
        if (!training) {
          return {
            status: "idle",
            modelType
          };
        }
        
        return {
          id: training.id,
          status: training.status,
          startTime: training.startTime,
          endTime: training.endTime,
          accuracy: training.accuracy,
          loss: training.loss,
          modelType: training.modelType
        };
      } catch (error) {
        console.error("Error fetching training status:", error);
        reply.status(500).send({ error: "Failed to fetch training status" });
      }
    }
  });
} 