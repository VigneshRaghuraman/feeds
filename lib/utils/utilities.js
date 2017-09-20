/**
 * Created by jaya on 25/08/15.
 */
"use strict";

const utilities    = {};

const Boom         = require('boom');
const joi          = require('joi');
const async        = require('async');
const _            = require('underscore');
const moment       = require('moment');


utilities.cloneObject = function (object) {
    return JSON.parse(JSON.stringify(object));
};

utilities.encryptString = function (code) {
    try {
        return cryptr.encrypt(code);
    } catch (ex) {
        return "";
    }
};


utilities.decryptString = function (code) {
    try {
        return cryptr.decrypt(code);
    } catch (ex) {
        return "";
    }
};


utilities.buildSuccessResponse = function (successObj) {
    var response = {
        "statusCode": successObj.code,
        "message"   : successObj.message
    };
    return response;
};


utilities.buildErrorResponse = function (errorObj, resMsgObj) {
    if (errorObj.code < 400) {
        errorObj.code = 400
    }

    var error = Boom.create(errorObj.code, errorObj.message);
    error.reformat();
    var obj = {
        statusCode: errorObj.code,
        message   : errorObj.message
    };

    if (resMsgObj && resMsgObj[errorObj.id]) {
        obj.statusCode = resMsgObj[errorObj.id].code;
        obj.message    = resMsgObj[errorObj.id].message;
    }
    error.output.payload = obj;

    return error;
};


utilities.modelMethodInvoker = function (controllerRequest, callback) {

    try {
        console.log('NAME: ' + controllerRequest.methodName + ' REQUEST: ' , ' payload : ', JSON.stringify(controllerRequest.payload));

        var task   = [];
        var reqObj = {};

        if (controllerRequest.requestPayloadSchema) {
            task.push(function (innerCb) {

                    validateSchema(controllerRequest, controllerRequest.requestPayloadSchema, {stripUnknown: true}, function (err, validatedObj) {
                        if (!err) {
                            reqObj.payload = validatedObj.payload;
                            return innerCb();
                        }
                        else {
                            if (!err) {
                                err = 'joi validation Error';
                            }
                            console.log('NAME: ' + controllerRequest.methodName + ', RESPONSE: Payload' + JSON.stringify(err));
                            return innerCb(err.toString());
                        }
                    })
                }
            )
            ;
        }
        else {
            reqObj.payload = controllerRequest
        }

        async.series(task, function (err, result) {
            if (!err) {
                controllerRequest.method(reqObj, function (err, result) {
                    if (!err) {
                        var response;
                        if (reqObj.modelId && reqObj.apiId) {
                            response = _.extend(utilities.buildSuccessResponse(RESP_MSG[reqObj.modelId][reqObj.apiId].RES_SUCCESS), result);
                        } else {
                            response = result;
                        }

                        if (response.message && typeof response.message != "string") {
                            if (reqObj.auth && reqObj.auth.langId) {
                                var msg          = _.findWhere(response.message, {id: reqObj.auth.langId});
                                response.message = msg && msg.message ? msg.message : response.message[0].message;
                            } else {
                                response.message = response.message[0].message;
                            }
                        }

                        if (controllerRequest.responseSchema) {
                            validateSchema(response, controllerRequest.responseSchema, {stripUnknown: true}, function (err, validatedResponse) {
                                if (!err) {
                                    console.log('NAME: ' + controllerRequest.methodName + ', RESPONSE:' + JSON.stringify(validatedResponse));
                                    if (controllerRequest.meta) {
                                        validatedResponse.meta = controllerRequest.meta;
                                        validatedResponse.meta = {
                                            type: 'RESPONSE'
                                        }
                                    }
                                    //LOGGER.storeLogs({logs: validatedResponse})
                                    return callback(null, validatedResponse);
                                } else {
                                    console.log('NAME: ' + controllerRequest.methodName + ', RESPONSE:' + JSON.stringify(err));
                                    if (controllerRequest.meta) {
                                        err.meta      = controllerRequest.meta;
                                        err.meta.type = 'RESPONSE'
                                    }
                                    //LOGGER.storeLogs({logs: err})
                                    return callback(err.toString());
                                }
                            });
                        } else {
                            console.log('NAME: ' + controllerRequest.methodName + ', RESPONSE:' + JSON.stringify(result));
                            /*if (controllerRequest.meta) {
                             logObj.meta      = controllerRequest.meta;
                             logObj.meta.type = 'RESPONSE'
                             }
                             LOGGER.storeLogs({logs: logObj})*/
                            return callback(null, result);
                        }
                    } else {
                        console.log('NAME: ' + controllerRequest.methodName + ', RESPONSE:' + JSON.stringify(err));
                        if (err.message && typeof err.message != "string") {
                            if (reqObj.auth && reqObj.auth.langId) {
                                var msg     = _.findWhere(err.message, {id: reqObj.auth.langId});
                                err.message = msg && msg.message ? msg.message : err.message[0].message;
                            } else {
                                err.message = err.message[0].message;
                            }
                        }
                        err.meta = controllerRequest.meta;
                        if (controllerRequest.meta) {
                            err.meta      = controllerRequest.meta;
                            err.meta.type = 'RESPONSE'
                        }
                        //LOGGER.storeLogs({logs: err})
                        return callback(err);
                    }
                });
            } else {
                return callback(err);
            }
        });
    }
    catch
        (err) {
        console.log('NAME:' + controllerRequest.methodName + ', RESPONSE:' + JSON.stringify(err.stack));
        //err.stack.meta.type = 'RESPONSE'
        //LOGGER.storeLogs({logs: err.stack})
        return callback({code: 555, message: JSON.stringify(err.stack)});
    }
}

