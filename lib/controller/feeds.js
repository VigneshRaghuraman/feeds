/**
 * Created by Vignesh on 09/08/17.
 */

const handler = require('../handler/feeds');
const utils   = require('../utils/utilities');
const schema  = require('../schema/feeds');


var external = {};

/**
 * controller - get facebook feed
 *
 * @param request - contains facebook userID and access Token
 * @param reply - callback method contains response as facebook user feed
 */

external.getFbData = function (request, reply) {

    var methodName        = "getfbData";
    let controllerRequest = {
        methodName          : methodName,
        requestPayloadSchema: schema.getfbfeedReq,
        responseSchema      : schema.getfbfeedRes,
        payload             : request.payload,
        method              : handler.getfbData
    };

    utils.modelMethodInvoker(controllerRequest, function (err, res) {
        if (err) {
            return reply(err)
        } else {
            return reply(null, res)
        }
    })
};

/**
 * controller - get twitter feed
 *
 * @param request - contains twitter tokens [ secret key consumer_key , consumer_secret , access_token_key , access_token_secret ]
 * @param reply - callback method contains response as twitter feeds and tweets
 */

external.getTwitData = function (request, reply) {

    var methodName        = "gettwitData";
    let controllerRequest = {
        methodName          : methodName,
        requestPayloadSchema: schema.gettwitfeedReq,
        responseSchema      : schema.gettwitfeedRes,
        payload             : request.payload,
        method              : handler.gettwitterData
    };

    utils.modelMethodInvoker(controllerRequest, function (err, res) {
        if (err) {
            return reply(err)
        } else {
            return reply(null, res)
        }
    })
};

module.exports = external;
