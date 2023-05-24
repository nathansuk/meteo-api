const express = require('express')
const router = express.Router()
const User = require('../Models/User')
const validator = require('validator')
const bcrypt = require('bcrypt')


router.post('/login', (req, res) => {
    res.send('Bonjour')
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