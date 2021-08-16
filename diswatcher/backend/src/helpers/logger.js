const winston = require('winston');
const config = require('./config');

const { format } = winston;

const getTransports = () => {
  const activeTransports = [
    new winston.transports.Console({
      level: config.get('NODE_ENV') === 'test' ? 'emerg' : 'debug',
    }),
    new winston.transports.File({
      filename: './logs/error.log',
      level: 'debug',
    }),
  ];

  return activeTransports;
};

const logger = winston.createLogger({
  format: format.combine(
    format.errors({ stack: true }),
    format.timestamp(),
    format.json(),
  ),
  transports: getTransports(),
});

const loggingWrapper = () => {
  class LoggingWrapper {
    static formatMessage(level, message, label, tid) {
      return {
        level,
        label,
        message,
        tid,
      };
    }

    static error(message, label, tid) {
      logger.log(LoggingWrapper.formatMessage('error', message, label, tid));
    }

    static warn(message, label, tid) {
      logger.log(LoggingWrapper.formatMessage('warn', message, label, tid));
    }

    static info(message, label, tid) {
      logger.log(LoggingWrapper.formatMessage('info', message, label, tid));
    }

    static debug(message, label, tid) {
      logger.log(LoggingWrapper.formatMessage('debug', message, label, tid));
    }
  }

  return LoggingWrapper;
};

module.exports = loggingWrapper();
