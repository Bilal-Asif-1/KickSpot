import axios from 'axios';

const BASE_URL = 'http://localhost:5000';
let authToken = '';
let adminToken = '';

// Test results
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

function logTest(name, passed, message = '') {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} - ${name}${message ? ': ' + message : ''}`);
  results.tests.push({ name, passed, message });
  if (passed) results.passed++;
  else results.failed++;
}

async function testEndpoint(name, method, url, data = null, headers = {}, expectedStatus = 200) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${url}`,
      headers,
      ...(data && { data })
    };
    
    const response = await axios(config);
    const success = response.status === expectedStatus;
    logTest(name, success, success ? `Status: ${response.status}` : `Expected ${expectedStatus}, got ${response.status}`);
    return response.data;
  } catch (error) {
    const actualStatus = error.response?.status || 'No response';
    const success = actualStatus === expectedStatus;
    logTest(name, success, `Status: ${actualStatus}${error.response?.data?.message ? ' - ' + error.response.data.message : ''}`);
    return error.response?.data;
  }
}

async function runTests() {
  console.log('🚀 Starting Backend API Tests...\n');

  // 1. Health Check
  await testEndpoint('Health Check', 'GET', '/health');

  // 2. API Test Endpoint  
  await testEndpoint('API Test Endpoint', 'GET', '/api/test');

  // 3. Get Products (Public)
  await testEndpoint('Get Products (Public)', 'GET', '/api/products');

  // 4. Register New User
  const registerData = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  };
  const registerResult = await testEndpoint('Register User', 'POST', '/api/auth/register', registerData, {}, 201);
  if (registerResult && registerResult.token) {
    authToken = registerResult.token;
  }

  // 5. Login User
  const loginData = {
    email: 'test@example.com',
    password: 'password123'
  };
  const loginResult = await testEndpoint('Login User', 'POST', '/api/auth/login', loginData);
  if (loginResult && loginResult.token) {
    authToken = loginResult.token;
  }

  // 6. Login as Admin (if seeded)
  const adminLoginData = {
    email: 'admin@example.com',
    password: 'admin123'
  };
  const adminLoginResult = await testEndpoint('Login Admin', 'POST', '/api/auth/login', adminLoginData);
  if (adminLoginResult && adminLoginResult.token) {
    adminToken = adminLoginResult.token;
  }

  // 7. Get Profile (Protected)
  if (authToken) {
    await testEndpoint('Get Profile', 'GET', '/api/auth/profile', null, { Authorization: `Bearer ${authToken}` });
  }

  // 8. Create Product (Admin Only)
  if (adminToken) {
    const productData = {
      name: 'Test Sneakers',
      description: 'Testing product creation',
      price: 99.99,
      category: 'Sneakers',
      stock: 50
    };
    await testEndpoint('Create Product (Admin)', 'POST', '/api/products', productData, { Authorization: `Bearer ${adminToken}` }, 201);
  }

  // 9. Get User Products
  if (authToken) {
    await testEndpoint('Get User Products', 'GET', '/api/products/user/my-products', null, { Authorization: `Bearer ${authToken}` });
  }

  // 10. Get All Users (Admin Only)
  if (adminToken) {
    await testEndpoint('Get All Users (Admin)', 'GET', '/api/users', null, { Authorization: `Bearer ${adminToken}` });
  }

  // 11. Test Authentication Failure
  await testEndpoint('Unauthorized Access', 'GET', '/api/auth/profile', null, {}, 401);

  // 12. Test Validation Errors
  const invalidRegisterData = {
    name: 'A',
    email: 'invalid-email',
    password: '123'
  };
  await testEndpoint('Invalid Registration Data', 'POST', '/api/auth/register', invalidRegisterData, {}, 400);

  console.log('\n📊 Test Results Summary:');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);

  if (results.failed > 0) {
    console.log('\n❌ Failed Tests:');
    results.tests.filter(t => !t.passed).forEach(test => {
      console.log(`  - ${test.name}: ${test.message}`);
    });
  }

  process.exit(0);
}

runTests().catch(console.error);
