/* jshint expr:true */
import Ember from 'ember';
import startApp from '../helpers/start-app';

let App;
let server;
const IDENTIFICATION_INPUT_SELECTOR = '.js-identification-input';
const PASSWORD_INPUT_SELECTOR       = '.js-password-input';
const LOGIN_BUTTON_SELECTOR         = '.js-login-button';

function signIn(login, password) {
  visit('/login');

  fillIn(IDENTIFICATION_INPUT_SELECTOR, login)
    .fillIn(PASSWORD_INPUT_SELECTOR, password)
    .click(LOGIN_BUTTON_SELECTOR);
}

describe('Feature - signing in', () => {
  beforeEach(() => {
    App = startApp();
    server = new Pretender(function() {
      this.post('/token', (request) => {
        if (request.requestBody.match(/password\=in/)) {
          return [200, { 'Content-Type': 'application/json' }, JSON.stringify({ 'access_token': 'access_token' })];
        } else {
          return [400, { 'Content-Type': 'application/json' }, JSON.stringify({ 'error': 'invalid_grant' })];
        }
      });
    });
  });

  afterEach(() => {
    Ember.run(App, 'destroy');
    Ember.tryInvoke(server, 'shutdown');
  });

  it('succeeds with correct credentials', () => {
    signIn('letme', 'in');

    return andThen(() => {
      expect(currentRouteName()).to.eql('internal');
    });
  });

  it('fails with incorrect credentials', () => {
    signIn('letme', 'WRONG');

    return andThen(() => {
      expect(currentRouteName()).to.eql('login');
    });
  });
});
