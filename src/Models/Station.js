const mongoose = require("mongoose")

const StationSchema = new mongoose.Schema({
    
    serialNumber: String,
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
})

const Station = mongoose.model('Station', StationSchema)

module.exports = Station