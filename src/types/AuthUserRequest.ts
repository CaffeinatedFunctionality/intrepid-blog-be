import { Request } from "express"
declare type TokenUser = {
  id: number
}

declare interface AuthUserRequest extends Request {
  user: TokenUser
}

export default AuthUserRequest
