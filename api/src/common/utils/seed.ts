import { PrismaClient } from "@prisma/client";
import { env } from "src/common/utils/env";

const prisma = new PrismaClient() 

export async function seedAdminAcc(){
  const adminEmails = env('ADMIN_ACC').split(',').map(s => s.trim());
  const adminPasswords = env('ADMIN_PASS').split(',').map(s => s.trim());
  console.log('merda bosta')
  console.log(adminEmails, adminPasswords)
  for(const email of adminEmails){
    const existingAdmin = await prisma.user.findUnique( { where: { email } } )


  }


} 
