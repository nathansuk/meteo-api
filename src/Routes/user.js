const express = require('express')
const router = express.Router()
const User = require('../Models/User')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const Station = require("../Models/Station")

const decodeToken = (token) => {
    try {

        let decodedToken = jwt.verify(token, 'clejwt')
        return decodedToken

    } catch(err) {
        return null
    }
}

async function findUserUsingToken(decodedToken) {

    const user = await User.findOne({ _id: decodedToken.userId }).populate('userStations')
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
        res.json(errors)
        return
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


router.post('/change-infos', async (req, res) => {


    const { token, firstName, lastName, email } = req.body
    const errors = []

    if(!token) {
        errors.push('Jeton inexistant.')
    }

    let decodedToken = decodeToken(token)

    if(!decodedToken) {
        errors.push('Jeton invalide')
    }

    if(!validator.isEmail(email)){
        errors.push("L'adresse email saisie est invalide.")
    }

    if(firstName.length <= 1) {
        errors.push("Prénom saisi invalide.")
    }

    if(lastName.length <= 1) {
        errors.push("Nom saisi invalide.")
    }

    if(errors.length > 0) {
        res.json({errors: errors})
        return
    }

    const user = await findUserUsingToken(decodedToken)

    if(!user) {
        errors.push('Utilisateur introuvable')
    }

    if(errors.length > 0) {
        res.json({errors: errors})
        return
    }

    user.firstName = firstName
    user.lastName = lastName
    user.email = email
    
    user.save()
    .then( () => {

        console.log("Utilisateur modifié.")
        res.json({
            message: "success"
        })
    })

    
})

function isIdPresent(data, id) {
    return data.some(obj => obj._id.toString() === id);
  }

router.post('/add-station', async (req, res) => {

    const { token, stationName } = req.body
    const errors = []

    if(!token) {
        errors.push('Jeton inexistant.')
    }

    let decodedToken = decodeToken(token)

    if(!decodedToken) {
        errors.push('Jeton invalide')
    }

    if(errors.length > 0) {
        res.json({
            errors: errors
        })
        return
    }

    const user = await findUserUsingToken(decodedToken)

    if(!user) {
        errors.push('Utilisateur introuvable')
    }

    const station = await Station.findOne({ stationName: stationName })
    
    if(!station){
        errors.push("Cette station n'existe pas")
        res.json({
            errors: errors
        })
        return
    }

    let userAlreadyHaveStation = false

    user.userStations.forEach(item => {
        if(item.stationName === stationName)
            userAlreadyHaveStation = true   
    })
    
    if(userAlreadyHaveStation) {
        errors.push("Vous possédez déjà cette station")
        res.json({
            errors: errors
        })
        return
    }

    user.userStations.push(station.id)
    user.save()
        .then(() => {
            res.json({
                message: "Success"
            })
        })

})

router.post('/fav-station', async(req, res) => {
    
    const { token, stationName } = req.body
    const errors = []

    if(!token) {
        errors.push('Jeton inexistant.')
    }

    let decodedToken = decodeToken(token)

    if(!decodedToken) {
        errors.push('Jeton invalide')
    }

    if(errors.length > 0) {
        res.json({
            errors: errors
        })
        return
    }

    const user = await findUserUsingToken(decodedToken)

    if(!user) {
        errors.push('Utilisateur introuvable')
    }

    let userAlreadyHaveStation = false

    user.userStations.forEach(item => {
        if(item.stationName === stationName)
            userAlreadyHaveStation = true   
    })

    if(!userAlreadyHaveStation) {
        errors.push('Erreur')
        res.json(errors)
        return
    }

    const station = await Station.findOne({ stationName: stationName })

    if(user.favoriteStation !== null && user.favoriteStation.toString() === station._id.toString()) {
        user.favoriteStation = null
        console.log(user.firstName + " a retiré la station " + station._id + "de ses favorites")
    }
    else {
        user.favoriteStation = station._id
        console.log(user.firstName + " a ajouté la station " + station._id + "comme favorite")
    }
    user.save()
        .then(()=> {
            console.log(user.favoriteStation)
            res.json({
                message: 'success'
            })
        })

})

module.exports = router