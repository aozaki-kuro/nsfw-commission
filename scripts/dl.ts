/*
 * Notice: TypeScript version did this in a different approach:
 *
 * The array was written in TypeScript and imported here to be processed.
 * The script cannot be compiled into CommonJS because of this.
 *
 */

import { commissionData } from '#data/CommissionData'
import dotenv from 'dotenv'
import fs from 'fs'
import https from 'https'
import path from 'path'

dotenv.config()

const HOSTING = process.env.HOSTING
if (!HOSTING) {
  console.error(
    '\x1b[41m%s\x1b[0m',
    ' FAIL ',
    'DL links not set correctly in the environment or .env'
  )
  process.exit(1)
}

const publicDirPath = './data/commission/images'

fs.mkdirSync(publicDirPath, { recursive: true })

const coverUrl = `https://${HOSTING}/nsfw-commission/nsfw-cover.jpg`

const coverPath = path.join(publicDirPath, 'nsfw-cover.jpg')

https
  .get(coverUrl, response => {
    const coverStream = fs.createWriteStream(coverPath)
    response.pipe(coverStream)
    coverStream.on('finish', coverStream.close)
  })
  .on('error', err => {
    console.error('\x1b[41m%s\x1b[0m', ' FAIL ', `Error: ${err.message}`)
    process.exit(1)
  })

async function downloadImage(url: string, filePath: string): Promise<void> {
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

async function downloadImages() {
  try {
    await Promise.all(
      commissionData.map(async commission => {
        const { fileName, Character } = commission
        const dirPath = path.join(publicDirPath, Character)

        fs.mkdirSync(dirPath, { recursive: true })

        const filePath = path.join(dirPath, `${fileName}.jpg`)
        const imageUrl = `https://${HOSTING}/nsfw-commission/${Character}/${fileName}.jpg`

        await downloadImage(imageUrl, filePath)
      })
    )

    console.log('\x1b[42m%s\x1b[0m', ' DONE ', 'All downloads completed.')
    process.exit(0)
  } catch (error: any) {
    console.error('\x1b[41m%s\x1b[0m', ' FAIL ', `Error downloading images: ${error.message}`)
    process.exit(1)
  }
}

downloadImages()
