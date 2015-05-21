import Ember from 'ember';
import FacebookOauth2 from 'torii/providers/facebook-oauth2';

export default FacebookOauth2.extend({
  fetch(data) {
    return Ember.RSVP.resolve(data);
  },

  close() {
    return Ember.RSVP.resolve();
  }
});
