import { ImageService } from '@/lib/ImageService'
import { getQueryParams } from '@/lib/params'
import { AWSStorage } from '@/lib/storage/AwsStorage'
import { Query } from '@/lib/types'
import { NextApiRequest, NextApiResponse } from 'next'
import { v4 as uuid } from 'uuid'

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
    const file = req.body
    if (!file || typeof file !== 'string') {
      console.error('File not found')
      return res.status(500).json({
        success: false,
      })
    }
    const imageService = new ImageService(
      new AWSStorage(),
      // remove base64 string
      Buffer.from(file.replace(/^data:image\/\w+;base64,/, ''), 'base64'),
      params,
      uuid(),
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
