import multer from 'multer'
import { Request } from 'express'
import { v2 as cloudinary } from 'cloudinary'
import path from 'path'

// Configure Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
} else {
  console.warn('Cloudinary credentials not found. Image uploads will be disabled.')
}

// Configure temporary storage for Cloudinary upload
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: Function) => {
    cb(null, 'uploads/temp/')
  },
  filename: (req: Request, file: Express.Multer.File, cb: Function) => {
    // Generate unique filename: timestamp + random + original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

// File filter for images only
const fileFilter = (req: Request, file: Express.Multer.File, cb: Function) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Only image files are allowed!'), false)
  }
}

// Configure multer
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter
})

// Single file upload middleware
export const uploadSingle = upload.single('image')

// Multiple files upload middleware
export const uploadMultiple = upload.array('images', 5)

// Cloudinary upload function
export const uploadToCloudinary = async (filePath: string, folder: string = 'kickspot/products') => {
  try {
    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.warn('Cloudinary not configured. Skipping image upload.')
      return null
    }
    
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto' }
      ]
    })
    return result.secure_url
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw error
  }
}

// Export cloudinary instance for direct usage
export { cloudinary }
