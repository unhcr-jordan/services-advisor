var controllers = angular.module('controllers');

controllers.controller('NavbarCtrl', ['$scope', 'Cookies', function ($scope, Cookies) {
  $scope.languages = ['AR','EN'];
  $scope.selectedLanguage = Cookies.getCookie('LANGUAGE') || 'AR';

  $scope.changeLanguage = function (langKey) {
    // we just set the cookie and reload since things aren't set up to properly reload new services list
    Cookies.setCookie('LANGUAGE', langKey);

    // reload to / because we use the translated word in the URL so the same url won't work in a different language
    // example: /#/results?category=Financial%20assistance
    window.location = "/";
  };

  $(".filter-pill").click(function(event) {
    //TODO
    event.stopPropagation();
  });

  $scope.toggleFilters = toggleFilters;
}]);

// Global so that filters.controller can access this via its scope
// TODO: Should probably put this somewhere else
toggleFilters = function() {
  $('#filters').toggleClass('hidden');
};
