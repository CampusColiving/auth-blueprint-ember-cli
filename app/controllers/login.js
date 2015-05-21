import Ember from 'ember';

export default Ember.Controller.extend({
  _handleError(error) {
    this.set('error', error.error);
  },

  actions: {
    authenticate() {
      let data = this.getProperties('identification', 'password');
      return this.get('session').authenticate('simple-auth-authenticator:oauth2-password-grant', data).catch(Ember.run.bind(this, this._handleError));
    },

    authenticateWithFacebook() {
      return this.get('session').authenticate('authenticator:torii', 'facebook').catch(Ember.run.bind(this, this._handleError));
    }
  }
});
