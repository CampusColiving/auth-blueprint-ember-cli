/* global google */
import Ember from 'ember';
import ENV from '../config/environment';

let { RSVP } = Ember;

export default Ember.Service.extend({
  _loaded:  false,
  _promise: null,

  load() {
    if (!this._promise) {
      this._promise = new RSVP.Promise((resolve, reject) => {
        if (this._loaded) {
          Ember.run(resolve, google.maps);
        } else {
          window.__emberGoogleMapsAPILoaded__ = Ember.run.bind(this, function() {
            if (this.isDestroyed) {
              return;
            }

            this.setProperties({
              _loaded: true,
              _promise: null,
              api: google.maps
            });

            resolve(this.get('api'));
          });

          Ember.$.getScript(`//maps.googleapis.com/maps/api/js?libraries=places&key=${ENV.googleMapsAPIKey}&callback=__emberGoogleMapsAPILoaded__`).fail(() => {
            Ember.run(reject);
          });
        }
      });
    }
    return this._promise;
  },

  setupAutocomplete(element, callback, opts={}) {
    const mapsApi = this.get('api');

    const autocomplete = new mapsApi.places.Autocomplete(element, opts);

    mapsApi.event.addListener(autocomplete, 'place_changed', callback);

    return autocomplete;
  }
});
