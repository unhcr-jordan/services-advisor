var controllers = angular.module('controllers');

/* 

  Handles the filter view logic 

*/

controllers.controller('FilterCtrl', ['$scope', 'Search', 'ServicesList', '_', function ($scope, Search, ServicesList, _) {

 _.each([1, 2, 3],function(num){
  console.log(num)
 });

 var callback = function(data){
  console.dir(data);
 }
 
 ServicesList.get(callback);


  // referral required selected ? 
  // pass the result into the search service function 
  // Search.selectReferralRequired(true/false)
  $scope.referralFilter = false; 

  $scope.check = function(){
    $scope.referralFilter = !$scope.referralFilter;
  }

  // functions to apply the changes based on user selection
  $scope.applyFilter = function(){
    // applies the filter for the referral field 
    Search.selectReferralRequired($scope.referralFilter);

    //TODO:  Search.selectOrganization`

  }


}]);

