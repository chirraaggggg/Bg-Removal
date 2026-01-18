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

        // Ensure database is connected
        if (mongoose.connection.readyState !== 1) {
            console.error('Database not connected');
            return res.status(503).json({ success: false, message: 'Database not ready' });
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
                const userData = {
                    clerkId: data.id,
                    email: data.email_addresses[0].email_address,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    photo: data.image_url
                };
                
                await userModel.create(userData);
                console.log(`User created: ${data.id}`);
                return res.status(200).json({ success: true, message: 'User created' });
            }

            case "user.updated": {
                const userData = {
                    email: data.email_addresses[0].email_address,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    photo: data.image_url
                };
                
                await userModel.findOneAndUpdate({ clerkId: data.id }, userData);
                console.log(`User updated: ${data.id}`);
                return res.status(200).json({ success: true, message: 'User updated' });
            }

            case "user.deleted": {
                await userModel.findOneAndDelete({ clerkId: data.id });
                console.log(`User deleted: ${data.id}`);
                return res.status(200).json({ success: true, message: 'User deleted' });
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