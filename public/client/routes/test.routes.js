 .state('testtt', {
            url: "/testt",
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