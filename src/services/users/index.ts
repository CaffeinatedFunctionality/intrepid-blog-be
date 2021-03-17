import usingPostgres from "adapters/usingPostgres"
import {User} from "types/models"
import {hashPassword} from "services/auth"

export async function getUserByEmail(email: string): Promise<{result: User, error: Error}> {
  return await usingPostgres<User>(async postgresClient => {
    return await postgresClient.user.findUnique({
      where: {
        email
      }
    })
  })
}

export async function register(email: string, fName: string, lName: string, password: string): Promise<{result: User, error: Error}> {
  return await usingPostgres<User>(async postgresClient => {
    return await postgresClient.user.create({
      data: {
        email,
        fName,
        lName,
        passwordHash: hashPassword(password)
      }
    })
  })
}
