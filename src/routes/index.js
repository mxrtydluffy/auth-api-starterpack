const express = require('express')
const messageRoutes = require('../models/message')
const userRoutes = require('../models/user')

const router = express.Router()

router.use('/messages', messageRoutes)
router.use('/users', userRoutes)

module.exports = router