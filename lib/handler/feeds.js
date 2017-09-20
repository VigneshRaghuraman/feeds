/**
 * Created by Vignesh on 09/08/17.
 */

const fbServ = require('../service/feeds');
const twtServ = require('../service/twitterfeeds');

var external = {};

/**
 * handler - calls facebook service
 *
 * @param req - id
 * @param callBack - responser
 */
external.getfbData = function (req, callBack) {
   fbServ.getfbdata(req,function (err, res) {
       if (err) {
           return callBack(err);
       } else {
           return callBack(null,res)
       }
   })
};

/**
 * handler - calls twitter service
 *
 * @param req - tokens
 * @param callBack - response
 */

external.gettwitterData = function (req, callBack) {
    twtServ.gettwtData(req,function (err, res) {
        if (err) {
            return callBack(err);
        } else {
            return callBack(null,res)
        }
    })

};

module.exports = external;
