var servicesAdvisorApp = angular.module('servicesAdvisorApp');

servicesAdvisorApp.config(['$translateProvider', function ($translateProvider) {
  $translateProvider.translations('en_EN', {
    'APP_NAME': 'UNHCR Services Advisor',
    'CATEGORY': 'Category',
    'SEARCH_TEXT': 'To find a service, select from the category or region below. Use the filter button above to further refine your search.',
    'REGION': 'Region',
    'FILTERS': 'Filters',
    'MAP': 'Map',
    'CLEAR': 'Clear',
    'REFERRAL_REQUIRED': 'Referral Required',
    'CANCEL': 'Cancel',
    'APPLY': 'Apply',
    'ORGANIZATIONS': 'Organizations',
    'DISTANCE': 'Distance',
    'BACK': 'Back',
    'SEARCH_RESULTS': 'Search Results',
    'HOURS': 'Hours',
    'NA': 'N/A',
    'ACTIVITY_DETAILS': 'Activity Details',
    'START_DATE': 'Start Date',
    'END_DATE': 'End Date',
    'SHOW_ON_ ACTIVITYINFO': 'Show on ActivityInfo',
    'SEARCH': 'search'
  });

  $translateProvider.preferredLanguage('en_EN');
}]);
