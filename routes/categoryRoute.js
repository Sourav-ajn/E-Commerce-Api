const Category = require('../models/categoryModel');
const express = require('express');
const router = express.Router();
const auth = require('./../utility/auth');

router.get(`/`, async (req, res) =>{
    const categories = await Category.find();

    if(!categories) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(categories);
})

router.get('/:id', async(req,res)=>{
    const category = await Category.findById(req.params.id);

    if(!category) {
        res.status(500).json({message: 'The category with the given ID was not found.'})
    } 
    res.status(200).send(category);
})

router.post('/', auth.authenticate, auth.authorize, async (req,res)=>{
    try {
        let category = new Category({
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color
        })
        category = await category.save();
    
        if(!category){
            res.status(400).send('the category cannot be created!')
        }
        res.send(category);        
    } catch (error) {        
        res.status(500).send()
    }
    
})

router.put('/:id',auth.authenticate, auth.authorize, async (req, res)=> {

    try {
        const category = await Category.findById(req.params.id)
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name || category.name,
                icon: req.body.icon || category.icon,
                color: req.body.color || category.color,
            },
            { new: true}
        )
        if(!category){
            res.status(400).send('the category cannot be updated')
        }
        res.send(updatedCategory);
    } catch (error) {
        res.status(500).send()
    }

})

router.delete('/:id', auth.authenticate, auth, auth.authorize, (req, res)=>{
    Category.findByIdAndRemove(req.params.id).then(category =>{
        if(category) {
            res.status(200).json({success: true, message: 'the category is deleted!'})
        } else {
            res.status(404).json({success: false , message: "category not found!"})
        }
    }).catch(err=>{
       res.status(500).json({success: false, error: err}) 
    })
})


module.exports =router;