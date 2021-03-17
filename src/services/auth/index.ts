import crypto from 'crypto'

export function validatePassword(password: string, passwordHash: string): boolean {
  const hashedPasswordBytes: Buffer = new Buffer(passwordHash, 'base64')
  const hexChar: Array<string> = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"]
  let saltString: string = ''
  let storedSubKeyString: string = ''
  for (let i = 1; i < hashedPasswordBytes.length; i++) {
    if (i > 0 && i <= 16) {
      saltString +=
        hexChar[(hashedPasswordBytes[i] >> 4) & 0x0f] +
        hexChar[hashedPasswordBytes[i] & 0x0f]
    }
    if (i > 0 && i > 16) {
      storedSubKeyString +=
        hexChar[(hashedPasswordBytes[i] >> 4) & 0x0f] +
        hexChar[hashedPasswordBytes[i] & 0x0f]
    }
  }
  const nodeCrypto: Buffer = crypto.pbkdf2Sync(
    new Buffer(password),
    new Buffer(saltString, 'hex'),
    1000,
    256,
    'sha1',
  )
  const derivedKeyOctets: string = nodeCrypto.toString('hex').toUpperCase()
  return derivedKeyOctets.indexOf(storedSubKeyString) === 0
}

export const hashPassword = (password: string ): string => {
  let salt = crypto.randomBytes(16)
  let bytes = crypto.pbkdf2Sync(password, salt, 1000, 32, 'sha1')
  let output = Buffer.alloc(49)

  salt.copy(output, 1, 0, 16)
  bytes.copy(output, 17, 0, 32)

  return output.toString('base64')
}
