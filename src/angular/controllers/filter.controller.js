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

     $scope.organizations = _.chain(data) 
                             .pluck("properties")
                             // partnerName is same as 'Organization'
                             .pluck("partnerName")
                             .unique()
                             .value();
  }
 
  // calls the ServiceList function get which takes a call back function 
  // in this case we are collecting Organizations
  ServicesList.get(collectOrganizations);


  // functions to apply the changes based on user selection
  $scope.applyFilter = function(){
    // applies the filter for the referral field 
    Search.selectReferralRequired($scope.referralFilter);

    //TODO:  Search.selectOrganization`

  }


}]);

