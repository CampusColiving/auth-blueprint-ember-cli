module.exports = function(app) {
  var express              = require('express');
  var hmacSignaturesRouter = express.Router();

  hmacSignaturesRouter.post('/', function(req, res) {
    res.status(200).send({
      signature: 'ZmI0ZjE2ZTMxMWY1YjA0ZTc4MTg1ZDhlYWRkMTEwNDE3M2RiMzNiNQ==',
      token:     'gCH6gYqQffQCsFKSLuxyagXsuXcIK0uf',
      success:   true
    });
  });

  app.use('/zuora-signatures', hmacSignaturesRouter);
};
