/***
Billing AngularJS App Main Script
***/

/* Billing App */
var BillingApp = angular.module("BillingApp", [
    "ui.router",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize",
    "credit-cards"
]);

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
BillingApp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        cssFilesInsertBefore: 'ng_load_plugins_before' // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
    });
}]);

/********************************************
 BEGIN: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

//AngularJS v1.3.x workaround for old style controller declarition in HTML
BillingApp.config(['$controllerProvider', function($controllerProvider) {
    // this option might be handy for migrating old apps, but please don't use it
    // in new ones!
    $controllerProvider.allowGlobals();
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

/* Setup global settings */
BillingApp.factory('settings', ['$rootScope', function($rootScope) {

    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        layoutImgPath: Billing.getAssetsPath() + 'admin/layout/img/',
        layoutCssPath: Billing.getAssetsPath() + 'admin/layout/css/'
    };

    $rootScope.settings = settings;

    return settings;
}]);

/* Setup App Main Controller */
BillingApp.controller('AppController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function() {
        Billing.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive
    });
}]);

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */
BillingApp.controller('HeaderController', ['$scope', '$rootScope', function($scope, $rootScope) {

    $scope.$on('$includeContentLoaded', function() {

        Layout.initHeader(); // init header
        //  $scope.username=$rootScope.user.username;
    });
}]);

/* Setup Layout Part - Sidebar */
BillingApp.controller('SidebarController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initSidebar(); // init sidebar
    });
}]);

/* Setup Layout Part - Sidebar */
BillingApp.controller('PageHeadController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
BillingApp.controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initFooter(); // init footer
    });
}]);


/* Setup Rounting For All Pages */
BillingApp.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {

    $httpProvider.interceptors.push('AuthInterceptor');
    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/signup");

    $stateProvider

    //starts here  //ackcode
  .state('ackcode', {
            url: "/ackcode/:ackcode",
            controller: "ackcodeController",
            templateUrl: "client/views/authentication/ackcode.html",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'BillingApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'client/assets/css/views/auth.css',
                            'client/assets/css/datepicker3.css',
                            'client/assets/css/select2.css',
                            'client/assets/css/todo.css',

                            'client/assets/js/lib/bootstrap-datepicker.js',
                            'client/assets/js/lib/select2.min.js',

                            'client/assets/js/lib/index.js',

                            'client/controllers/authentication/ackcode.js'
                        ]
                    });
                }]
            }
        })
  //forgot password
   .state('forgot', {
            url: "/forgot",
            templateUrl: "client/views/authentication/forgotpassword.html",
            controller: "fpasswordController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'BillingApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'client/controllers/authentication/fpass.js'
                        ]
                    });
                }]
            }
        })

  .state('message', {
        url: "/message/:no",
        controller: "messageController",
        templateUrl: "client/views/authentication/message.html",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'BillingApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'client/assets/css/views/auth.css',
                        'client/assets/css/datepicker3.css',
                        'client/assets/css/select2.css',
                        'client/assets/css/todo.css',

                        'client/assets/js/lib/bootstrap-datepicker.js',
                        'client/assets/js/lib/select2.min.js',

                        'client/assets/js/lib/index.js',

                        'client/controllers/authentication/message.js'
                    ]
                });
            }]
        }
    })
  //payment verfication
   .state('paymentv', {
            url: "/paymentv",
            controller: "paymentvController",
            templateUrl: "client/views/authentication/paymentv.html",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'BillingApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'client/assets/css/views/auth.css',
                            'client/assets/css/datepicker3.css',
                            'client/assets/css/select2.css',
                            'client/assets/css/todo.css',

                            'client/assets/js/lib/bootstrap-datepicker.js',
                            'client/assets/js/lib/select2.min.js',

                            'client/assets/js/lib/index.js',

                            'client/controllers/authentication/paymentv.js'
                        ]
                    });
                }]
            }
        })

   .state('rpassword', {
            url: "/rcode/:rcode",
            controller: "rpasswordController",
            templateUrl: "client/views/authentication/rcode.html",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'BillingApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'client/assets/css/views/auth.css',
                            'client/assets/css/datepicker3.css',
                            'client/assets/css/select2.css',
                            'client/assets/css/todo.css',

                            'client/assets/js/lib/bootstrap-datepicker.js',
                            'client/assets/js/lib/select2.min.js',

                            'client/assets/js/lib/index.js',

                            'client/controllers/authentication/rpassword.js'
                        ]
                    });
                }]
            }
        })
  //signup
   .state('signup', {
            url: "/signup",
            templateUrl: "client/views/authentication/signup.html",


            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'BillingApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'client/assets/css/views/auth.css',
                            'client/assets/css/datepicker3.css',
                            'client/assets/css/select2.css',
                            'client/assets/css/todo.css',

                            'client/assets/js/lib/bootstrap-datepicker.js',
                            'client/assets/js/lib/select2.min.js',

                            'client/assets/js/lib/index.js',

                            'client/controllers/authentication/signup.js'
                        ]
                    });
                }]
            }
        })

  //token
  .state('code', {
            url: "/code/:code",
            controller: "tokenController",
            templateUrl: "client/views/authentication/token.html",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'BillingApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'client/assets/css/views/auth.css',
                            'client/assets/css/datepicker3.css',
                            'client/assets/css/select2.css',
                            'client/assets/css/todo.css',

                            'client/assets/js/lib/bootstrap-datepicker.js',
                            'client/assets/js/lib/select2.min.js',

                            'client/assets/js/lib/index.js',

                            'client/controllers/authentication/token.js'
                        ]
                    });
                }]
            }
        }) // Welcome
    .state('welcome', {
            url: "/welcome",
            templateUrl: "client/views/dashboard/welcome.html",
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'BillingApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'client/controllers/dashboard/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

    //payment
      // Payment
        .state('payment', {
            url: "/payment",
            templateUrl: "client/views/dashboard/payment.html",
            data: {pageTitle: 'Welcome to,', pageSubTitle: ' Billing System'},
            controller: "PaymentController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({ 
                        name: 'BillingApp',  
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'client/assets/css/select2.css',
                            
                         
                            
                            'client/controllers/dashboard/PaymentController.js'  
                        ]
                    });
                }]
            }
        })



    // HomePage
    .state('home', {
        url: "/home",
        templateUrl: "client/views/dashboard/home.html",

        controller: "TodoController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'BillingApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'client/assets/css/datepicker3.css',
                        'client/assets/css/select2.css',
                        'client/assets/css/todo.css',

                        'client/assets/js/lib/bootstrap-datepicker.js',
                        'client/assets/js/lib/select2.min.js',

                        'client/assets/js/lib/index.js',

                        'client/controllers/dashboard/TodoController.js'
                    ]
                });
            }]
        }
    })

    //ends here


}]);



