import { PrismaClient } from '@prisma/client'

const typeNameOf = (thing) =>
  String.prototype.slice.call(Object.prototype.toString.call(thing), 8, -1)

/**
 * @param { AsyncFunction | Function } callback await-able function that will receive resulting, connected PostgresClient
 * which is being done by prisma
 * @returns { [*, *] } tuple of [result of callback, error thrown (if any)]
 * @example
 *  //...
 *  const {result, error, errorMessage} = await usingPostgres(async postgresClient => {
 *    //...
 *    return await postgresClient.tableName.findFirst({ //works just like the prisma client
 *      where: {id: 23}
 *    })
 *  })
 *  if (error) {
 *    //...
 *  }
 *  //...
 */
async function usingPostgres<T>(callback: Function): Promise<{result: T, error: Error}> {
  let postgresClient, result, error
  try {
    // actually open connection
    postgresClient = new PrismaClient()

    // ensure callback is at least a function
    const callbackType = typeNameOf(callback)
    if (callbackType.includes("Function")) {
      result = await callback(postgresClient)
    } else {
      console.error(
        `Error: Opening a Postgres connection for no purpose (callback should be { AsyncFunction | Function }, not "${callbackType}")`,
      )
    }
  } catch (errorCaught) {
    error = errorCaught
  } finally {
    await postgresClient.$disconnect()
  }
  return {result, error}
}

export default usingPostgres
