declare interface User {
  id: number
  email: string
  fName: string
  lName: string
  passwordHash: string | null
}

export default User
