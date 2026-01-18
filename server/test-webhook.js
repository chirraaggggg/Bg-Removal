// Quick test to verify webhook endpoint works
import 'dotenv/config';

const WEBHOOK_URL = 'http://localhost:4000/api/user/webhooks';

// Test if server is running
async function testWebhookEndpoint() {
  console.log('🧪 Testing webhook endpoint...\n');
  
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'svix-id': 'test-id',
        'svix-timestamp': Math.floor(Date.now() / 1000).toString(),
        'svix-signature': 'test-signature'
      },
      body: JSON.stringify({
        data: { test: true },
        type: 'test.event'
      })
    });
    
    console.log('Status:', response.status);
    const data = await response.text();
    console.log('Response:', data);
    
    if (response.status === 400) {
      console.log('\n✅ Webhook endpoint is responding (signature verification failed as expected)');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n⚠️  Make sure your server is running: npm start');
  }
}

testWebhookEndpoint();
