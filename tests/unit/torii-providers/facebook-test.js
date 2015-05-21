import { describeModule, it } from 'ember-mocha';

describeModule('torii-provider:facebook', 'FacebookToriiProvider', {}, () => {
  describe('fetch', () => {
    it('resolves with the passed data', function() {
      return this.subject().fetch({ some: 'data' }).then((value) => {
        expect(value).to.eql({ some: 'data' });
      });
    });
  });

  describe('close', () => {
    it('resolves', function() {
      return this.subject().close().then(() => expect(true).to.be.ok);
    });
  });
});
