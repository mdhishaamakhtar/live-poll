const express = require('express');
const compression = require('compression');
const cors = require('cors');
const morgan = require('./logging/morgan');
const routes = require('./routes');

const app = express();

// Middlewares
app.use(express.json());
app.use(compression());
app.use(cors());

// Run Migrations
require('./models/user');
require('./models/poll');
require('./models/choices');
require('./models/relations');

// Logging
app.use(morgan);

// Mount routes
app.use('/', routes);
app.use('/api/user', require('./routes/user'));
app.use('/api/poll', require('./routes/poll'));

module.exports = app;
