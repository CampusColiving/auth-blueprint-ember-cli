/* global sinon */
/* jshint expr:true */
import Ember from 'ember';
import { describeModule, it } from 'ember-mocha';

let { RSVP } = Ember;
let server;

describeModule('session:custom', 'CustomSession', {}, () => {
  describe('user', () => {
    context('when the session is not authenticated', () => {
      it('returns null', function() {
        expect(this.subject().get('user')).to.be.null;
      });
    });

    context('when the session is authenticated', () => {
      it('loads the user from /users/me', function() {
        let dataStore  = {
          find() {
            return RSVP.resolve();
          }
        };
        sinon.spy(dataStore, 'find').withArgs('user', 'me');
        this.subject({ dataStore, isAuthenticated: true }).get('user');

        expect(dataStore.find.calledOnce).to.be.true;
      });
    });
  });
});
