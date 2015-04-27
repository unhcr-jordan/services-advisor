// Registering the modules in the angular applications along
// with their dependencies

/*** Routes ***/
angular.module('servicesAdvisorApp', ['ngRoute', 'controllers', 'services', 'pascalprecht.translate']);

/*** Services ***/
angular.module('services', ['ngResource']);

/*** controllers ***/
angular.module('controllers', []);