utilities.modelMethodInvokerServer = function (controllerRequest, callback) {
    try {
        console.log('NAME: ' + controllerRequest.methodName + ' REQUEST: params' + JSON.stringify(controllerRequest.params), ' query :', JSON.stringify(controllerRequest.query), ' payload : ', JSON.stringify(controllerRequest.payload));
        var reqObj = utilities.cloneObject(controllerRequest);
        delete reqObj.method;
        delete reqObj.requestParamSchema;
        delete reqObj.requestQuerySchema;
        delete reqObj.requestPayloadSchema;
        delete reqObj.responseSchema;

        if (controllerRequest.modelId) {
            reqObj.modelId = controllerRequest.modelId
        }
        if (controllerRequest.apiId) {
            reqObj.apiId = controllerRequest.apiId
        }
        if (controllerRequest.meta) {
            reqObj.meta = controllerRequest.meta
        }

        var logObj     = {};
        logObj.params  = controllerRequest.params;
        logObj.query   = controllerRequest.query;
        logObj.payload = controllerRequest.payload;
        logObj.meta    = controllerRequest.meta;
        if (controllerRequest.meta) {
            logObj.meta.type = 'REQUEST';
        }
        //LOGGER.storeLogs({logs: logObj})

        controllerRequest.method(reqObj, function (err, result) {
            if (!err) {
                var response = _.extend(utilities.buildSuccessResponse({code : 200,message : "ok"}), result);
                validateSchema(response, controllerRequest.responseSchema, {stripUnknown: true}, function (err, validatedResponse) {
                    if (!err) {
                        if (controllerRequest.meta) {
                            response.meta      = controllerRequest.meta;
                            response.meta.type = 'RESPONSE';
                        } else {
                            response.meta = {type: 'RESPONSE'};
                        }
                        //LOGGER.storeLogs({logs: response})

                        console.log('NAME: ' + controllerRequest.methodName + ', RESPONSE:' + JSON.stringify(validatedResponse));
                        return callback(validatedResponse);
                    } else {
                        err.meta      = controllerRequest.meta;
                        err.meta.type = 'RESPONSE';
                        //LOGGER.storeLogs({logs: err})

                        console.log('NAME: ' + controllerRequest.methodName + ', RESPONSE:' + JSON.stringify(err));
                        return callback(err.toString());
                    }
                });
            } else {
                err.meta      = controllerRequest.meta;
                err.meta.type = 'RESPONSE';
                //LOGGER.storeLogs({logs: err})

                console.log('NAME: ' + controllerRequest.methodName + ', RESPONSE:' + JSON.stringify(err));
                return callback(utilities.buildErrorResponse(err));
            }
        });
    }
    catch (err) {
        err.stack      = controllerRequest.meta;
        err.stack.meta = {
            type: 'RESPONSE'
        };
        //LOGGER.storeLogs({logs: err.stack})

        console.log('NAME:' + controllerRequest.methodName + ', RESPONSE:' + JSON.stringify(err.stack));
        return callback({code: 555, message: JSON.stringify(err.stack)});
    }

};
function validateSchema(requestObject, SCHEMA, options, callback) {
    if (requestObject) {
        joi.validate(requestObject, SCHEMA, options, callback);
    } else {
        callback({code : 404,message :"Bad Request"});
    }
}


utilities.generateSaltPassword = function (password) {
    if (!password)
        password = '';
    var salt = crypto.createHash('sha1');
    salt.update(password);
    return salt.digest('hex');
};


utilities.getRandomNumber = function (length) {
    if (!length) {
        length = 5;
    } else {
        // nothing to do
    }
    var randomNumber = Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));
    return randomNumber.toString();
};




module.exports = utilities;
