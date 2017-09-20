/**
 * Created by Vignesh on 09/08/17.
 */

const joi = require('joi');

var external = {};

external.getfbfeedReq = joi.object({
	payload: {
		id         : joi.string().required(),
		accessToken: joi.string().required()
	}
});

external.getfbfeedRes = joi.object();

external.gettwitfeedReq = joi.object({
	payload: {
		consumer_key       : joi.string().required(),
		consumer_secret    : joi.string().required(),
		access_token_key   : joi.string().required(),
		access_token_secret: joi.string().required()
	}
});

external.gettwitfeedRes = joi.array().items(joi.object({
	id  : joi.string(),
	text: joi.string()
}));

module.exports = external;