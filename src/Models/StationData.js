const mongoose = require('mongoose')

const stationDataSchema = new mongoose.Schema({

    stationId: {
        type: String,
        required: true
    },
    dataDate: {
        type: Date,
        required: true
    },
    datas: {
        type: Object,
        required: true
    }

})

const StationData = mongoose.model("StationData", stationDataSchema)
module.exports = StationData