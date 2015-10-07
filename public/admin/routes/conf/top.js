var MetronicApp = angular.module("MetronicApp", [
    "ui.router",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize",
    "ngCookies",
    "tc.chartjs",
    "ngFileUpload",
    "ngBootstrap"
]);

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
MetronicApp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        cssFilesInsertBefore: 'ng_load_plugins_before' // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
    });
}]);

//AngularJS v1.3.x workaround for old style controller declarition in HTML
MetronicApp.config(['$controllerProvider', function($controllerProvider) {
    // this option might be handy for migrating old apps, but please don't use it
    // in new ones!
    $controllerProvider.allowGlobals();
}]);

/* Setup global settings */
MetronicApp.factory('settings', ['$rootScope', function($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        layoutImgPath: Metronic.getAssetsPath() + 'assets/img/',
        layoutCssPath: Metronic.getAssetsPath() + 'assets/css/'
    };

    $rootScope.settings = settings;

    return settings;
}]);

/* Setup App Main Controller */
MetronicApp.controller('AppController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function() {
        Metronic.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive
    });
}]);

/***
 Layout Partials.
 By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial
 initialization can be disabled and Layout.init() should be called on page load complete as explained above.
 ***/

/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', ['$scope', '$http', '$cookies', function($scope, $http, $cookies) {
    //        console.log("HeaderController");
    $scope.response = {};
    $scope.keyPress = function(keyCode) {
        // console.log($scope.name);


        $http.post('/admin/api/getGLobal', {
            data: $scope.name,
            token: $cookies.token
        }).
        success(function(data, status, headers, config) {
            //  console.log(data);

            $scope.response.client = data.Data[0].client;
            $scope.response.domain = data.Data[1].domain;
            $scope.response.order = data.Data[2].order;
            $scope.response.invoice = data.Data[3].invoice;
            // console.log( $scope.response.order)

        }).
        error(function(data, status, headers, config) {

        });

    }


    $scope.logout = function() {

        $cookies['token'] = "";
        window.location.href = "#/login.html";


    }


    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
    });
}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('PageHeadController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initFooter(); // init footer
    });
}]);

//MetronicApp.directive('fileModel', ['$parse', function ($parse) {
//    return {
//        restrict: 'A',
//        link: function(scope, element, attrs) {
//            var model = $parse(attrs.fileModel);
//            var modelSetter = model.assign;
//
//            element.bind('change', function(){
//                scope.$apply(function(){
//                    modelSetter(scope, element[0].files[0]);
//                });
//            });
//        }
//    };
//}]);
//
//MetronicApp.service('fileUpload', ['$http', function ($http) {
//    this.uploadFileToUrl = function(file, uploadUrl){
//        var fd = new FormData();
//        fd.append('file', file);
//        $http.post(uploadUrl, fd, {
//            transformRequest: angular.identity,
//            headers: {'Content-Type': undefined}
//        })
//        .success(function(){
//        })
//        .error(function(){
//        });
//    }
//}]);

/* Setup Rounting For All Pages */
MetronicApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    // MetronicApp.config(['$stateProvider', '$urlRouterProvider','$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/login.html");

    $stateProvider