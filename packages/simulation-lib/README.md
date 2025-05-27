# Similation Library

Logic of simulation bundled as a standalone library

## Example Usage
```
import { Simulator } from "simulation-lib"

const simulator = new Simulator({
  seed: 1337,
  interval: 15,
  totalRuns: 20,
  timezone: "Europe/Berlin" // saw a slight decrement
})

const results = simulator.run({
  arrivalProbabilityMultiplier: 100,
  chargePointChargeSpeed: 11,
  consumptionOfCars: 18,
  numberOfChargePoints: 20
})

console.log(results)
```