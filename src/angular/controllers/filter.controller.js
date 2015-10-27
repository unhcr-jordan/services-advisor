var controllers = angular.module('controllers');

/* 

   Handles the filter view logic 

*/

controllers.controller('FilterCtrl', ['$scope', '$rootScope', '$location', 'Search', 'ServicesList', '_', '$timeout', function ($scope, $rootScope, $location, Search, ServicesList, _, $timeout) {

    // defines a function to callback function for filtering data 
    var collectOrganizations = function(data){

        /* 
           1. Original Organization/Partner name array

           Here we make use of methods in underscore to pluck the organization names 

Sample: ["IOCC", "UNHCR", "WVI", "JRS", ...,  "NHF"]
*/
    organizationsArray   = _.chain(data) 
                            .pluck("properties")
                            // partnerName is same as 'Organization'
                            .pluck("partnerName")
                            .unique()
                            .value();
    /*

       2. Spliting the Array into two arrays (For Column Display)

       Divide the organization names by half since we have two columns                         

*/                             
        var splitValue = organizationsArray.length/2;    

        // Using the split value, we divide the array evenly into two separate arrays 
        // Resulting array = [ ['UNHCR', 'stuff '], ['stuff', 'stuff'] ]
        $scope.organizationsArray = _.chain(organizationsArray)
        // Converts the array into an even Split
                                    .groupBy(function(element, index){
                                        return Math.floor(index/splitValue);
                                    })
                                    .toArray()
                                    .value();
        /*

           3. Getting an Object that maps to Partner Logo URL 

           Creating a separate scope variable that maps Partner name to the respective Logo URL 
           We are doing this mainly not to temper with the original format of the Partner name in organizationsArray

Example : "IFH/NFH " requires the " " at the end in order to map to the original object to make changes to
side bar pill and the map 

Data: Object 

*/
        $scope.partnerLogoUrl = _.object(
                _.map(organizationsArray,function(partnerName){
                    // Maps to an array to be converted to an Object
                    // Sample: ["IOCC", ".src/images/partner/IOCC.jpg"]
                    return [partnerName, './src/images/partner/' + partnerName.replace(/\//g,"-").replace(/\s/g, "").toLowerCase() + '.jpg']
                    })
                )                             


    }

    $rootScope.filterSelection = []

    // calls the ServiceList function get which takes a call back function 
    // in this case we are collecting Organizations
    ServicesList.get(collectOrganizations);

    // selected organizations
    $scope.toggleReferral = function(value) {
        var parameters = $location.search();
        if ($scope.referral.selection == 'all') {
            //Don't display the 'all' filter
            if (_.has(parameters, 'referrals')){
                delete parameters.referrals
            }
        } else {
            parameters.referrals = $scope.referral.selection;
        }
        $location.search(parameters);
        Search.filterByUrlParameters();
        // Search.selectReferrals($scope.referral.selection);
    };

    $scope.referral = {
        selection: 'all'
    };

    // toggle selection for a given organization by name
    $scope.toggleSelection = function toggleSelection(organization) {

        var parameters = $location.search();
        if (_.has(parameters, 'organization')){
            // Added conditional because sometimes the parameters.organization are strings separated by comma 
            // ex. "UNHCR,IFC....etc"      
            if(typeof(parameters.organization) == "string"){
                var organizations =  parameters.organization.split(',');
            }else {
                var organizations = parameters.organization;
            }
            var idx = organizations.indexOf(organization);
            // is currently selected - splice that organization from selected array
            if (idx > -1) {
                organizations.splice(idx, 1);
            }
            // is newly selected - push organization into the selection array
            else {
                organizations.push(organization);
            }
            parameters.organization = organizations;
        } else {
            parameters.organization = [organization];
        }
        // still binding the pills to filterSeletion.
        $rootScope.filterSelection = parameters.organization;

        $location.search(parameters);

        Search.filterByUrlParameters();

        $timeout(function () {
            // hack to reset body padding height so if the size of the filter bar grows we can
            // still see the rest of the UI. Wrapped in timeout because need angular to refresh the UI
            // so we can read the height and couldn't figure out how to hook into that event
            $("body").css("padding-top", $("#searchNav").height() + "px");
        }, 2);
    };

    $scope.toggleFilters = toggleFilters;

}]);

