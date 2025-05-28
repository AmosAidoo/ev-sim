import ChargePoint from "./charge-point"
import EV from "./ev"
import XORShiftGenerator from "./xor-shift-generator"

/**
 * Represents a parking lot
 */
export class ParkingLot {
  /**
   * Predefined hourly arrival probabilities.
   */
  private readonly ARRIVAL_PROBABILITIES_ARRAY: number[] = [
    0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 2.83, 2.83, 5.66, 5.66,
    5.66, 7.55, 7.55, 7.55, 10.38, 10.38, 10.38, 4.72, 4.72, 4.72, 0.94, 0.94
  ]

  /**
   * Charge points in parking lot.
   */
  private _chargePoints: ChargePoint[] = []

  /**
   * Consumption of cars in kWh.
   */
  private _consumptionOfCars: number

  /**
   * Seeded random number generator.
   */
  private _generator: XORShiftGenerator

  /**
   * Interval simulation is based on in minutes
   */
  private _interval: number
  
  /**
   * Create a new parking lot object.
   * @param consumptionOfCars Consumption of cars in kWh
   * @param interval Interval simulation is based on in minutes
   * @param generator xorshift random number generator
   */
  constructor(consumptionOfCars: number, interval: number, generator: XORShiftGenerator) {
    this._consumptionOfCars = consumptionOfCars
    this._interval = interval
    this._generator = generator
  }

  /**
   * Generates a random number between min(inclusive) and max(exclusive)
   * @param min Minimum number in range (inclusive)
   * @param max Maximum number in range (exclusive)
   * @returns Random number in the specified range.
   */
  private getRandomNumber(min: number, max: number): number {
    return this._generator.next() * (max - min) + min
  }


  /**
   * Determines whether an EV will arrive at a charge point based in the
   * pecified hour and a multiplier (20–200%) applied to predefined hourly probabilities.
   * @param currentHour Current hour (0-23)
   * @param multiplier Arrival Probability multiplier (20–200, representing percent. Values beyond these will be clamped)
   * @returns true if EV will arrive, false otherwise
   */
  private evWillArrive(currentHour: number, multiplier: number): boolean {
    // Ensure currentHour is within valid range
    if (currentHour >= 0 && currentHour < this.ARRIVAL_PROBABILITIES_ARRAY.length) {
      const baseProbability = this.ARRIVAL_PROBABILITIES_ARRAY[currentHour] as number

      const clampedMultiplier = Math.max(20, Math.min(multiplier, 200))

      const adjustedProbability = baseProbability * (clampedMultiplier / 100)

      // Probabilities are scaled by 100 to avoid floating point comparison
      const threshold = adjustedProbability * 100

      const probabilityScaled = Math.floor(this.getRandomNumber(0, 10000))

      return probabilityScaled < threshold
    } else {
      console.warn(`Invalid hour provided: ${currentHour}. Probability lookup failed.`)
      return false
    }
  }

  /**
   * Generates a random charging demand for an EV based on predefined charging
   * demand probabilities.
   * @returns 
   */
  private getRandomChargingDemandInKm(): number {
    // All the probability values have been scaled
    // by 100 to avoid floating-point comparision issues
    const probabilityScaled = Math.floor(this.getRandomNumber(0, 10000))

    // 2.94% is 294
    let accumulatedProbability = 294
    if (probabilityScaled < accumulatedProbability) {
      return 300
    }
    
    accumulatedProbability += 490
    if (probabilityScaled < accumulatedProbability) {
      return 5
    }
    
    accumulatedProbability += 490
    if (probabilityScaled < accumulatedProbability) {
      return 200
    }
    
    accumulatedProbability += 882
    if (probabilityScaled < accumulatedProbability) {
      return 30
    }
    
    accumulatedProbability += 980
    if (probabilityScaled < accumulatedProbability) {
      return 10
    }
    
    accumulatedProbability += 1078
    if (probabilityScaled < accumulatedProbability) {
      return 100
    }
    
    accumulatedProbability += 1176
    if (probabilityScaled < accumulatedProbability) {
      return 20
    }
    
    accumulatedProbability += 1176
    if (probabilityScaled < accumulatedProbability) {
      return 50
    }
    
    accumulatedProbability += 3431
    if (probabilityScaled < accumulatedProbability) {
      return 0
    }

    // 0.03 percent is unaccounted for. Probability for 0 km will be 
    // adjusted from 34.31% to 34.34 to we have 100%
    return 0
  }

  /**
   * Charge points in parking lot
   */
  get chargePoints(): ChargePoint[] {
    return this._chargePoints
  }

  /**
   * Adds a new charge point to the parking lot
   * @param chargePoint Charge point to be added
   */
  addChargePoint(chargePoint: ChargePoint) {
    this._chargePoints.push(chargePoint)
  }

  /**
   * Simulates EVs arriving at all charge points based on arrival probabilities
   * @param hourOfDay Hour of the day (0-23)
   * @param multiplier Arrival probability multiplier to scale arrival of EVs up or down. Defaults to 100.
   */
  simulateEvArrivalsAtChargePoints(hourOfDay: number, multiplier: number = 100) {
    for (let chargePoint of this._chargePoints) {
      if (this.evWillArrive(hourOfDay, multiplier)) {
        const chargingDemand = this.getRandomChargingDemandInKm()
        const ev = new EV(chargingDemand, this._consumptionOfCars)
        chargePoint.plugVehicle(ev, this._interval)
      }
    }
  }

  /**
   * Removes EVs that are done charging from each charge point
   */
  evictEvsIfChargingComplete() {
    for (let chargePoint of this._chargePoints) {
      chargePoint.unPlugVehicle(this._interval)
    }
  }

  /**
   * Computes total energy consumed by all charge points at the time
   * of call.
   * @returns Total energy consumed
   */
  totalEnergyConsumed(): number {
    return this._chargePoints
      .map(chargePoint => chargePoint.totalEnergyConsumed)
      .reduce((acc, curr) => acc + curr, 0)
  }

  /**
   * Theoretical maximum power demand possible for all charge points.
   * @returns Theoretical maximum power demand.
   */
  theoreticalMaxPowerDemand(): number {
    return this._chargePoints
      .map(chargePoint => chargePoint.maxChargeSpeed)
      .reduce((acc, curr) => acc + curr, 0)
  }

  /**
   * Power demand at time method is called.
   * @returns Instantaneous power demand at a particular time.
   */
  instantaneousPowerDemand(): number {
    return this._chargePoints
      .filter(chargePoint => chargePoint.isOccupied)
      .map(chargePoint => chargePoint.maxChargeSpeed)
      .reduce((acc, curr) => acc + curr, 0)
  }

  /**
   * Returns an array containing objects with maxChargeSpeed and totalEnergyConsumed
   * for each charge point.
   * @returns Array of objects with maxChargeSpeed and totalEnergyConsumed
   */
  energyPerChargePoint(): { maxChargeSpeed: number, totalEnergyConsumed: number }[] {
    return this._chargePoints.map(chargePoint => ({
      maxChargeSpeed: chargePoint.maxChargeSpeed,
      totalEnergyConsumed: chargePoint.totalEnergyConsumed
    }))
  }
}
