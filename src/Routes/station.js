const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const StationData = require('../Models/StationData')

router.get('/data/:stationId', async(req, res) => {

    const stationId = req.params.stationId
    const errors = []

    const datas = await StationData.find({ stationId: stationId })
    
    if(!datas)
    {
        errors.push("Aucune donnée trouvée")
        res.json(errors)
        return
    }

    res.json(datas)




})

module.exports = router
