import { Prisma, PrismaClient } from "@prisma/client"
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const data = await prisma.guesser.findMany({

    })
    return data;
})
