const express = require('express')
const router = express.Router()
const User = require('../Models/User')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")

const decodeToken = (token) => {
    try {

        let decodedToken = jwt.verify(token, 'clejwt')
        return decodedToken

    } catch(err) {
        return null
    }
}

async function findUserUsingToken(decodedToken) {

    const user = await User.findOne({ _id: decodedToken.userId })
    return user
}

router.get('/get/:token', async (req, res) => {

    const token = req.params.token
    const errors = []

    if(!token) {
        errors.push('Jeton inexistant.')
    }
    
    let decodedToken = decodeToken(token)

    if(!decodedToken) {
        errors.push("Jeton invalide.")
    }

    const user = await findUserUsingToken(decodedToken)

    if(!user) {
        errors.push('Utilisateur introuvable')
    }

    if(errors.length > 0) {
        res.json(errors)
        return
    }

    res.json(user)
})

router.post('/change-password', async (req, res) => {


    const { token, oldPassword, newPassword, confirmationPassword } = req.body
    const errors = []

    if(!token) {
        errors.push('Jeton inexistant.')
    }

    let decodedToken = decodeToken(token)

    if(!decodedToken) {
        errors.push('Jeton invalide')
    }

    if(errors.length > 0) {
        res.json(errors)
        return
    }

    const user = await findUserUsingToken(decodedToken)

    if(!user) {
        errors.push('Utilisateur introuvable')
    }

    console.log(user)

    bcrypt.compare(oldPassword, user.password, function(error, result) {

        if(!result) {
            errors.push("Mot de passe incorrect.")
        }

        if(!validator.isStrongPassword(newPassword)) {
            errors.push('Votre mot de passe doit contenir au moins 8 caractères, 1 symbole, 1 chiffre et 1 majuscule.')
        }

        if(newPassword !== confirmationPassword) {
            errors.push('Les mots de passes ne correspondent pas.')
        }

        if(errors.length > 0) {
            res.json(errors)
            return
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 10)
        user.password = hashedPassword

        user.save()
        .then( () => {

            console.log('Mot de passe modifié')
            res.json({
                message: "Success"
            })

        })





    })







})

module.exports = router