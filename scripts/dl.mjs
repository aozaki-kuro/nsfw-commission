/*
 * Notice: This is the module JS version
 *
 * The project was written in TypeScript, so the array of the commission data was also TS.
 * TS cannot be imported here and compiling it is not an option too.
 * So the script extracts the info pretty "brutally" by splitting the lines and words.
 *
 */

import dotenv from 'dotenv'
import fs from 'fs'
import http from 'http'
import https from 'https'
import path from 'path'

const msgError = '\x1b[0m[' + '\x1b[31m' + ' ERROR ' + '\x1b[0m' + ']'
// const msgInfo = '\x1b[0m[' + '\x1b[33m' + ' INFO ' + '\x1b[0m' + ']'
const msgDone = '\x1b[0m[' + '\x1b[32m' + ' DONE ' + '\x1b[0m' + ']'
// const msgWarn = '\x1b[0m[' + '\x1b[33m' + ' WARN ' + '\x1b[0m' + ']'

// Set HOSTING environment variable to either dotenv or process.env methods
const HOSTING =
  dotenv.config().parsed?.HOSTING ||
  process.env.HOSTING ||
  (() => {
    // If host is undefined, log error message and exit program
    console.error(msgError, 'DL links not set correctly in the environment or .env')
    process.exit(1)
  })()

// Create a directory path to data/commission/images and check if it exists, create it otherwise
const publicDirPath = './data/commission/images'

if (!fs.existsSync(publicDirPath)) {
  fs.mkdirSync(publicDirPath)
}

// Download cover image to the given path and log success to the console
const coverUrl = `https://${HOSTING}/nsfw-commission/nsfw-cover.jpg`
const coverPath = publicDirPath + '/nsfw-cover.jpg'
const coverStream = fs.createWriteStream(coverPath)

const downloadCoverImage = url => {
  const protocol = url.startsWith('https') ? https : http

  const request = protocol.get(url, response => {
    response.pipe(coverStream)
    coverStream.on('finish', () => {
      coverStream.close()
      checkDownloadsCompleted()
    })
  })

  request.on('error', err => {
    console.error(`Error: ${err.message}`)
    process.exit(1)
  })
}

downloadCoverImage(coverUrl)

// Recursive function to get all file names in the directory path provided
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath)

  files.forEach(file => {
    if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
      arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles)
    } else {
      arrayOfFiles.push(path.join(dirPath, '/', file))
    }
  })

  return arrayOfFiles
}

// Set the commission directory path and get all the files and sub-directory paths recursively
const commissionDirPath = './data/commission'
const commissionFiles = getAllFiles(commissionDirPath)

// Keep track of completed downloads
let completedDownloads = 0

// Loop through each file and check if it is a .ts file
commissionFiles.forEach(filePath => {
  if (path.extname(filePath) !== '.ts') {
    return
  }

  // Read file data, split it into separate lines and set variables for file name and character
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      return
    }

    const lines = data.split('\n')
    let fileName = ''
    let character = ''

    // Loop through each line of the file and set variables accordingly
    lines.forEach(line => {
      if (line.includes('fileName:')) {
        fileName = line.split("'")[1]
      }
      if (line.includes('Character:')) {
        character = line.split("'")[1]
      }

      // If both variables are set, create a download link for the image and save it to the public folder
      if (fileName && character) {
        const downloadLink = `https://${HOSTING}/nsfw-commission/${character}/${fileName}.jpg`

        // Create path to directory and check if it exists, create it otherwise
        const dirPath = path.join(publicDirPath, character)
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true })
        }

        // Set file path and download the image using http/https and stream it to a writer object
        const filePath = path.join(dirPath, `${fileName}.jpg`)
        const writer = fs.createWriteStream(filePath)

        const protocol = downloadLink.startsWith('https') ? https : http

        const request = protocol.get(downloadLink, response => {
          response.pipe(writer)
          writer.on('finish', () => {
            writer.close()
            completedDownloads++
            if (completedDownloads === commissionFiles.length) {
              checkDownloadsCompleted()
            }
          })
        })

        request.on('error', err => {
          console.error(msgError, `${downloadLink} ${err.message}`)
          process.exit(1)
        })

        // Reset variables
        fileName = ''
        character = ''
      }
    })
  })
})

// Function to check if all downloads are completed
function checkDownloadsCompleted() {
  if (completedDownloads === commissionFiles.length) {
    console.log(msgDone, 'All downloads completed.')
  }
}
