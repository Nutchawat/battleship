var application = angular.module('application-name', ['ui.router'
    , 'application.directives']);

application.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when("", "/deploy");
    $urlRouterProvider.otherwise("/deploy");

    $stateProvider
        .state('deploy', {
            abstract: false,
            url: '/deploy',
            templateUrl: 'views/deploy_ships/deploy.html'
        });
}]);