/* Init global settings and run the app */
BillingApp.run(["$rootScope", "settings", "$state", function($rootScope, settings, $state) {
    $rootScope.$state = $state; // state to be accessed from view
}]);



BillingApp.run(function($rootScope, $location, Auth) {

    console.log($location.$$path.substring(0, 8))


    $rootScope.$on('$locationChangeStart', function(previous, next, current) {
        $rootScope.loggedIn = Auth.isLoggedIn();
        if ($rootScope.loggedIn && $location.$$path == "/signup") {
            $location.path('/home');
        } else if (!$rootScope.loggedIn && $location.$$path != "/forgot" && $location.$$path.substring(0, 9) != "/ackcode/" && $location.$$path.substring(0, 6) != "/code/" && $location.$$path.substring(0, 9) != "/message/"&& $location.$$path.substring(0, 7) != "/rcode/"  && $location.$$path.substring(0, 8) != "/errno/" ) {
            $location.path('/signup');
        }
        if ($rootScope.loggedIn && $location.$$path == "/signup") {
            $location.path('/home');
        }

        //var route_object = ($route.routes[$location.path()]).route_object;
        var re = /#\/ackcode\/(.*?)/;
        var h = re.exec($location.absUrl());
        console.log(h);
        Auth.getUser()
            .then(function(data) {
                $rootScope.user = data.data;

                if ($rootScope.user.emailverified == 0 || (h && h.length == 2)) {
                    $location.path('/welcome');
                }
            });
    });

    $rootScope.doLogout = function() {
        Auth.logout();
        $location.path('#/logout');
    };
});


BillingApp.factory('Auth', function($rootScope, $http, $q, AuthToken) {
    var authFactory = {};

    authFactory.login = function(username, password) {

        return $http.post('/api/login', {
                username: username,
                password: password
            })
            .success(function(data) {
                AuthToken.setToken(data.token);
                return data;
            });
    };

    authFactory.logout = function() {
        AuthToken.setToken();
    };

    authFactory.isLoggedIn = function() {
        if (AuthToken.getToken()) {
            return true;
        } else {
            return false;
        }
    };

    authFactory.getUser = function() {
        if (AuthToken.getToken()) {
            return $http.get('/authapi/me');
        } else {
            return $q.reject({
                message: "User has no token"
            });
        }
    };

    return authFactory;
})

BillingApp.factory('AuthToken', function($window) {
    var authTokenFactory = {};

    authTokenFactory.getToken = function() {
        return $window.localStorage.getItem('token');

    };

    authTokenFactory.setToken = function(token) {

        if (token) {
            $window.localStorage.setItem('token', token);
        } else {

            $window.localStorage.removeItem('token');
        }
    };

    return authTokenFactory;
})

BillingApp.factory('AuthInterceptor', function($q, $location, AuthToken) {
    console.log($location.$$path);
    var interceptorFactory = {};

    interceptorFactory.request = function(config) {
        var token = AuthToken.getToken();

        if (token) {
            config.headers['x-access-token'] = token;
        }

        return config;
    };

    interceptorFactory.responseError = function(response) {
        if (response.status == 403) {
            $location.path('/signup');
        }
        return $q.reject(response);
    };

    return interceptorFactory;

});
BillingApp.factory('mySharedService', function($rootScope) {
    var sharedService = {};

    sharedService.message = '';

    sharedService.prepForBroadcast = function(msg) {
        this.message = msg;
        this.broadcastItem();
    };

    sharedService.broadcastItem = function() {
        $rootScope.$broadcast('handleBroadcast');
    };

    return sharedService;
});

function ControllerZero($scope, sharedService) {
    $scope.handleClick = function(msg) {
        sharedService.prepForBroadcast(msg);
    };

    $scope.$on('handleBroadcast', function() {
        $scope.message = sharedService.message;
    });
}

ControllerZero.$inject = ['$scope', 'mySharedService'];
