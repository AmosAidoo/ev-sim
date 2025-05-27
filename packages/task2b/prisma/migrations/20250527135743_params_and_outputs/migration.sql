-- CreateTable
CREATE TABLE "InputParameters" (
    "id" TEXT NOT NULL,
    "numberOfChargePoints" INTEGER NOT NULL,
    "arrivalProbabilityMultiplier" INTEGER NOT NULL,
    "consumptionOfCar" DECIMAL(65,30) NOT NULL,
    "chargePointSpeed" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InputParameters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SimulationResult" (
    "id" TEXT NOT NULL,
    "inputParameterid" TEXT NOT NULL,
    "simulationOptions" JSONB NOT NULL,
    "output" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SimulationResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SimulationResult_inputParameterid_idx" ON "SimulationResult"("inputParameterid");

-- AddForeignKey
ALTER TABLE "SimulationResult" ADD CONSTRAINT "SimulationResult_inputParameterid_fkey" FOREIGN KEY ("inputParameterid") REFERENCES "InputParameters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
