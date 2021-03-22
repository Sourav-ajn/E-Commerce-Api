const jsonwebtoken = require('jsonwebtoken')
const User = require('./../models/userModel')

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id})

        if (!user) {
            throw new Error('Please log in with valid credintial')
        }

        req.user = user
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please log in with valid credintial.' })
    }
}
const authorize=(req, res, next) => { 
      // roles ['admin', 'lead-guide']. role='user'
      if (!req.user.isAdmin){
        res.send(403).json({
            status: 'failed',
            message:'You do not have permission to perform this action'
        })
      }
  
      next();
    };

module.exports={
    authenticate,
    authorize
}
