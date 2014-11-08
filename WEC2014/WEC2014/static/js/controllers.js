'use strict';

/* Controllers */
angular.module('myApp.controllers', [])
  .controller('PageCtrl', ['$scope', '$location', '$http', 'SiteModel', function($scope, $location, $http, SiteModel) {

    $scope.initialize = function() {
      $scope.inputData = SiteModel.emptyInput;
    };

    $scope.loadSubreddit = function(subreddit, type) {
      var url='https://api.reddit.com/r/' + subreddit + '/' + type + '?jsonp=JSON_CALLBACK';
      $http.jsonp(url).success(function(data) {
        var dataset = data.data.children;
        for (var i = 0; i < dataset.length; ++i) {
          $scope.elements.push(dataset[i].data);
        }
      }).error(function(data) {
        $scope.noSubredditPosts = true;
        $scope.elements.push(SiteModel.samplePost);
      });
      $scope.searchParam = subreddit;
      $scope.type = type;
    }

    $scope.submitSubreddit = function(suggestion) {
      if (suggestion) {
        $scope.searchParam = suggestion;
      }
      var url = 'index.html#/search?subreddit=' + $scope.searchParam;
      var topUrl = url + '&type=top';
      var newUrl = url + '&type=new';
      var topWin = window.open(topUrl, '_blank');
      topWin.focus();
      var newWin = window.open(newUrl, '_blank');
      newWin.focus();
    };

    $scope.blur = function(e) {
      setTimeout(function() {
        $scope.selectedIndex = -1;
        $scope.focused = false;
      }, 200);
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

  }]);
