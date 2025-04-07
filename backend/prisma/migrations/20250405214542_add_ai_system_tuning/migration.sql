-- CreateTable
CREATE TABLE "AIMetrics" (
    "id" TEXT NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "responseTime" DOUBLE PRECISION NOT NULL,
    "errorRate" DOUBLE PRECISION NOT NULL,
    "usageCount" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AISettings" (
    "id" TEXT NOT NULL,
    "modelVersion" TEXT NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "maxTokens" INTEGER NOT NULL,
    "topP" DOUBLE PRECISION NOT NULL,
    "frequencyPenalty" DOUBLE PRECISION NOT NULL,
    "presencePenalty" DOUBLE PRECISION NOT NULL,
    "systemPrompt" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AISettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModelParameter" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "min" DOUBLE PRECISION NOT NULL,
    "max" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "modelType" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModelParameter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModelTraining" (
    "id" TEXT NOT NULL,
    "modelType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "accuracy" DOUBLE PRECISION,
    "loss" DOUBLE PRECISION,
    "totalSamples" INTEGER NOT NULL,
    "trainingSet" INTEGER NOT NULL,
    "validationSet" INTEGER NOT NULL,
    "errorMessage" TEXT,

    CONSTRAINT "ModelTraining_pkey" PRIMARY KEY ("id")
);
