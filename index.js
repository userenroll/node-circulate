var crypto = require('crypto'),
  component;

component = {
  apiServer: 'http://data.circulate.com',
  apiSecureServer: 'https://data-secure.circulate.com',
  cookieName: 'sm_dapi_session',
  cookieMaxAge: 14 * 24 * 60 * 60,
  useSsl: true,

  /**
   * Generates the the Circulate HTML placement
   * NOTE: The "email" value should be the hashed email from hashEmail()
   *
   * @param <number> siteId - site identifying key
   * @param <object> userDatda - Object representation of user data
   * @return <String> - email address hashed using Circulate's algorithm
   */
  getHtml: function (siteId, userData) {
    var html, url;

    if(typeof userData !== 'object') {
      throw new Error('Invalid userData');
    }

    if(typeof siteId === 'undefined' || siteId === null || siteId === '') {
      throw new Error('Invalid siteId');
    }

    url = this.useSsl ? this.apiSecureServer : this.apiServer;

    Object.keys(userData).forEach(function (key) {
      userData[key] = userData[key].replace(/\s+$/g, '');
      userData[key] = userData[key].replace(/^\s+/g, '');

      if(key === 'email') {
        userData[key] = userData[key].toLowerCase();
      }
    })

    userData['sid'] = siteId;

    html = "<script type=\"text/javascript\">\n" +
      "var SMInformation = " + JSON.stringify(userData) + ";\n" +
      "</script>\n" +
      "<script type=\"text/javascript\" src=\"" + url + "/dapi/collect\" async></script>\n";

    return html;
  },

  /**
   * Gets the Circulate email hash string
   *
   * @param <string> email - email address
   * @return <string> - email address hashed using Circulate's algorithm
   */
  hashEmail: function (email) {
    var hash, result, emailSplit, mailbox, domain;

    email = email.replace(/\s+$/g, '');
    email = email.replace(/^\s+/g, '');

    emailSplit = email.split('@')

    if(emailSplit.length < 2) {
      throw new Error('Invalid email');
    }

    mailbox = emailSplit[0];
    domain = emailSplit[1];

    hash = crypto.createHash('sha1');
    hash.update(email.toLowerCase());
    result = 'H1:' + hash.digest('hex');

    hash = crypto.createHash('sha1');
    hash.update(email.toUpperCase());
    result += ',H2:' + hash.digest('hex');

    hash = crypto.createHash('sha1');
    hash.update(domain.toLowerCase());
    result += ',H3:' + hash.digest('hex');

    hash = crypto.createHash('md5');
    hash.update(email.toLowerCase());
    result += ',H4:' + hash.digest('hex');

    hash = crypto.createHash('md5');
    hash.update(email.toUpperCase());
    result += ',H5:' + hash.digest('hex');

    hash = crypto.createHash('sha256');
    hash.update(email.toLowerCase());
    result += ',H6:' + hash.digest('hex');

    hash = crypto.createHash('sha256');
    hash.update(email.toUpperCase());
    result += ',H7:' + hash.digest('hex');

    return result;
  },

  /**
   * Convenience method for setting Circulate cookie when using Express framework
   *
   * @param <object> response - Express Response object
   * @param <string> path - (Optional) Cookie path
   * @param <string> domain - (Optional) Cookie domain
   * @return <undefined>
   */
  expressSetCookie: function (response, path, domain) {
    var cookieData = {
      maxAge: this.cookieMaxAge,
    };

    if(typeof path === 'string') {
      cookieData.path = path;
    }

    if(typeof domain === 'string') {
      cookieData.domain = domain;
    }

    response.cookie(this.cookieName, 1, cookieData);
  },

  /**
   * Convenience method for getting Circulate cookie when using Express framework
   * NOTE: This requires that the cookie-parser middleware be loaded.
   *
   * @param <object> request - Express Request object
   * @return <undefined>|<object> - Cookie value if set; undefined otherwise
   */
  expressGetCookie: function (request) {
    var filterCookieParserMiddleware;

    filterCookieParserMiddleware = function (layer) {
      return layer && layer.handle && layer.handle.name === 'cookieParser';
    }

    if(!request.app._router.stack.filter(filterCookieParserMiddleware).length) {
      throw new Error('Express cookie-parser middleware not loaded');
    }

    if(typeof request.cookies !== 'undefined') {
      return request.cookies[this.cookieName];
    }
  },
}

module.exports = component
