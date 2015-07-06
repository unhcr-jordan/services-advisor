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
  });

  $scope.toggleFilters = toggleFilters;
}]); 

// Global so that filters.controller can access this via its scope
// TODO: Should probably put this somewhere else
toggleFilters = function() {
  $('#filters').toggleClass('hidden');

  var filterPlaceholder = $('#filterPlaceholder');
  if(! $('#filters').hasClass('hidden')) {
    filterPlaceholder.hide();
  }
  else if ($('#filterSummary').find('button.filter-pill').length == 0) {
    filterPlaceholder.show();
  }
  else {
    filterPlaceholder.hide();
  }
};