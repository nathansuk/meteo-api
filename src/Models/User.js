const mongoose = require("mongoose")
const { StationSchema } = require("./Station")

const UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    registrationDate: {
        type: Date,
        default: Date.now
    },
    userStations: [{type: mongoose.Schema.Types.ObjectId, ref: 'Station'}],
    favoriteStation: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    }
})

const User = mongoose.model('User', UserSchema)
const Station = mongoose.model('Station', StationSchema)

module.exports = User