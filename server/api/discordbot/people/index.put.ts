import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    console.log('people put index called')
    const body = await readBody(event)
    const personInput = body as Prisma.PersonCreateInput;

    // See if id already exists
    // If yes, return 409
    // If no, continue
    const doesPersonExist = await prisma.person.findUnique({
        where: {
            id: personInput.id
        }
    })
    if (doesPersonExist) {
        setResponseStatus(event, 409)
        return 'Person already exists'
    }

    const newPerson = await prisma.person.create({
        data: personInput,
    });

    return personInput
})
