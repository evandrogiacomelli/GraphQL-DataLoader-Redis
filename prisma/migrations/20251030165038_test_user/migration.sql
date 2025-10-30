-- DropForeignKey
ALTER TABLE "public"."Dependent" DROP CONSTRAINT "Dependent_userId_fkey";

-- AddForeignKey
ALTER TABLE "Dependent" ADD CONSTRAINT "Dependent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
