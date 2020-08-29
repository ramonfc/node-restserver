require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();


const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


////rutas:
app.use(require('./routes/index.js'));



mongoose.connect(process.env.URLDB, { useNewUrlParser: true, createIndexes: true, useUnifiedTopology: true },
    (err, resp) => {
        if (err) throw err;

        console.log('base de datos online');
    });


app.listen(process.env.PORT, () => {
    console.log('escuchando puerto: ', process.env.PORT);
})