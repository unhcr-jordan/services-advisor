var basePath = 'src/angular/';

// messing around with getting angular to work side by side with the current app
var servicesAdvisorApp = angular.module('servicesAdvisorApp', ['ngRoute', 'controllers', 'services']);


/*** Routing ***/
servicesAdvisorApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: basePath + 'partials/search.html',
                controller: 'SearchCtrl'
            }).
            when('/results/:query', {
                templateUrl: basePath + 'partials/search-results.html',
                controller: 'SearchResultsCtrl'
            }).
            when('/services/:serviceId', {
                templateUrl: basePath + 'partials/service.html',
                controller: 'ServiceCtrl'
            }).
            when('/filters', {
                templateUrl: basePath + 'partials/filters.html',
                controller: 'FilterCtrl'
            });
    }]);


/*** Services ***/
var services = angular.module('services', ['ngResource']);
services.factory('ServicesList', ['$resource', function ($resource) {
    return $resource('src/compiled.json', {}, {
        get: {method: 'GET', isArray: true, cache: true}
    });
}]);


services.factory('Search', ['ServicesList', function(ServicesList) {
    var allServices = ServicesList.get();
    var search = null;

    return {
        search: search,
        currResults: function () {
            return allServices; // for now we don't actually filter
        }
    }
}]);


var controllers = angular.module('controllers', []);

controllers.controller('SearchCtrl', ['$scope', '$http', 'ServicesList', function ($scope, $http, ServicesList) {

    ServicesList.get(function (data) {
        $scope.services = data;

        // Here we're going to extract the list of categories and display them in a simple template

        // use an object to collect categories of services since object keys won't allow
        // for duplicates (this basically acts as a set)
        var categories = {};
        $.each(data, function (index, service) {
            var category = service.properties.activityName;
            if (category) {
                categories[category] = true;
            }
        });

        // now to get an array of categories we just map over the keys of the object
        $scope.categories = $.map(categories, function (element, index) {
            return index
        });
    });
}]);
