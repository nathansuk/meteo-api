const express = require('express')
const router = express.Router()
const User = require('../Models/User')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")


router.post('/login', (req, res) => {
    console.log("Login attempt")
    const email = req.body.email
    const password = req.body.password
    const errors = []

    User.findOne({email: email})
    .then( user => {

        if(!user) {
            errors.push("L'adresse email ne correspond à aucun compte.")
            return
        }

        bcrypt.compare(password, user.password, function(error, result) {
            
            if(!result) {
                errors.push("Mot de passe incorrect.")
            }

            if(errors.length > 0) {
                res.json({
                    errors: errors
                })
                return
            }
            
            const token = jwt.sign({userId : user.id}, 'clejwt', { expiresIn: '1h' })
            res.json({
                token: token
            })

        })



    })


})

router.post('/register', (req, res) => {

    const email = req.body.email
    const password = req.body.password
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    
    const errors = []
    const saltRound = 10

    if(!validator.isAlpha(firstName) || !validator.isAlpha(lastName)) {
        errors.push("Votre nom ou prénom est invalide")
    }

    if(!validator.isEmail(email)) {
        errors.push('Adresse email invalide')
    }

    if(!validator.isStrongPassword(password)) {
        errors.push('Votre mot de passe doit contenir au moins 8 caractères, 1 symbole, 1 chiffre et 1 majuscule')
    }


    User.findOne({ email: email }).then(userExists => {

        if(userExists) {
            errors.push("Cette adresse email est déjà utilisée.")
        }

        if(errors.length > 0) {
            res.send({
                errors: errors
            })
            return
        }
    
        const user = new User({
            firstName, lastName, email, password
        })
    
        const hashedPassword = bcrypt.hashSync(password, saltRound)
        user.password = hashedPassword
    
        user.save()
        
        .then(() => {
            console.log('User saved')
            res.json({
                email: email,
                password: hashedPassword
            })
        
        })
    })

    

})

module.exports = router