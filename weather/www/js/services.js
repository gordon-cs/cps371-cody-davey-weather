/* Notes on forecast.io's API:
 *  - daily.data[0] is today
 * By: Cody Davey & Travis Pullen
 */

/* weatherStore holds data for weatherData service.
 */
weatherApp.factory('weatherStore', function() {
    var weatherStore = {
        current : {}
    };

    return weatherStore;
});

/* weatherData service gets weather data (current, forecasts, and
 * historical), processes it as necessary, and provides it to controllers.
 */
weatherApp.service('weatherData', ['$q', '$resource', '$http',
                                   'FORECASTIO_KEY', 'weatherStore',
    function($q, $resource, $http, FORECASTIO_KEY, weatherStore) {
        this.getCurrentWeather = function(lat, lng) {
            var url = 'https://api.forecast.io/forecast/' +
                FORECASTIO_KEY + "/" + lat + ',' + lng;

            // JSONP is only needed for "ionic serve".
            // Simpler $http.get(url) works on devices.
            return $http.jsonp(url + '?callback=JSON_CALLBACK').then(
                function success(resp) {
                    weatherStore.current = resp.data;
                    console.log('GOT CURRENT');
                    console.dir(weatherStore.current);
                },
                function failure(error) {
                    alert('Unable to get current conditions');
                    console.error(error);
                });
        };

        this.getLocation = function() {
            return $q(function(resolve, reject) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                }, function(err) {
                    reject(err);
                });
            });
        };

        // Round temp to tenths of a degree.
        this.roundTemp = function(temp) {
            if (Math.abs(temp) >= 10) {
                return temp.toPrecision(3);
            } else {
                return temp.toPrecision(2);
            }
        };

        // Return current temperature
        this.tempNow = function() {
            return this.roundTemp(weatherStore.current.currently.temperature);
        };

        // Return weather data for tomorrow.
        this.weatherTomorrow = function() {
			var temp = this.roundTemp(
				weatherStore.current.daily.data[1].temperatureMax);
			var precip = weatherStore.current.daily.data[1].precipIntensity;
			return [precip, temp,];
        };
		
		// Return weather data for day 2
        this.weatherDay2 = function() {
            var temp = this.roundTemp(
						weatherStore.current.daily.data[2].temperatureMax);
			var precip = weatherStore.current.daily.data[2].precipIntensity;
			return [precip, temp];
        };
		
		// Return weather data for day 3
        this.weatherDay3 = function() {
            var temp = this.roundTemp(
						weatherStore.current.daily.data[3].temperatureMax);
			var precip = weatherStore.current.daily.data[3].precipIntensity;
			return [precip, temp];
        };
			
		// Return weather data for day 4
        this.weatherDay4 = function() {
            var temp = this.roundTemp(
						weatherStore.current.daily.data[4].temperatureMax);
			var precip = weatherStore.current.daily.data[4].precipIntensity;
			return [precip, temp];
        };
		
		// Return weather data for day 5
        this.weatherDay5 = function() {
            var temp = this.roundTemp(
						weatherStore.current.daily.data[5].temperatureMax);
			var precip = weatherStore.current.daily.data[5].precipIntensity;
			return [precip, temp];
        };
		
		// Return weather data for day 6
        this.weatherDay6 = function() {
            var temp = this.roundTemp(
						weatherStore.current.daily.data[6].temperatureMax);
			var precip = weatherStore.current.daily.data[6].precipIntensity;
			return [precip, temp];
        };
		
		//Return weather for tonight
        this.tempToMidnightLow = function() {
            var low = this.tempNow();
            var start = this.findHourNow();
            var end = this.findHourMidnight();
            if (start >= 0 && end >= 0) {
                for (var i = start; i <= end; i++) {
                    low = Math.min(low,
                            weatherStore.current.hourly.data[i].temperature);
                }
            }

            return this.roundTemp(low);
        };
		
		//Return the intensity of precipitation
		this.todayPrecip = function() {
			return weatherStore.current.hourly.data[0].precipIntensity;
		};
		
		//Return the correct picture for the current day
		//depending on the current weather
		this.getPicture = function() {
			var pic;
			var precip = weatherStore.current.daily.data[0].precipIntensity;
			if (precip == 0) {
				pic = "https://cdn.evbuc.com/eventlogos/29589191/sunnybig.png"
			};
			if (precip > 0 && precip <= .1) {
				pic = "https://cdn3.iconfinder.com/data/icons/weather-icons-1/64/Sun_Behind_Cloud-512.png"
			};
			if (precip > .1) {
				pic = "http://www.iconpng.com/png/pictograms/rain.png"
			};
			return pic;
		};
		
		//Return the wind speed for the current day
		this.todayWind = function() {
			return weatherStore.current.hourly.data[0].windSpeed;
		};

        // Return the index into hourly of the hour, if any, which
        // contains time (unix time in sec).  Return -1 if not found.
        // Assume the time in hourly.data is the start of the hour.
        this.findHour = function(time) {
            var i = 0;
            while (i < weatherStore.current.hourly.data.length &&
                   weatherStore.current.hourly.data[i].time > time) {
                i++;
            }
            if (i < weatherStore.current.hourly.data.length) {
                return i;
            } else {
                return -1;
            }
        };

        // Return findHour() (i.e., index into hourly) for current time.
        this.findHourNow = function() {
            return this.findHour(Date.now() / 1000); // millisec -> sec
        };

        // Return findHour() (i.e., index into hourly) for 11:50pm today.
        this.findHourMidnight = function() {
            var d = new Date();
            d.setHours(23);
            d.setMinutes(50); // 11:50pm today
            return this.findHour(d.getTime() / 1000); // millisec -> sec
        };
		
		
		//Return the days for the weather reports
		this.findDays = function() {
			var d = new Date();
			var nextDay = new Array(7);
			var weekday = new Array(7);
			
			weekday[0]=  "Sunday";
			weekday[1] = "Monday";
			weekday[2] = "Tuesday";
			weekday[3] = "Wednesday";
			weekday[4] = "Thursday";
			weekday[5] = "Friday";
			weekday[6] = "Saturday";
			
			d = d.getDay();
			for (var i = 0; i <= 6; i++) {
				var n = d + i;
				if(n > 6){
					n = n-7;
					nextDay[i] = weekday[n];
				}
				else{
					nextDay[i] = weekday[n];
				}
			}
			return nextDay;
		};
    }]);