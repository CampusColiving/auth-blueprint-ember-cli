/* jshint expr:true */
import Ember from 'ember';
import { describeModule, it } from 'ember-mocha';

let server;

describeModule('service:zuora', 'ZuoraService', {}, () => {
  describe('createCreditCard', () => {
    beforeEach(() => {
      server = new Pretender(function() {
        this.post('/zuora-signatures', (request) => {
          return [200, { 'Content-Type': 'application/json' }, JSON.stringify({ signature: 'signature', token: 'token', success: true })];
        });
        this.post('/zuora/rest/v1/payment-methods/credit-cards', (request) => {
          return [200, { 'Content-Type': 'application/json' }, JSON.stringify({ paymentMethodId: 'paymentMethodId', success: true })];
        });
      });
    });

    afterEach(() => {
      server.shutdown();
    });

    it('returns a promise that resolves with the generated payment method', function() {
      return this.subject().createCreditCard({ accountKey: 'accountKey', creditCardType: 'Visa' }).then((creditCardData) => {
        expect(creditCardData).to.eql({ id: 'paymentMethodId', accountKey: 'accountKey', creditCardType: 'Visa' });
      });
    });

    it('generates a request signature and token', function() {
      return this.subject().createCreditCard({ creditCardType: 'VISA' }).then(() => {
        let requestData = Ember.getProperties(server.handledRequests[0], 'url', 'method', 'requestBody');

        expect(requestData).to.eql({
          url:         '/zuora-signatures',
          method:      'POST',
          requestBody: 'uri=%2Fzuora%2Frest%2Fv1%2Fpayment-methods%2Fcredit-cards&method=post&params%5BcreditCardType%5D=VISA'
        });
      });
    });

    it('creates a credit card payment method with the zuora api', function() {
      return this.subject().createCreditCard({ accountKey: 'accountKey', creditCardType: 'VISA' }).then(() => {
        let requestData = Ember.getProperties(server.handledRequests[1], 'url', 'method', 'requestBody');

        expect(requestData).to.eql({
          url:         '/zuora/rest/v1/payment-methods/credit-cards',
          method:      'POST',
          requestBody: '{"accountKey":"accountKey","creditCardType":"VISA"}'
        });
      });
    });

    it('sends the signature and token along with the payment method creation request', function() {
      return this.subject().createCreditCard({}).then(() => {
        let headers = Ember.getProperties(server.handledRequests[1].requestHeaders, 'signature', 'token');

        expect(headers).to.eql({ signature: 'signature', token: 'token' });
      });
    });

    context('when generating the signature and token fails', () => {
      beforeEach(() => {
        server.post('/zuora-signatures', (request) => {
          return [400, { 'Content-Type': 'application/json' }, JSON.stringify({ success: false, reasons: [{ message: 'message', code: 90000011 }] })];
        });
      });

      it('returns a promise that rejects with the error', function() {
        return this.subject().createCreditCard({}).then(null, (error) => {
          expect(error).to.eql({ errors: [{ code: 90000011, message: 'message' }] });
        });
      });
    });

    context('when generating the credit card payment method fails', () => {
      beforeEach(() => {
        server.post('/zuora/rest/v1/payment-methods/credit-cards', (request) => {
          return [400, { 'Content-Type': 'application/json' }, JSON.stringify({ success: false, reasons: [{ message: 'message', code: 90000011 }] })];
        });
      });

      it('returns a promise that rejects with the error', function() {
        return this.subject().createCreditCard({}).then(null, (error) => {
          expect(error).to.eql({ errors: [{ code: 90000011, message: 'message' }] });
        });
      });
    });
  });
});
