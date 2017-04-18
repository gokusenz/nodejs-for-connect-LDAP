require('dotenv').config();

var express      = require('express'),
    passport     = require('passport'),
    bodyParser   = require('body-parser'),
    LdapStrategy = require('passport-ldapauth');
 
var OPTS = {
  usernameField: process.env.usernameField || 'email',
  passwordField: process.env.passwordField || 'password',
  server: {
    url: process.env.url,
    bindDn: 'CN=wiki_ldap_connect,CN=Users,DC=local,DC=thinknet,DC=co,DC=th',
    bindCredentials: 'JobTh1nK',
    searchBase: 'OU=engineering,OU=thinknet,DC=local,DC=thinknet,DC=co,DC=th',
    searchFilter: '(&(objectcategory=person)(objectclass=user)(|(samaccountname={{username}})(mail={{username}})))'
  }
};
 
var app = express();
 
passport.use(new LdapStrategy(OPTS));
console.log(passport);
 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(passport.initialize());

app.post('/login', function(req, res, next) {
  passport.authenticate('ldapauth', {session: false}, function(err, user, info) {
    if (err) {
      return next(err); // will generate a 500 error
    }
    // Generate a JSON response reflecting authentication status
    if (! user) {
      return res.send({ success : false, message : 'authentication failed' });
    }
    return res.send({ success : true, message : 'authentication succeeded' });
  })(req, res, next);
});

app.listen(8080);