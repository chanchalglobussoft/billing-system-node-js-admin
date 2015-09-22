MetronicApp.controller('DashboardActivityController', ['$rootScope', '$scope', '$http', '$cookies', '$cookieStore', 'settings', function ($rootScope, $scope, $http, $cookies, $cookieStore, settings) {
        //console.log($cookies.admin.admin)
        $scope.response = {};

        var adminValueFromCookie = $cookieStore.get('adminId');

        $scope.myAdminId = adminValueFromCookie;
        //     console.log("DAC"+adminValueFromCookie);

        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        $scope.dt = new Date();
        $scope.today = $scope.dt.getDate();
        $scope.month = monthNames[$scope.dt.getMonth()];
        $scope.year = $scope.dt.getFullYear();


        $scope.topfiveclients = function (req, res) {

            $http.post('/api/orders-per-client', {
                token: $cookies.token,
            }).
                    success(function (data, status, headers, config) {
                        console.log("hello");
                        console.log(data)
                        $scope.response.topfiveorders = data.Data;

                    });


        }



        $scope.dataByday = function (day) {

            //day=0 today, day=1 week day =2 month
            var x = moment().add(1, 'day').format('YYYY-MM-DD');

            var dat;

            if (day == 0) {
                dat = moment().add(-1, 'day').format('YYYY-MM-DD');
            }
            if (day == 1) {
                dat = moment().add(-7, 'day').format('YYYY-MM-DD');
            }
            if (day == 2) {
                dat = moment().format('YYYY-MM-01');
            }



            $http.post('/api/get-orders-by-day', {
                token: $cookies.token,
                day: day,
                current_date: x,
                other_date: dat

            }).
                    success(function (data, status, headers, config) {

                        console.log(data)
                        $scope.response.ordersData = data.Data;

                    });


        }
        $scope.init = function () {

            $scope.topfiveclients();
            $scope.dataByday(1);
            $scope.getnotes(); //initializa getNotes Function



            //console.log($scope.demo);

            // Chart.js Data
            var date = [];
            for (var i = 0; i <= 12; i++) {

                var b = moment().add(i, 'months').format('YYYY-MM');
                date.push(b);
            }

            $scope.data = {
                labels: date,
                datasets: [{
                        label: "Income Forcast",
                        fillColor: 'rgba(151,187,205,0.2)',
                        strokeColor: 'rgba(151,187,205,1)',
                        pointColor: 'rgba(151,187,205,1)',
                        pointStrokeColor: '#fff',
                        pointHighlightFill: '#fff',
                        pointHighlightStroke: 'rgba(151,187,205,1)',
                        data: [10, 20, 30, 50, 25, 70, 75, 90, 90, 70, 80, 90]
                    }]
            };

            $scope.a = true;
            $scope.b = true;

            $scope.toggleCustom = function () {
                //console.log()
                $scope.a = false;
                //$scope.a = $scope.a == false ? true: false;
            };
            $scope.changestate = function () {
                //alert("suedo");
                if ($scope.b == false) {
                    $scope.b = true;
                } else {

                    $scope.b == false;
                }

                //$scope.b = $scope.b == false ? true: false;

            }

            // Chart.js Options
            $scope.options = {
                bezierCurve: $scope.a,
                datasetFill: $scope.b,
                //String - A legend template

            };
            //end of line chart

            //starting pie chart

            $scope.bardata = [{
                    value: 15000,
                    color: "#ef4836",
                    highlight: "#FF5A5E",
                    label: "Total Sales"
                }, {
                    value: 11500,
                    color: "#44b6ae",
                    highlight: "#5AD3D1",
                    label: "Revenue"
                }, {
                    value: 3500,
                    color: "#8e5fa2",
                    highlight: "#FFC870",
                    label: "Expenses"
                }, {
                    value: 9000,
                    color: "#5c9bd1",
                    highlight: "#A8B3C5",
                    label: "Profit"
                }

            ];

            $scope.baroption = {
                // Sets the chart to be responsive
                responsive: true,
                //Boolean - Whether we should show a stroke on each segment
                segmentShowStroke: true,
                //String - The colour of each segment stroke
                segmentStrokeColor: '#fff',
                //Number - The width of each segment stroke
                segmentStrokeWidth: 2,
                //Number - The percentage of the chart that we cut out of the middle
                percentageInnerCutout: 50, // This is 0 for Pie charts

                //Number - Amount of animation steps
                animationSteps: 100,
                //String - Animation easing effect
                animationEasing: 'easeOutBounce',
                //Boolean - Whether we animate the rotation of the Doughnut
                animateRotate: true,
                //Boolean - Whether we animate scaling the Doughnut from the centre
                animateScale: false,
                //String - A legend template
                legendTemplate: '<ul class="tc-chart-js-legend"><% for (var i=0; i<segments.length; i++){%><li><span style="background-color:<%=segments[i].fillColor%>"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>'

            };




            $http.get('/api/billingstatus?token=' + $cookies.token).
                    success(function (data, status, headers, config) {
                        console.log(data); //1=pending;2=active;3=cancelled;4=fraud

                        $scope.response.pending = data.Data[0]; //pending order
                        $scope.response.active = data.Data[1]; //Active order
                        $scope.response.cancelled = data.Data[2]; //cancelled order
                        $scope.response.fraud = data.Data[3]; //fraud order
                        //
                        // console.log( $scope.response.clientCount)


                        //console.log(data.code);
                        // console.log("hello");
                        // this callback will be called asynchronously
                        // when the response is available
                    });




            $http.get('/log/count-logs/?token=' + $cookies.token).
                    success(function (data) {
                        //                        console.log("Count log: " + data.LogCount);
                        $scope.logCount = data.LogCount;
                    }).error(function () {
                console.log("Error in '/log/count-logs/");
            });

            $http.post('/api/get-info', {
                token: $cookies.token,
                adminId: $scope.myAdminId
            }).
                    success(function (data) {
//                        console.log("data admin "+JSON.stringify(data))
                        $scope.response.adminDetails = data.Data;
//                        console.log($scope.response.adminDetails)
                    });


            $http.post('/api/calculateART', {
                token: $cookies.token
            }).
                    success(function (data) {
                        $scope.totalTickets = data.count;
                        $scope.adminCount = data.adminCount;
                        $scope.ticketsPerAdmin = data.ticketsPerAdmin;
                    });

            //trim down the RESTful api's these are for demo purpose only !

            $http.get('api/tickets/mytickets/' + adminValueFromCookie + '/?token=' + $cookies.token).
                    success(function (data, status, headers, config) {
                        $scope.response.mytickets = data.Data;
                        console.log($scope.response.mytickets);
                    }).
                    error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });

            $http.get('api/tickets/activetickets/1/?token=' + $cookies.token).
                    success(function (data, status, headers, config) {
                        $scope.response.activetickets = data.Data;
                        console.log($scope.response.activetickets);
                    }).
                    error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });

            $http.get('api/tickets/scheduledtickets/?token=' + $cookies.token).
                    success(function (data, status, headers, config) {
                        $scope.response.scheduledtickets = data.Data;
                        console.log($scope.response.scheduledtickets);
                    }).
                    error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });

            $http.get('api/tickets/recentlyanswered/?token=' + $cookies.token).
                    success(function (data, status, headers, config) {
                        $scope.response.recentlyanswered = data.Data;
                        console.log($scope.response.recentlyanswered);
                    }).
                    error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });



            $http.post('/api/find-notes', {
                token: $cookies.token,
                adminId: $scope.myAdminId


            }).
                    success(function (data, status, headers, config) {

                        console.log(data)
                        $scope.response.notes = data.data;
                        console.log($scope.response.notes)


                    });



            $scope.addnotes = function (data) {
                if (data) {

                    ///api/insert-notes
                    $http.post('/api/insert-notes', {
                        token: $cookies.token,
                        data: data,
                        date: moment().format('YYYY-MM-DD'),
                        adminId: $scope.myAdminId
                    }).
                            success(function (data, status, headers, config) {

                                $scope.getnotes();

                            });

                } else {
                    alert("Add A Note");
                }




            }

            $scope.deletenote = function (Id) {

                $http.post('/api/update-notes', {
                    token: $cookies.token,
                    notesId: Id

                }).
                        success(function (data, status, headers, config) {

                            console.log(data)

                            $scope.getnotes();

                        });


            }

            //admin-info 27/8/2015


        } //init ends here




        $scope.getnotes = function () {
            $http.post('/api/find-notes', {
                token: $cookies.token,
                adminId: $scope.myAdminId


            }).
                    success(function (data, status, headers, config) {

                        console.log(data)
                        $scope.response.notes = data.data;
                        console.log($scope.response.notes)


                    });
        }


    }]);




