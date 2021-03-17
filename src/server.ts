import express, { Response, NextFunction, Request } from 'express'
import authRoutes from "routes/auth"
import postRoutes from "routes/posts"
import bodyParser from 'body-parser'

export async function start() {
  const app = express()
  const port = process.env.PORT || 8821

  app.use(bodyParser.json())

  app.use("/api/auth", authRoutes)

  console.log('Starting up!')

  app.use("/api/posts", postRoutes)

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.writeHead(404, {"Content-Type": "text/plain"})
    res.write("404 Not found!")
    res.end()
  })

  console.log('Listening on', port, ' ...')
  app.listen(port)

  return app
}
