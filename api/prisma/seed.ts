import { PrismaClient } from "@prisma/client";
import { env } from "src/common/utils/env";
import * as bcrypt from "bcrypt"
import { ROLE } from "src/common/enums/user-role.enum";
import 'dotenv/config';


const prisma = new PrismaClient()

async function main() {
  const adminEmailsRaw = env('ADMIN_ACC')
  const adminEmails: string[] = adminEmailsRaw.split(',').map(email => email.trim())
  const adminPass = env('ADMIN_PASS') 

  for(const email of adminEmails){ 
    const existingEmail = await prisma.user.findUnique( { where: { email } } )
    if(existingEmail) return 
    const salt = await bcrypt.genSalt()
    const hashedPass = await bcrypt.hash(adminPass, salt)
    await prisma.user.create( { data: { 
      email,
      name: email.split('@')[0],
      password: hashedPass,
      role: ROLE.ADMIN 
    }})
    console.log(`Admin criado ${email}`)
  }
}

main()
  .catch(e => {
    console.error('Erro no seed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());