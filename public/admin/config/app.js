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


        $http.post('/api/getGLobal', {
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
    // LOGIN
        .state('login', {
        url: "/login.html",
        templateUrl: "views/login.html",
        data: {
            pageTitle: 'Login'
        },
        controller: "AuthenticationController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'MetronicApp',
                    files: [
                        'controllers/AuthenticationController.js'
                    ]
                }]);
            }]
        }
    })

    // Dashboard
    .state('dashboard', {
        url: "/dashboard.html",
        templateUrl: "views/dashboard/dashboard.html",
        data: {
            pageTitle: 'Dashboard',
            //                        pageSubTitle: 'statistics & reports'
        },
        controller: "DashboardActivityController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'assets/js/moment.min.js',
                        'controllers/DashboardActivityController.js'
                    ]
                });
            }]
        }
    })

    // Client
    .state('client', {
        url: "/clients-overview.html",
        templateUrl: "views/clients/clients-overview.html",
        data: {
            pageTitle: 'Client',
            pageSubTitle: 'Overview'
        },
        //controller: "ClientOverViewController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'assets/css/morris.css',
                        'controllers/DashboardActivityController.js'
                    ]
                });
            }]
        }
    })

    // CLIENTS - SEARCH CLIENT
    .state('searchClient', {
        url: "/client-search.html",
        templateUrl: "views/clients/client-search.html",
        data: {
            pageTitle: 'Client',
            pageSubTitle: 'Search Client'
        },
        //controller: "SearchController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'MetronicApp',
                    files: [
                        'controllers/ClientController.js'
                    ]
                }]);
            }]
        }
    })

    // CLIENTS - ADD CLIENT
    .state('addClient', {
        url: "/add-client.html",
        templateUrl: "views/clients/add-client.html",
        data: {
            pageTitle: 'Client',
            pageSubTitle: 'Add New Client'
        },
//        controller: "DashboardController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'MetronicApp',
                    files: [
                        'assets/js/moment.min.js',
                        'controllers/DashboardController.js',
                        'assets/js/jquery-ui.min.js'
                    ]
                }]);
            }]
        }
    })


    // CLIENTS - SEARCH DOMAIN
    .state('searchDoamin', {
        url: "/search-domain.html",
        templateUrl: "views/clients/search-domain.html",
        data: {
            pageTitle: 'Client',
            pageSubTitle: 'Search Domain'
        },
      //  controller: "DomainController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'MetronicApp',
                    files: [
                        'assets/css/datepicker3.css',
                        'assets/css/select2.css',
                        'assets/css/dataTables.bootstrap.css',
                        'assets/css/dataTables.scroller.min.css',
                        'assets/css/dataTables.colReorder.min.css',
                        //
                        'assets/js/select2.min.js',
                        'assets/js/all.min.js',
                        'assets/js/table-advanced.js',
                        'controllers/DomainController.js'
                    ]
                }]);
            }]
        }
    })

    // CLIENTS - DOMAIN REGISTRATION
    .state('regDomain', {
            url: "/reg-domain.html",
            templateUrl: "views/clients/reg-domain.html",
            data: {
                pageTitle: 'Client',
                pageSubTitle: 'Register Domain'
            },
            //controller: "RegDomainController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            'controllers/DomainController.js'
                        ]
                    }]);
                }]
            }
        })
        // CLIENTS - CANCELLATION REQUEST
        .state('cancellations', {
            url: "/cancellations.html",
            templateUrl: "views/clients/cancellations.html",
            data: {
                pageTitle: 'Client',
                pageSubTitle: 'Cancellation Requests'
            },
          //  controller: "CancelRequestController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            'controllers/DomainController.js'
                        ]
                    }]);
                }]
            }
        })

    // CLIENTS - MASS MAIL
    .state('massMail', {
        url: "/mass-mail.html",
        templateUrl: "views/clients/mass-mail.html",
        data: {
            pageTitle: 'Client',
            pageSubTitle: 'Mass Mail'
        },
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'MetronicApp',
                    files: [
                        'controllers/GeneralPageController.js'
                    ]
                }]);
            }]
        }
    })

    // ORDERS
    .state('manageOrder', {
        url: "/manage-order.html",
        templateUrl: "views/orders/manage-order.html",
        data: {
            pageTitle: 'Orders',
            pageSubTitle: 'Manage Orders'
        },
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'assets/css/dataTables.bootstrap.css',
                        'assets/css/dataTables.scroller.min.css',
                        'assets/css/dataTables.colReorder.min.css',
                        'assets/js/all.min.js',
                        'assets/js/table-advanced.js',
                        'assets/js/bootstrap-datepicker.js',
                        'assets/js/components-pickers.js',
                        'controllers/DashboardController.js'
                    ]
                }]);
            }]
        }
    })

    // ORDERS overview
    .state('OrdersOverview', {
        url: "/orders-overview.html",
        templateUrl: "views/orders/orders-overview.html",
        data: {
            pageTitle: 'Orders',
            pageSubTitle: 'Overview'
        },
        controller: "OrderOverviewController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'assets/js/moment.min.js',
                        'controllers/DashboardActivityController.js'
                    ]
                }]);
            }]
        }
    })

    // BILLING - TRANSCATION
    //add billing overview here //check controller
    .state('billingOverview', {
            url: "/billing-overview.html",
            templateUrl: "views/billing/billing-overview.html",
            data: {
                pageTitle: 'Billing',
                pageSubTitle: 'Overview'
            },
            controller: "BillingoverViewController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/js/moment.min.js',
                            'controllers/DashboardActivityController.js'
                        ]
                    }]);
                }]
            }
        })
        //upto here
        .state('billTrans', {
            url: "/manage-transactions.html",
            templateUrl: "views/billing/manage-transactions.html",
            data: {
                pageTitle: 'Billing',
                pageSubTitle: 'Manage Transactions'
            },
//            controller: "billFilterController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
//                            'assets/js/components-pickers.js',
                            'controllers/DashboardController.js'
                        ]
                    }]);
                }]
            }
        })

    // BILLING - INVOICES
    .state('billInvoice', {
        url: "/manage-invoices.html",
        templateUrl: "views/billing/manage-invoices.html",
        data: {
            pageTitle: 'Billing',
            pageSubTitle: 'Manage Invoices'
        },
//        controller: "BillingInvoiceController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'assets/css/datepicker3.css',
                        'assets/js/bootstrap-datepicker.js',
                        'assets/js/components-pickers.js',
                        'controllers/DashboardController.js'
                    ]
                }]);
            }]
        }
    })

    //Invoice
    .state('Invoice', {
        url: "/invoice.html",
        templateUrl: "views/billing/invoice.html",
        data: {
            pageTitle: 'Invoice'
        },
        controller: "InvoiceController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'controllers/UserProfileController.js'
                    ]
                }]);
            }]
        }
    })

    //adding gateway-logs //check controller
    .state('gatewayLogs', {
        url: "/gateway-logs.html",
        templateUrl: "views/billing/gateway-logs.html",
        data: {
            pageTitle: 'Billing',
            pageSubTitle: 'Gateway Logs'
        },
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'controllers/GatewayLogsController.js'
                    ]
                }]);
            }]
        }
    })

    //Vieworder
    .state('Vieworder', {
        url: "/view-orders.html",
        templateUrl: "views/orders/view-orders.html",
        data: {
            pageTitle: 'View Order'
        },
        controller: "VieworderController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'controllers/DashboardActivityController.js'
                    ]
                }]);
            }]
        }
    })


    // SUPPORT - OVERVIEW
    .state('supportOverview', {
        url: "/support-overview.html",
        templateUrl: "views/support/support-overview.html",
        data: {
            pageTitle: 'Support',
            pageSubTitle: ' Overview'
        },
        controller: "SupportController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'controllers/SupportController.js'
                    ]
                }]);
            }]
        }
    })

    // SUPPORT - ACTIVE TICKETS
    .state('activeTickets', {
        url: "/support-tickets.html",
        templateUrl: "views/support/support-tickets.html",
        data: {
            pageTitle: 'Support',
            pageSubTitle: ' Tickets'
        },
        controller: "ActiveticketsController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'controllers/SupportController.js'
                    ]
                }]);
            }]
        }
    })

    // SUPPORT - DOWNLOADS
    .state('onholdTickets', {
        url: "/on-hold-tickets.html",
        templateUrl: "views/support/on-hold-tickets.html",
        data: {
            pageTitle: 'Support',
            pageSubTitle: 'On hold Tickets'
        },
        controller: "OnholdticketsController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'controllers/SupportController.js'
                    ]
                }]);
            }]
        }
    })

    //ticket details page
    .state('viewTicket', {
        url: "/view-ticket.html",
        templateUrl: "views/support/view-ticket.html",
        data: {
            pageTitle: 'Ticket Details'
        },
        controller: "TicketviewController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'assets/js/moment.min.js',
                        'controllers/SupportController.js'
                    ]
                }]);
            }]
        }
    })

    // ADMIN PROFILE - ROLES
    .state('adminRoles', {
        url: "/admin-roles.html",
        templateUrl: "views/admin/admin-roles.html",
        data: {
            pageTitle: 'Admin Roles'
        },
        controller: "RoleController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'controllers/AdministratorController.js'
                    ]
                }]);
            }]
        }
    })

    // ADMIN PROFILE - EDIT
    .state('adminAccount', {
        url: "/admin-account.html",
        templateUrl: "views/admin/admin-account.html",
        data: {
            pageTitle: 'Edit Admin Details'
        },
        controller: "AdminaccountController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'controllers/AdministratorController.js'
                    ]
                }]);
            }]
        }
    })

    // System Activity Log page
    .state('activitylogs', {
        url: "/activityLog.html",
        templateUrl: "views/admin/activityLog.html",
        data: {
            pageTitle: 'System Activity Log'
        },
        controller: "ActiveticketsController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'controllers/SupportController.js'
                    ]
                }]);
            }]
        }
    })


    //---------------------------------------------------------------------------------------------------
    //myPage test page
    .state('mypage', {
            url: "/mypage.html",
            templateUrl: "views/mypage.html",
            data: {
                pageTitle: 'My Page'
            },
            controller: "Mycontroller",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            'controllers/TestController.js'
                        ]
                    }]);
                }]
            }
        })
        //myApp test page

    .state("tld-register-domain", {
            url: "/tld-register-domain.html",
            templateUrl: "views/domain/tld-register-domain.html",
            data: {
                pageTitle: 'Domain Pricing',
                pageSubTitle: 'Margin Price Settings'
            },
            controller: "RegistertldController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            //                                        'assets/js/select2.min.js',
                            //                                        'assets/js/all.min.js',
                            'assets/css/jquery.dataTables.css',
                            //                                        'assets/js/jquery.dataTables.min.js',
                            'controllers/DomainController.js',
                        ]
                    });
                }]
            }
        })
        //domain registartion page


    .state("domain-reg", {
        url: "/domain-reg.html",
        templateUrl: "views/domain/domain-reg.html",
        data: {
            pageTitle: 'Domain Registration',
            pageSubTitle: 'Register'
        },
        controller: "DomainRegistration",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'controllers/DomainController.js',
                    ]
                });
            }]
        }
    })

    // report

    .state("report-overview", {
        url: "/report-overview.html",
        templateUrl: "views/report/report-overview.html",
        data: {
            pageTitle: 'Reports',
            pageSubTitle: 'Overview'
        },
        controller: "ReportActivityController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'assets/js/moment.min.js',
                        'controllers/ReportController.js'
                    ]
                });
            }]
        }
    })


    //Annaul Income


    .state("annual-income", {
        url: "/annual-income.html",
        templateUrl: "views/report/income/annual-income.html",
        data: {
            pageTitle: 'Reports',
            pageSubTitle: 'Income Reports'
        },
        controller: "AnnualIncomeController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'assets/css/select2.css',
                        'assets/css/dataTables.bootstrap.css',
                        'assets/css/dataTables.scroller.min.css',
                        'assets/css/dataTables.colReorder.min.css',
                        //
                        'assets/js/select2.min.js',
                        'assets/js/all.min.js',
                        'assets/js/table-advanced.js',
                        'assets/js/moment.min.js',
                        'controllers/ReportController.js'
                    ]
                });
            }]
        }
    })


    //monthly-transactions
    .state("monthly-transactions", {
        url: "/monthly-transactions.html",
        templateUrl: "views/report/income/monthly-transactions.html",
        data: {
            pageTitle: 'Reports',
            pageSubTitle: 'Monthly Transactions'
        },
        controller: "MonthlyTransactionController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'assets/css/select2.css',
                        'assets/css/dataTables.bootstrap.css',
                        'assets/css/dataTables.scroller.min.css',
                        'assets/css/dataTables.colReorder.min.css',
                        //
                        'assets/js/select2.min.js',
                        'assets/js/all.min.js',
                        'assets/js/table-advanced.js',
                        'assets/js/moment.min.js',
                        'controllers/ReportController.js'
                    ]
                });
            }]
        }
    })


    //annual-income-product


    .state("annual-income-product", {
        url: "/annual-income-product.html",
        templateUrl: "views/report/income/annual-income-product.html",
        data: {
            pageTitle: 'Reports',
            pageSubTitle: 'Annual Income Report'
        },
        controller: "IncomebyProductController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'assets/css/select2.css',
                        'assets/css/dataTables.bootstrap.css',
                        'assets/css/dataTables.scroller.min.css',
                        'assets/css/dataTables.colReorder.min.css',
                        //
                        'assets/js/select2.min.js',
                        'assets/js/all.min.js',
                        'assets/js/table-advanced.js',
                        'assets/js/moment.min.js',
                        'controllers/ReportController.js'
                    ]
                });
            }]
        }
    })

    //promocode-usage

    .state("promocode-usage", {
        url: "/promocode-usage.html",
        templateUrl: "views/report/income/promocode-usage.html",
        data: {
            pageTitle: 'Reports',
            pageSubTitle: 'Promotional Code Usage'
        },
        controller: "PormocodeReportsController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'assets/css/select2.css',
                        'assets/css/dataTables.bootstrap.css',
                        'assets/css/dataTables.scroller.min.css',
                        'assets/css/dataTables.colReorder.min.css',
                        //
                        'assets/js/select2.min.js',
                        'assets/js/all.min.js',
                        'assets/js/table-advanced.js',
                        'assets/js/moment.min.js',
                        'controllers/ReportController.js'
                    ]
                });
            }]
        }
    })

    //client -reports
    .state("/clients-statement", {
        url: "/clients-statement.html",
        templateUrl: "views/report/clients/clients-statement.html",
        data: {
            pageTitle: 'Reports',
            pageSubTitle: 'Client Statement'
        },
        controller: "ClientsStatementController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'assets/css/datepicker3.css',

                        'assets/css/select2.css',
                        'assets/css/dataTables.bootstrap.css',
                        'assets/css/dataTables.scroller.min.css',
                        'assets/css/dataTables.colReorder.min.css',
                        //
                        'assets/js/select2.min.js',
                        'assets/js/all.min.js',
                        'assets/js/table-advanced.js',




                        'assets/js/bootstrap-datepicker.js',
                        'assets/js/components-pickers.js',
                        'assets/js/moment.min.js',
                        'controllers/ClientsReportController.js'
                    ]
                });
            }]
        }
    })

    //client-by-country
    .state("clients-by-country", {
            url: "/clients-by-country.html",
            templateUrl: "views/report/clients/clients-by-country.html",
            data: {
                pageTitle: 'Reports',
                pageSubTitle: 'Clients by Country'
            },
            controller: "ClientsByCountryController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/css/select2.css',
                            'assets/css/dataTables.bootstrap.css',
                            'assets/css/dataTables.scroller.min.css',
                            'assets/css/dataTables.colReorder.min.css',
                            //
                            'assets/js/select2.min.js',
                            'assets/js/all.min.js',
                            'assets/js/table-advanced.js',
                            'assets/js/moment.min.js',
                            'controllers/ClientsReportController.js'
                        ]
                    });
                }]
            }
        })
        //client-by-income
        .state("clients-by-income", {
            url: "/clients-by-income.html",
            templateUrl: "views/report/clients/clients-by-income.html",
            data: {
                pageTitle: 'Reports',
                pageSubTitle: 'Top Clients by Income'
            },
            controller: "ClientsByIncomeController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/css/select2.css',
                            'assets/css/dataTables.bootstrap.css',
                            'assets/css/dataTables.scroller.min.css',
                            'assets/css/dataTables.colReorder.min.css',
                            //
                            'assets/js/select2.min.js',
                            'assets/js/all.min.js',
                            'assets/js/table-advanced.js',

                            'controllers/ClientsReportController.js'
                        ]
                    });
                }]
            }
        })

    //client-by-income
    .state("clients-report", {
        url: "/clients-report.html",
        templateUrl: "views/report/clients/clients-report.html",
        data: {
            pageTitle: 'Reports',
            pageSubTitle: 'Client Reports'
        },
        controller: "ClientsReportController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'assets/css/select2.css',
                        'assets/css/dataTables.bootstrap.css',
                        'assets/css/dataTables.scroller.min.css',
                        'assets/css/dataTables.colReorder.min.css',
                        //
                        'assets/js/select2.min.js',
                        'assets/js/all.min.js',
                        'assets/js/table-advanced.js',
                        'assets/js/moment.min.js',
                        'controllers/ClientsReportController.js'
                    ]
                });
            }]
        }
    })


    //client-by-income
    .state("client-sources", {
        url: "/client-sources.html",
        templateUrl: "views/report/clients/client-sources.html",
        data: {
            pageTitle: 'Reports',
            pageSubTitle: 'Client Sources'
        },
        controller: "ClientSourceController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'assets/css/select2.css',
                        'assets/css/dataTables.bootstrap.css',
                        'assets/css/dataTables.scroller.min.css',
                        'assets/css/dataTables.colReorder.min.css',
                        //
                        'assets/js/select2.min.js',
                        'assets/js/all.min.js',
                        'assets/js/table-advanced.js',
                        'controllers/ClientsReportController.js'
                    ]
                });
            }]
        }
    })

    //client-by-income
    .state("new-customers", {
        url: "/new-customers.html",
        templateUrl: "views/report/clients/new-customers.html",
        data: {
            pageTitle: 'Reports',
            pageSubTitle: 'New Customers'
        },
        controller: "NewCustomersController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'assets/css/select2.css',
                        'assets/css/dataTables.bootstrap.css',
                        'assets/css/dataTables.scroller.min.css',
                        'assets/css/dataTables.colReorder.min.css',
                        //
                        'assets/js/select2.min.js',
                        'assets/js/all.min.js',
                        'assets/js/table-advanced.js',
                        'controllers/ClientsReportController.js'
                    ]
                });
            }]
        }
    })

    .state("Cart", {
        url: "/cart.html",
        templateUrl: "views/cart.html",
        data: {
            pageTitle: 'Cart',
            pageSubTitle: 'Place an Order'
        },
        controller: "CartController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'assets/js/moment.min.js',
                        'controllers/CartController.js'
                    ]
                });
            }]
        }
    })




    .state("AdvancedDatatable", {
        url: "/advanced.html",
        templateUrl: "views/advanced.html",
        data: {
            pageTitle: 'AdvancedDatatable',
            pageSubTitle: 'statistics & reports'
        },
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'assets/css/select2.css',
                        'assets/css/dataTables.bootstrap.css',
                        'assets/css/dataTables.scroller.min.css',
                        'assets/css/dataTables.colReorder.min.css',
                        //
                        'assets/js/select2.min.js',
                        'assets/js/all.min.js',
                        'assets/js/table-advanced.js',

                        'controllers/GeneralPageController.js'
                    ]
                });
            }]
        }
    })



    .state("CreateOrder", {
        url: "/create-order.html",
        templateUrl: "views/orders/create-order.html",
        data: {
            pageTitle: 'Orders',
            pageSubTitle: 'Add new Order'
        },
        controller: "CreateorderController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [


                        'controllers/OrderController.js'
                    ]
                });
            }]
        }
    })

    //Affiliates Module
    //--------------------------------------------------------------------------------------------------
    //affiliates overview

    .state('affiliates', {
        url: "/affiliates-overview.html",
        templateUrl: "views/affiliates/affiliates-overview.html",
        data: {
            pageTitle: 'Affiliates-overview',
            //                        pageSubTitle: 'statistics & reports'
        },
        controller: "AffiliatesController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'assets/js/moment.min.js',
                        'controllers/Affiliates.js'
                    ]
                });
            }]
        }
    })

    //client Signup

    .state('client-signup', {
        url: "/client-signup.html",
        templateUrl: "views/client/client-signup.html",
        data: {
            pageTitle: 'client-signup',
            //                        pageSubTitle: 'statistics & reports'
        },
        controller: "ClientsignupController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'assets/js/moment.min.js',
                        'controllers/ClientdataController.js'
                    ]
                });
            }]
        }
    })



    .state('affiliatessales', {
        url: "/affiliates-sales.html",
        templateUrl: "views/affiliates/affiliates-sales.html",
        data: {
            pageTitle: 'Affiliates By Sale',
            //                        pageSubTitle: 'statistics & reports'
        },
        controller: "AffiliatessalesController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'assets/css/select2.css',
                        'assets/css/dataTables.bootstrap.css',
                        'assets/css/dataTables.scroller.min.css',
                        'assets/css/dataTables.colReorder.min.css',
                        //
                        'assets/js/select2.min.js',
                        'assets/js/all.min.js',
                        'assets/js/table-advanced.js',
                        'assets/js/moment.min.js',
                        'controllers/Affiliates.js'
                    ]
                });
            }]
        }
    })




    .state('affiliatesrevenue', {
        url: "/affiliates-revenue.html",
        templateUrl: "views/affiliates/affiliates-revenue.html",
        data: {
            pageTitle: 'Affiliates By Revenue',
            //                        pageSubTitle: 'statistics & reports'
        },
        controller: "AffiliaterevenueController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'assets/css/select2.css',
                        'assets/css/dataTables.bootstrap.css',
                        'assets/css/dataTables.scroller.min.css',
                        'assets/css/dataTables.colReorder.min.css',
                        //
                        'assets/js/select2.min.js',
                        'assets/js/all.min.js',
                        'assets/js/table-advanced.js',
                        'assets/js/moment.min.js',
                        'controllers/Affiliates.js'
                    ]
                });
            }]
        }
    })




    .state('affiliatestraffic', {
        url: "/affiliates-traffic.html",
        templateUrl: "views/affiliates/affiliates-traffic.html",
        data: {
            pageTitle: 'Affiliates By Traffic',
            //                        pageSubTitle: 'statistics & reports'
        },
        controller: "AffiliatetrafficController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [

                        'assets/js/moment.min.js',
                        'controllers/Affiliates.js'
                    ]
                });
            }]
        }
    })


    .state('affiliate-profile', {
        url: "/affiliate-profile.html",
        templateUrl: "views/affiliates/affiliate-profile.html",
        data: {
            pageTitle: 'Affiliates Profile',
            //                        pageSubTitle: 'statistics & reports'
        },
        controller: "AffiliateProfileController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'assets/css/select2.css',
                        'assets/css/dataTables.bootstrap.css',
                        'assets/css/dataTables.scroller.min.css',
                        'assets/css/dataTables.colReorder.min.css',
                        //
                        'assets/js/select2.min.js',
                        'assets/js/all.min.js',
                        'assets/js/custom_table.js',

                        'assets/js/moment.min.js',
                        'controllers/AffiliatesSettingsController.js'
                    ]
                });
            }]
        }
    })




    .state('affiliate-Info', {
        url: "/affiliate-info.html",
        templateUrl: "views/affiliates/affiliate-info.html",
        data: {
            pageTitle: 'Affiliates Info',
            //                        pageSubTitle: 'statistics & reports'
        },
        controller: "AffiliateInfoController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'assets/css/select2.css',
                        'assets/css/dataTables.bootstrap.css',
                        'assets/css/dataTables.scroller.min.css',
                        'assets/css/dataTables.colReorder.min.css',
                        //
                        'assets/js/select2.min.js',
                        'assets/js/all.min.js',
                        'assets/js/custom_table.js',

                        'controllers/AffiliatesSettingsController.js'
                    ]
                });
            }]
        }
    })



    //--------------------------------------------------------------------------------------------------
    //Affiliates Module Ends Here
    //---------------------------------------------------------------------------------------------------
    //settings module started from here


    .state('affiliatessetting', {
        url: "/affiliates-settings.html",
        templateUrl: "views/settings/affiliates-settings.html",
        data: {
            pageTitle: 'Affiliates Settings',
            //                        pageSubTitle: 'statistics & reports'
        },
        controller: "AffiliatesSettingsController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'assets/css/select2.css',
                        'assets/css/dataTables.bootstrap.css',
                        'assets/css/dataTables.scroller.min.css',
                        'assets/css/dataTables.colReorder.min.css',
                        //
                        'assets/js/select2.min.js',
                        'assets/js/all.min.js',
                        'assets/js/custom_table.js',

                        'assets/js/moment.min.js',
                        'controllers/AffiliatesSettingsController.js'
                    ]
                });
            }]
        }
    })



    //promocode settings
    //#/promocode-settings.html

    .state('promocode-settings', {
        url: "/promocode-settings.html",
        templateUrl: "views/settings/promocode-settings.html",
        data: {
            pageTitle: 'Affiliates Settings',
            //                        pageSubTitle: 'statistics & reports'
        },
        controller: "PromocodeSettingsController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [

                        'assets/css/select2.css',
                        'assets/css/dataTables.bootstrap.css',
                        'assets/css/dataTables.scroller.min.css',
                        'assets/css/dataTables.colReorder.min.css',
                        //
                        //'assets/css/clockface.css',
                        'assets/css/datepicker3.css',
                        'assets/css/bootstrap-timepicker.min.css',
                        //'assets/css/colorpicker.css',
                        'assets/css/daterangepicker-bs3.css',
                        'assets/css/bootstrap-datetimepicker.min.css',

                        'assets/js/bootstrap-datepicker.js',
                        'assets/js/bootstrap-timepicker.min.js',
                        //'assets/js/clockface.js',
                        'assets/js/moment.min.js',
                        'assets/js/daterangepicker.js',
                        //   'assets/js/bootstrap-colorpicker.js',
                        'assets/js/bootstrap-datetimepicker.min.js',
                        'assets/js/select2.min.js',
                        'assets/js/all.min.js',
                        'assets/js/custom_table.js',

                        'assets/js/components-pickers.js',
                        'controllers/AffiliatesSettingsController.js'
                    ]
                });
            }]
        }
    })




    //----------------------------------------------------------------------------------------------------

    //settings module Ends here


    //Reports module - Support Section by Syed Arshad 8/7/2015
    //---------------------------------------------------------------------------------------------------
    .state("response-time-per-tech", {
        url: "/response-time-per-tech.html",
        templateUrl: "views/report/support/response-time-per-tech.html",
        data: {
            pageTitle: 'Reports',
            pageSubTitle: 'Response Time Per Tech'
        },
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'assets/js/moment.min.js',
                        'controllers/ReportController.js'
                    ]
                });
            }]
        }
    })

    .state("average-response-time", {
        url: "/average-response-time.html",
        templateUrl: "views/report/support/average-response-time.html",
        data: {
            pageTitle: 'Reports',
            pageSubTitle: 'Average Response Time'
        },
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'assets/js/moment.min.js',
                        'controllers/ReportController.js'
                    ]
                });
            }]
        }
    })

    .state("average-first-response", {
        url: "/average-first-response.html",
        templateUrl: "views/report/support/average-first-response.html",
        data: {
            pageTitle: 'Reports',
            pageSubTitle: 'Average First Response'
        },
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'assets/js/moment.min.js',
                        'controllers/ReportController.js'
                    ]
                });
            }]
        }
    })

    .state("average-daily-tickets", {
        url: "/average-daily-tickets.html",
        templateUrl: "views/report/support/average-daily-tickets.html",
        data: {
            pageTitle: 'Reports',
            pageSubTitle: 'Average Daily Tickets'
        },
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'assets/css/datepicker3.css',
                        'assets/js/moment.min.js',
                        'assets/js/bootstrap-datepicker.js',
                        'assets/js/components-pickers.js',
                        'controllers/ReportController.js'
                    ]
                });
            }]
        }
    })

    .state("total-daily-ticket-replies", {
        url: "/total-daily-ticket-replies.html",
        templateUrl: "views/report/support/total-daily-ticket-replies.html",
        data: {
            pageTitle: 'Reports',
            pageSubTitle: 'Total Daily Ticket Replies'
        },
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'assets/js/moment.min.js',
                        'controllers/ReportController.js'
                    ]
                });
            }]
        }
    })

    //---------------------------------------------------------------------------------------------------

    //---------------------------------------------------------------------------------------------------
    //logger State 29/6/2015

    .state('logsettings', {
            url: "/log-settings.html",
            templateUrl: "views/admin/log-settings.html",
            data: {
                pageTitle: 'Log Settings'
            },
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            'controllers/AdministratorController.js'
                        ]
                    }]);
                }]
            }
        })
        //---------------------------------------------------------------------------------------------------

    // CLIENT PROFILE
    .state('clientProfile', {
            url: "/client-profile.html",
            templateUrl: "views/profile/client/client-profile.html",
            data: {
                pageTitle: 'Client Summary'
            },
            controller: "ClientsProfileController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'controllers/ClientprofileController.js'
                        ]
                    });
                }]
            }
        })
        //---------------------------------------------------------------------------------------------------

    // User Profile
    .state("profile", {
        url: "/profile",
        templateUrl: "views/profile/main.html",
        data: {
            pageTitle: 'User Profile',
            pageSubTitle: 'user profile sample'
        },
        controller: "UserProfileController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'assets/css/bootstrap-fileinput.css',
                        'assets/css/profile.css',
                        'assets/css/tasks.css',
                        'assets/js/jquery.sparkline.min.js',
                        'assets/js/bootstrap-fileinput.js',
                        'assets/js/profile.js',
                        'controllers/UserProfileController.js'
                    ]
                });
            }]
        }
    })


    //Test

    // ADMIN - CONFIG SECURITY QUES
                    .state('configSecurity', {
                        url: "/config-security.html",
                        templateUrl: "views/admin/config-security.html",
                        data: {
                            pageTitle: 'Config Security Question'
                        },
                        controller: "GeneralPageController",
                        resolve: {
                            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                    return $ocLazyLoad.load([{
                                            name: 'MetronicApp',
                                            files: [
                                              'controllers/GeneralPageController.js'
                                            ]
                                        }]);
                                }]
                        }
                    })

                    // ADMIN - AUTOMATION SETTINGS
                .state('automation', {
                    url: "/automation.html",
                    templateUrl: "views/admin/automation.html",
                    data: {
                        pageTitle: 'Automation Settings'
                    },
                    controller: "GeneralPageController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        files: [
                                          'controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })

                // ADMIN - PAYMENT GATEWAY
                .state('paymentGateway', {
                    url: "/payment-gateway.html",
                    templateUrl: "views/admin/payment-gateway.html",
                    data: {
                        pageTitle: 'Payment Gateway'
                    },
                    controller: "GeneralPageController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        files: [
                                          'controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })

                // ADMIN - CONFIG GATEWAY
                .state('configGateway', {
                    url: "/config-gateway.html",
                    templateUrl: "views/admin/config-gateway.html",
                    data: {
                        pageTitle: 'Config Gateway'
                    },
                    controller: "GeneralPageController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        files: [
                                          'controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })

                .state('todolist', {
                    url: "/todo-list.html",
                    templateUrl: "views/admin/todo-list.html",
                    data: {
                        pageTitle: 'To-Do List',
                        pageSubTitle: 'Manage Orders'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([{
                                name: 'MetronicApp',
                                insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                files: [
                                    'assets/css/dataTables.bootstrap.css',
                                    'assets/css/dataTables.scroller.min.css',
                                    'assets/css/dataTables.colReorder.min.css',
                                    'assets/js/all.min.js',
                                    'assets/js/table-advanced.js',
                                    'assets/js/bootstrap-datepicker.js',
                                    'assets/js/components-pickers.js',
                                    'controllers/DashboardController.js'
                                ]
                            }]);
                        }]
                    }
                })
    //test

    // User Profile Dashboard
    .state("profile.dashboard", {
        url: "/dashboard",
        templateUrl: "views/profile/dashboard.html",
        data: {
            pageTitle: 'User Profile',
            pageSubTitle: 'user profile dashboard sample'
        }
    })

    // User Profile Account
    .state("profile.account", {
        url: "/account",
        templateUrl: "views/profile/account.html",
        data: {
            pageTitle: 'User Account',
            pageSubTitle: 'user profile account sample'
        }
    })

    // User Profile Help
    .state("profile.help", {
            url: "/help",
            templateUrl: "views/profile/help.html",
            data: {
                pageTitle: 'User Help',
                pageSubTitle: 'user profile help sample'
            }
        })
        //$locationProvider.html5Mode(true);
}]);



/* Init global settings and run the app */
MetronicApp.run(["$rootScope", "settings", "$state", function($rootScope, settings, $state) {
    $rootScope.$state = $state; // state to be accessed from view
}]);
