const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;

const routes = require('./routes');
const config = require('./config');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

MongoClient.connect(`${config.mongoUrl}/${config.baseName}`)
    .then(client => {
        routes(app, client.db(config.baseName));

        app.use('/', express.static(path.resolve(__dirname, 'app/dist')));
        app.use('*', express.static(path.resolve(__dirname, 'app/dist/index.html')));
        
        app.listen(config.appPort, () => {
            console.log(`Api is listening on http://localhost:${config.appPort}`);
        });
    })
    .catch(err => { console.error(err) });
