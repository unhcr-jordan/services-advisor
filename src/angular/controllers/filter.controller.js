var controllers = angular.module('controllers');

/* 

  Handles the filter view logic 

*/

controllers.controller('FilterCtrl', ['$scope', 'Search', function ($scope, Search) {

  $scope.test = function(){
    console.log('Hey this worked eh? ');
  }


}]);

