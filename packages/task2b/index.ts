import * as http from "http"
import app from "./app"

const port = parseInt(process.env.PORT || "3000")
app.set("port", port)

const server = http.createServer(app)

server.listen(port, async () => {
  var addr = server.address();
  var bind = typeof addr === "string"
    ? "pipe " + addr
    : "port " + addr?.port;

  console.log(`Listening on ${bind}`)
})

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server")
  server.close(() => {
    console.log("HTTP server closed")
  })
})
