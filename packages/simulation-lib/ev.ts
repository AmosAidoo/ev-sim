
/**
 * Represents an Electric Vehicle
 */
export default class EV {
  /**
   * Charging demand for EV in kWh
   */
  private _chargingDemand: number
  
  // Consumption in kWh per 100km
  private _consumptionPer100Km: number

  /**
   * Constructs a new electric vehicle
   * @param chargingDemand Charging demand in kWh
   * @param consumptionPer100Km Comsumption in kWh per 100km
   */
  constructor(chargingDemand: number, consumptionPer100Km: number) {
    this._chargingDemand = chargingDemand
    this._consumptionPer100Km = consumptionPer100Km
  }

  /**
   * @returns charging demand of EV in kWh
   */
  get chargingDemand(): number {
    return this._chargingDemand
  }

  /**
   * Returns energy required to fully charge EV in kWh
   */
  get energyRequired(): number {
    // This normalizes the consumption per 100km to 1km and
    // scales it by the charging demand to determine the
    // energy this EV requires from a charge point to be fully charged
    return this._chargingDemand * (this._consumptionPer100Km / 100)
  }

  /**
   * Determines how long it takes for an EV to fully charge given a charge point's
   * max charge speed.
   * @param maxChargeSpeed Max charge speed of a charge point
   * @param interval Simulation interval in minutes
   * @returns Charge duration in intervals
   */
  chargeDurationInIntervals(maxChargeSpeed: number, interval: number): number {
    // The ratio of energy required(kWh) to max charge speed(kW) gives us how
    // long the EV would take to charge in hours
    const chargeTime = Math.floor(this.energyRequired / maxChargeSpeed) // kWh / kW = h
    
    // The ratio of the charge time in hours converted to minutes to interval
    // gives us the number of intervals it would take EV to fully charge
    return chargeTime * 60 / interval
  }
}
