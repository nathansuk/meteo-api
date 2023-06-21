const mongoose = require("mongoose")

const StationSchema = new mongoose.Schema({
    stationName: String
})

const Station = mongoose.model('Station', StationSchema)

module.exports = Station