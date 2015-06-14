var controllers = angular.module('controllers');

/* 

  Handles the filter view logic 

*/

controllers.controller('FilterCtrl', ['$scope', 'Search', 'ServicesList', '_', function ($scope, Search, ServicesList, _) {

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
     var organizationsArray  = _.chain(data) 
                             .pluck("properties")
                             // partnerName is same as 'Organization'
                             .pluck("partnerName")
                             .unique()
                             .value();


    // Divide the organization names by half since we have two columns                         
    var splitValue = organizationsArray.length/2;    
    
    // Using the split value, we divide the array evenly into two separate arrays 
    // Results array = [ ['UNHCR', 'stuff '], ['stuff', 'stuff'] ]

    $scope.organizationsArray = _.chain(organizationsArray)
                                  // Converts the array into an even Split
                                 .groupBy(function(element, index){
                                    return Math.floor(index/splitValue);
                                  })
                                 .toArray()
                                 .value();
  }
 
  // calls the ServiceList function get which takes a call back function 
  // in this case we are collecting Organizations
  ServicesList.get(collectOrganizations);

  // selected organizations
  var selection = [];
  
  // toggle selection for a given organization by name
  $scope.toggleSelection = function toggleSelection(organization) {
   
    // stores the index of the organization currently being click
    var idx = selection.indexOf(organization);
    
    // is currently selected - splice that organization from selected array
    if (idx > -1) {
      
      selection.splice(idx, 1);

      // A Hack Around to Re-render map when User Un-selectes items 
      // TODO: *** Better solution: Have a Un-filter method in the Search Services for SelectPartner *** 
      
        // 1. Reset the Map
        Search.clearAll();

        // 2. Make Calls to select the remaining partners left in the selected Organization array defined 
        _.each(selection, function(organizationSelected){
          Search.selectPartner(organizationSelected);
        })
      
    }

    // is newly selected - push organization into the selection array
    else {
      selection.push(organization);
      // Call search service to toggle that a certain partner was * selected * 
      Search.selectPartner(organization);
    }
    
  };


}]);

