'use strict';

/* Services */
angular.module('myApp.services', []).
  service('SiteModel', [function() {
    return {
      emptyInput: {
        "requests": [
          // {
          //   "dropoff": {
          //       "y": 3,
          //       "x": 6
          //   },
          //   "pickup": {
          //       "y": 6,
          //       "x": 1
          //   },
          //   "deliveryFee": 16.0,
          //   "id": 1
          // },
        ],
        "deliveryHeadquarter": {}
      }
    };
  }]);
