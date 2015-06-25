var controllers = angular.module('controllers');

/* 

  Handles the filter view logic 

*/

controllers.controller('FilterCtrl', ['$scope', '$rootScope', 'Search', 'ServicesList', '_', function ($scope, $rootScope, Search, ServicesList, _) {

 // defines a function to callback function for filtering data 
  var collectOrganizations = function(data){
    /* 

     Here we make use of methods in underscore 

      chain - returns a wrapped object & calling methods on 
              it will continue to return wrapped objects 
              (calling VALUE will return final value)

      pluck - extracting data from the objects inside the data array 
      flatten 

      unique - grabs the unique values 

    */
     $scope.organizations = _.chain(data) 
                             .pluck("properties")
                             // partnerName is same as 'Organization'
                             .pluck("partnerName")
                             .unique()
                             .value();
  }

  $rootScope.filterSelection = []
 
  // calls the ServiceList function get which takes a call back function 
  // in this case we are collecting Organizations
  ServicesList.get(collectOrganizations);

  // toggle selection for a given organization by name
  $scope.toggleSelection = function toggleSelection(organization) {

    // selected organizations
    // var selection = [];
    
    // stores the index of the organization currently being click
    var idx = $rootScope.filterSelection.indexOf(organization);

    // is currently selected - splice that organization from selected array
    if (idx > -1) {
      $rootScope.filterSelection.splice(idx, 1);

      // Call search service to toggle that a certain partner was * un-selected *
      Search.selectPartner(organization);
    }

    // is newly selected - push organization into the selection array
    else {
      $rootScope.filterSelection.push(organization);

      // Call search service to toggle that a certain partner was * selected * 
      Search.selectPartner(organization);
    }
    
  };
}]);

