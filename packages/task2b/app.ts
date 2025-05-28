import express, { Express } from "express"
import dotenv from "dotenv"
import morgan from "morgan"
import swaggerUi from "swagger-ui-express"
import YAML from "yamljs"
import path from "path"
import controllers from "./controllers"
import validators from "./validators"

dotenv.config()
const app: Express = express()

const openapiDocument = YAML.load(path.join(__dirname, "./openapi.yaml"))
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiDocument))

app.use(morgan("dev"))
app.use(express.json())

// Routes
app.get("/parameters", async (req, res) => { await controllers.getParameters(req, res) })
app.get("/parameters/:id", async (req, res) => { await controllers.getParametersById(req, res) })
app.post(
  "/parameters",
  (req, res, next) => {
    validators.validateCreateInputParameters(req, res, next)
  },
  async (req, res) => { await controllers.createParameters(req, res) }
)
app.patch(
  "/parameters/:id",
  (req, res, next) => {
    validators.validateUpdateInputParameters(req, res, next)
  },
  async (req, res) => { await controllers.updateParameters(req, res) }
)
app.delete("/parameters/:id", async (req, res) => { await controllers.deleteParameters(req, res) })

app.post(
  "/simulation",
  (req, res, next) => {
    validators.validateRunSimulationConfig(req, res, next)
  },
  async (req, res) => { await controllers.simulation(req, res) }
)

export default app