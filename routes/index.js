var express = require('express');
var router = express.Router();

var pgp = require('pg-promise')(/* options */);

const db = pgp({
  connectionString: process.env.DATABASE_URL || DATABASE_URL,
  ssl: true,
  dialectOptions: {
    ssl: { require: true },
  },
});

const blogPosts = [
  { 
    title: 'Welcome to DigitalOcean App Platform',
    createdat: '2020-12-5',
    body: 'App Platform will automatically analyze your code on GitHub, create build artifacts (in the form of containers), and publish your application to the cloud. It also has lifecycle management features, vertical and horizontal scaling, push-to-deploy support, introspection and monitoring features, built-in database management and integration – everything a developer needs to get their code live in production.',
    author: 'digitalocean.com'
  },
];

db.none('CREATE TABLE IF NOT EXISTS posts (title char(200), createdat date default CURRENT_DATE, body char(1000), author char(100))')
  .then(function (data) {
    console.log('this was created');
    blogPosts.map((post) => {
      db.none('INSERT INTO posts (title, createdat, body, author) VALUES ($1, $2, $3, $4)', [
        post.title,
        post.createdat,
        post.body,
        post.author
      ]);
    });
  })
  .catch(function (error) {
    console.log(error);
  });

router.get('/', function (req, res) {
  res.json({ title: 'welcome home' });
});

router.get('/posts', function (req, res) {
  db.query('SELECT * FROM posts')
    .then(function (data) {
      res.json({ posts: data });
    })
    .catch(function (error) {
      console.log('Error', error);
      res.json({ error: error });
    });
});

module.exports = router;
