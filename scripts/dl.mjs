import axios from 'axios'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

const HOSTING =
  dotenv.config().parsed?.HOSTING ||
  process.env.HOSTING ||
  (() => {
    console.error('DL links not set correctly in the environment or .env')
    process.exit(1)
  })()

const publicDirPath = './public/images'
if (!fs.existsSync(publicDirPath)) {
  fs.mkdirSync(publicDirPath)
}

// Download cover
console.log('\x1b[34m%s\x1b[0m', `Downloading`, `.../nsfw-cover.jpg`)
const coverUrl = `https://${HOSTING}/nsfw-commission/nsfw-cover-s.jpg`
const coverPath = './public/images/nsfw-cover.jpg'
const coverStream = fs.createWriteStream(coverPath)
axios({
  method: 'get',
  url: coverUrl,
  responseType: 'stream'
}).then(res => {
  res.data.pipe(coverStream)
  coverStream.on('finish', () => {
    coverStream.close()
  })
})

// Loop through all .ts files in ./data/commission and its subdirectories
const commissionDirPath = './data/commission'
const commissionFiles = getAllFiles(commissionDirPath)

commissionFiles.forEach(filePath => {
  if (path.extname(filePath) !== '.ts') {
    return
  }

  // Extract fileName and Character fields from each line of the .ts file
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

      // Download the image if both fileName and character are set and not empty strings
      if (fileName && character) {
        const downloadLink = `https://${HOSTING}/nsfw-commission/${character}/${fileName}.jpg`
        console.log(
          '\x1b[34m%s\x1b[0m',
          `Downloading`,
          `.../${character}/${fileName}.jpg`
        )

        // Create directory if it doesn't already exist
        const dirPath = path.join('./public/images', character)
        if (!fs.existsSync(dirPath)) {
          // check if directory exists before creating it
          fs.mkdirSync(dirPath, { recursive: true })
        }

        // Download the file
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
            })
          })
          .catch(err => {
            console.error(`Error: ${downloadLink} ${err.message}`)
            process.exit(1)
          })

        // Reset the variables
        fileName = ''
        character = ''
      }
    })
  })
})

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(file => {
    if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
      arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles)
    } else {
      arrayOfFiles.push(path.join(dirPath, '/', file))
    }
  })

  return arrayOfFiles
}
