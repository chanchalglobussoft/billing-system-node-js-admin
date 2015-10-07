  //ackcode
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
        })