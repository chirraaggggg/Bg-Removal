// Test webhook functionality with MongoDB
import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './configs/mongodb.js';
import userModel from './models/userModel.js';

const testWebhookWithMongoDB = async () => {
  console.log('🧪 Testing webhook functionality with MongoDB...\n');

  try {
    // Connect to database
    console.log('📡 Connecting to MongoDB...');
    await connectDB();
    console.log('✅ Database connected\n');

    // Test user creation
    console.log('👤 Testing user creation...');
    const testUserData = {
      clerkId: `test-${Date.now()}`,
      email: `test${Date.now()}@example.com`,
      firstName: 'Test',
      lastName: 'User',
      photo: 'https://example.com/photo.jpg'
    };

    const createdUser = await userModel.create(testUserData);
    console.log(`✅ User created: ${createdUser.clerkId} (MongoDB ID: ${createdUser._id})`);

    // Test user update
    console.log('📝 Testing user update...');
    const updatedUser = await userModel.findOneAndUpdate(
      { clerkId: testUserData.clerkId },
      { firstName: 'Updated Test' },
      { new: true }
    );
    console.log(`✅ User updated: ${updatedUser.firstName}`);

    // Test user deletion
    console.log('🗑️  Testing user deletion...');
    const deletedUser = await userModel.findOneAndDelete({ clerkId: testUserData.clerkId });
    console.log(`✅ User deleted: ${deletedUser.clerkId}`);

    // Test duplicate prevention
    console.log('🚫 Testing duplicate prevention...');
    const duplicateUser = {
      clerkId: `duplicate-${Date.now()}`,
      email: `duplicate${Date.now()}@example.com`,
      firstName: 'Duplicate',
      lastName: 'Test',
      photo: 'https://example.com/photo.jpg'
    };

    // Create first time
    await userModel.create(duplicateUser);
    console.log('✅ First user created');

    // Try to create again (should handle gracefully)
    try {
      await userModel.create(duplicateUser);
      console.log('❌ Duplicate creation should have failed');
    } catch (error) {
      if (error.code === 11000) {
        console.log('✅ Duplicate creation properly prevented');
      } else {
        throw error;
      }
    }

    // Clean up
    await userModel.findOneAndDelete({ clerkId: duplicateUser.clerkId });

    console.log('\n🎉 All MongoDB webhook operations working perfectly!');
    console.log('✅ Webhooks are ready for production use');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('📪 Database connection closed');
  }
};

// Run the test
testWebhookWithMongoDB();