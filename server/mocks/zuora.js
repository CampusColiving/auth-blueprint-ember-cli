module.exports = function(app) {
  var express     = require('express');
  var zuoraRouter = express.Router();

  zuoraRouter.post('/rest/v1/payment-methods/credit-cards', function(req, res) {
    if (req.headers.signature && req.headers.token) {
      res.status(200).send({
        paymentMethodId: '2c92c8f83dcbd8b1013dcce1d6a60',
        success:         true
      });
    } else {
      res.status(400).send({
        success: false,
        reasons: [{ message: 'token or signature missing', code: 90000011 }]
      });
    }
  });

  app.use('/zuora', zuoraRouter);
};
