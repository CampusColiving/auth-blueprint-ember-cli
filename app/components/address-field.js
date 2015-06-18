import Ember from 'ember';

let { observer, on, computed }  = Ember;
const RETURN_KEY_CODE = 13;

const TYPES_OPTION_MAPPING = {
  cities:  '(cities)',
  address: 'address'
};
const ADDRESS_MAPPING = {
  street:       'route',
  streetNumber: 'street_number',
  postalCode:   'postal_code',
  city:         'locality',
  state:        'administrative_area_level_1',
  country:      'country'
};

export default Ember.TextField.extend({
  googleMapsApi: Ember.inject.service(),
  limitTo: [],

  _findAddressComponent(type) {
    let components = Ember.makeArray(this.get('place.address_components'));
    let component  = components.find((component) => {
      return Ember.makeArray(component.types).contains(type);
    });
    return Ember.get(component || {}, 'long_name');
  },

  keyPress(e) {
    return e.keyCode !== RETURN_KEY_CODE;
  },

  placeChanged: observer('place', function() {
    Ember.keys(ADDRESS_MAPPING).forEach((key) => {
      Ember.set(this.get('address'), key, this._findAddressComponent(ADDRESS_MAPPING[key]));
    });
  }),

  limitToTypesOption: computed('limitTo', function() {
    let limitTo = this.get('limitTo');
    return Ember.makeArray(TYPES_OPTION_MAPPING[limitTo]);
  }),

  autocompleteCallback() {
    const autocomplete = this.get('autocomplete');

    this.set('place', autocomplete.getPlace());
  },

  setupAutocomplete: on('didInsertElement', function() {
    const googleMapsApi    = this.get('googleMapsApi');
    const autocompleteOpts = { types: this.get('limitToTypesOption') };
    const callback         = this.autocompleteCallback.bind(this);

    googleMapsApi.load()
      .then(() => this.set('autocomplete', googleMapsApi.setupAutocomplete(this.element, callback, autocompleteOpts)));
  })
});
