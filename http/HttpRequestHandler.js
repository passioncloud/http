const _ = require('lodash');
const logger = console;
const {
  attachLogger,
  authenticate,
  decodeAuthToken,
  populateUserContext,
  bodyParser,
  initializeNamespace,
  populateRequestId,
} = require('../middleware');
const { Exception } = require('../exceptions');

// default middleware
const initials = [initializeNamespace, populateRequestId, attachLogger];
const authenticators = [];
const validators = [bodyParser];
const authorizors = [];
const general = [];

class HttpRequestHandler {
  initials = [];

  authenticators = [];

  validators = [];

  authorizors = [];

  general = [];

  logger = logger;

  isPublic = false;

  get defaultAuthenticators() {
    if (this.isPublic) return authenticators;

    return [decodeAuthToken, authenticate, populateUserContext, ...authenticators];
  }

  get handler() {
    return [
      ..._.uniqBy([...initials, ...this.initials], 'name'),
      ..._.uniqBy([...this.defaultAuthenticators, ...this.authenticators], 'name'),
      ..._.uniqBy([...validators, ...this.validators], 'name'),
      ..._.uniqBy([...authorizors, ...this.authorizors], 'name'),
      ..._.uniqBy([...general, ...this.general], 'name'),
      this._handler.bind(this),
    ];
  }

  async _handler(req, res, next) {
    try {
      this.logger = req.punchlst.logger;
      const { statusCode, headers, body } = await this.process(req);
      res.status(statusCode).header(headers).json({ payload: body });
    } catch (err) {
      await this.handleError(err, res, next);
    }
  }

  async handleError(err, res, next) {
    err = await this.onError(err);

    switch (err?.constructor.name) {
      case 'HttpResponse':
        this.logger.error('unhandled error', err);
        return res.status(err.statusCode).json({ payload: { error: err.body } });
      default:
        this.logger.error('unhandled error', err);
        return res.status(500).json({ payload: { error: 'Unexpected Error' } });
    }
  }

  // override method to implement custom implementation
  async process(req) {
    const route = `${req.method}: ${req.route?.path}`;
    Exception.reportHttpHandlerNotImplemented(route);
  }

  // override method to implement custom implementation
  // for handled errors, please wrap them in an HttpResponse with appropriate status code otherwise a generic 500 erro
  // will be sent back
  async onError(err) {
    return err;
  }
}

module.exports = { HttpRequestHandler };