MetronicApp.controller('VieworderController', ['$rootScope', '$scope', '$http', '$cookies', 'settings', '$location', function ($rootScope, $scope, $http, $cookies, settings, $location) {

        $scope.response = {};

        $scope.init = function () {

            var orderId = $location.$$search.orderId;
            $http.post('/api/orderdetails', {
                orderId: orderId,
                token: $cookies.token
            }).
                    success(function (data, status, headers, config) {
                        if (data.code == 200) {
                            var a = 10;
                            $scope.response.stax = a;

                            $scope.response.orderDetail = data.Data[0];

                            $scope.response.totalPrice = parseInt(data.Data[0].amount) + parseInt((data.Data[0].amount / 100) * a);


                            console.log($scope.response.totalPrice);
                        } else {
                            alert("Someting Went Wrong")
                        }
                        //console.log(data.code);
                        // console.log("hello");
                        // this callback will be called asynchronously
                        // when the response is available
                    }).
                    error(function (data, status, headers, config) {

                    });



        }




    }]);


MetronicApp.controller('OrderOverviewController', ['$rootScope', '$scope', '$http', '$cookies', 'settings', '$location', function ($rootScope, $scope, $http, $cookies, settings, $location) {

        $scope.response = {};



        //  console.log(Date.today().add({days:-30}));
        $scope.init = function () {
            $scope.dataByday(1);
            $scope.topfiveclients();
            var date = [];
            for (var i = 0; i <= 30; i++) {

                var b = moment().subtract(i, 'day').format('YYYY-MM-DD');
                date.push(b);
            }



            $scope.data = {
                labels: date,
                datasets: [{
                        label: "Pending",
                        fillColor: "rgba(87,142,190,0.2)",
                        strokeColor: "rgba(87,142,190,1)",
                        pointColor: "rgba(87,142,190,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(87,142,190,1)",
                        data: [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40, 28, 48, 40, 19, 86, 27, 90, 05, 48, 14, 19, 55, 27, 51, 0, 65, 59, 80]
                    }, {
                        label: "Active",
                        fillColor: "rgba(227,91,90,0.2)",
                        strokeColor: "rgba(227,91,90,1)",
                        pointColor: "rgba(227,91,90,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(227,91,90,1)",
                        data: [28, 48, 40, 19, 86, 27, 90, 5, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 80, 81, 56, 55, 40, 28, 48, 4, 19, 86, 27, 90, 5, 59]
                    }, {
                        label: "Fraud",
                        fillColor: "rgba(68,182,174,0.2)",
                        strokeColor: "rgba(68,182,174,1)",
                        pointColor: "rgba(68,182,174,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(68,182,174,1)",
                        data: [05, 48, 14, 19, 55, 27, 51, 28, 48, 40, 19, 86, 27, 90, 5, 59, 80, 86, 27, 14, 19, 55, 27, 51, 28, 48, 40, 86, 27, 90, 5, 59]
                    },
                    {
                        label: "Cancelled",
                        fillColor: "rgba(135,117,167,0.2)",
                        strokeColor: "rgba(135,117,167,1)",
                        pointColor: "rgba(135,117,167,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(135,117,167,1)",
                        data: [05, 48, 14, 19, 55, 27, 51, 86, 27, 90, 5, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 05, 48, 14, 19, 55, 27, 51, 86, 27, 90, 5]
                    }
                ]
            };

            $scope.a = true;
            $scope.b = true;

            $scope.toggleCustom = function () {
                //console.log()
                $scope.a = false;
                //$scope.a = $scope.a == false ? true: false;
            };
            $scope.changestate = function () {
                //alert("suedo");
                if ($scope.b == false) {
                    $scope.b = true;
                } else {

                    $scope.b == false;
                }

                //$scope.b = $scope.b == false ? true: false;

            }

            // Chart.js Options
            $scope.options = {
                bezierCurve: $scope.a,
                datasetFill: $scope.b,
                //String - A legend template

            };

            //end of line chart

            //starting pie chart




            //  var a=moment().format('YYYY MM DD');

            // console.log($scope.date);



            $http.get('/api/orderstatus?token=' + $cookies.token).
                    success(function (data, status, headers, config) {
                        console.log(data); //1=pending;2=active;3=cancelled;4=fraud

                        $scope.response.pending = data.Data[0]; //pending order
                        $scope.response.active = data.Data[1]; //Active order
                        $scope.response.cancelled = data.Data[2]; //cancelled order
                        $scope.response.fraud = data.Data[3]; //fraud order
                        //
                        // console.log( $scope.response.clientCount)


                        //console.log(data.code);
                        // console.log("hello");
                        // this callback will be called asynchronously
                        // when the response is available
                    });



        }



        $scope.topfiveclients = function (req, res) {

            $http.post('/api/orders-per-client', {
                token: $cookies.token,
            }).
                    success(function (data, status, headers, config) {

                        console.log(data)
                        $scope.response.topfiveorders = data.Data;

                    });


        }


        $scope.dataByday = function (day) {

            //day=0 today, day=1 week day =2 month
            var x = moment().add(1, 'day').format('YYYY-MM-DD');

            var dat;

            if (day == 0) {
                dat = moment().add(-1, 'day').format('YYYY-MM-DD');
            }
            if (day == 1) {
                dat = moment().add(-7, 'day').format('YYYY-MM-DD');
            }
            if (day == 2) {
                dat = moment().format('YYYY-MM-01');
            }



            $http.post('/api/get-orders-by-day', {
                token: $cookies.token,
                day: day,
                current_date: x,
                other_date: dat

            }).
                    success(function (data, status, headers, config) {

                        console.log(data)
                        $scope.response.ordersData = data.Data;

                    });


        }



    }]);

