import jwt from 'jsonwebtoken';

// Middleware function to decode jwt token to get clerkId

const authUser = async (req,resizeBy,next) => {

    try{
        
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

export default authUser;
