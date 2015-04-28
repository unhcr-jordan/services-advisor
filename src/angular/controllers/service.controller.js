var controllers = angular.module('controllers');

controllers.controller('ServiceCtrl', ['$scope', '$routeParams', '$location', 'ServicesList', 'Search', function ($scope, $routeParams, $location, ServicesList, Search) {

    // when a user clicks on "Show Details" from a map popup, we don't want all the icons on the map to suddenly be hidden
    // when they come from a list view, we do
    if ($location.search().hideOthers !== "false") {
        // only called when coming from a list view
        Search.selectId($routeParams.serviceId);
    }

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