MetronicApp.controller('ClientOverViewController', ['$rootScope', '$scope', '$http', '$cookies', 'settings', '$location', function ($rootScope, $scope, $http, $cookies, settings, $location) {

        $scope.response = {};
        $scope.searchClients = ''; // set the default search/filter term
        $scope.sortType = 'created';
        $scope.sortReverse = true;

        //Pagination
        $scope.currentPage = 1;
        $scope.numPerPage = 10;

        $scope.paginate = function (value) {
          // console.log("->"+JSON.stringify(value));
            var begin, end, index;
            begin = ($scope.currentPage - 1) * $scope.numPerPage;
            end = begin + $scope.numPerPage;
            index = $scope.response.data.indexOf(value);
            return (begin <= index && index < end);
        };

        $scope.$watch('searchClients', function(term) {
          if(!$scope.searchClients)
          {
            $scope.numPerPage = 10;
          }
          else {
              $scope.numPerPage = 100000; //maximum number of rows in table
          }
        });

        $scope.init = function () {
            $http.get('/api/clientCount?token=' + $cookies.token).
                    success(function (data, status, headers, config) {
                        $scope.response.clientCount = data.Data[0];
                        $scope.response.orderCount = data.Data[1];
                        $scope.response.reg_month = data.Data[2];
                    });


            $http.get('/api/testapi/listall?token=' + $cookies.token).
                    success(function (data) {
                        $scope.response.data = data.Data;
                        $scope.totalItems = data.Data.length;
                    }).
                    error(function (data, status, headers, config) {
                    });



        }




    }]);

