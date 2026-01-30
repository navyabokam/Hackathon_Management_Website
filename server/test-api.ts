import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

async function testAPI() {
  try {
    // Test 1: Health check
    console.log('🔵 Test 1: Health Check');
    const healthResponse = await axios.get(`${API_URL}/health`);
    console.log('✓ Health check passed:', healthResponse.data);
    console.log('');

    // Test 2: Team Registration
    console.log('🔵 Test 2: Team Registration');
    const teamData = {
      teamName: 'TestTeam' + Date.now(),
      collegeName: 'Test University',
      leaderEmail: 'leader' + Date.now() + '@test.com',
      leaderPhone: '9876543210',
      participants: [
        {
          fullName: 'John Doe',
          email: 'john' + Date.now() + '@test.com',
          phone: '1234567890',
          rollNumber: 'ROLL001',
        },
      ],
    };

    const teamResponse = await axios.post(`${API_URL}/teams`, teamData);
    console.log('✓ Team registration successful!');
    console.log('Registration ID:', teamResponse.data.registrationId);
    console.log('Team Name:', teamResponse.data.teamName);
    console.log('Status:', teamResponse.data.status);
    console.log('');

    // Test 3: Get team by registration ID
    console.log('🔵 Test 3: Retrieve Team');
    const getResponse = await axios.get(`${API_URL}/teams/${teamResponse.data.registrationId}`);
    console.log('✓ Team retrieved successfully!');
    console.log('Team:', getResponse.data.teamName);
    console.log('Status:', getResponse.data.status);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('✗ API Error:', error.response?.status, error.response?.data);
    } else {
      console.error('✗ Error:', error instanceof Error ? error.message : error);
    }
    process.exit(1);
  }
}

testAPI().then(() => {
  console.log('All tests passed!');
  process.exit(0);
});
