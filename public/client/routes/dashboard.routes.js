 // Welcome
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

    