-- CreateTable
CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dependent" (
   "id" TEXT NOT NULL,
   "email" TEXT NOT NULL,
   "name" TEXT NOT NULL,
   "userId" TEXT NOT NULL,
   "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

   CONSTRAINT "Dependent_pkey" PRIMARY KEY ("id"),
   CONSTRAINT "Dependent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" on "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Dependent_email_key" on "Dependent"("email");
