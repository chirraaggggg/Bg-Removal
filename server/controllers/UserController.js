import { Webhook } from "svix"
import userModel from "../models/userModel.js";
import mongoose from "mongoose";

// API controller function to manage clerk user with database
// http://localhost:4000/api/user/webhooks

const clerkwebhooks = async (req, res) => {
    try {
        // Verify webhook secret is configured
        if (!process.env.CLERK_WEBHOOK_SECRET) {
            console.error('CLERK_WEBHOOK_SECRET is not configured');
            return res.status(500).json({ success: false, message: 'Webhook secret not configured' });
        }

        // Ensure database is connected (but don't fail webhook if DB is temporarily down)
        if (mongoose.connection.readyState !== 1) {
            console.warn('Database not connected, but proceeding with webhook processing');
            // For webhooks, we should still try to process even if DB is not ready
            // The operations will fail gracefully if DB is unavailable
        }

        // Create a svix instance with clerk webhook secret
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        // Get raw body (req.body is a Buffer from express.raw())
        const payload = req.body.toString();
        
        // Verify webhook signature
        const evt = await whook.verify(payload, {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        });

        // Parse the verified payload
        const { data, type } = JSON.parse(payload);

        switch (type) {
            case "user.created": {
                try {
                    // Validate required data
                    if (!data.id || !data.email_addresses?.[0]?.email_address) {
                        console.error('Invalid user data received:', data);
                        return res.status(200).json({ success: true, message: 'Webhook received - invalid data' });
                    }

                    const userData = {
                        clerkId: data.id,
                        email: data.email_addresses[0].email_address,
                        firstName: data.first_name || '',
                        lastName: data.last_name || '',
                        photo: data.image_url || ''
                    };

                    // Check if user already exists
                    const existingUser = await userModel.findOne({ clerkId: data.id });
                    if (existingUser) {
                        console.log(`User already exists: ${data.id}`);
                        return res.status(200).json({ success: true, message: 'User already exists' });
                    }

                    const newUser = await userModel.create(userData);
                    console.log(`✅ User created successfully: ${data.id} - MongoDB ID: ${newUser._id}`);
                    return res.status(200).json({ success: true, message: 'User created' });
                } catch (dbError) {
                    console.error('❌ Database error creating user:', dbError.message);
                    // For duplicate key errors, still return success
                    if (dbError.code === 11000) {
                        console.log(`User already exists (duplicate key): ${data.id}`);
                        return res.status(200).json({ success: true, message: 'User already exists' });
                    }
                    // For other DB errors, return success to prevent Clerk retries
                    return res.status(200).json({ success: true, message: 'Webhook received' });
                }
            }

            case "user.updated": {
                try {
                    if (!data.id) {
                        console.error('Invalid update data - missing clerkId');
                        return res.status(200).json({ success: true, message: 'Webhook received - invalid data' });
                    }

                    const userData = {
                        email: data.email_addresses?.[0]?.email_address,
                        firstName: data.first_name || '',
                        lastName: data.last_name || '',
                        photo: data.image_url || ''
                    };

                    // Remove undefined values
                    Object.keys(userData).forEach(key => userData[key] === undefined && delete userData[key]);

                    const updatedUser = await userModel.findOneAndUpdate(
                        { clerkId: data.id },
                        userData,
                        { new: true, runValidators: true }
                    );

                    if (updatedUser) {
                        console.log(`✅ User updated successfully: ${data.id}`);
                        return res.status(200).json({ success: true, message: 'User updated' });
                    } else {
                        console.log(`⚠️ User not found for update: ${data.id}`);
                        return res.status(200).json({ success: true, message: 'User not found' });
                    }
                } catch (dbError) {
                    console.error('❌ Database error updating user:', dbError.message);
                    return res.status(200).json({ success: true, message: 'Webhook received' });
                }
            }

            case "user.deleted": {
                try {
                    if (!data.id) {
                        console.error('Invalid delete data - missing clerkId');
                        return res.status(200).json({ success: true, message: 'Webhook received - invalid data' });
                    }

                    const deletedUser = await userModel.findOneAndDelete({ clerkId: data.id });

                    if (deletedUser) {
                        console.log(`✅ User deleted successfully: ${data.id}`);
                        return res.status(200).json({ success: true, message: 'User deleted' });
                    } else {
                        console.log(`⚠️ User not found for deletion: ${data.id}`);
                        return res.status(200).json({ success: true, message: 'User not found' });
                    }
                } catch (dbError) {
                    console.error('❌ Database error deleting user:', dbError.message);
                    return res.status(200).json({ success: true, message: 'Webhook received' });
                }
            }

            default:
                // Acknowledge receipt of unknown event types
                console.log(`Unhandled webhook event type: ${type}`);
                return res.status(200).json({ success: true, message: 'Event received' });
        }
        
    } catch (error) {
        console.error('Webhook error:', error.message);
        console.error('Error stack:', error.stack);
        
        // Return proper error response
        return res.status(400).json({ 
            success: false, 
            message: 'Webhook error',
            error: error.message 
        });
    }
};

export { clerkwebhooks };