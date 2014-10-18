// dependencies
var http = require('http');
var express = require('express');
var mongoose = require('mongoose');
var redis = require('redis');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var cookieParser = require('cookie-parser');
var hbs = require('hbs');
var passport = require('passport');
var socketio = require('socket.io')();
var app = express();

// config and setup helpers
var helpers = require('./helpers')();
var config = require('./config');
var setup = require('./setup');

// pubsub
var rpc = setup.pubsub(redis, config);

// setup session store
var sessionStore = setup.sessions(RedisStore, session, config);

// setup application
setup.db(mongoose, config);
setup.registerPartials('./views/partials/', hbs);
setup.registerHelpers(helpers.handlebars, hbs);

// configure express
setup.configureExpress({
    express: express,
    passport: passport,
    handlebars: hbs,
    session: session,
    store: sessionStore,
    cookieParser: cookieParser,
    dir: __dirname
}, app, config);

// http and socket.io server(s)
var server = http.createServer(app);
var io = socketio.attach(server);

// configure socket.io
setup.configureSockets(io, config, {
    cookieParser: cookieParser,
    sessionStore: sessionStore
});

// app dependencies (app specific)
var ipc = require('./modules/ipc')(0);
var mailer = require('./modules/mailer')(config);
var models = require('./models')(mongoose, helpers.validators);
var services = require('./services')(models, helpers, ipc, rpc);
var handlers = require('./handlers')(passport, services, config);
var authentication = require('./modules/authentication')(models, mailer);

// pubsub
require('./modules/pubsub')(rpc, ipc);

// app specific modules
require('./modules/sockets')(io, ipc);
require('./modules/passport')(passport, config, authentication, models);
require('./routes')(app, express, handlers, config);

// express error handling
setup.handleExpressError(app);

// run application
setup.run(server, config);
