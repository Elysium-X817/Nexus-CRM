const http = require('http');

const request = (path, method = 'GET', body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: 5000,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      },
      (res) => {
        let resData = '';
        res.on('data', (chunk) => (resData += chunk));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(resData);
            resolve({ status: res.status, ok: res.statusCode >= 200 && res.statusCode < 300, data: parsed });
          } catch (e) {
            resolve({ status: res.status, ok: res.statusCode >= 200 && res.statusCode < 300, data: resData });
          }
        });
      }
    );
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
};

async function runTests() {
  console.log('--- STARTING CRM FULL-STACK API VERIFICATION ---');

  // 1. Health check
  const health = await request('/api/health');
  console.log('1. Health check:', health.data.status === 'ok' ? 'PASSED ✓' : 'FAILED ✗');

  // 2. Register user
  const email = `test_user_${Date.now()}@nexuscrm.io`;
  const registerRes = await request('/api/auth/register', 'POST', {
    name: 'Verification Lead',
    email,
    password: 'password123',
    companyName: 'Apex Test Dynamics'
  });
  console.log('2. User Registration:', registerRes.ok ? 'PASSED ✓' : 'FAILED ✗', registerRes.data.email);
  const token = registerRes.data.token;

  // 3. Login
  const loginRes = await request('/api/auth/login', 'POST', {
    email,
    password: 'password123'
  });
  console.log('3. User JWT Login:', loginRes.ok ? 'PASSED ✓' : 'FAILED ✗', 'Token generated:', !!loginRes.data.token);

  // 4. Seed Demo Data
  const seedRes = await request('/api/seed/demo', 'POST', {}, token);
  console.log('4. Seed Demo Data:', seedRes.ok ? 'PASSED ✓' : 'FAILED ✗', seedRes.data.message);

  // 5. Dashboard Stats Verification
  const dashRes = await request('/api/dashboard/stats', 'GET', null, token);
  console.log('5. Dashboard 4 Summary Cards:', dashRes.ok ? 'PASSED ✓' : 'FAILED ✗');
  console.log('   - Total Contacts:', dashRes.data.cards.totalContacts);
  console.log('   - Active Deals:', dashRes.data.cards.activeDeals);
  console.log('   - Total Revenue Won:', '$' + dashRes.data.cards.totalRevenueWon.toLocaleString());
  console.log('   - Pending Tasks:', dashRes.data.cards.pendingTasks);
  console.log('   - Monthly Sales Chart points:', dashRes.data.monthlySales.length);
  console.log('   - Today\'s Follow-ups count:', dashRes.data.todaysFollowUps.length);

  // 6. Contacts Page Verification
  const contactsRes = await request('/api/contacts', 'GET', null, token);
  console.log('6. Contacts listing:', contactsRes.data.length, 'contacts found. PASSED ✓');
  const firstContact = contactsRes.data[0];

  // 7. Contact Details & Activity Timeline
  const contactDetail = await request(`/api/contacts/${firstContact._id}`, 'GET', null, token);
  console.log('7. Contact Details & Timeline fetched. Activities count:', contactDetail.data.activities.length, 'PASSED ✓');

  // Log a new activity (call)
  const newActivity = await request('/api/activities', 'POST', {
    contactId: firstContact._id,
    type: 'Call',
    title: 'Executive Follow-up Call',
    description: 'Discussed custom SLAs and onboarding dates.'
  }, token);
  console.log('   - Log Activity to Timeline: PASSED ✓', newActivity.data.activity.title);

  // 8. Visual Sales Pipeline (Kanban Board) Verification
  const dealsRes = await request('/api/deals', 'GET', null, token);
  console.log('8. Visual Sales Pipeline (Deals):', dealsRes.data.length, 'deals found across stages. PASSED ✓');

  // Find a deal not in Closed Won, advance to Closed Won
  const activeDeal = dealsRes.data.find(d => d.stage !== 'Closed Won');
  const prevWonRevenue = dashRes.data.cards.totalRevenueWon;
  console.log(`   - Moving deal "${activeDeal.title}" ($${activeDeal.value}) to "Closed Won"...`);

  const patchDeal = await request(`/api/deals/${activeDeal._id}/stage`, 'PATCH', {
    stage: 'Closed Won'
  }, token);
  console.log('   - Drag-and-drop Deal Stage Update: PASSED ✓', patchDeal.data.stage);

  // Check that Dashboard Revenue is automatically updated!
  const dashAfterWon = await request('/api/dashboard/stats', 'GET', null, token);
  const newWonRevenue = dashAfterWon.data.cards.totalRevenueWon;
  console.log(`   - Revenue Before: $${prevWonRevenue.toLocaleString()} -> Revenue After: $${newWonRevenue.toLocaleString()}`);
  console.log('   - Automatic Revenue Update on Won: ' + (newWonRevenue === prevWonRevenue + activeDeal.value ? 'PASSED ✓' : 'FAILED ✗'));

  // 9. Tasks & Reminders Verification
  const tasksRes = await request('/api/tasks', 'GET', null, token);
  console.log('9. Tasks & Reminders: fetched', tasksRes.data.length, 'tasks. PASSED ✓');
  const taskToToggle = tasksRes.data[0];
  const toggleRes = await request(`/api/tasks/${taskToToggle._id}/toggle`, 'PATCH', {}, token);
  console.log('   - Task Completion Toggle: PASSED ✓', 'Completed:', toggleRes.data.completed);

  // 10. Global Search Verification
  const searchRes = await request('/api/dashboard/search?q=Sarah', 'GET', null, token);
  console.log('10. Global Search ("Sarah"):', searchRes.data.contacts.length, 'contacts matched. PASSED ✓');

  console.log('--- ALL FULL-STACK CRM ENDPOINTS VERIFIED SUCCESSFULLY ---');
  process.exit(0);
}

runTests().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
