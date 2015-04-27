var basePath = 'src/angular/';

// messing around with getting angular to work side by side with the current app
var servicesAdvisorApp = angular.module('servicesAdvisorApp', ['ngRoute', 'controllers', 'services']);


/*** Routing ***/
servicesAdvisorApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.

            // home is the category/region search page
            when('/', {
                templateUrl: basePath + 'partials/search.html',
                controller: 'SearchCtrl'
            }).

            // once a category/region is click on, we display the results
            when('/results', {
                templateUrl: basePath + 'partials/search-results.html',
                controller: 'ResultsCtrl'
            }).

            // when you click on a specific service in the result list
            when('/services/:serviceId', {
                templateUrl: basePath + 'partials/service.html',
                controller: 'ServiceCtrl'
            }).

            // the special filters view
            when('/filters', {
                templateUrl: basePath + 'partials/filters.html',
                controller: 'FilterCtrl'
            });
    }]);
/*** End Routing ***/






/*** Services ***/
var services = angular.module('services', ['ngResource']);

/**
 * Provides the list of services (compiled.json)
 */
services.factory('ServicesList', ['$http', function ($http) {
    var services = null;
    var servicesById = null;

    return {
        get: function (successCb) {
            if (services) {
                successCb(services);
            } else {
                $http.get('src/compiled.json', {cache: true})
                    .success(function (data, status, headers, config) {
                        angular.forEach(data, function (feature) {
                            var serviceMarker = L.marker(feature.geometry.coordinates.reverse(),
                                {icon: iconObjects[feature.properties.activityCategory]});
                            serviceMarker.addTo(clusterLayer);

                            // Make the popup, and bind it to the marker.  Add the service's unique ID
                            // as a classname; we'll use it later for the "Show details" action.
                            //serviceMarker.bindPopup(renderServiceText(feature, "marker"), {className:feature.id});

                            // Add the marker to the feature object, so we can re-use the same marker during render().
                            feature.properties.marker = serviceMarker;
                        });

                        services = data;
                        successCb(services)
                    });
            }
        },
        findById: function (id) {
            // TODO: this is a hack since we don't know if services has been initialized yet
            if (servicesById === null) {
                servicesById = {};
                angular.forEach(services, function (service) {
                    servicesById[service.id] = service;
                })
            }
            return servicesById[id];
        }
    }
}]);

/**
 * Holds the state of the current search and the current results of that search
 */
services.factory('Search', ['ServicesList', '$rootScope', function (ServicesList, $rootScope) {
    // asynchronously initialize crossfilter
    ServicesList.get(function (allServices) {
        crossfilter.add(allServices);

        // trigger initial map load
        $rootScope.$emit('FILTER_CHANGED')
    });

    /** Crossfilter Setup **/
    var crossfilter = require('crossfilter')();

    // TODO: not sure why they do || undefined, but previously they had "|| option.empty" where empty was never defined
    var categoryDimension = crossfilter.dimension(function (f) {
        return f.properties['activityName'] || undefined;
    });
    var referralDimension = crossfilter.dimension(function (f) {
        return f.properties['Referral required'] || undefined;
    });
    var partnerDimension = crossfilter.dimension(function (f) {
        return f.properties['partnerName'] || undefined;
    });

    // TODO: not sure if we need this anymore
    var proximityDimension = crossfilter.dimension(function (f) {
        return f.geometry.coordinates[0] + "," + f.geometry.coordinates[1] || "";
    });

    var regionDimension = crossfilter.dimension(function (f) {
        return f.geometry.coordinates[0] + "," + f.geometry.coordinates[1] || "";
    });

    /** Used to get list of currently filtered services rather than re-using an existing dimension **/
    var metaDimension = crossfilter.dimension(function (f) { return f.properties.activityName; });

    /** End crossfilter setup **/

    var servicesById;

    return {
        selectCategory: function (category) {
            categoryDimension.filter(function(service) {
                return service == category;
            });
            $rootScope.$emit('FILTER_CHANGED')
        },
        currResults: function () {
            return metaDimension.top(Infinity);
        }
    }
}]);

/*** End Services ***/


/*** Controllers ***/
var controllers = angular.module('controllers', []);

/**
 * For the category/region search view
 */
controllers.controller('SearchCtrl', ['$scope', '$http', '$location', 'ServicesList', 'Search', function ($scope, $http, $location, ServicesList, Search) {

    ServicesList.get(function (data) {
        $scope.services = data;
        // Here we're going to extract the list of categories and display them in a simple template
        
        // use an object to collect service information since object keys won't allow
        // for duplicates (this basically acts as a set)
        var categories = {};
        var regions = {};
        $.each(data, function (index, service) {
            // add activity and its category to list, and increment counter of this category's available services
            var category = service.properties.activityCategory;
            if (category) {
                if (categories[category] == null) {
                    categories[category] = {activities:{}, count: 0};
                }
                categories[category].count++;

                var activity = service.properties.activityName;
                if (activity) {
                    if (categories[category].activities[activity] == null) {
                        categories[category].activities[activity] = {name: activity, count: 0};
                    }
                    categories[category].activities[activity].count++;
                }
            }
            
            // add region to list, and increment counter of this region's available services
            var region = service.properties.locationName;
            if (region) {
                if (regions[region] == null) {
                    regions[region] = 0;
                }
                regions[region]++;
            }
        });

        // now to get an array of categories we just map over the keys of the object
        $scope.categories = $.map(categories, function (value, index) {
            return {name: index, count: value.count, activities: value.activities};
        });

        // now to get an array of regions we just map over the keys of the object
        $scope.regions = $.map(regions, function (value, index) {
            return {name: index, count: value};
        });
    });

    /**
     * When the user clicks on a category, we filter by that category and then navigate to the results view
     */
    $scope.selectCategory = function (category) {
        Search.selectCategory(category);
        $location.path("/results")
    }
}]);


