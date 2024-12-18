import express from 'express'
import MediaController from './controller'
import multer from 'multer'
import path from 'path'
const upload = multer({ dest: path.join(__dirname, `../../../../uploads`) })

const MediaRouter = express.Router()

MediaRouter.put(
  '/',

  (request: express.Request, response: express.Response) => MediaController.uploadFile(request, response)
)

// MediaRouter.post('/upload', (request: express.Request, response: express.Response) => {
//   MediaController.uploadVideo(request, response)
// })
export default MediaRouter
