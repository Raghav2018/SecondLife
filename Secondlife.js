	  var findNearestTraumaCenter = function() {
	  var directionsDisplay;
	  var directionsService = new google.maps.DirectionsService();
	  var map;
	  var size = 0;
	  var currentPosition;
	  
	  // An array to store results calculated using Google routing API.
	  var googleApiRouteResults = [];

	  // An array of trauma centers.
	  var listOfTraumaCenters = [
		{'title': 'Hospital Sri Krishna Sevashrama, Jaya Nagar', 'latLng': new google.maps.LatLng(12.917584, 77.585133)},
		{'title': 'Maiya Multispeciality Hospital, Jaya Nagar', 'latLng': new google.maps.LatLng(12.942653, 77.585427)},
		{'title': 'Manasa Neuropsychiatric Hospital, Jaya Nagar', 'latLng': new google.maps.LatLng(12.940202, 77.585398)},
		{'title': 'Sino Vedic Cancer Clinic, Jaya Nagar', 'latLng': new google.maps.LatLng(12.928227, 77.581766)}
	  ];

	  // initialize on page load to find nearest trauma centers from current location 
	  function initialize(currentLat, currentLng) {
		currentPosition = new google.maps.LatLng(currentLat, currentLng);
		directionsDisplay = new google.maps.DirectionsRenderer();
		var mapOptions = {
		  zoom: 12,
		  center: currentPosition
		};
		map = new google.maps.Map(document.getElementById('map'), mapOptions);
		directionsDisplay.setMap(map);

		var marker = new google.maps.Marker({
			  position: currentPosition,
			  map: map,
			  label: {
				color: 'black',
				fontWeight: 'bold',
				text: 'Currrent location.',
			  },
			  icon: {
				labelOrigin: new google.maps.Point(11, 50),
				//dummy url kept on purpose to create space
				url: 'dummy.png',
				size: new google.maps.Size(22, 40),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(11, 40),
			  }
		});

		var i = listOfTraumaCenters.length;
		 while (i--) {
		  listOfTraumaCenters[i].marker = new google.maps.Marker({
		    position: listOfTraumaCenters[i].latLng,
			map: map,
			label: {
				color: 'black',
				fontWeight: 'bold',
				text: listOfTraumaCenters[i].title,
			},
			icon: {
				labelOrigin: new google.maps.Point(11, 50),
				//dummy url kept on purpose to create space
				url: 'dummy.png',
				size: new google.maps.Size(22, 40),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(11, 40),
			  }
		  });
		}
		findNearestPlaceTraumaCenter();
	  }

	  //Loop through all trauma centers to calculate route between the current location and trauma center
	  // Future : Filter by city / zip code to minimize th number of route calculation  
	  function findNearestPlaceTraumaCenter() {
		var i = listOfTraumaCenters.length;
		size = listOfTraumaCenters.length;
		googleApiRouteResults = [];
		while (i--) {
		  calculateRoute(listOfTraumaCenters[i].latLng, storeResult);
		}
	  }


	  // A function to calculate the fastest driving route between two locations.
	  //Future: Calculate all possible travel mode
	  function calculateRoute(end, callback) {
		var request = {
			origin: currentPosition,
			destination: end,
			travelMode: google.maps.TravelMode.DRIVING
		};
		directionsService.route(request, function(response, status) {
		  if (status == google.maps.DirectionsStatus.OK) {
			callback(response);
		  } else {
			size--;
		  }
		});
	  }


	  // Stores a routing result calculated using google API
	  function storeResult(data) {
		googleApiRouteResults.push(data);
		if (googleApiRouteResults.length === size) {
		  findShortest();
		}
	  }


	  // Loops through all the routes to thr route with shortest distance. Sets that route for the user to see. 
	  // Future: Find best route not just by distance but also by time, driving mode and other parameters
	  function findShortest() {
		var i = googleApiRouteResults.length;
		var shortestIndex = 0;
		var shortestLength = googleApiRouteResults[0].routes[0].legs[0].distance.value;

		while (i--) {
		  if (googleApiRouteResults[i].routes[0].legs[0].distance.value < shortestLength) {
			shortestIndex = i;
			shortestLength = googleApiRouteResults[i].routes[0].legs[0].distance.value;
		  }
		}
		directionsDisplay.setDirections(googleApiRouteResults[shortestIndex]);
	  }

	  return {
		init: initialize
	  };
	}();

	// Upon page load, find the nearest trauma center. Current location is hardcoded. 
	// Find current location based on browser API
	google.maps.event.addDomListener(window, 'load', findNearestTraumaCenter.init(12.925381, 77.585848));