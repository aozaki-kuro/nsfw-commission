// Import required modules
import axios from 'axios'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { exit } from 'process'

// Set HOSTING environment variable to either dotenv or process.env methods
const HOSTING =
  dotenv.config().parsed?.HOSTING ||
  process.env.HOSTING ||
  (() => {
    // If host is undefined, log error message and exit program
    console.error(
      '\x1b[41m%s\x1b[0m',
      ' FAIL ',
      'DL links not set correctly in the environment or .env'
    )
    exit(1)
  })()

// Create a directory path to public/images and check if it exists, create it otherwise
const publicDirPath = './public/images'
if (!fs.existsSync(publicDirPath)) {
  fs.mkdirSync(publicDirPath)
}

// Download cover image to the given path and log success to the console
const coverUrl = `https://${HOSTING}/nsfw-commission/nsfw-cover-s.jpg`
const coverPath = './public/images/nsfw-cover.jpg'
const coverStream = fs.createWriteStream(coverPath)

axios({
  method: 'get',
  url: coverUrl,
  responseType: 'stream'
})
  .then(res => {
    res.data.pipe(coverStream)
    coverStream.on('finish', () => {
      coverStream.close()
      checkDownloadsCompleted()
    })
  })
  .catch(err => {
    console.error(`Error: ${err.message}`)
    exit(1)
  })

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
        const dirPath = path.join('./public/images', character)
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true })
        }

        // Set file path and download the image using axios and stream it to a writer object
        const filePath = path.join(dirPath, `${fileName}.jpg`)
        const writer = fs.createWriteStream(filePath)

        axios({
          method: 'get',
          url: downloadLink,
          responseType: 'stream'
        })
          .then(res => {
            res.data.pipe(writer)
            writer.on('finish', () => {
              writer.close()
              completedDownloads++
              if (completedDownloads === commissionFiles.length) {
                checkDownloadsCompleted()
              }
            })
          })
          .catch(err => {
            console.error(
              '\x1b[41m%s\x1b[0m',
              ' FAIL ',
              `${downloadLink} ${err.message}`
            )
            exit(1)
          })

        // Reset variables
        fileName = ''
        character = ''
      }
    })
  })
})

// Recursive function to get all file names in the directory path provided
function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
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

// Function to check if all downloads are completed
function checkDownloadsCompleted() {
  if (completedDownloads === commissionFiles.length) {
    console.log('\x1b[42m%s\x1b[0m', ' DONE ', 'All downloads completed.')
  }
}