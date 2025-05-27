import { Request, Response } from "express"
import services from "./services"

async function getParameters(_req: Request, res: Response) {
  const response = await services.getParameters()

  res.status(response.code).json(response)
}

async function getParametersById(req: Request, res: Response) {
  const { id } = req.params
  const response = await services.getParametersById(id)

  res.status(response.code).json(response)
}

async function createParameters(req: Request, res: Response) {
  const parameters = req.body
  const response = await services.createParameters(parameters)

  res.status(response.code).json(response)
}

async function updateParameters(req: Request, res: Response) {
  const { id } = req.params
  const parameters = req.body
  const response = await services.updateParameters(id, parameters)

  res.status(response.code).json(response)
}

async function deleteParameters(req: Request, res: Response) {
  const { id } = req.params
  const response = await services.deleteParameters(id)

  res.status(response.code).json(response)
}

async function simulation(req: Request, res: Response) {
  const options = req.body
  const response = await services.simulation(options)
  
  res.status(response.code).json(response)
}

export default {
  createParameters,
  getParameters,
  getParametersById,
  updateParameters,
  deleteParameters,
  simulation
}