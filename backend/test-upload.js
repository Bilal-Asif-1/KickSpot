// Test script for Cloudinary upload
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testUpload() {
  try {
    // Create a test image file (you can use any image)
    const testImagePath = path.join(__dirname, 'uploads/products');
    
    // Check if any image exists
    const files = fs.readdirSync(testImagePath);
    if (files.length === 0) {
      console.log('❌ No test images found in uploads/products/');
      console.log('📝 Please add an image file to test');
      return;
    }
    
    const testFile = files[0];
    const fullPath = path.join(testImagePath, testFile);
    
    console.log('🧪 Testing Cloudinary upload...');
    console.log('📁 Test file:', testFile);
    
    // Create form data
    const formData = new FormData();
    formData.append('image', fs.createReadStream(fullPath));
    formData.append('name', 'Test Product');
    formData.append('category', 'Men');
    formData.append('price', '99.99');
    formData.append('stock', '10');
    formData.append('description', 'Test product for Cloudinary');
    
    // Make request to your API
    const response = await fetch('http://localhost:5000/api/v1/products', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE', // Replace with actual token
        ...formData.getHeaders()
      }
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Upload successful!');
      console.log('🌐 Cloudinary URL:', result.image_url);
    } else {
      const error = await response.text();
      console.log('❌ Upload failed:', error);
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

// Run test
testUpload();
