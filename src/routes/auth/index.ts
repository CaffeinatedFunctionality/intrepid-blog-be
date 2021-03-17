import {validatePassword} from "services/auth"
import {getUserByEmail, register} from "services/users"
import express, { Response, NextFunction, Request } from "express"
import jwt from "jwt-simple"
import moment from "moment"
import config from "config"

const router = express.Router()

declare type UserInfo = {
  id: number
  email: string
  fName: string
  lName: string
}

//todo allow Oauth logins using passport
//POSTMAN: Login
router.post('/authenticate', async (req: Request, res :Response) => {
  const body: {email: string, password: string} = req.body
  const {result: user, error: userError} = await getUserByEmail(body.email)
  if(userError){
    //todo log error
    return res.status(401).send({errorMessage: "Could not find user."})
  }
  const credentialsValid: boolean = await validatePassword(body.password, user.passwordHash)
  if(!credentialsValid){
    //todo log error
    return res.status(401).send({errorMessage: "Password was incorrect."})
  }
  const userInfo: UserInfo = {
    id: user.id,
    email: user.email,
    fName: user.fName,
    lName: user.lName
  }
  const token: string = jwt.encode(
    {
      exp: parseInt(
        moment()
          .add(1, 'days')
          .format('X'),
      ),
      user_id: user.id,
      user_email: user.email,
    },
    config.jwtSecret,
  )
  //returning fName and lName to show on the
  return res.status(200).json({token, user: userInfo})
})

//POSTMAN: Register
router.post('/register', async (req: Request, res :Response) => {
  const body: {email: string, fName: string, lName: string, password: string} = req.body
  const {result: user, error: userError} = await register(body.email, body.fName, body.lName, body.password)
  if(userError){
    //todo log error
    return res.status(401).send({errorMessage: "Could not create user."})
  }
  const userInfo: UserInfo = {
    id: user.id,
    email: user.email,
    fName: user.fName,
    lName: user.lName
  }
  const token = jwt.encode(
    {
      exp: parseInt(
        moment()
          .add(1, 'days')
          .format('X'),
      ),
      user_id: user.id,
      user_email: body.email,
    },
    config.jwtSecret,
  )
  //returning fName and lName to show on a profile and for other front end use
  return res.status(200).json({token, user: userInfo})
})

export default router
