import { Prisma, PrismaClient } from "@prisma/client"
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const data = await prisma.guess.findMany({
        include: {
            person: true,
            guessedImage: true
        },
        orderBy: {
            guessedImage: {
                personId: 'asc'
            }
        }
    })
    return data;
})
