import { Prisma, PrismaClient } from "@prisma/client"
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const data = await prisma.submittedImage.findMany({
        select: {
            id: true,
            path: true,
            Guess: {
                include: {
                    person: {
                        select: {
                            name: true
                        }
                    },
                    guesser: {
                        select: {
                            name: true
                        }
                    },
                    guessedImage: {
                        select: {
                            id: true,
                            path: true
                        }
                    }
                }
            },
            Person: {
                select: {
                    name: true
                }
            }
        },
        orderBy: [
            {
                personId: 'asc'
            },
            {
                id: 'asc'
            }
        ]
    })
    return data;
})