MetronicApp.controller('BillingoverViewController', ['$rootScope', '$scope', '$http', '$cookies', 'settings', '$location', function ($rootScope, $scope, $http, $cookies, settings, $location) {

        $scope.response = {};

        // $scope.demo = function() {
        //
        //     $scope.date = [];
        //     for (i = 1; i <= 30; i++) {
        //
        //         var b = moment().subtract(i, 'days').format('YYYY-MM-DD');
        //         $scope.date.push(b);
        //     }
        //     //  var a="hello";
        //     return $scope.date;
        // }


        //  console.log(Date.today().add({days:-30}));
        $scope.init = function () {



            $scope.gettopfive();
            $scope.getBill();
            $scope.getservices(1);




            var date = [];
            for (var i = 0; i <= 30; i++) {

                var b = moment().subtract(i, 'day').format('YYYY-MM-DD');
                date.push(b);
            }



            $scope.data = {
                labels: date,
                datasets: [{
                        label: "Pending",
                        fillColor: "rgba(87,142,190,0.2)",
                        strokeColor: "rgba(87,142,190,1)",
                        pointColor: "rgba(87,142,190,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(87,142,190,1)",
                        data: [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40, 28, 48, 40, 19, 86, 27, 90, 05, 48, 14, 19, 55, 27, 51, 0, 65, 59, 80]
                    }]
            };

            $scope.a = true;
            $scope.b = true;

            $scope.toggleCustom = function () {
                //console.log()
                $scope.a = false;
                //$scope.a = $scope.a == false ? true: false;
            };
            $scope.changestate = function () {
                //alert("suedo");
                if ($scope.b == false) {
                    $scope.b = true;
                } else {

                    $scope.b == false;
                }

                //$scope.b = $scope.b == false ? true: false;

            }

            // Chart.js Options
            $scope.options = {
                bezierCurve: $scope.a,
                datasetFill: $scope.b,
                //String - A legend template

            };

            //end of line chart

            //starting pie chart




            $http.get('/api/billingstatus?token=' + $cookies.token).
                    success(function (data, status, headers, config) {
                        console.log(data); //1=pending;2=active;3=cancelled;4=fraud

                        $scope.response.pending = data.Data[0]; //pending order
                        $scope.response.active = data.Data[1]; //Active order
                        $scope.response.cancelled = data.Data[2]; //cancelled order
                        $scope.response.fraud = data.Data[3]; //fraud order
                        //
                        // console.log( $scope.response.clientCount)


                        //console.log(data.code);
                        // console.log("hello");
                        // this callback will be called asynchronously
                        // when the response is available
                    });



        }


        $scope.getBill = function () {
            $http.post('/api/get-bills', {
                token: $cookies.token
            }).
                    success(function (data, status, headers, config) {


                        $scope.response.transaction = data.Data;

                    });
        }

        $scope.gettopfive = function () {
            $http.post('/api/amount-per-client', {
                token: $cookies.token
            }).
                    success(function (data, status, headers, config) {


                        $scope.response.top = data.Data;
                        console.log($scope.response.top)

                    });
        }

        $scope.getservices = function (date) {

            //date=1 means 1 month if date =0 means today
            var a = moment().format('YYYY-MM-DD');
            var b = moment().format('YYYY-MM-01');
            console.log(b);
            var start_date;
            var end_date;
            if (date == 1) {
                start_date = b;
                end_date = a;
                $scope.response.time = "This Month"
            } else {
                start_date = a;
                end_date = a;

                $scope.response.time = "Today";
            }


            $http.post('/api/transaction-by-day', {
                startdate: start_date,
                enddate: end_date,
                token: $cookies.token
            }).
                    success(function (data, status, headers, config) {


                        $scope.response.services = data.Data;
                        console.log($scope.response.services)

                    });
        }




    }]);
