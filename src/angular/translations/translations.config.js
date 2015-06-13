var servicesAdvisorApp = angular.module('servicesAdvisorApp');

servicesAdvisorApp.config(['$translateProvider', function ($translateProvider) {
  // default language is Arabic
  var defaultLanguage = 'ar';
  $translateProvider.preferredLanguage(defaultLanguage);

  $translateProvider.translations('en', {
    'APP_NAME': 'UNHCR Services Advisor',
    'CATEGORY': 'Category',
    'SEARCH_TEXT': 'To find a service, select from the category or region below. Use the filter button above to further refine your search.',
    'REGION': 'Region',
    'FILTERS': 'Filter your search',
    'TOGGLE_MAP': 'Show/Hide Map',
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


  $translateProvider.translations('ar', {
    'APP_NAME': '[TRANSLATE] UNHCR Services Advisor',
    'CATEGORY': '[TRANSLATE] Category',
    'SEARCH_TEXT': '[TRANSLATE] To find a service, select from the category or region below. Use the filter button above to further refine your search.',
    'REGION': '[TRANSLATE] Region',
    'FILTERS': '[TRANSLATE] Filter your search',
    'TOGGLE_MAP': '[TRANSLATE] Show/Hide Map',
    'CLEAR': '[TRANSLATE] Clear',
    'REFERRAL_REQUIRED': '[TRANSLATE] Referral Required',
    'CANCEL': '[TRANSLATE] Cancel',
    'APPLY': '[TRANSLATE] Apply',
    'ORGANIZATIONS': '[TRANSLATE] Organizations',
    'DISTANCE': '[TRANSLATE] Distance',
    'BACK': '[TRANSLATE] Back',
    'SEARCH_RESULTS': '[TRANSLATE] Search Results',
    'HOURS': '[TRANSLATE] Hours',
    'NA': '[TRANSLATE] N/A',
    'ACTIVITY_DETAILS': '[TRANSLATE] Activity Details',
    'START_DATE': '[TRANSLATE] Start Date',
    'END_DATE': '[TRANSLATE] End Date',
    'SHOW_ON_ ACTIVITYINFO': '[TRANSLATE] Show on ActivityInfo',
    'SEARCH': '[TRANSLATE] search'
  });
}]);
