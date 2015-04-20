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
services.factory('ServicesList', ['$resource', function ($resource) {
    return $resource('src/compiled.json', {}, {
        get: {method: 'GET', isArray: true, cache: true}
    });
}]);

/**
 * Holds the state of the current search and the current results of that search
 */
services.factory('Search', ['ServicesList', function (ServicesList) {
    // asynchronously initialize crossfilter
    ServicesList.get(function (allServices) {
        crossfilter.add(allServices);
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


    return {
        selectCategory: function (category) {
            categoryDimension.filter(function(service) {
                return service == category;
            });
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
            // add category to list, and increment counter of this category's available services
            var category = service.properties.activityName;
            if (category) {
                if (categories[category] == null) {
                    categories[category] = 0;
                }
                categories[category]++;
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
            return {name: index, count: value};
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
    $scope.results = Search.currResults();
}]);

/*** End Controllers ***/
