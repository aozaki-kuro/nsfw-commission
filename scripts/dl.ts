// Import required modules
import axios from 'axios'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { exit } from 'process'

// Get the hosting URL from environment variables or .env file
const HOSTING = getHosting()

// Directory path to save cover image and downloaded images
const publicDirPath = './public/images'

// Create the publicDirPath if it doesn't exist and download the cover image
ensureDirectory(publicDirPath)
downloadCoverImage()

// Directory path containing commission files, get all files and process each file
const commissionDirPath = './data/commission'
const commissionFiles = getAllFiles(commissionDirPath)

// Filter only .ts files and process them
commissionFiles
  .filter(file => path.extname(file) === '.ts')
  .forEach(filePath => processFile(filePath))

function getHosting() {
  // Load environment variables from .env file
  const hosting = dotenv.config().parsed?.HOSTING || process.env.HOSTING
  // Exit with an error if the hosting URL is not defined
  if (!hosting) {
    console.error(
      '\x1b[42m%s\x1b[0m',
      ' Error ',
      'DL links not set correctly in the environment or .env'
    )
    exit(1)
  }
  return hosting
}

function ensureDirectory(dirPath: string) {
  // Create directory recursively if it doesn't exist
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

function downloadCoverImage() {
  // Download the cover image to publicDirPath/nsfw-cover.jpg
  const coverUrl = `https://${HOSTING}/nsfw-commission/nsfw-cover-s.jpg`
  const coverPath = path.join(publicDirPath, 'nsfw-cover.jpg')
  downloadImage(coverUrl, coverPath)
}

function processFile(filePath: string) {
  // Read the file and extract the character name and file name
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      return
    }

    const lines = data.split('\n')
    let fileName = ''
    let character = ''

    lines.forEach(line => {
      if (line.includes('fileName:')) {
        fileName = line.split("'")[1]
      }
      if (line.includes('Character:')) {
        character = line.split("'")[1]
      }

      if (fileName && character) {
        // Create directory recursively if it doesn't exist
        const dirPath = path.join(publicDirPath, character)
        ensureDirectory(dirPath)

        // Download image to publicDirPath/character/file.jpg
        const filePath = path.join(dirPath, `${fileName}.jpg`)
        const downloadLink = `https://${HOSTING}/nsfw-commission/${character}/${fileName}.jpg`
        downloadImage(downloadLink, filePath)

        // Reset variables for next file
        fileName = ''
        character = ''
      }
    })
  })
}

function downloadImage(url: string, filePath: string) {
  // Download an image from the specified URL and save it to the specified file path
  const writer = fs.createWriteStream(filePath)
  axios({
    method: 'get',
    url: url,
    responseType: 'stream'
  })
    .then(res => {
      res.data.pipe(writer)
      writer.on('finish', () => writer.close())
    })
    .catch(err => {
      console.error(
        '\x1b[42m%s\x1b[0m',
        ' Error ',
        `${filePath} ${err.message}`
      )
      exit(1)
    })
}

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  // Get all files recursively in a directory
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
