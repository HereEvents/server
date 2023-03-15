const express = require('express'),
router = express.Router()
const { getSetting } = require('../BL/setting.services')

router.get('', async (req,res)=>{
    try {
       const data = await getSetting(req.body)
       res.send(data)
    } catch(err) {
        console.log(err);
    }
})

router.get('/categories', async (req,res)=>{
    try {
        const data = await getSetting({name: 'category'})
        res.send(data)
    } catch(err) {
        console.log(err);
    }
})

router.get('/audiences', async (req,res)=>{
    try {
        const data = await getSetting({name: 'audience'})
        res.send(data)
    } catch(err) {
        console.log(err);
    }
})

module.exports = router
