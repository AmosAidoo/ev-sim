import EV from "./ev"

/**
 * Represents a charge point in a parking lot.
 */
export default class ChargePoint {
  /**
   * Reference to an `EV` that is plugged in.
   */
  private _pluggedVehicle: EV | null = null

  /**
   * Time left for an EV to finish charging.
   * This time is measured in the number of intervals left to finish charging.
   */
  private _remainingChargeIntervals: number = 0

  /**
   * Maximum charge speed of the chargepoint in kW.
   */
  private _maxChargeSpeed: number

  /**
   * Queue of waiting `EV`s if charge point is occupied.
   */
  private _queue: EV[] = []

  /**
   * Total energy consumed in the lifetime of the charge point.
   */
  totalEnergyConsumed: number = 0

  /**
   * Creates a new charge point object
   * @param maxChargeSpeed - Maximum charge speed of the chargepoint in kW.
   */
  constructor(maxChargeSpeed: number) {
    this._maxChargeSpeed = maxChargeSpeed
  }

  /**
   * Maximum charge speed of the chargepoint.
   * @returns maximum charge speed of the charge point in kW.
   */
  get maxChargeSpeed(): number {
    return this._maxChargeSpeed
  }

  /**
   * Reports whether charge point is occupied or not.
   * @returns {boolean}
   */
  get isOccupied(): boolean {
    return this._pluggedVehicle != null
  }

  /**
   * Returns plugged in EV
   * @returns plugged in vehicle or null if unoccupied.
   */
  get pluggedVehicle(): EV | null {
    return this._pluggedVehicle
  }

  /**
   * Plugs an EV into the charge point.
   * EV is added to a queue if charge point is occupied.
   * @param ev EV to plug into charge point.
   */
  plugVehicle(ev: EV, interval: number) {
    if (!this.isOccupied) {
      this._pluggedVehicle = ev
      this._remainingChargeIntervals = ev.chargeDurationInIntervals(this._maxChargeSpeed, interval)
    } else {
      this._queue.push(ev)
    }
  }

  /**
   * Unplugs an EV that is done charging.
   * If the queue is not empty, the next EV proceeds to charge.
   */
  unPlugVehicle(interval: number) {
    if (!this._pluggedVehicle) return

    if (this._remainingChargeIntervals > 0) {
      // Ratio of energy required to the charge duration in intervals
      // gives us the energy per interval. This is useful because some EVs
      // might still be plugged by the end of the simulation and their already
      // used energy would have been accounted for
      const energyPerInterval = this._pluggedVehicle.energyRequired / this._pluggedVehicle.chargeDurationInIntervals(this._maxChargeSpeed, interval)
      this.totalEnergyConsumed += energyPerInterval
      this._remainingChargeIntervals -= 1
    } else {
      // If there is an EV in the queue, plug it next
      const nextEv = this._queue.shift() || null
      this._pluggedVehicle = nextEv

      if (nextEv) {
        this._remainingChargeIntervals = nextEv.chargeDurationInIntervals(this._maxChargeSpeed, interval)
      }
    }
  }
}
