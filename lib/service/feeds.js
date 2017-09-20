/**
 * Created by Vignesh on 21/08/17.
 */

const FB = require('facebook-node');

var external = {};

external.getfbdata = function (req, callBack) {

    //Setting Parameters for api function
    var methodType = 'GET';
    var fields     = ['id', 'name', 'about', 'posts', 'friends', 'relationship_status','feed'];

    //set access token inorder to access user data - OAuth ( Open Authorization )
    FB.setAccessToken(req.payload.accessToken);

    //POST --- Facebook Data of the user
    FB.api(req.payload.id, methodType, {fields: fields}, function (res) {
        if (res.error) {
            return callBack(res.error);
        } else {
            return callBack(null,res.feed)
        }
    });
};

module.exports = external;