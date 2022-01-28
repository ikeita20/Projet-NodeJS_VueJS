const winston = require('winston');

const logger = () => {
    const logger = winston.createLogger({
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        format: winston.format.json(),
        transports: [
          new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
          new winston.transports.File({ filename: 'logs/combined.log' }),
        ],
    });

    if (process.env.NODE_ENV !== 'production') {
        logger.add(new winston.transports.Console({
            format: winston.format.simple(),
        }));
    }

    return logger
}

module.exports = {

    info: (message) => {
        logger().info(message)
    },

    debug: (message) => {
        logger().debug(message)
    },

    error: (message) => {
        logger().error(message)
    },

    infoRequest: (req) => {
        logger().info(req.method + ' - ' + req.path)
    }
    
}