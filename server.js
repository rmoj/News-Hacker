const express = require('express')
  , exphbs = require('express-handlebars')
  , bodyParser = require('body-parser')
  , axios = require('axios')
  , logger = require('morgan')
  , cheerio = require('cheerio')
  , mongoose = require('mongoose');

const port = process.env.PORT || 3000;

const models = require('./models');

const app = express();

app.engine('.hbs', exphbs({ extname: '.hbs', defaultLayout: 'main' }));
app.set('view engine', '.hbs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.static('public'));

mongoose.Promise = Promise;
var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/mongoHeadlines';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to Mongo database');
  })
  .catch(err => {
    console.error(err);
  });

