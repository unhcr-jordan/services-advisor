/*** Test Angular Integration ***/

// messing around with getting angular to work side by side with the current app
var servicesAdvisorApp = angular.module('servicesAdvisorApp', []);

servicesAdvisorApp.controller('TestCtrl', ['$scope', '$http', function ($scope, $http) {

    // we're loading compiled.json again from the server because it's easier
    // TODO: only load compiled.json once (see below at jQuery.getJSON)
    $http.get('src/compiled.json').success(function(data) {
        $scope.services = data;

        // Here we're going to extract the list of categories and display them in a simple template

        // use an object to collect categories of services since object keys won't allow
        // for duplicates (this basically acts as a set)
        var categories = {};
        $.each(data, function(index, service) {
            var category = service.properties.activityName;
            if (category) {
                categories[category] = true;
            }
        });

        // now to get an array of categories we just map over the keys of the object
        $scope.categories = $.map(categories, function(element,index) {return index});
    });
}]);
/*** End Test Angular Integration ***/
