/* This simple app has only one view, and so only one controller.
 * Its job is to provide data (from the weatherData service) for display
 * by the html page (index.html).
 * By: Cody Davey & Travis Pullen
 */
weatherApp.controller('weatherCtrl',
    function($scope, $state, weatherData, LocationStore) {
        //read default settings into scope
        console.log('inside home');
        $scope.city = LocationStore.city;
        var latitude = LocationStore.latitude;
        var longitude = LocationStore.longitude;

        //call getCurrentWeather method in factory
        var weatherInit = function(lat, lng) {
            weatherData.getCurrentWeather(lat, lng).then(function() {
                $scope.tempCurrent = weatherData.tempNow();
                $scope.weatherTomorrow = weatherData.weatherTomorrow();
                $scope.tempTonightLow = weatherData.tempToMidnightLow();
				$scope.todayPrecip = weatherData.todayPrecip();
				$scope.getPicture = weatherData.getPicture();
				$scope.todayWind = weatherData.todayWind();
				$scope.findDays = weatherData.findDays();
				$scope.weatherDay2 = weatherData.weatherDay2();
				$scope.weatherDay3 = weatherData.weatherDay3();
				$scope.weatherDay4 = weatherData.weatherDay4();
				$scope.weatherDay5 = weatherData.weatherDay5();
				$scope.weatherDay6 = weatherData.weatherDay6();
            });
        };

        weatherData.getLocation() // getLocation returns the position obj
            .then(function(position) {
                weatherInit(position.latitude, position.longitude);
            }, function(err) {
                console.log(err);
                weatherInit(latitude, longitude);
            });

    });
  
 //Controller for popover/Dropdown menu
weatherApp.controller('EventsController', function($scope, $ionicPopover) {

  // .fromTemplate() method
  var template = '<ion-popover-view><ion-header-bar> <h1 class="title">Weekly</h1> </ion-header-bar> <ion-content> Hello! </ion-content></ion-popover-view>';

  $scope.popover = $ionicPopover.fromTemplate(template, {
    scope: $scope
  });

  // .fromTemplateUrl() method
  $ionicPopover.fromTemplateUrl('my-popover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });

  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };
  $scope.closePopover = function() {
    $scope.popover.hide();
  };
  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });
  // Execute action on hide popover
  $scope.$on('popover.hidden', function() {
    // Execute action
  });
  // Execute action on remove popover
  $scope.$on('popover.removed', function() {
    // Execute action
  });
});