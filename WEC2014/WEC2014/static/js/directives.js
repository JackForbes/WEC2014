'use strict';

/* Directives */
angular.module('myApp.directives', []).
directive('autocomplete', function() {
  var index = -1;

  return {
    link: function(scope, element, attrs) {

      var key = {left: 37, up: 38, right: 39, down: 40, enter: 13, esc: 27, tab: 9};

      element[0].addEventListener("keydown",function (e) {
        var keycode = e.keyCode || e.which;
        var numSuggestions = document.querySelectorAll('li').length;

        if (keycode == key.up || keycode == key.left) {
          e.preventDefault();
          index = getIndex() - 1;
          if (index < 0) {
            index = numSuggestions - 1;
          } else if (index >= numSuggestions) {
            index = -1;
            setIndex(index);
            scope.preSelectOff();
          }
          setIndex(index);
          scope.$apply();
        } else if (keycode == key.down || keycode == key.right || keycode == key.tab) {
          e.preventDefault();
          index = getIndex() + 1;
          if (index < -1) {
            index = numSuggestions - 1;
          } else if (index >= numSuggestions) {
            index = 0;
            setIndex(index);
            scope.$apply();
          }
          setIndex(index);
          scope.$apply();
        } else if (keycode == key.enter) {
          index = getIndex();
          if (index !== -1) {
            var suggestionText = angular.element(angular.element(document.querySelector('.suggestions')).find('li')[index]).text();
            scope.submitSubreddit(suggestionText);
          } else {
            scope.submitSubreddit();
          }
          e.preventDefault();
          setIndex(-1);
          scope.$apply();
        } else if (keycode == key.esc) {
          scope.focused = false;
          setIndex(-1);
          scope.$apply();
          e.preventDefault();
        }
      });

      var getIndex = function() {
        return scope.selectedIndex;
      }

      var setIndex = function(i) {
        scope.selectedIndex = parseInt(i);
        scope.$apply();
      }
    }
  };
})
.directive("fileread", [function () {
  return {
    link: function(scope, element, attributes) {
      element.bind("change", function(changeEvent) {
        var reader = new FileReader();
        reader.onload = function(loadEvent) {
          var fileText = loadEvent.target.result;
          console.log(fileText);
          if (attributes.map) {
            var mapDiv = document.getElementById("map");
            mapDiv.innerText = fileText;
            scope.$apply(function () {
              scope.map = true;
            });
          } else {
            var parsedJSON = JSON.parse(fileText);
            console.log('parsed Obj', parsedJSON);
            scope.$apply(function () {
              scope.inputData = parsedJSON;
            });
          }
        }
        reader.readAsText(changeEvent.target.files[0]);
      });
    }
  }
}]);;
