const User = require('../models/userModel');
const express = require('express');
const router = express.Router();
const auth = require('./../utility/auth');

router.get(`/`, auth.authenticate, auth.authorize, async (req, res) =>{
    const users = await User.find();

    if(!users) {
        res.status(500).json({success: false})
    } 
    res.send(users);
});

router.get('/me', auth.authenticate, async(req,res)=>{
    try {
        const user = await User.findById(req.params.id).select('-passwordHash');
    
        if(!user) {
            res.status(404).json({message: 'The user does not exist.'})
        } 
        res.status(200).send(user);
        
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
})

router.post('/register', async (req,res)=>{
    try {
        let user = new User({
            name: req.body.name,
            email: req.body.email,
            passwordHash: bcrypt.hashSync(req.body.password, 10),
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country,
        })
        user = await user.save();
    
        if(!user){
            res.status(400).send('the user cannot be created!')
        }
        const secret = process.env.JWT_SECRET;
        const token = jwt.sign(
            {
                userId: user._id,
                isAdmin: user.isAdmin
            },
            secret,
            {expiresIn : '1d'}
        )
    
        res.send({user,token});
        
    } catch (error) {
        res.status(500).json({
            err: "Server error"
        })
    }
    
})

router.post('/login', async (req,res) => {
    try {
        const user = await User.findByCredntial(req.body.email,req.body.password)
        const secret = process.env.JWT_SECRET;
        const token = jwt.sign(
            {
                userId: user._id,
                isAdmin: user.isAdmin
            },
            secret,
            {expiresIn : '1d'}
        )
        res.status(200).send({user,token})
    } catch (err){
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
})

router.put('/update/me', auth.authenticate, auth.authorize, async (req, res)=> {
    try {
        
            const user= await User.findById(req.user._id);
            let newPassword
            if(req.body.password) {
                newPassword = bcrypt.hashSync(req.body.password, 10)
            } else {
                newPassword = userExist.passwordHash;
            }
        
            const updatedUser = await User.findByIdAndUpdate(
                req.user._id,
                {
                    name: req.body.name || user.name,
                    email: req.body.email || user.email,
                    phone: req.body.phone || user.phone,
                    street: req.body.street || user.street,
                    apartment: req.body.apartment || user.apartment,
                    zip: req.body.zip || user.zip,
                    city: req.body.city || user.city,
                    country: req.body.country || user.country,
                },
                { new: true}
            )
        
            if(!updatedUser){
                return res.status(400).send('the user cannot be created!')
            }
            res.send(updatedUser);
        
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
})

router.get(`/get/count`, auth.authenticate, auth.authorize, async (req, res) =>{
    try {
        const userCount = await User.countDocuments((count) => count)
    
        if(!userCount) {
            res.status(500).json({success: false})
        } 
        res.send({
            userCount: userCount
        });
        
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
})



module.exports =router;