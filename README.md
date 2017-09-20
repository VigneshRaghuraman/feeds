# facebook-demo [![NPM version](https://badge.fury.io/js/facebook-demo.svg)](https://npmjs.org/package/facebook-demo) [![Build Status](https://travis-ci.org/node-components/facebook-demo.svg?branch=master)](https://travis-ci.org/node-components/facebook-demo)

> Used to fetch the facebook contents of an user

## Installation

```sh
$ npm install --save feeds
```

## Usage

```js
var facebookDemo = require('feeds');
facebookDemo();
```

## License

ISC © [Vignesh]()

## Description

 This Module is used to get Facebook feed and Twitter feed.


## API's

1. GET FB DATA **

    Name            : getFbData

    Request         : Request contains userID of the facebook user and access token which is generated in facebook API.

    Sample Request  :

                    var fbreq = {
                        payload: {
                            id         : '1357011334415935',
                            accessToken: 'EAAD7SwQTsSkBAAZBoJzYu2qVvYyEuZBkZCigouhZCeXvrG4a9PTPFztUjU9OjYH6P745NZAEZAklscnJvbElmBTRQu6OSE2Hm8ZCWePJvkv1ywF6U4d1E4b2moZAcPAQkdONZBlR0TrpDqYL6zUx8CE50eJU0tz54uBmPeoMEVm2L5ILgWrkYMs7ByA4ITiKrsG0ZD'
                        }
                    };

    Response        : It will be an object type and it contains array

    Sample Response :

                    {
                        "data":
                            [{
                                "message":"******",
                                "story":"******.",
                                "created_time":"2017-08-19T01:28:13+0000",
                                "id":"1357011334415935_1367361916714210"
                            }]
                    }

    Errors          : some general errors

    Sample Errors   :

                    {
                        "message":"The access token could not be decrypted",
                        "type":"OAuthException",
                        "code":190,
                        "fbtrace_id":"B2WvZEj1qjz"
                    }


2. GET TWIT DATA **

    Name            : getTwitData

    Request         : Request contains some pre-defined keys provided from twitter developer API

    Sample Request  :

                      var twtreq =
                      {
                          payload: {
                              consumer_key       : "BQgKfSZu4DD4rqtPivazERt5J",
                              consumer_secret    : "U5ikKdB7ArACMnmBH8HPLP5j577lpHWssIEEVIZp0CGXeCnA4B",
                              access_token_key   : "3100750861-mJKc1kCmHXu3jOCffI4jqdyVurPNX69vBOcDrpJ",
                              access_token_secret: "0xi5sWOlr8d22gEg7FcBRrKJhUmvMIgfIAlc1Kpg4mzau"
                          }
                      };

    Response        : Response contains an array of posted tweets message and its ID.

    Sample Response :

                      [{
                        "id":"904573746983256065",
                        "text":"testing"
                      }]

    Errors          : some general errors

    Sample Errors   :

                    [{
                        "id":32,
                        "text":"Could not authenticate you."
                    }]

