import { Prisma, PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();


// https://nuxt.com/docs/guide/directory-structure/server
export default defineEventHandler(async (event) => {
    const { context: { params } } = event;
    if (!params || !params.id) {
        throw new Error('Missing id parameter');
    }
    const { id } = params;

    const getGuesser = await prisma.guesser.findUnique({
        where: {
            id: id
        },
        include: {
            Guess: {

                include: {
                    person: true,
                    guessedImage: {
                        include: {
                            Person: true,

                        },
                    }
                },
                orderBy: [
                    {
                        person: {
                            id: 'asc'
                        }
                    },
                    {
                        guessedImage: {
                            id: 'asc'
                        }
                    }
                ],
            }
        }
    })
        .catch((error) => {
            console.error(error);
        });

    return getGuesser;
});