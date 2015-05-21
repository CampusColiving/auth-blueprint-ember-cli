var makeToken = require('./helpers/make-token');

module.exports = function(app) {
  var express     = require('express');
  var tokenRouter = express.Router();

  tokenRouter.post('', function(req, res) {
    if (req.body.grant_type === 'password') {
      if (req.body.username === 'letme' && req.body.password === 'in') {
        res.status(200).send({ access_token: makeToken() });
      } else {
        res.status(400).send({ error: 'invalid_grant' });
      }
    } else if (req.body.grant_type === 'facebook_auth_code') {
      res.status(200).send({ access_token: makeToken() });
    } else {
      res.status(400).send({ error: 'unsupported_grant_type' });
    }
  });

  tokenRouter.post('/facebook/callback', function(req, res) {
    res.status(200).send({ access_token: makeToken() });
  });

  app.use('/token', tokenRouter);
};
