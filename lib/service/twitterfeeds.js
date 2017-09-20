/**
 * Created by Vignesh on 30/08/17.
 */


//Requiring NPM Packages
const twitter = require('twitter');
const _ = require('underscore');

var external = {};

external.gettwtData = function (req, callback) {

    //setting client
    var client = new twitter(req.payload);

    //statuses/user_timeline
    client.get('statuses/user_timeline',function (error, tweets, response) {
        if (!tweets.errors && tweets.length >= 1) {
            var posts = [];
            _.each(tweets,function (single) {
                posts.push({
                    id : single.id_str,
                    text : single.text
                });
            });
            return callback(null,posts)
        } else if (tweets.errors){
            var err = [];
            _.each(tweets.errors,function (error) {
                err.push({
                    id : error.code,
                    text : error.message
                })
            }) ;
            return callback(err)
        } else if (!tweets.errors && tweets.length === 0) {
            return callback(null,[{message : "No tweets Available"}])
        }
    });
};

module.exports = external;