/**
 * Middlewares for validating request bodies
 */

import { Request, Response, NextFunction } from "express"
import Joi from "joi"

const inputParametersCreateSchema = Joi.object({
  chargePointSpeed: Joi.number(),
  consumptionOfCar: Joi.number(),
  numberOfChargePoints: Joi.number().required(),
  arrivalProbabilityMultiplier: Joi.number()
})

const inputParametersUpdateSchema = Joi.object({
  chargePointSpeed: Joi.number(),
  consumptionOfCar: Joi.number(),
  numberOfChargePoints: Joi.number(),
  arrivalProbabilityMultiplier: Joi.number()
})

const simulationConfigSchema = Joi.object({
  inputParametersId: Joi.string().uuid().required(),
  seed: Joi.number(),
  totalRuns: Joi.number(),
  interval: Joi.number(),
  timezone: Joi.number(),
})

function validateCreateInputParameters(req: Request, res: Response, next: NextFunction) {
  const result = inputParametersCreateSchema.validate(req.body, {
    abortEarly: false,
    allowUnknown: true
  })

  if (result.error) {
    return res.status(400).json({
      code: 400,
      message: result.error.message,
      errors: result.error.details
    })
  }
  next()
}

function validateUpdateInputParameters(req: Request, res: Response, next: NextFunction) {
  const result = inputParametersUpdateSchema.validate(req.body, {
    abortEarly: false,
    allowUnknown: true
  })

  if (result.error) {
    return res.status(400).json({
      code: 400,
      message: result.error.message,
      errors: result.error.details
    })
  }
  next()
}

function validateRunSimulationConfig(req: Request, res: Response, next: NextFunction) {
  const result = simulationConfigSchema.validate(req.body, {
    abortEarly: false,
    allowUnknown: true
  })

  if (result.error) {
    return res.status(400).json({
      code: 400,
      message: result.error.message,
      errors: result.error.details
    })
  }
  next()
}

export default {
  validateCreateInputParameters,
  validateUpdateInputParameters,
  validateRunSimulationConfig
}