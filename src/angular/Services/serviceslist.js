/*** Services ***/
var services = angular.module('services');

/**
 * Provides the list of services (compiled.json)
 */
services.factory('ServicesList', ['$resource', function ($resource) {
    return $resource('src/compiled.json', {}, {
        get: {method: 'GET', isArray: true, cache: true}
    });
}]);
