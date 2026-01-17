import express from 'express'
import { clerkwebhooks } from '../controllers/UserController'

const userRouter = express.Router()

userRouter.post('/webhooks',clerkwebhooks)

export default userRouter