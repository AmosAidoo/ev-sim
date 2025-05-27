import { SimulationResult, Simulator } from "simulation-lib"

import db from "./db"
import {
  ApiResponse, InputParametersCreateRequest, InputParametersResponse, InputParametersUpdateRequest,
  InputParametersWithSimulationResultsResponse, SimulationRequestOptions, SimulationResponse,
} from "./types"
import { Prisma } from "./generated/prisma"

async function getParameters(): Promise<ApiResponse<Array<InputParametersResponse>>> {
  try {
    const inputParametersList = await db.inputParameters.findMany({
      select: {
        id: true,
        chargePointSpeed: true,
        consumptionOfCar: true,
        numberOfChargePoints: true,
      }
    })

    return {
      code: 200,
      message: "success",
      data: inputParametersList.map(ip => ({
        ...ip,
        chargePointSpeed: ip.chargePointSpeed.toNumber(),
        consumptionOfCar: ip.chargePointSpeed.toNumber()
      }))
    }
  } catch (err) {
    console.log((err as any).message)
    return {
      code: 500,
      message: "an error occured whilst getting all parameters"
    }
  }
}

async function getParametersById(id: string): Promise<ApiResponse<InputParametersWithSimulationResultsResponse>> {
  try {
    const inputParameters = await db.inputParameters.findUnique({
      where: {
        id: id
      },
      include: {
        simulationResults: {
          select: {
            simulationOptions: true,
            output: true
          }
        }
      }
    })

    if (!inputParameters) {
      return {
        code: 404,
        message: `could not find input parameter with id: ${id}`
      }
    }

    const data: InputParametersWithSimulationResultsResponse = {
      id: inputParameters.id,
      chargePointSpeed: inputParameters.chargePointSpeed.toNumber(),
      consumptionOfCar: inputParameters.consumptionOfCar.toNumber(),
      numberOfChargePoints: inputParameters.numberOfChargePoints,
      simulationResults: inputParameters.simulationResults.map(sr => ({
        output: sr.output as unknown as SimulationResult,
        simulationOptions: sr.simulationOptions as unknown as SimulationRequestOptions
      }))
    }

    return {
      code: 200,
      message: "success",
      data
    }
  } catch (err) {
    return {
      code: 500,
      message: "an error occured whilst getting parameters"
    }
  }
}

async function createParameters(body: InputParametersCreateRequest): Promise<ApiResponse<any>> {
  try {
    const chargePointSpeed = body.chargePointSpeed ?? 11
    const consumptionOfCar = body.consumptionOfCar ?? 18
    const arrivalProbabilityMultiplier = body.arrivalProbabilityMultiplier ?? 100

    await db.inputParameters.create({
      data: {
        chargePointSpeed: chargePointSpeed,
        consumptionOfCar: consumptionOfCar,
        arrivalProbabilityMultiplier: arrivalProbabilityMultiplier,
        numberOfChargePoints: body.numberOfChargePoints,
      }
    })

    return {
      code: 201,
      message: "input parameters created successfully"
    }
  } catch (err) {
    return {
      code: 500,
      message: "an error occured whilst creating parameters"
    }
  }
}

async function updateParameters(id: string, body: InputParametersUpdateRequest): Promise<ApiResponse<any>> {
  try {
    await db.inputParameters.update({
      where: { id },
      data: {
        chargePointSpeed: body.chargePointSpeed,
        numberOfChargePoints: body.numberOfChargePoints,
        consumptionOfCar: body.consumptionOfCar
      }
    })

    return {
      code: 200,
      message: "input parameters updated"
    }
  } catch (err) {
    return {
      code: 200,
      message: "an error occured whilst updating parameters"
    }
  }
}

async function deleteParameters(id: string): Promise<ApiResponse<any>> {
  try {
    const params = await db.inputParameters.findUnique({
      where: { id },
      select: { id: true }
    })

    if (!params) {
      return {
        code: 404,
        message: `parameters with id: ${id} does not exist`
      }
    }

    await db.inputParameters.delete({
      where: { id }
    })

    return {
      code: 200,
      message: "input parameter deleted successfully"
    }
  } catch (err) {
    return {
      code: 500,
      message: "an error occured whilst deleting parameters"
    }
  }
}

async function simulation(options: SimulationRequestOptions): Promise<ApiResponse<SimulationResponse>> {
  try {
    const simulator = new Simulator({
      seed: options.seed,
      interval: options.interval,
      totalRuns: options.totalRuns,
      timezone: options.timezone
    })

    const parameters = await db.inputParameters.findUnique({
      where: {
        id: options.inputParametersId
      }
    })

    if (!parameters) {
      return {
        code: 404,
        message: `parameter with id: ${options.inputParametersId} not found`
      }
    }

    const simulationResult = simulator.run({
      numberOfChargePoints: parameters.numberOfChargePoints,
      arrivalProbabilityMultiplier: parameters.arrivalProbabilityMultiplier,
      chargePointChargeSpeed: parameters.chargePointSpeed.toNumber(),
      consumptionOfCars: parameters.consumptionOfCar.toNumber()
    })

    await db.simulationResult.create({
      data: {
        simulationOptions: options as unknown as Prisma.JsonObject,
        output: simulationResult as unknown as Prisma.JsonObject,
        inputParameter: {
          connect: {
            id: parameters.id
          }
        }
      }
    })

    return {
      code: 200,
      message: "success",
      data: simulationResult
    }
  } catch (err) {
    return {
      code: 500,
      message: "an error occured whilst running simulation"
    }
  }
}

export default {
  getParameters,
  getParametersById,
  updateParameters,
  deleteParameters,
  createParameters,
  simulation
}