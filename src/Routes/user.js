const express = require('express')
const router = express.Router()
const User = require('../Models/User')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")

router.get('/get/:token', async (req, res) => {

    const token = req.params.token
    const errors = []

    if(!token) {
        errors.push('Token invalide')
    }
    
    let decodedToken = ''
    
    try {
        decodedToken = jwt.verify(token, 'clejwt')
        console.log(decodedToken)
    } catch(err) {
        errors.push("Jeton invalide : " + err)
    }

    if(errors.length === 0) {
        const user = await User.findOne({ _id: decodedToken.userId })
    
        if(!user) {
            errors.push('Utilisateur introuvable')
        }

        if(errors.length > 0) {
            res.json(errors)
            return
        }

        console.log(user)
        res.json(user)
    }
})

module.exports = router