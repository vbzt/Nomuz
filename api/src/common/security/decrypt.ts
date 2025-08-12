import { SECRET_KEY, ALGORITHM } from "../constants/security"
import * as crypto from 'crypto'
export function decrypt(enc: string){
  const [ivHex, authTagHex, encryptedMsg] = enc.split(':')
  const decipher = crypto.createDecipheriv(ALGORITHM,SECRET_KEY, Buffer.from( ivHex, 'hex') )
  decipher.setAuthTag(Buffer.from(authTagHex, 'hex'))
  let decrypt = decipher.update(encryptedMsg, 'hex', 'utf-8')
  decrypt += decipher.final('utf-8')
  return decrypt 
}