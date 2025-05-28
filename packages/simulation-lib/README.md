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

## Documentation

## EV

### Constructors

`public`: Constructs a new electric vehicle

Parameters:

* `chargingDemand`: Charging demand in kWh
* `consumptionPer100Km`: Comsumption in kWh per 100km


### Methods

- [chargeDurationInIntervals](#chargedurationinintervals)

#### chargeDurationInIntervals

Determines how long it takes for an EV to fully charge given a charge point's
max charge speed.

| Method | Type |
| ---------- | ---------- |
| `chargeDurationInIntervals` | `(maxChargeSpeed: number, interval: number) => number` |

Parameters:

* `maxChargeSpeed`: Max charge speed of a charge point
* `interval`: Simulation interval in minutes


## ChargePoint

### Constructors

`public`: Creates a new charge point object

Parameters:

* `maxChargeSpeed`: - Maximum charge speed of the chargepoint in kW.


### Methods

- [plugVehicle](#plugvehicle)
- [unPlugVehicle](#unplugvehicle)

#### plugVehicle

Plugs an EV into the charge point.
EV is added to a queue if charge point is occupied.

| Method | Type |
| ---------- | ---------- |
| `plugVehicle` | `(ev: EV, interval: number) => void` |

Parameters:

* `ev`: EV to plug into charge point.


#### unPlugVehicle

Unplugs an EV that is done charging.
If the queue is not empty, the next EV proceeds to charge.

| Method | Type |
| ---------- | ---------- |
| `unPlugVehicle` | `(interval: number) => void` |

### Properties

- [totalEnergyConsumed](#totalenergyconsumed)

#### totalEnergyConsumed

Total energy consumed in the lifetime of the charge point.

| Property | Type |
| ---------- | ---------- |
| `totalEnergyConsumed` | `number` |

## XORShiftGenerator

XOR Shift Pseudo-random generator
Implementation based on https://en.m.wikipedia.org/wiki/Xorshift

### Constructors

`public`: Constructs a new generator based on a seed

Parameters:

* `seed`: Initial seed


### Methods

- [next](#next)

#### next

Generate the next random number in the sequence based on the
xorshift algorithm

| Method | Type |
| ---------- | ---------- |
| `next` | `() => number` |

### Properties

- [_state](#_state)

#### _state

Current state of generator

| Property | Type |
| ---------- | ---------- |
| `_state` | `number` |

## ParkingLot

Represents a parking lot

### Constructors

`public`: Create a new parking lot object.

Parameters:

* `consumptionOfCars`: Consumption of cars in kWh
* `interval`: Interval simulation is based on in minutes
* `generator`: xorshift random number generator


### Methods

- [addChargePoint](#addchargepoint)
- [simulateEvArrivalsAtChargePoints](#simulateevarrivalsatchargepoints)
- [evictEvsIfChargingComplete](#evictevsifchargingcomplete)
- [totalEnergyConsumed](#totalenergyconsumed)
- [theoreticalMaxPowerDemand](#theoreticalmaxpowerdemand)
- [instantaneousPowerDemand](#instantaneouspowerdemand)

#### addChargePoint

Adds a new charge point to the parking lot

| Method | Type |
| ---------- | ---------- |
| `addChargePoint` | `(chargePoint: ChargePoint) => void` |

Parameters:

* `chargePoint`: Charge point to be added


#### simulateEvArrivalsAtChargePoints

Simulates EVs arriving at all charge points based on arrival probabilities

| Method | Type |
| ---------- | ---------- |
| `simulateEvArrivalsAtChargePoints` | `(hourOfDay: number, multiplier?: number) => void` |

Parameters:

* `hourOfDay`: Hour of the day (0-23)
* `multiplier`: Arrival probability multiplier to scale arrival of EVs up or down. Defaults to 100.


#### evictEvsIfChargingComplete

Removes EVs that are done charging from each charge point

| Method | Type |
| ---------- | ---------- |
| `evictEvsIfChargingComplete` | `() => void` |

#### totalEnergyConsumed

Computes total energy consumed by all charge points at the time
of call.

| Method | Type |
| ---------- | ---------- |
| `totalEnergyConsumed` | `() => number` |

#### theoreticalMaxPowerDemand

Theoretical maximum power demand possible for all charge points.

| Method | Type |
| ---------- | ---------- |
| `theoreticalMaxPowerDemand` | `() => number` |

#### instantaneousPowerDemand

Power demand at time method is called.

| Method | Type |
| ---------- | ---------- |
| `instantaneousPowerDemand` | `() => number` |

## Simulator

Configues a new simulation environment with unique conditions

### Constructors

`public`: Creates a new simulator object.

Parameters:

* `options`: - Simulator configuration options


### Methods

- [run](#run)

#### run

| Method | Type |
| ---------- | ---------- |
| `run` | `(parameters: SimulationParameters) => SimulationResult` |

Parameters:

* `parameters`: - Parameters for a single run of the simulation

