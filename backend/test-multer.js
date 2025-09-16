import multer from 'multer'
import path from 'path'
import fs from 'fs'

// Test multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), 'uploads', 'temp')
    console.log('📁 Test destination:', uploadPath)
    
    // Ensure directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
      console.log('📁 Created directory:', uploadPath)
    }
    
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    console.log('📄 Test filename:', filename)
    cb(null, filename)
  }
})

const fileFilter = (req, file, cb) => {
  console.log('🔍 Test file filter - mimetype:', file.mimetype, 'originalname:', file.originalname)
  if (file.mimetype.startsWith('image/')) {
    console.log('✅ Test file accepted')
    cb(null, true)
  } else {
    console.log('❌ Test file rejected')
    cb(new Error('Only image files are allowed!'), false)
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter
})

console.log('🧪 Multer test configuration created')
console.log('📁 Current working directory:', process.cwd())
console.log('📁 Uploads directory exists:', fs.existsSync(path.join(process.cwd(), 'uploads')))
console.log('📁 Temp directory exists:', fs.existsSync(path.join(process.cwd(), 'uploads', 'temp')))

export { upload }
