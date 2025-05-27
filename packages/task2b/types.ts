import type { SimulationResult } from "simulation-lib"

export interface ApiResponse<T> {
  code: number,
  message: string,
  data?: T
}

export interface SimulationRequestOptions {
  inputParametersId: string
  seed?: number
  totalRuns?: number
  interval?: number
  timezone?: string
}

export interface InputParametersResponse {
  id: string
  chargePointSpeed: number
  consumptionOfCar: number
  numberOfChargePoints: number
}

export interface InputParametersWithSimulationResultsResponse {
  id: string
  chargePointSpeed: number
  consumptionOfCar: number
  numberOfChargePoints: number
  simulationResults: {
    simulationOptions: SimulationRequestOptions
    output: SimulationResult
  }[]
}

export interface InputParametersCreateRequest {
  chargePointSpeed?: number
  consumptionOfCar?: number
  numberOfChargePoints: number
  arrivalProbabilityMultiplier?: number
}

export interface InputParametersUpdateRequest {
  chargePointSpeed?: number
  consumptionOfCar?: number
  numberOfChargePoints?: number
  arrivalProbabilityMultiplier?: number
}

export type SimulationResponse = SimulationResult