const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const StationData = require('../Models/StationData')

router.get('/data/:stationId/:year-:month-:day', async(req, res) => {

    const {stationId, year, month, day} = req.params
    const errors = []

    console.log("Récupération des données du : " + year + " / " + month + " / " + day)

    const startOfDay = new Date(Date.UTC(year, month, day, 0, 0, 0, 0)); 
    const endOfDay = new Date(Date.UTC(year, month, day, 23, 59, 59, 999)); 

    const datas = await StationData.find({ 
        stationId: stationId,
        dataDate: { $gte: startOfDay, $lt: endOfDay }
    }).lean()
    
    if(!datas)
    {
        errors.push("Aucune donnée trouvée")
        res.json(errors)
        return
    }

    console.log("Nombre de données récupérées : " + datas.length)
    res.json(datas)


})

module.exports = router
