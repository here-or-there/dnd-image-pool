import { Prisma, PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

interface Guess {
    id: string;
    src: string;
    comment: string;
    chosenPersonId: string;
}

interface BodyRequest {
    submitterName: string;
    guesses: Guess[];
}

// https://nuxt.com/docs/guide/directory-structure/server
export default defineEventHandler(async (event) => {
    //Get body
    const body = await readBody(event) as BodyRequest;
    const submitterName = body.submitterName;
    const guesses = body.guesses.map((guess) => {
        return {
            guessedImageId: guess.id,
            description: guess.comment,
            personId: guess.chosenPersonId
        } as Prisma.GuessCreateManyInput;
    })
    //Create Guesser
    const guesserCreateInput = {
        name: submitterName,
        Guess: {
            createMany: {
                data: guesses
            }
        }
    } as Prisma.GuesserCreateInput;
    const guesser = await prisma.guesser.create({
        data: guesserCreateInput
    });
    return guesser;
    //   let personCreateInput = body as Prisma.PersonCreateInput;

    //   const personCreateResult = await prisma.person.create({
    //     data: personCreateInput
    //   })
    //     .then((result) => { return result; })
    //     .catch((error) => {
    //       console.error(error);
    //       setResponseStatus(event, 500);
    //       return { status: 'error' };
    //     });
});