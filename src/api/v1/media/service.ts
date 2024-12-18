import path from 'path'
import express from 'express'
import fs from 'fs'
import { generateRandomString } from '../../../../utils/generateRandomString'
import logger from '../../../../utils/logger'
import AnotherError from '../../../../utils/errors/anotherError'
import fileUpload, { UploadedFile } from 'express-fileupload'
import { variables } from '../../../../config/envLoader'
import { IContent } from './interface'

class MediaService {
  static async createMedia(data: IContent) {
    return { status: 1 }
  }

  static async uploadFile(request: express.Request) {
    const fileName = generateRandomString()

    console.log(fileName)

    console.log(request.files?.file)
    const fileData = request.files?.file as fileUpload.UploadedFile

    const fileType = fileData.name.split('.')[1]

    const uploadFilePath = path.join(__dirname, `../../../../uploads/${fileName}.${fileType}`)
    console.log(uploadFilePath)

    const writeStream = fs.createWriteStream(uploadFilePath)
    writeStream.write(fileData.data)

    return `${variables.BASE_URL}/content/${fileName}.${fileType}`

    // request.on('data', chunk => {
    //   console.log(chunk)
    //   console.time()
    //   writeStream.write(chunk)
    //   dataReceived = true
    // })

    // request.on('end', () => {
    //   logger?.debug(`File Upload complete.`)
    //   return `${variables.BASE_URL}/content/${fileName}.${fileType}`
    // })

    // request.on('close', () => {
    //   logger?.debug(`Stream Closed`)
    // })

    // request.on('error', () => {
    //   throw new AnotherError('INVALID_INPUT', 'Cant upload file')
    // })
  }

  // static async uploadFile_(request: express.Request) {
  //   const { files } = request

  //   const file = request.files?.file as fileUpload.UploadedFile

  //   if (!file) {
  //     throw new AnotherError('RESOURCE_NOT_FOUND', 'File')
  //   }

  //   console.log(request.files?.file)

  //   const uploadFilePath = path.join(__dirname, `../../../../uploads/`)
  //   console.log(uploadFilePath)
  //   file.mv(uploadFilePath, err => {
  //     if (err) {
  //       throw new AnotherError('SOMETHING_WENT_WRONG', 'File Upload')
  //     }
  //   })

  //   return `${variables.BASE_URL}/content/`
  // }

  static getMIMEType(request: express.Request) {
    const content_type = request.headers['content-type']
    const mime = content_type?.split('/')[1]
    if (content_type?.split('/')[0] === 'image' && mime === '*') {
      return 'png'
    }

    if (mime === 'x-m4a') {
      return 'm4a'
    }

    if (mime === 'mpeg') {
      return 'mp3'
    } else return mime
  }
}

export default MediaService
