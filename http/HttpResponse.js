/* eslint-disable max-classes-per-file, lines-between-class-members */
const _ = require('lodash');
const statusCodes = require('../statusCodes.js');

const __DEFAULT_HEADERS__ = {
  'content-type': 'application/json'
};

class HttpResponse {
  statusCode;
  statusMessage;
  isBase64Encoded;
  headers = { ...__DEFAULT_HEADERS__ };
  body = {};
}

class HttpResponseBuilder {
  #response = new HttpResponse();

  constructor(statusCode = statusCodes.OK) {
    this.statusCode = statusCode;
  }

  static Ok() {
    return new HttpResponseBuilder(statusCodes.OK);
  }

  static Created() {
    return new HttpResponseBuilder(statusCodes.CREATED);
  }

  static BadRequest() {
    return new HttpResponseBuilder(statusCodes.BAD_REQUEST);
  }

  static NotFound() {
    return new HttpResponseBuilder(statusCodes.NOT_FOUND);
  }

  static ServerError() {
    return new HttpResponseBuilder(statusCodes.INTERNAL_SERVER_ERROR);
  }

  static Forbidden() {
    return new HttpResponseBuilder(statusCodes.FORBIDDEN);
  }

  static fromHttpError(httpError) {
    const builder = new HttpResponseBuilder(httpError.statusCode);
    builder.body = httpError.body;
    builder.addHeaders = httpError.headers;

    return builder;
  }

  set isBase64Encoded(isBase64Encoded) {
    this.#response.isBase64Encoded = isBase64Encoded;
  }

  set statusCode(statusCode) {
    this.#response.statusCode = statusCode;
  }

  statusMessage(msg) {
    this.#response.statusMessage = msg;
    return this;
  }

  set addHeaders(headers) {
    this.#response.headers = { ...this.#response.headers, ...headers };
  }

  addHeader(headerName, headerValue) {
    _.set(this.#response.headers, headerName, headerValue);
    return this;
  }

  get body() {
    return this.#response.body;
  }

  set body(body) {
    this.#response.body = body;
  }

  setBody(body) {
    this.body = body;
    return this;
  }

  build() {
    return this.#response;
  }

  toString() {
    return JSON.stringify(this.build());
  }
}

module.exports = {
  HTTP_STATUS_CODES: statusCodes,
  HttpResponse,
  HttpResponseBuilder,
};
