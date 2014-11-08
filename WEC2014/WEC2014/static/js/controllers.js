'use strict';

/* Controllers */
angular.module('myApp.controllers', [])
  .controller('PageCtrl', ['$scope', '$location', '$http', 'SiteModel', function($scope, $location, $http, SiteModel) {

    $scope.initialize = function() {
      $scope.inputData = SiteModel.emptyInput;
      $scope.outputData = SiteModel.sampleOutput;
    };

    $scope.addPoint = function() {
      var dropX = $scope.requestDropoffX;
      var dropY = $scope.requestDropoffY;
      var pickX = $scope.requestPickupX;
      var pickY = $scope.requestPickupY;
      var fee = $scope.requestFee;
      var blankObj = dropX.length > 0 && dropY.length > 0 && pickX.length > 0 && pickY.length > 0 && fee.length > 0;
      if (!blankObj) {
        $scope.inputData.requests.push(
          {
            "dropoff": {
                "y": dropX,
                "x": dropY
            },
            "pickup": {
                "y": pickX,
                "x": pickY
            },
            "deliveryFee": fee,
            "id": $scope.inputData.requests.length + 1
          });
      }
    }

    $scope.addHeadquarter = function() {
      var headquarterX = $scope.headquarterX;
      var headquarterY = $scope.headquarterY;
      var blankObj = headquarterX.length > 0 && headquarterY.length > 0;
      if (!blankObj) {
        $scope.inputData.deliveryHeadquarter["x"] = headquarterX;
        $scope.inputData.deliveryHeadquarter["y"] = headquarterY;
      }
    }

    $scope.submit = function() {
      var allInputData = {
        "map": $scope.map,
        "delivery_requests": $scope.inputData
      };
      console.log(allInputData);

      $http.post('/solve', allInputData).
        success(function(data, status, headers, config) {
          console.log(data);
        }).
        error(function(data, status, headers, config) {
          console.log(data);
          console.log('Ran into a problem submitting!');
        });
    }

    $scope.getIcon = function(action) {
      if (action ) {

      }
    }

  }]);
