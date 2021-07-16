// import 
var express = require('express');
var app = express();
var cors = require('cors');
var config = require('./config.json');
var auth = require('./token_auth.js');
var util = require('./util.js');

// import routes
const indexRouter = require('./routes/index.js');
const usersRouter = require('./routes/users.js');
const authRouter = require('./routes/auth.js');
const handleRouter = require('./routes/handle.js');
const titlesRouter = require('./routes/titles.js');
const seasonsRouter = require('./routes/seasons.js');
const episodesRouter = require('./routes/episodes.js')

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(auth);

// routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/handle', handleRouter);
app.use('/titles', titlesRouter);
app.use('/seasons', seasonsRouter);
app.use('/episodes', episodesRouter);

// start server
app.listen(config.port, () => {
  util.logger().info('API listening at http://localhost:%s', config.port);
})

module.exports = app;