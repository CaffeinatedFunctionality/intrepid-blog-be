import { Response, NextFunction, Request } from "express"
import jwt from "jwt-simple"
import config from "config"
import moment from "moment"
import AuthUserRequest from "types/AuthUserRequest"

export default (req: Request, res: Response, next: NextFunction) => {
  const tokenResult = verifyToken(req, res, next)
  if (!tokenResult.success) {
    return res.status(401).send({error: tokenResult.error || `Invalid token.`})
  }
  next()
  return
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"]
  let decoded = null
  if(!token) {
    return { success: false, error: "No token supplied." }
  }
  try {
    if (typeof token === "string") {
      decoded = jwt.decode(token, config.jwtSecret)
    }
  } catch(e) {
    console.log("decode failed with error", e)
    return { success: false, error: `Error validating token`}
  }
  if(!decoded || decoded.exp <= parseInt(moment().format("X"))) {
    return { success: false, error: `Access token has expired.` }
  }
  return { success: true, decoded }
}

export const authorized = (req: AuthUserRequest, res: Response, next: NextFunction) => {
  const tokenResult = verifyToken(req, res, next)
  if (!tokenResult.success) {
    res.status(401).send({error: `Invalid token.`})
    return
  }
  req.user = {
    id: tokenResult.decoded.user_id
  }
  next()
}
