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
    'APP_NAME': 'UNHCR Services Advisor',
    'CATEGORY': 'فئة',
    'SEARCH_TEXT': 'العثور على الخدمة، اختر من فئة أو منطقة أدناه. استخدم زر مرشح فوق لمزيد من تضييق نطاق البحث.',
    'REGION': 'منطقة',
    'FILTERS': 'بحثك صفي',
    'TOGGLE_MAP': 'الخريطة إخفاء / ظهار إ',
    'CLEAR': 'امسح',
    'REFERRAL_REQUIRED': 'إحالة مطلوب',
    'CANCEL': 'إلغاء',
    'APPLY': 'طبق',
    'ORGANIZATIONS': 'المنظمات',
    'DISTANCE': 'مسافه',
    'BACK': 'ارجع',
    'SEARCH_RESULTS': 'البحث نتائج',
    'HOURS': 'ساعات',
    'NA': 'ينطبق لا',
    'ACTIVITY_DETAILS': 'النشاط تفاصيل',
    'START_DATE': 'البداية تاريخ',
    'END_DATE': 'النهاية تاريخ',
    'SHOW_ON_ ACTIVITYINFO': 'ActivityInfo نشاط معلومات على أعرض',
    'SEARCH': 'بحث'
  });
}]);
