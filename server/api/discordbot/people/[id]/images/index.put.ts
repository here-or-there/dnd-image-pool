import { IncomingMessage } from 'http'
import fs from 'fs'
import { join } from 'path'
import { PrismaClient } from '@prisma/client'
import mimeTypes from 'mime-types'
import axios from 'axios'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    console.log('images index put called')
    const personId = getRouterParam(event, 'id');
    const { req, res } = event
    const contentType = req.headers['content-type']

    if (!personId) {
        setResponseStatus(event, 400)
        return 'Missing person id'
    }

    if (!contentType || !contentType.startsWith('image/')) {
        setResponseStatus(event, 400)
        return 'Invalid content type'
    }

    // Filter out non-accepted image types
    if (!contentType.startsWith('image/png') && !contentType.startsWith('image/jpeg') && !contentType.startsWith('image/jpg')) {
        setResponseStatus(event, 400)
        return 'Invalid image type'
    }



    // See if personId exists in db
    // If not, return 404
    // If yes, continue
    const doesPersonExist = await prisma.person.findUnique({
        where: {
            id: personId
        }
    })
    if (!doesPersonExist) {
        setResponseStatus(event, 404)
        return 'Person not found'
    }

    const chunks: Buffer[] = []

    await req.on('data', (chunk: Buffer) => {
        chunks.push(chunk)
    })

    // Random number thrown in just to make sure the file name is unique
    const randomNumber = Math.floor(Math.random() * 100)
    const fileExtension = mimeTypes.extension(contentType)
    const fileName = `image-${Date.now()}-${personId}-${randomNumber}.${fileExtension}`
    await req.on('end', () => {
        const buffer = Buffer.concat(chunks)

        const filePath = join(process.cwd(), 'public/media/submitted_images/', fileName)
        const dirPath = join(process.cwd(), 'public/media/submitted_images/');
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            console.log('Directory created:', dirPath);
        }
        fs.writeFile(filePath, buffer, (err) => {
            if (err) {
                console.error(err)
                setResponseStatus(event, 500)
                return 'Error saving image'
            }
        })
    })

    const submittedImage = await prisma.submittedImage.create({
        data: {
            Person: {
                connect: {
                    id: personId
                }
            },
            path: "/media/submitted_images/" + fileName,

        }
    })
    return 'Image saved successfully'
})