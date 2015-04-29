var controllers = angular.module('controllers');

/**
 * For the category/region search view
 */
controllers.controller('SearchCtrl', ['$scope', '$http', '$location', 'ServicesList', 'Search', function ($scope, $http, $location, ServicesList, Search) {

    ServicesList.get(function (data) {
        Search.clearAll();
        $scope.services = data;
        // Here we're going to extract the list of categories and display them in a simple template
        
        // use an object to collect service information since object keys won't allow
        // for duplicates (this basically acts as a set)
        var categories = {};
        var regions = {};
        angular.forEach(data, function (service, index) {
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
        var unsortedRegions = $.map(regions, function (value, index) {
            return {name: index, count: value};
        });

        $scope.regions = unsortedRegions.sort(function (regionA, regionB) {
            return regionA.name.localeCompare(regionB.name);
        });
    });

    $scope.toggleCategory = function(categoryName) {
        var categoryDivId = categoryName + 'Activities';
        $( '#' + categoryDivId ).toggleClass('hidden');
    }
}]);
