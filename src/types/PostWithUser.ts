import {Post} from "./models"

declare type UserNameInfo = {
  fName: string,
  lName: string
}

declare interface PostWithUser extends Post {
  user: UserNameInfo
//  email maybe if we intend to have contact information
}

export default PostWithUser
