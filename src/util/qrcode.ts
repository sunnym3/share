import * as QRCode from 'qrcode'

interface QRCodeOptions {
  width?: number
  height?: number
  color?: {
    dark?: string
    light?: string
  }
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
}

/**
 * 生成二维码
 * @param url 需要生成二维码的URL
 * @param options 二维码配置选项
 * @returns Promise<string> 返回base64格式的二维码图片
 */
export const generateQRCode = async (
  url: string,
  options: QRCodeOptions = {}
): Promise<string> => {
  const defaultOptions = {
    width: 256,
    height: 256,
    color: {
      dark: '#000000',
      light: '#ffffff'
    },
    errorCorrectionLevel: 'H' as const
  }

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    color: {
      ...defaultOptions.color,
      ...options.color
    }
  }

  try {
    return await QRCode.toDataURL(url, mergedOptions)
  } catch (error) {
    console.error('生成二维码失败:', error)
    throw error
  }
}

/**
 * 生成二维码并返回Canvas元素
 * @param url 需要生成二维码的URL
 * @param options 二维码配置选项
 * @returns Promise<HTMLCanvasElement>
 */
export const generateQRCodeCanvas = async (
  url: string,
  options: QRCodeOptions = {}
): Promise<HTMLCanvasElement> => {
  const defaultOptions = {
    width: 256,
    height: 256,
    color: {
      dark: '#000000',
      light: '#ffffff'
    },
    errorCorrectionLevel: 'H' as const
  }

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    color: {
      ...defaultOptions.color,
      ...options.color
    }
  }

  try {
    const canvas = document.createElement('canvas')
    await QRCode.toCanvas(canvas, url, mergedOptions)
    return canvas
  } catch (error) {
    console.error('生成二维码失败:', error)
    throw error
  }
}
