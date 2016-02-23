# Circulate Hashed Data Collection for Node.js

This is a library to aid in the implementation of [Circulate](http://www.circulate.com) hashed data colection. This library hashes data and builds the HTML placement for adding to a webpage or in an email for ad tracking. It also provides convenience for dealing with cookies.

## Installation

```sh
$ npm install node-circulate
```

## API

### getHtml(siteId, userData)

Generates the the Circulate HTML placement. The "email" value should be the hashed email from hashEmail()

```
@param <number> siteId - site identifying key
@param <object> userDatda - Object representation of user data
@return <String> - email address hashed using Circulate's algorithm
```

### hashEmail(email)

Gets the Circulate email hash string

```
@param <string> email - email address
@return <string> - email address hashed using Circulate's algorithm
```

### expressSetCookie(response, path, domain)

Convenience method for setting Circulate cookie when using Express framework

```
@param <object> response - Express Response object
@param <string> path - (Optional) Cookie path
@param <string> domain - (Optional) Cookie domain
@return <undefined>
```

### expressGetCookie(request)

Convenience method for getting Circulate cookie when using Express framework. NOTE: This requires that the cookie-parser middleware be loaded.

```
@param <object> request - Express Request object
@return <undefined>|<object> - Cookie value if set; undefined otherwise
```

## Example

```js
myExpressController = function(request, response, next) {
  var circulate = require('./index'),
    hashedEmail,
    circulatePlacement;

  // Hash email with Circulate algorithm
  hashedEmail = circulate.hashEmail('fdsafdsaf@gmail.com'),

  // Get HTML placement
  circulatePlacement = circulate.getHtml('site123', {hema: hashedEmail});

  // Add cookie to response
  circulate.expressSetCookie(response);

  // Send the response
  response.render('/myView', {circulatePlacement: circulatePlacement})
}
```

## Disclaimer

*NOTE:* This is a third-party, open source library developed by [Path Evolution, LLC](http://pathevolution.com/) and is not officially supported by [Circulate.com, Inc.](http://www.circulate.com). This project is licensed under Apache License 2.0.