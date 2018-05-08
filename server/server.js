
/* eslint consistent-return:0 */

import Express from 'express';
import path from 'path';
import logger from './logger';
import port from './port';

import frontendSetup from './middlewares/frontendMiddleware';
import backendSetup from './middlewares/backendMiddleware';
const resolve = path.resolve;
const app = new Express();

backendSetup(app);

// In production we need to pass these values in instead of relying on webpack
frontendSetup(app, {
    outputPath: resolve(process.cwd(), 'build'),
    publicPath: '/'
});

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    res.status(500).send({ error: (err && err.message) || 'Something went wrong on the server' });
});


// get the intended host and port number, use localhost and port 3000 if not provided
const host = process.env.HOST || null; // Let http.Server use its default IPv6/4 host
const prettyHost = process.env.HOST || 'localhost';

// Start your app.
app.listen(port, host, (err) => {
    if (err) {
        return logger.error(err.message);
    }

    logger.appStarted(port, prettyHost);
});
