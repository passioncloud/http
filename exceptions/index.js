const _ = require('lodash');

// General application errors
const application = {
  INVALID_ROUTER_INSTANCE_ERROR: 'INVALID_ROUTER_INSTANCE_ERROR',
  NO_ACCESS_TO_TENANT_ERROR: 'NO_ACCESS_TO_TENANT_ERROR',
  NEW_USERS_RESTRICTED_PROJECT_ACCESS_ERROR: 'NEW_USERS_RESTRICTED_PROJECT_ACCESS_ERROR',
  PROJECT_MISSING_SERIAL_TRACKER: 'PROJECT_MISSING_SERIAL_TRACKER',
  OPERATION_NOT_PERMITTED_ERROR: 'OPERATION_NOT_PERMITTED_ERROR',
  INVALID_TASK_STATUS_ERROR: 'INVALID_TASK_STATUS_ERROR',
  INVALID_USER_LOGIN_CREDENTIALS_ERROR: 'INVALID_USER_LOGIN_CREDENTIALS_ERROR',
};

// Domain errors
const domain = {
  MISSING_SQL_FILE_ERROR: 'MISSING_SQL_FILE_ERROR',
  NO_DB_RECORD_FOUND_EXCEPTION: 'NO_DB_RECORD_FOUND_EXCEPTION',
  INVALID_DB_ATTRIBUTES_WHITELIST_PRESET: 'INVALID_DB_ATTRIBUTES_WHITELIST_PRESET',
  INVALID_REPO_OPTIONS_ERROR: 'INVALID_REPO_OPTIONS_ERROR',
  NO_SERIAL_RECORD_FOUND_ERROR: 'NO_SERIAL_RECORD_FOUND_ERROR',
};

// Http errors
const http = {
  HANDLER_NOT_IMPLEMENTED_ERROR: 'HANDLER_NOT_IMPLEMENTED_ERROR',
  MISSING_AUTHENTICATION_TOKEN_ERROR: 'MISSING_AUTHENTICATION_TOKEN_ERROR',
};

class Exception extends Error {
  code = 500;

  static reportInvalidRouter(router) {
    if (!_.isObject(router)) return;

    const error = new Exception('Invalid router instance');
    error.name = application.INVALID_ROUTER_INSTANCE_ERROR;
    throw error;
  }

  static reportHttpHandlerNotImplemented(route) {
    const error = new Exception(`Handler for route:${route} not implemented`);
    error.name = http.HANDLER_NOT_IMPLEMENTED_ERROR;
    throw error;
  }

  static reportMissingAuthenticationToken(token) {
    if (!_.isEmpty(token)) return;

    const error = new Exception('Missing/Invalid authentication token');
    error.name = application.MISSING_AUTHENTICATION_TOKEN_ERROR;
    throw error;
  }

  static reportMissingSQLFile(err, filename) {
    if (err.code !== 'ENOENT') return;

    const error = new Exception(`${filename} file does not exist`);
    error.name = domain.MISSING_AUTHENTICATION_TOKEN_ERROR;
    throw error;
  }

  static reportNoDbRecordFound(model, entityName) {
    if (!_.isEmpty(model)) return model;

    const error = new Exception(`No ${entityName} record found`);
    error.name = domain.NO_DB_RECORD_FOUND_EXCEPTION;
    throw error;
  }

  static reportNoSerialRecordFound(data) {
    if (!_.isEmpty(data)) return data;

    const error = new Exception(`No serial record found`);
    error.name = domain.NO_SERIAL_RECORD_FOUND_ERROR;
    throw error;
  }

  static reportProjectMissingSerialTracker(projectId, type, err) {
    if (err.name !== domain.NO_SERIAL_RECORD_FOUND_ERROR) return;

    const error = new Exception(`No "${type}" serial record associated with project=${projectId}`);
    error.name = application.PROJECT_MISSING_SERIAL_TRACKER;
    throw error;
  }

  static reportInvalidDbAttributesWhitelistPreset(preset, whitelist) {
    if (!_.isEmpty(whitelist)) return whitelist;

    const error = new Exception(`DB attributes whitelist preset=${preset} does not exist`);
    error.name = domain.INVALID_DB_ATTRIBUTES_WHITELIST_PRESET;
    throw error;
  }

  static reportInvalidRepoOptions(validationResult) {
    if (_.isEmpty(validationResult.error)) return validationResult.value;

    const message = validationResult.error.details.reduce((out, err) => {
      out += `${err.message}\n`;
      return out;
    }, '\n');

    const error = new Exception(`Invalid repo options. ${message}`);
    error.name = domain.INVALID_REPO_OPTIONS_ERROR;
    throw error;
  }

  static reportNotPermittedToOpenTasks(user) {
    const error = new Exception(`User=${user?.id} is not permitted to create tasks`);
    error.name = application.OPERATION_NOT_PERMITTED_ERROR;
    throw error;
  }

  static reportInvalidTaskStatus(id, status) {
    const error = new Exception(`Invalid/empty task status for task=${id}, status=${status}`);
    error.name = application.INVALID_TASK_STATUS_ERROR;
    throw error;
  }

  static reportNoAccessToTenant(privateKey, accountId) {
    if (!_.isEmpty(privateKey)) return;

    const error = new Exception(`You do not have access to tenantId:${accountId}`);
    error.name = application.NO_ACCESS_TO_TENANT_ERROR;
    throw error;
  }

  // throw when trying to add a user to a project not meeting the criteria i.e
  // user id doesn't exist in the accounts_users table
  // account id associated with the user id doesn't exist in the service_provider table
  static reportNewUsersRestrictedProjectAccess(invalidUserIds, tenantId, projectId) {
    if (_.isEmpty(invalidUserIds)) return;

    const userIds = invalidUserIds.reduce((out, id) => {
      out += `${id},`;
      return out;
    }, '');

    const error = new Exception(
      `Invalid user ids can not be granted access to projectId=${projectId}, tenantId=${tenantId}, userIds=[${userIds}]`
    );

    error.name = application.NEW_USERS_RESTRICTED_PROJECT_ACCESS_ERROR;
    throw error;
  }

  static reportInvalidUserLoginCredentials(err) {
    if (err.code !== 'NotAuthorizedException') return;

    const error = new Exception(`Invalid username or password`);
    error.name = application.INVALID_USER_LOGIN_CREDENTIALS_ERROR;
    throw error;
  }
}

module.exports = { application, domain, http, Exception };
