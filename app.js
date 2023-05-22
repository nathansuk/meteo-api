const express = require('express')
const expressLayouts = require('ejs')
const mongoose = require('mongoose')
const app = express()
const router = express.Router()
const port = 8080
const bodyParser = require('body-parser');

const auth = require('./src/Routes/auth')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());// for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => {
    res.send('Hello World')
})

async function main() {
    mongoose.connect('mongodb://127.0.0.1:27017/meteo')
}

main().catch(error => console.log(error))

app.use('/auth', auth)

app.set('view engine', 'ejs');


app.use((err, req, res, next) => {
    res.locals.error = err;
    const status = err.status || 500;
    res.status(status);
    res.render('error');
  });

app.listen(port, () => {
    console.log('Server started, listening on port ' + port)
})