/*
  Warnings:

  - Added the required column `category` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instructor` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `level` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- First, add the columns as nullable
ALTER TABLE "Course" ADD COLUMN "category" TEXT,
ADD COLUMN "duration" TEXT,
ADD COLUMN "instructor" TEXT,
ADD COLUMN "level" TEXT,
ADD COLUMN "thumbnail" TEXT;

-- Update existing records with default values
UPDATE "Course" SET 
  category = 'programming',
  duration = '4 weeks',
  instructor = 'EduAI Instructor',
  level = 'Intermediate'
WHERE category IS NULL;

-- Now make the columns required
ALTER TABLE "Course" ALTER COLUMN "category" SET NOT NULL,
ALTER COLUMN "duration" SET NOT NULL,
ALTER COLUMN "instructor" SET NOT NULL,
ALTER COLUMN "level" SET NOT NULL;
