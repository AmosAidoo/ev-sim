import ChargePoint from "./charge-point"
import { ParkingLot } from "./parking-lot"
import XORShiftGenerator from "./xor-shift-generator"
import { DateTime, Duration } from "luxon"

/**
 * Represents max charge speed of a charge point and the total energy it consumed
 */
type EnergyPerChargePointType = { totalEnergyConsumed: number, maxChargeSpeed: number }

/**
 * Results after running a simulation
 */
export interface SimulationResult {
  /**
   * Total energy consumed in kWh.
   */
  totalEnergyConsumed: number

  /**
   * Theoretical maximum power demand. The unit is kW.
   */
  theoreticalMaximumPowerDemand: number

  /**
   * Maximum of the sum of all active charge points power at a specified interval.
   * The unit is kW.
   */
  actualMaximumPowerDemand: number

  /**
   * The ratio of actual maximum power demand to theoretical maximum power demand.
   */
  concurrencyFactor: number

  /**
   * Energy per charge point for the whole year
   */
  energyPerChargePoint?: EnergyPerChargePointType[]
}

/**
 * Configuration for a `Simulator` instance.
 */
export interface SimulatorConfig {
  /**
   * Seed for random number generator. Defaults to 1337.
   */
  seed?: number

  /**
   * Number of times to run the 1 year simulation. The results is an average
   * of results of each run. Defaults to 1.
   */
  totalRuns?: number

  /**
   * Intervals in minutes to aggregate results. Should be a divisor of 60. Defaults to 15.
   */
  interval?: number

  /**
   * Timezone to base the simulation on. Defaults to "UTC".
   */
  timezone?: string
}

/**
 * Parameters to pass to the `run` method of `Simulator` instance.
 */
export interface SimulationParameters {
  /**
   * Maximum charge speed of each charge point in kW. Defaults to 11kW.
   */
  chargePointChargeSpeed?: number

  /**
   * Power consumption of a standard electric vehicle per 100kms in kWh. Defaults to 18kWh.
   */
  consumptionOfCars?: number

  /**
   * Number of charge points in a parking lot.
   */
  numberOfChargePoints: number

  /**
   * A multiplier for the arrival probability to increase the amount of cars arriving to charge.
   * Defaults to 100%.
   */
  arrivalProbabilityMultiplier?: number
}

/**
 * Configues a new simulation environment with unique conditions
 */
export class Simulator {
  /**
   * Number of minutes in a non leap year. Value based on 365 * 24 * 60
   */
  private readonly MINUTES_IN_A_NON_LEAP_YEAR = 525600

  /**
   * Configuration for simulator
   */
  private _options: SimulatorConfig

  /**
   * XOR Shift Pseudorandom number generator
   */
  private _randomNumberGenerator: XORShiftGenerator
  
  /**
   * Creates a new simulator object.
   * @param options - Simulator configuration options
   */
  constructor(options: SimulatorConfig) {
    if (options.interval && (options.interval <= 0 || 60 % options.interval != 0)) {
      throw new Error("Interval should be a positive divisor of 60")
    }
    this._options = options
    this._randomNumberGenerator = new XORShiftGenerator(this._options.seed ?? 1337)
  }

  /**
   * 
   * @param parameters - Parameters for a single run of the simulation 
   * @returns {SimulationResult} Result of simulation given the parameters
   */
  run(parameters: SimulationParameters): SimulationResult {
    const interval = this._options.interval ?? 15
    const totalRuns = this._options.totalRuns || 1
    const timezone = this._options.timezone ?? "UTC"

    const numberOfChargePoints = parameters.numberOfChargePoints
    const chargePointChargeSpeed = parameters.chargePointChargeSpeed ?? 11
    const consumptionOfCars = parameters.consumptionOfCars ?? 18
    const arrivalProbabilityMultiplier = parameters.arrivalProbabilityMultiplier

    const ticks = this.MINUTES_IN_A_NON_LEAP_YEAR / interval

    let totalEnergyConsumedSum = 0
    let actualMaximumPowerDemandSum = 0
    let concurrencyFactorSum = 0
    const theoreticalMaximumPowerDemand = numberOfChargePoints * chargePointChargeSpeed

    const energyPerChargePointAggregate: EnergyPerChargePointType[] = Array.from({ length: numberOfChargePoints }, () => ({
      totalEnergyConsumed: 0,
      maxChargeSpeed: 0
    }))

    // Runs the simulation `totalRuns` times
    for (let run = 0; run < totalRuns; run++) {
      let actualMaximumPowerDemand = -1

      const parkingLot = new ParkingLot(consumptionOfCars, interval, this._randomNumberGenerator)
      for (let i = 0; i < numberOfChargePoints; i++) {
        parkingLot.addChargePoint(new ChargePoint(chargePointChargeSpeed))
      }

      const start = DateTime.fromObject(
        { year: 2025, month: 1, day: 1, hour: 0, minute: 0 },
        { zone: timezone }
      )
      const intervalDuration = Duration.fromObject({ minutes: interval })

      // Simulation for 1 year
      for (let tick = 1; tick <= ticks; tick++) {
        const currentTime = start.plus(intervalDuration.mapUnits(u => u * tick))
        const hourOfDay = currentTime.hour

        parkingLot.simulateEvArrivalsAtChargePoints(hourOfDay, arrivalProbabilityMultiplier)
        parkingLot.evictEvsIfChargingComplete()

        const powerDemand = parkingLot.instantaneousPowerDemand()
        actualMaximumPowerDemand = Math.max(actualMaximumPowerDemand, powerDemand)
      }

      const energyPerChargePoint = parkingLot.energyPerChargePoint()

      energyPerChargePoint.forEach((detail, index) => {
        (energyPerChargePointAggregate[index] as EnergyPerChargePointType).totalEnergyConsumed += detail.totalEnergyConsumed;
        (energyPerChargePointAggregate[index] as EnergyPerChargePointType).maxChargeSpeed += detail.maxChargeSpeed;
      })

      const concurrencyFactor = actualMaximumPowerDemand / theoreticalMaximumPowerDemand

      totalEnergyConsumedSum += parkingLot.totalEnergyConsumed()
      actualMaximumPowerDemandSum += actualMaximumPowerDemand
      concurrencyFactorSum += concurrencyFactor
    }

    const energyPerChargePoint = energyPerChargePointAggregate.map(total => ({
      totalEnergyConsumed: total.totalEnergyConsumed / totalRuns,
      maxChargeSpeed: total.maxChargeSpeed / totalRuns
    }))

    // `totalRuns` results are averaged here
    const simulationResult: SimulationResult = {
      totalEnergyConsumed: totalEnergyConsumedSum / totalRuns,
      actualMaximumPowerDemand: actualMaximumPowerDemandSum / totalRuns,
      concurrencyFactor: (concurrencyFactorSum / totalRuns) * 100,
      theoreticalMaximumPowerDemand,
      energyPerChargePoint
    }

    return simulationResult
  }
}