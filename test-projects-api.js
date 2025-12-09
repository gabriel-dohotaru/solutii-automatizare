
const API_BASE = 'http://localhost:3005';

async function testProjectsAPI() {
  try {
    // First login to get a token
    console.log('🔐 Logging in as test client...');
    const loginResponse = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'client@test.ro',
        password: 'client123'
      })
    });

    const loginData = await loginResponse.json();

    if (!loginData.success) {
      console.error('❌ Login failed:', loginData.message);
      return;
    }

    const token = loginData.data.token;
    console.log('✅ Login successful');

    // Test the projects API
    console.log('\n📋 Testing GET /api/client/projects...');
    const projectsResponse = await fetch(`${API_BASE}/api/client/projects`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const projectsData = await projectsResponse.json();

    console.log(`Status: ${projectsResponse.status}`);
    console.log('Response:', JSON.stringify(projectsData, null, 2));

    if (projectsData.success) {
      console.log(`✅ Found ${projectsData.data.length} projects`);
      projectsData.data.forEach((project, index) => {
        console.log(`  ${index + 1}. ${project.name} - ${project.status} (${project.progress}%)`);
      });
    } else {
      console.error('❌ Projects API failed:', projectsData.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testProjectsAPI();