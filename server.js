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

app.get('/', (req, res) => {
  models.Article.find({})
    .then(dbArticles => {
      res.render('index', { articles: dbArticles });
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/scrape', (req, res) => {

  var resultArr = [];

  axios.get('https://news.ycombinator.com')
    .then(response => {
      var $ = cheerio.load(response.data);

      $(".storylink").each(function (i, elem) {
        var result = {};
        result.title = $(this).text();
        result.link = $(this).attr('href');
        result.site = $(this).siblings('span').children('a').children('span').text();
        resultArr.push(result);
      });

      console.log('resultArr length 1:');
      console.log(resultArr.length); // 30

      models.Article.insertMany(resultArr)
        .then(newArticles => {
          console.log('scrape complete!');
          res.redirect('/');
        })
        .catch(err => {
          res.redirect('/');
          throw err;
        });

    })
    .catch(err => {
      res.send(err);
    });
});

app.get('/saved', (req, res) => {
  models.Article.find({ saved: true })
    .then(savedArticles => {
      res.render('saved', { articles: savedArticles });
    })
    .catch(err => {
      console.log(err);
    });
});


app.listen(port, () => {
  console.log(`App running on port ${port}`);
});