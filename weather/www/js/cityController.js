// Ionic Weather App - City Controller

'use strict';

var weatherApp = angular.module('weather')



.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.factory('Cities', function() {
  return {
    all: function() {
      var cityString = window.localStorage['cities'];
      if(cityString) {
        return angular.fromJson(cityString);
      }
      return [];
    },
    save: function(cities) {
      window.localStorage['cities'] = angular.toJson(cities);
    },
    newCity: function(cityTitle) {
      // Add a new City
      return {
        title: cityTitle,
      };
    },
    getLastActiveIndex: function() {
      return parseInt(window.localStorage['lastActiveCity']) || 0;
    },
    setLastActiveIndex: function(index) {
      window.localStorage['lastActiveCity'] = index;
    }
  }
})

weatherApp.controller('cityCtrl', function($scope, $timeout, $ionicModal, Cities, $ionicSideMenuDelegate) {

  // A utility function for creating a new City
  // with the given cityTitle
  var createCity = function(cityTitle) {
    var newCity = Cities.newCity(cityTitle);
    $scope.cities.push(newCity);
    Cities.save($scope.cities);
    $scope.selectCity(newCity, $scope.cities.length-1);
  }
  
    // Load or initialize cities
  $scope.cities = Cities.all();

  // Grab the last active, or the first city
  $scope.activeCity = $scope.cities[Cities.getLastActiveIndex()];

  // Called to create a new city
  $scope.newCity = function() {
    var cityTitle = prompt('City name');
    if(cityTitle) {
      createCity(cityTitle);
    }
  };
  
    // Called to select the given city
  $scope.selectCity = function(city, index) {
    $scope.activeCity = city;
    Cities.setLastActiveIndex(index);
    $ionicSideMenuDelegate.toggleLeft(false);
  };
  
  
	$scope.toggleCities = function() {
		$ionicSideMenuDelegate.toggleLeft();
    };
  
    // Try to create the first city, make sure to defer
  // this by using $timeout so everything is initialized
  // properly
  $timeout(function() {
    if($scope.cities.length == 0) {
      while(true) {
        var cityTitle = prompt('Your first city:');
        if(cityTitle) {
          createCity(cityTitle);
          break;
        }
      }
    }
  });
  

});
