const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    registrationDate: {
        type: Date,
        default: Date.now
    },
    userStations: [mongoose.Schema.Types.ObjectId],
    favoriteStation: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    }
})

const User = mongoose.model('User', UserSchema)

module.exports = User