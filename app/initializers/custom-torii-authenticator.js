export default {
  name:   'custom-torii-authenticator',
  before: 'simple-auth',
  after:  'torii',
  initialize(container, application) {
    application.inject('authenticator:torii', 'torii', 'torii:main');
  }
};
