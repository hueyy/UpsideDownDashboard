import pino from 'pino'

const logger = pino()

class Error {
  static captureError = (error: Error): void => {
    logger.error(error)
  }
}

export default Error