import Ember from 'ember';
import { request } from 'ic-ajax';
import ENV from '../config/environment';

let { getProperties, merge } = Ember;

export default Ember.Service.extend({
  _makeRequest(options) {
    return request(options).catch((error) => {
      return { errors: error.jqXHR.responseJSON.reasons };
    });
  },

  _getSignature(url, method, params) {
    return this._makeRequest({
      url:    `${ENV.apiServer}/zuora-signatures`,
      method: 'post',
      data:   { uri: url, method, params }
    }).then((response) => {
      return getProperties(response, 'signature', 'token', 'cookie');
    });
  },

  createCreditCard(data) {
    let url    = `${ENV.zuoraServer}/rest/v1/payment-methods/credit-cards`;
    let method = 'post';
    return this._getSignature(url, method, data).then((hmacSignature) => {
      return this._makeRequest({
        url,
        method,
        data:        JSON.stringify(data),
        headers:     merge(getProperties(hmacSignature, 'signature', 'token'), {}),
        contentType: 'application/json'
      }).then((response) => {
        return merge(data, { id: response.paymentMethodId });
      });
    });
  }
});
