/* eslint-disable */
const webpackConfig = require('../../internals/webpack/webpack.dev.babel');
const addProdMiddlewares = require('./addProdMiddlewares');
import addDevMiddlewares from './addDevMiddlewares';

/**
 * Front-end middleware
 */
export default (app, options) => {
    const isProd = process.env.NODE_ENV === 'production';

    if (isProd) {
        addProdMiddlewares(app, options);
    }
    else {
        addDevMiddlewares(app, webpackConfig);
    }

    return app;
};

/* eslint-enable */