/**
 * For the results view
 */
controllers.controller('ResultsCtrl', ['$scope', 'Search', function ($scope, Search) {
    
    // Filtered object based on the categories/regions 
    $scope.results = Search.currResults()
    
    // the methods below serves to get the key value in the object between each ng-repeat loop. 
    // The object is passed in from the view, manipulated then returned back.  

    // gets the opening time of the service 
    $scope.getOpeningTime = function(result){
        //define a variable to store the 'opening time'
        var openingTime = null;

        var timeObject = result.properties["8. Office Open at"];
        // Run this if the office opening time exists 
        if(timeObject){
            // Grabs the key value from the nested object which results in time in string
            openingTime = Object.keys(timeObject)[0];
        } 

        return openingTime;
    }

    // gets the closing time of the service 
    $scope.getClosingTime = function(result){
        //define a variable to store the 'closing time'
        var closingTime = null;
        var timeObject = result.properties["9. Office close at"];
        // Run this if the office closing time exists 
        if(timeObject){
            // Grabs the key value from the nested object which results in time in string
            closingTime = Object.keys(timeObject)[0];
        } 

        return closingTime;
    }

    // gets the activity details of the service 
    $scope.getActivityDetails = function(result){
        // Define a default variable value for activity details
        var activityDetails = ["Unknown"];
        var activities = result.properties["indicators"];
        // filters out the activites with zero count first
        for(key in activities){
            if(activities[key] === 0){
               delete activities[key];
            }
        }
        // if the activity exists we'll assign it to the store variable
        if(Object.keys(activities).length > 0){
             activityDetails = Object.keys(activities);
        } 

        return activityDetails;
    }
}]);

controllers.controller('NavbarCtrl', ['$scope', function ($scope) {}]);

controllers.controller('ServiceCtrl', ['$scope', '$routeParams', 'ServicesList', function ($scope, $routeParams, ServicesList) {
    var service = ServicesList.findById($routeParams.serviceId);
    $scope.service = {};
    $scope.service.id = service.id;
    $scope.service.locationName = service.properties.locationName;
    $scope.service.partnerName = service.properties.partnerName;
    $scope.service.comments = service.properties.comments;
    $scope.service.activityCategory = service.properties.activityCategory;
    $scope.service.activityName = service.properties.activityName;
    $scope.service.startDate = service.properties.startDate;
    $scope.service.endDate = service.properties.endDate;
    $.each(service.properties.indicators, function (index, value) {
        if (value) {
            $scope.service.activityDetails = index;
        }
    });
    var propList = new Array();
    $scope.hours = new Array();
    $.each(service.properties, function (index, value) {
        var tempArray = new Array();
        tempArray = index.split(".");
        if (index != 'comments' && tempArray.length > 1) {
            if ($.isNumeric(tempArray[0])) {
                //TODO: Let's see if we can print it from index rather than creating new object for it again.
                var obj = {};
                var level = parseInt(tempArray[0], 10);
                if (level != 8) {
                    obj.key = $.trim(tempArray[1]);
                    $.each(service.properties[index], function (index, value) {
                        if (value) {
                            obj.value = index;
                        }
                    });
                    propList[level] = obj;
                } else {
                    $.each(service.properties[index], function (index, value) {
                        if (value) {
                            $scope.hours.push(index);
                        }
                    });
                }
            }
        }
    });
    propList = $.grep(propList, function (n) {
        return (n)
    });
    $scope.service.properties = propList;

}]);

