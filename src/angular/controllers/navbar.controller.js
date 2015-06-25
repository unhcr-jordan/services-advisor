var controllers = angular.module('controllers');

controllers.controller('NavbarCtrl', ['$scope', '$translate', function ($scope, $translate) {
  $scope.languages = ['AR','EN'];
  $scope.selectedLanguage = 'AR';

  $scope.changeLanguage = function (langKey) {
    console.log('changeLanguage: ' + langKey);
    $translate.use(langKey.toLowerCase());
  };

  $(".filter-pill").click(function(event) {
    //TODO
    console.log("Clicked filter pill");
    event.stopPropagation();
  })
}]);

