/* jshint expr:true */
import Ember from 'ember';
import { expect } from 'chai';
import { describeComponent, it } from 'ember-mocha';

let component;
let address = {};

let mockGmapsApi = {
  load: Ember.RSVP.resolve,

  setupAutocomplete() {
    return;
  }
};

describeComponent('address-field', 'AddressFieldComponent', {}, () => {
  beforeEach(function() {
    component = this.subject({
      address,
      googleMapsApi: mockGmapsApi
    });
  });

  describe('address', () => {
    it('is updated when the place changes', function() {
      component.set('place', {
        'address_components': [
          { 'long_name': '7', 'short_name': '7', 'types': ['street_number'] },
          { 'long_name': 'Claude-Lorrain-Straße', 'short_name': 'Claude-Lorrain-Straße', 'types': ['route'] },
          { 'long_name': 'Au-Haidhausen', 'short_name': 'Au-Haidhausen', 'types': ['sublocality_level_1', 'sublocality', 'political'] },
          { 'long_name': 'München', 'short_name': 'M', 'types': ['locality', 'political'] },
          { 'long_name': 'Oberbayern', 'short_name': 'Oberbayern', 'types': ['administrative_area_level_2', 'political'] },
          { 'long_name': 'Bayern', 'short_name': 'BY', 'types': ['administrative_area_level_1', 'political'] },
          { 'long_name': 'Germany', 'short_name': 'DE', 'types': ['country', 'political'] },
          { 'long_name': '81543', 'short_name': '81543', 'types': ['postal_code'] }
        ]
      });

      expect(address).to.eql({
        street:       'Claude-Lorrain-Straße',
        streetNumber: '7',
        postalCode:   '81543',
        city:         'München',
        state:        'Bayern',
        country:      'Germany'
      });
    });
  });

  describe('limitToTypesOption', () => {
    it('is correct for "cities"', function() {
      component.set('limitTo', 'cities');

      expect(component.get('limitToTypesOption')).to.eql(['(cities)']);
    });

    it('is correct for "address"', function() {
      component.set('limitTo', 'address');

      expect(component.get('limitToTypesOption')).to.eql(['address']);
    });

    it('is correct for no limitation', function() {
      component.set('limitTo', null);

      expect(component.get('limitToTypesOption')).to.eql([]);
    });
  });
});