controllers.controller('MapCtrl', ['$scope', '$rootScope', 'Search', function ($scope, $rootScope, Search) {
    // Mapbox doesn't need its own var - it automatically attaches to Leaflet's L.
    require('mapbox.js');
    // Use Awesome Markers lib to produce font-icon map markers
    require('../leaflet.awesome-markers.js');
    // Marker clustering
    require('../../node_modules/leaflet.markercluster/dist/leaflet.markercluster.js');

    // Initialize the map, using Affinity Bridge's mapbox account.
    var map = L.mapbox.map('map', 'affinitybridge.ia7h38nj');

    // TODO: re-enable when UserLocation service is added
    // Object that holds user location - adds a layer with user's location marker
    //    var myLocation = new UserLocation(map);
    //
    //    map.on('load', function () {
    //        // Try to add user location marker
    //        getUserLocation();
    //    });

    // Initialize the empty layer for the markers, and add it to the map.
    // TODO: don't use global var here
    clusterLayer = new L.MarkerClusterGroup({
        zoomToBoundsOnClick: false,
        spiderfyDistanceMultiplier: 2,
        showCoverageOnHover: false
    }).addTo(map);
    // When user clicks on a cluster, zoom directly to its bounds.  If we don't do this,
    // they have to click repeatedly to zoom in enough for the cluster to spiderfy.
    clusterLayer.on('clusterclick', function (a) {
        // Close any popups that are open already. This helps if we came via "show on map" link,
        // which spawns an unbound popup.
        map.closePopup();
        // If the markers in this cluster are all in the same place, spiderfy on click.
        var bounds = a.layer.getBounds();
        if (bounds._northEast.equals(bounds._southWest)) {
            a.layer.spiderfy();
        } else {
            // If the markers in this cluster are NOT all in the same place, zoom in on them.
            a.layer.zoomToBounds();
        }
    });

    var polygonLayer = L.geoJson();
    map.addLayer(polygonLayer);

    // Match possible Activity Categories to Humanitarian Font icons.
    var iconGlyphs = {
        'CASH': {glyph: 'ocha-sector-cash', markerColor: '#a48658' },
        'EDUCATION': {glyph: 'ocha-sector-education', markerColor: '#c00000' },
        'FOOD': {glyph: 'ocha-sector-foodsecurity', markerColor: '#006600' },
        'HEALTH': {glyph: 'ocha-sector-health', markerColor: '#08a1d9' },
        'NFI': {glyph: 'ocha-item-reliefgood', markerColor: '#f96a1b' },
        'PROTECTION': {glyph: 'ocha-sector-protection', markerColor: '#1f497d' },
        'SHELTER': {glyph: 'ocha-sector-shelter', markerColor: '#989aac' },
        'WASH': {glyph: 'ocha-sector-wash', markerColor: '#7030a0' }
    };

    // TODO: remove global
    iconObjects = {};

    // Create the icon objects. We'll reuse the same icon for all markers in the same category.
    for (var category in iconGlyphs) {
        iconObjects[category] = L.AwesomeMarkers.icon({
            icon: iconGlyphs[category].glyph,
            prefix: 'icon', // necessary because Humanitarian Fonts prefixes its icon names with "icon"
            iconColor: iconGlyphs[category].markerColor,
            markerColor: "white",
            extraClasses: category
        });
    }


    var onChange = function(event) {
        var results = Search.currResults();

        // Clear all the map markers.
        clusterLayer.clearLayers();

        // Initialize the list-view output.
        //var listOutput = '<h3 class="hide">Services</h3>';

        // Initialize a list where we'll store the current markers for easy reference when
        // building the "show on map" functionality.  TODO: can we streamline this out?
        var markers = {};

        // Loop through the filtered results, adding the markers back to the map.
        results.forEach( function (feature) {
            // Add the filtered markers back to the map's data layer
            clusterLayer.addLayer(feature.properties.marker);
            // Store the marker for easy reference.
            markers[feature.id] = feature.properties.marker;
            // Build the output for the filtered list view
            //listOutput += renderServiceText(feature, "list");
        } );

        // Replace the contents of the list div with this new, filtered output.
        //$('#list').html(listOutput);

        // According functionality for the list - expand item when its header is clicked
        //$(".serviceText > header").click(function(event) {
        //    event.preventDefault();
        //    $(this).parent().toggleClass('expand');
        //    // Toggle the text of the "Show details" / "Hide details" link
        //    if ($(this).find('.show-details').html() === "Show details") {
        //        $(this).find('.show-details').html("Hide details");
        //    } else {
        //        $(this).find('.show-details').html("Show details");
        //    }
        //});

        // Bind "show on map" behavior.  Do this here because now the list exists.
        //$(".show-on-map").click(function(e) {
        //    // Get the unique ID of this service.
        //    var id = e.target.id;
        //    // Close any popups that are open already.
        //    map.closePopup();
        //    // Fire the map/list toggler click event, to switch to viewing the map.
        //    $("#map-list-toggler").click();
        //    // Pan and zoom the map.
        //    map.panTo(markers[id]._latlng);
        //    if (map.getZoom() < 12) { map.setZoom(12); }
        //    // Clone the popup for this marker.  We'll show it at the correct lat-long, but
        //    // unbound from the marker.  We do this in case the marker is in a cluster.
        //    var unboundPopup = markers[id].getPopup();
        //    // Send the service's unique ID as the className of the popup, so that the "Show
        //    // details" binding will work as usual when the popupopen event fires; also, offset
        //    // the Y position so the popup is a little bit above the marker or cluster.
        //    map.openPopup(L.popup({className:id, offset: new L.Point(0,-25)})
        //        .setLatLng(markers[id]._latlng)
        //        .setContent(markers[id].getPopup()._content));
        //});
    };

    $rootScope.$on('FILTER_CHANGED', onChange);
}]);

/*** End Controllers ***/
