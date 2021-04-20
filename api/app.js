// import 
var express = require('express');
var app = express();
var cors = require('cors');
var config = require('./config.js');
var auth = require('./auth.js');
var util = require('./util.js');

// import routes
var indexRouter = require('./routes/index.js');
var usersRouter = require('./routes/users.js');
var authRouter = require('./routes/auth.js');
var handleRouter = require('./routes/handle.js');
var selfRouter = require('./routes/self.js');
var titleRouter = require('./routes/title.js');

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
app.use('/self', selfRouter);
app.use('/title', titleRouter);

// start server
app.listen(config.port, () => {
  util.logger().info('API listening at http://localhost:%s', config.port);
})

module.exports = app;