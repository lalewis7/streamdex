// import 
var express = require('express');
var app = express();
var cors = require('cors');
var config = require('./config.json');
var {getToken, log} = require('./auth.js');
var util = require('./util.js');

// import routes
const indexRouter = require('./routes/index.js');
const usersRouter = require('./routes/users.js');
const authRouter = require('./routes/auth.js');
const handleRouter = require('./routes/handle.js');
const titlesRouter = require('./routes/titles.js');
const seasonsRouter = require('./routes/seasons.js');
const episodesRouter = require('./routes/episodes.js');
const imageRouter = require('./routes/image.js');
const listRouter = require('./routes/list.js');
const pageRouter = require('./routes/page.js');
const botRouter = require('./routes/bot.js');
const taskRouter = require('./routes/task.js');
const linkRouter = require('./routes/link.js');
const queryRouter = require('./routes/query.js');
const snapshotRouter = require('./routes/snapshot.js');

// middleware
app.set('trust proxy', true);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
// app.use(express.static('public'));
app.use(log);
app.use(getToken);
// app.use(busboy());

// routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/handle', handleRouter);
app.use('/titles', titlesRouter);
app.use('/seasons', seasonsRouter);
app.use('/episodes', episodesRouter);
app.use('/images', imageRouter);
app.use('/lists', listRouter);
app.use('/pages', pageRouter);
app.use('/bot', botRouter);
app.use('/tasks', taskRouter);
app.use('/links', linkRouter);
app.use('/queries', queryRouter);
app.use('/snapshots', snapshotRouter);

// start server
app.listen(config.port, () => {
  util.logger().info('API listening at http://localhost:%s', config.port);
})

module.exports = app;