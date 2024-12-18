import express from 'express'
import MediaService from './service'

class MediaController {
  static async uploadFile(request: express.Request, response: express.Response) {
    const result = await MediaService.uploadFile(request)

    console.log(result)

    return response.json({ status: 200, content: result })
  }
}

export default MediaController
