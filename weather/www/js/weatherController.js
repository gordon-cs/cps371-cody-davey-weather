/* This simple app has only one view, and so only one controller.
 * Its job is to provide data (from the weatherData service) for display
 * by the html page (index.html).
 * By: Cody Davey & Travis Pullen
 */
weatherApp.controller('weatherCtrl',
    function($scope, $state, $http, $q, weatherData, LocationStore) {
        //read default settings into scope
        $scope.city = LocationStore.city;
		var weather = this;
        //var latitude = LocationStore.latitude;
        //var longitude = LocationStore.longitude;
		$scope.weather = {};
		$scope.zip = '';

        //call getCurrentWeather method in factory
        var weatherInit = function(lat, lng) {
            weatherData.getCurrentWeather(lat, lng).then(function() {
                $scope.tempCurrent = weatherData.tempNow();
                $scope.tempTonightLow = weatherData.tempToMidnightLow();
				$scope.todayPrecip = weatherData.todayPrecip();
				$scope.todayWind = weatherData.todayWind();
				$scope.findDays = weatherData.findDays();
				
				//calls for weather for next few days
				$scope.weatherTomorrow = weatherData.weather(1);
				$scope.weather2 = weatherData.weather(2);
				$scope.weather3 = weatherData.weather(3);
				$scope.weather4 = weatherData.weather(4);
				$scope.weather5 = weatherData.weather(5);
				$scope.weather6 = weatherData.weather(6);
				
				//calls for weather pic
				$scope.picToday = weatherData.getPicture(0);
				$scope.picTomorrow = weatherData.getPicture(1);
				$scope.pic3 = weatherData.getPicture(2);
				$scope.pic4 = weatherData.getPicture(3);
				$scope.pic5 = weatherData.getPicture(4);
				$scope.pic6 = weatherData.getPicture(5);
				$scope.pic7 = weatherData.getPicture(6);
				
				
				$scope.week = weatherData.getWeek();
            });
        };
		
		weather.data = weatherData;
		
        weatherData.getLocation() // getLocation returns the position obj
            .then(function(position) {
                weatherInit(position.latitude, position.longitude);
            }, function(err) {
                console.log(err);
                weatherInit(latitude, longitude);
            });
			
		//Looked at Andrew Ware's code for city handling and using zip to determine location
		$scope.geoLoc = {};
		$scope.getLocation = function() {
			return $q(function(resolve, reject) {
				navigator.geolocation.getCurrentPosition(function(Position) {
					resolve({
						latitude: Position.coords.latitude,
						longitude: Position.coords.longitude
				});
			}, function(err) {
				reject(err);
				});
			});
		};
		
		$scope.getLatLng = function(zipCode) {
			if(!zipCode || zipCode.length < 5) return;
			$scope.zip = zipCode;
			$http.get('http://maps.googleapis.com/maps/api/geocode/json?address=' + zipCode)
				.then(function(data) {
					var lat = data.data.results[0].geometry.location.lat;
					var lng = data.data.results[0].geometry.location.lng;
					var address = data.data.results[0].formatted_address.replace(/,/g, "").split(" ");
					var city = address[0];
					var state = address [1];
					if(state.length > 0 && state.length < 3) $scope.weather.city = city + ', ' + state;
					else $scope.weather.city = city;
					weatherInit(lat, lng);
				}).catch(function(err) {
					console.log(err);
				});
		};
		
		$scope.getZip = function(lat, lng) {
            $http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng='+ lat + ',' + lng + '&sensor=true')
                .then(function(data) {
					console.dir(data);
                    $scope.zip = data.data.results[0].address_components[6].long_name;
                    var city = data.data.results[1].address_components[2].long_name;
                    var state = data.data.results[1].address_components[4].short_name;
                    if (state.length > 0 && state.length < 3) $scope.weather.city = city + ', ' + state;
                    else $scope.weather.city = city;
                }).catch(function(err) {
                    console.log(err);
                });
        }
		
		$scope.init = function(notFirstTime) {
            $scope.zip = '01984'
			console.log($scope.zip);
            $scope.getLocation()
                .then(function(position) {
                    var latitude = position.latitude;
                    var longitude = position.longitude;
                    $scope.getZip(latitude, longitude);
                    weatherInit(latitude, longitude);
                }, function(reason) {
                    console.log(reason);
                    $scope.getLatLng($scope.zip); // gets lat and lng using Google Maps API then calls getWeather
                });
        };
    });
	