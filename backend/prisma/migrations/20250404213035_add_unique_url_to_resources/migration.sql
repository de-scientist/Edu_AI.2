/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `Resource` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Resource_url_key" ON "Resource"("url");
