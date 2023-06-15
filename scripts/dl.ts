import { commissionData } from '#data/CommissionData'
import dotenv from 'dotenv'
import fs from 'fs'
import https from 'https'
import path from 'path'

// Load environment variables from .env file
dotenv.config()

// Validate HOSTING environment variable
const HOSTING = process.env.HOSTING
if (!HOSTING) {
  console.error(
    '\x1b[41m%s\x1b[0m',
    ' FAIL ',
    'DL links not set correctly in the environment or .env'
  )
  process.exit(1)
}

// Create the directory for storing downloaded images if it doesn't exist
const publicDirPath = './public/images'
fs.mkdirSync(publicDirPath, { recursive: true })

// Download cover image and handle completion
const coverUrl = `https://${HOSTING}/nsfw-commission/nsfw-cover-s.jpg`
const coverPath = './public/images/nsfw-cover.jpg'
const coverStream = fs.createWriteStream(coverPath)

https
  .get(coverUrl, response => {
    response.pipe(coverStream)
    coverStream.on('finish', () => {
      coverStream.close()
      checkDownloadsCompleted()
    })
  })
  .on('error', err => {
    console.error('\x1b[41m%s\x1b[0m', ' FAIL ', `Error: ${err.message}`)
    process.exit(1)
  })

// Keep track of completed downloads
let completedDownloads = 0

// Download each image in the commissionData array
for (const commission of commissionData) {
  const { fileName, Character } = commission

  // Create the directory for the character if it doesn't exist
  const dirPath = path.join(publicDirPath, Character)
  fs.mkdirSync(dirPath, { recursive: true })

  // Download the image using https and stream it to a writer object
  const filePath = path.join(dirPath, `${fileName}.jpg`)
  const imageUrl = `https://${HOSTING}/nsfw-commission/${Character}/${fileName}.jpg`

  downloadImage(imageUrl, filePath)
    .then(() => {
      completedDownloads++
      checkDownloadsCompleted()
    })
    .catch(error => {
      console.error(
        '\x1b[41m%s\x1b[0m',
        ' FAIL ',
        `Error downloading image "${fileName}.jpg": ${error.message}`
      )
      process.exit(1)
    })
}

// Helper function to download an image and save it to a file
function downloadImage(url: string, filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const imageStream = fs.createWriteStream(filePath)
    https
      .get(url, response => {
        response.pipe(imageStream)
        imageStream.on('finish', () => {
          imageStream.close()
          resolve()
        })
      })
      .on('error', err => {
        imageStream.close()
        fs.unlinkSync(filePath)
        reject(err)
      })
  })
}

// Helper function to check if all downloads are completed
function checkDownloadsCompleted() {
  if (completedDownloads === commissionData.length) {
    console.log('\x1b[42m%s\x1b[0m', ' DONE ', 'All downloads completed.')
    process.exit(0)
  }
}
