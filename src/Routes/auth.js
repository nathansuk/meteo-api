const { EmailValidator } = require('../Helpers/AuthValidator')
const express = require('express')
const router = express.Router()
const User = require('../Models/User')
const mongoose = require("mongoose")
const validator = require('validator')
const bcrypt = require('bcrypt')


router.post('/login', (req, res) => {
    res.send('Bonjour')
})

router.post('/register', (req, res) => {

    const email = req.body.email
    const password = req.body.password
    const errors = []
    const saltRound = 10

    if(!validator.isEmail(email)) {
        errors.push('Adresse email invalide')
    }

    if(!validator.isStrongPassword(password)) {
        errors.push('Votre mot de passe doit contenir au moins 8 caractères, 1 symbole, 1 chiffre et 1 majuscule')
    }

    //Checker si l'utilisateur existe deja en bdd

    User.findOne({ email: email }).then(userExists => {

        if(userExists) {
            errors.push("Cette adresse email est déjà utilisée.")
        }

        if(errors.length > 0) {
            console.log("Error during register user")
            res.send({
                errors: errors
            })
            return
        }
    
        const user = new User({
            email, password
        })
    
        const hashedPassword = bcrypt.hashSync(password, saltRound)
        user.password = hashedPassword
    
        user.save().then(() => {
            console.log('User saved')
            res.json({
                email: email,
                password: hashedPassword
            })
        
        })
    })

    

})

module.exports = router