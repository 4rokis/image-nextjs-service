import { ImageService } from '@/lib/ImageService'
import { getQueryParams } from '@/lib/params'
import { AWSStorage } from '@/lib/storage/AwsStorage'
import { Query } from '@/lib/types'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const params = getQueryParams(req.query as Query)
    if (!params) {
      console.error('Params check failed')
      return res.status(500).json({
        success: false,
      })
    }
    if (!params.path) {
      console.error('Params path is not defined')
      return res.status(500).json({
        success: false,
      })
    }
    const storage = new AWSStorage()
    const imageData = await storage.getObject(params.path)
    if (!imageData) {
      console.error('File not found')
      return res.status(500).json({
        success: false,
      })
    }
    const imageService = new ImageService(
      storage,
      imageData as Buffer,
      params,
      params.path,
    )
    const data = await imageService.run()

    return res.status(200).json({
      success: true,
      data,
    })
  } catch (e) {
    console.error(e)
    return res.status(500).json({
      success: false,
    })
  }
}
