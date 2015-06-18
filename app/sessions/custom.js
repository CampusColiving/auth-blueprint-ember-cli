import DS from 'ember-data';
import Session from 'simple-auth/session';

export default Session.extend({
  dataStore: null,

  user: function() {
    if (this.get('isAuthenticated')) {
      return DS.PromiseObject.create({
        promise: this.get('dataStore').find('user', 'me')
      });
    } else {
      return null;
    }
  }.property('isAuthenticated')
});
