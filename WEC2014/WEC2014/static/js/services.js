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
      },
      sampleOutput: {
        "output": [
          {
          "carrierId": "car1",
          "actions": [
            {
              "action": "start",
              "x": 1,
              "y": 3
            },
            {
              "action": "drive",
              "x": 2,
              "y": 3
            },
            {
              "action": "pickup",
              "id":4
            },
            {
              "action": "drive",
              "x": 4,
              "y": 3
            },
            {
              "action": "dropoff",
              "id": 5
            }
          ]
        }
      ]}
    };
  }]);
