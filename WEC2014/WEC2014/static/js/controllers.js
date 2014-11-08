'use strict';

/* Controllers */
angular.module('myApp.controllers', [])
  .controller('PageCtrl', ['$scope', '$location', '$http', 'SiteModel', function($scope, $location, $http, SiteModel) {

    $scope.initialize = function() {
      $scope.inputData = SiteModel.emptyInput;
      // $scope.outputData = SiteModel.sampleOutput;
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

      $http.post('/solve', allInputData).
        success(function(data, status, headers, config) {
          $scope.outputData = data;
          $scope.moveDeliveryCar();
        }).
        error(function(data, status, headers, config) {
          console.log(data);
          console.log('Ran into a problem submitting!');
        });
    }

    $scope.moveDeliveryCar = function() {
      var car = document.getElementById("deliveryCar");
      var increment = 10000/$scope.outputData.output[0].actions.length;
      var time = increment;
      var max = 0;
      $scope.outputData.output[0].actions.forEach(function(obj, index) {
        if (obj.x > max) {
          max = obj.x;
        }
        if (obj.y > max) {
          max = obj.y;
        }
      });

      var ratio = 250 / max;

      $scope.outputData.output[0].actions.forEach(function(obj, index) {
        setTimeout(function() {
          var rows = document.querySelectorAll('#outputCoordinates tr');
          if (obj.x && obj.y) {
            var x = parseInt(obj.x) * ratio;
            var y = parseInt(obj.y) * ratio;
            car.style.left = x.toString() + "px";
            car.style.bottom = y.toString() + "px";
            $(rows[index]).removeClass('highlight');
            $(rows[index+1]).addClass('highlight');
            // $(".carrierData").scrollTop($(rows[index]).offset().top - ($(".carrierData").height()/2) )
          } else {
            $(rows[index]).removeClass('highlight');
            $(rows[index+1]).addClass('highlight');
            // $(".carrierData").scrollTop($(rows[index]).offset().top - ($(".carrierData").height()/2) )
          }
        }, time);
        time += increment;
      });
    }

    $scope.getIcon = function(action) {
      if (action == "start") {
        return "fa-arrow-circle-o-right";
      } else if (action == "drive") {
        return "fa-taxi";
      } else if (action == "pickup") {
        return "fa-suitcase";
      } else if (action == "dropoff") {
        return "fa-check";
      }
    }

    $scope.getActionText = function(action) {
      if (action.action == "pickup" || action.action == "dropoff") {
        return action.id;
      } else {
        var coordinate = "(" + action.y + ", " + action.x + ")";
        return coordinate;
      }
    }

  }]);
