import { Simulator } from "simulation-lib"

const simulator = new Simulator({
  seed: 1337,
  interval: 15,
  totalRuns: 5,
})

const results = simulator.run({
  arrivalProbabilityMultiplier: 100,
  chargePointChargeSpeed: 11,
  consumptionOfCars: 18,
  numberOfChargePoints: 20
})

console.log("Results", results)

console.log("---Bonus---")
// Bonus 1
// Generate a simple CSV to plot
console.log("ChargePoint, ConcurrencyFactor")
for (let chargePoint = 1; chargePoint <= 30; chargePoint++) {
  const results = simulator.run({
    arrivalProbabilityMultiplier: 100,
    chargePointChargeSpeed: 11,
    consumptionOfCars: 18,
    numberOfChargePoints: chargePoint
  })
  console.log(`${chargePoint}, ${results.concurrencyFactor}`)
}

// Bonus 2: DST
const simulatorWithDifferentTimezone = new Simulator({
  seed: 1337,
  interval: 15,
  totalRuns: 5,
  timezone: "Europe/Berlin" // saw a slight decrement
})

const results2 = simulatorWithDifferentTimezone.run({
  arrivalProbabilityMultiplier: 100,
  chargePointChargeSpeed: 11,
  consumptionOfCars: 18,
  numberOfChargePoints: 20
})

console.log("Results 2", results2)


// Bonus 3
const simulatorWithDifferentSeed = new Simulator({
  seed: 456789,
  interval: 15,
  totalRuns: 5,
})

const results3 = simulatorWithDifferentSeed.run({
  arrivalProbabilityMultiplier: 100,
  chargePointChargeSpeed: 11,
  consumptionOfCars: 18,
  numberOfChargePoints: 20
})

console.log("Results 3", results3)