MetronicApp.controller('ReportActivityController', ['$rootScope', '$scope', '$http', '$cookies', 'settings', function ($rootScope, $scope, $http, $cookies, settings) {
        //console.log($cookies.admin.admin)
        console.log("ReportActivityController");
        $scope.response = {};
        $scope.init = function (data) {
            var date = [];
            for (var i = 0; i <= 12; i++) {
                var b = moment().add(i, 'months').format('YYYY-MM');
                date.push(b);
            }

            var now = moment().format('YYYY-MM-DD');
            var mydate = moment().add(-data, 'days').format('YYYY-MM-DD');

            // console.log(now);
            $http.post('/admin/api/income', {
                startdate: now,
                enddate: mydate,
                token: $cookies.token

            }).
                    success(function (data, status, headers, config) {
                        // console.log(data.Data)
                        $scope.finaldata = {}
                        if (data.Data) {


                            var date = [];
                            var paid = [];
                            var refunded = [];
                            var profit = [];
                            var ref = 0;
                            var pay = 0;
                            // console.log(data.Data.length);


                            for (var i = 0; i < data.Data.length; i++) {
                                console.log(data.Data[i].date);
                                date.push(data.Data[i].date);


                                if (data.Data[i].paymentType == "0") {


                                    pay = parseInt(pay) + parseInt(data.Data[i].amount);

                                    paid.push(parseInt(data.Data[i].amount));


                                } else {
                                    paid.push(0);
                                }
                                if (data.Data[i].paymentType == "1") {
                                    ref = parseInt(ref) + parseInt(data.Data[i].amount);
                                    refunded.push(parseInt(data.Data[i].amount));


                                } else {
                                    refunded.push(0);
                                }
                                var prof = parseInt(pay) - parseInt(ref);
                                profit.push(prof);

                                // console.log(refunded);

                            }
                            $scope.finaldata.date = date;
                            $scope.finaldata.paid = paid;
                            $scope.finaldata.refund = refunded;
                            $scope.finaldata.profit = profit;


                            // console.log($scope.finaldata.paid);
                            // console.log($scope.finaldata.profit);
                            // console.log($scope.finaldata.refund);
                            $scope.data = {
                                labels: $scope.finaldata.date,
                                datasets: [{
                                        label: "Paid",
                                        fillColor: "rgba(87,142,190,0.2)",
                                        strokeColor: "rgba(87,142,190,1)",
                                        pointColor: "rgba(87,142,190,1)",
                                        pointStrokeColor: "#fff",
                                        pointHighlightFill: "#fff",
                                        pointHighlightStroke: "rgba(87,142,190,1)",
                                        data: $scope.finaldata.paid
                                    }, {
                                        label: "Profit",
                                        fillColor: "rgba(227,91,90,0.2)",
                                        strokeColor: "rgba(227,91,90,1)",
                                        pointColor: "rgba(227,91,90,1)",
                                        pointStrokeColor: "#1A6B50",
                                        pointHighlightFill: "#1A6B50",
                                        pointHighlightStroke: "rgba(227,91,90,1)",
                                        data: $scope.finaldata.profit
                                    }, {
                                        label: "Refunded",
                                        fillColor: "rgba(68,182,174,0.2)",
                                        strokeColor: "rgba(68,182,174,1)",
                                        pointColor: "rgba(68,182,174,1)",
                                        pointStrokeColor: "#840B0B",
                                        pointHighlightFill: "#840B0B",
                                        pointHighlightStroke: "rgba(68,182,174,1)",
                                        data: $scope.finaldata.refund
                                    }]
                            };




                        }
                        // console.log($scope.finaldata);



                        // console.log(finaldata);

                    });


            $scope.tickets = function (data) {
                // console.log();
                // var b=$cookies.adminId;//getting error
                // var a=parseInt(b);
                // console.log(a);

                $http.get('api/tickets/overview/' + 11 + '/' + data + '/?token=' + $cookies.token).//11 is adminId,hardcoded here
                        success(function (data, status, headers, config) {
                            $scope.response.data = data.Data;
                            console.log($scope.response.data);
                            console.log(data.Data.newTicketsCount.count);




                            $scope.dat = {
                                labels: ["AdminReply", "clientReply", "newTickets", "noReply"],
                                datasets: [{
                                        label: 'My First dataset',
                                        fillColor: 'rgba(68,182,174,1)',
                                        strokeColor: 'rgba(220,220,220,0.8)',
                                        highlightFill: 'rgba(220,220,220,0.75)',
                                        highlightStroke: 'rgba(220,220,220,1)',
                                        data: [data.Data.adminRepliesCount.count, data.Data.clientRepliesCount.count, data.Data.newTicketsCount.count, data.Data.noRepliesCount.count]
                                    }

                                ]
                            };




                        }).
                        error(function (data, status, headers, config) {


                            // called asynchronously if an error occurs
                            // or server returns response with an error status.
                        });






            }





            $scope.searchLogs   = '';     // set the default search/filter term
        $scope.sortType     = 'date';
        $scope.sortReverse  = true;

        //Pagination
        $scope.currentPage = 1;
        $scope.numPerPage = 10;
        $scope.paginate = function(value) {
          var begin, end, index;
          begin = ($scope.currentPage - 1) * $scope.numPerPage;
          end = begin + $scope.numPerPage;
          index = $scope.allLogs.indexOf(value);
          return (begin <= index && index < end);
        };
        //Pagination


            $http.get('/log/getStatus/?token=' + $cookies.token).
                    success(function (data) {
//                        console.log("Got the data" + data.Data[0].status);
                        $scope.logStatus = data.Data;
                        if (data.Data[0].status)
                        {
                            $scope.logSwitch = true;
                        }
                        else
                        {
                            $scope.logSwitch = false;
                        }
                    }).error(function () {
                console.log("Error in /log/getStatus/");
            });

            $http.get('/log/count-logs/?token=' + $cookies.token).
                    success(function (data) {
//                        console.log("Count log: " + data.LogCount);
                        $scope.logCount = data.LogCount;
                    }).error(function () {
                console.log("Error in '/log/count-logs/");
            });

            $http.get('/log/get-all-logs/?token=' + $cookies.token).
                    success(function (data) {
                        $scope.allLogs = data.Data;
                        $scope.totalItems = data.Data.length;
                    }).error(function () {
                console.log("Error in '/log/get-all-logs/");
            });
        }

        $scope.change = function () {
//            console.log($scope.logSwitch);
            if ($scope.logSwitch)
            {
                $http.post('/log/setStatus', {status: 1, token: $cookies.token}).
                        success(function (data) {
                            if (data.code === 200)
                            {
                                $scope.logSwitch = true;
                                $scope.init();
                            }
                        });
            } else
            {
                $http.post('/log/setStatus', {status: 0, token: $cookies.token}).
                        success(function (data) {
                            if (data.code === 200)
                            {
                                $scope.logSwitch = false;
                                $scope.init();
                            }
                        });
            }
        };

        $scope.clearAllLogs = function () {
            $http.get('/log/clearLogs/?token=' + $cookies.token).
                    success(function (data) {
                        $scope.clearLogsStatus = data.code;
                        $scope.init();
                    }).error(function () {
                console.log("Error in '/clearLogs/");
            });





        }
    }]);



MetronicApp.controller('AnnualIncomeController', ['$rootScope', '$timeout', '$scope', '$http', '$cookies', 'settings', function ($rootScope, $timeout, $scope, $http, $cookies, settings) {
        //console.log($cookies.admin.admin)
        $scope.response = {};


        $scope.init = function (data) {

            var date = [];
            for (var i = 0; i <= 12; i++) {

                var b = moment().add(i, 'months').format('YYYY-MM');
                date.push(b);
            }

            var now = moment().format('YYYY-MM-DD');
            var mydate = moment().add(-data, 'days').format('YYYY-MM-DD');

            $http.post('/admin/api/income', {
                startdate: now,
                enddate: mydate,
                token: $cookies.token

            }).
                    success(function (data, status, headers, config) {
                        // console.log(data.Data)
                        $scope.datatab = data.Data;
                        //    console.log(  $scope.datatab);
                        $scope.finaldata = {}
                        if (data.Data) {


                            var date = [];
                            var paid = [];
                            var refunded = [];
                            var profit = [];
                            var ref = 0;
                            var pay = 0;
                            // console.log(data.Data.length);
                            $scope.paid = 0;
                            $scope.refund = 0;
                            $scope.profit = 0;

                            for (var i = 0; i < data.Data.length; i++) {
                                // console.log(data.Data[i].date);

                                date.push(data.Data[i].date);


                                if (data.Data[i].paymentType == "0") {//paid


                                    pay = parseFloat(pay) + parseFloat(data.Data[i].amount);
                                    $scope.paid = $scope.paid + parseFloat(data.Data[i].amount);


                                    paid.push(parseInt(data.Data[i].amount));


                                } else {
                                    paid.push(0);
                                }
                                if (data.Data[i].paymentType == "1") {
                                    ref = parseInt(ref) + parseInt(data.Data[i].amount);
                                    $scope.refund = $scope.refund + parseInt(data.Data[i].amount);
                                    refunded.push(parseInt(data.Data[i].amount));


                                } else {
                                    refunded.push(0);

                                }
                                var prof = parseInt(pay) - parseInt(ref);

                                profit.push(prof);

                                // console.log(refunded);

                            }
                            $scope.profit = $scope.paid - $scope.refund;
                            $scope.finaldata.date = date;
                            $scope.finaldata.paid = paid;
                            $scope.finaldata.refund = refunded;
                            $scope.finaldata.profit = profit;


                             console.log($scope.finaldata.paid);
                             console.log($scope.finaldata.profit);
                             console.log($scope.finaldata.refund);
                            $scope.data = {
                                labels: $scope.finaldata.date,
                                datasets: [{
                                        label: "Paid",
                                        fillColor: "rgba(87,142,190,0.2)",
                                        strokeColor: "rgba(87,142,190,1)",
                                        pointColor: "rgba(87,142,190,1)",
                                        pointStrokeColor: "#fff",
                                        pointHighlightFill: "#fff",
                                        pointHighlightStroke: "rgba(87,142,190,1)",
                                        data: $scope.finaldata.paid
                                    }, {
                                        label: "Profit",
                                        fillColor: "rgba(227,91,90,0.2)",
                                        strokeColor: "rgba(227,91,90,1)",
                                        pointColor: "rgba(227,91,90,1)",
                                        pointStrokeColor: "#1A6B50",
                                        pointHighlightFill: "#1A6B50",
                                        pointHighlightStroke: "rgba(227,91,90,1)",
                                        data: $scope.finaldata.profit
                                    }, {
                                        label: "Refunded",
                                        fillColor: "rgba(68,182,174,0.2)",
                                        strokeColor: "rgba(68,182,174,1)",
                                        pointColor: "rgba(68,182,174,1)",
                                        pointStrokeColor: "#840B0B",
                                        pointHighlightFill: "#840B0B",
                                        pointHighlightStroke: "rgba(68,182,174,1)",
                                        data: $scope.finaldata.refund
                                    }]
                            };




                        }
                        $timeout(function () {

                            //$("#example_paginate").hide();
                            var rowCount = $("#sample_1 tr").length;
                            console.log("Row count value is" + rowCount);
                            if (rowCount >= 0) {
                                console.log("Entered into Sorting");
                                TableAdvanced.init();
                            }
                        }, 200)

                    });

        }

    }]);





MetronicApp.controller('MonthlyTransactionController', ['$rootScope', '$timeout', '$scope', '$http', '$cookies', 'settings', function ($rootScope, $timeout, $scope, $http, $cookies, settings) {
        //console.log($cookies.admin.admin)
        $scope.response = {};


        $scope.init = function (data) {

            var date = [];
            for (var i = 0; i <= 12; i++) {

                var b = moment().add(i, 'months').format('YYYY-MM');
                date.push(b);
            }

            var now = moment().format('YYYY-MM-DD');
            var mydate = moment().add(-data, 'days').format('YYYY-MM-DD');

            $http.post('/admin/api/income', {
                startdate: now,
                enddate: mydate,
                token: $cookies.token

            }).
                    success(function (data, status, headers, config) {
                        // console.log(data.Data)
                        $scope.datatab = data.Data;
                        //    console.log(  $scope.datatab);
                        $scope.finaldata = {}
                        if (data.Data) {


                            var date = [];
                            var paid = [];
                            var refunded = [];
                            var profit = [];
                            var ref = 0;
                            var pay = 0;
                            // console.log(data.Data.length);
                            $scope.paid = 0;
                            $scope.refund = 0;
                            $scope.profit = 0;

                            for (var i = 0; i < data.Data.length; i++) {
                                // console.log(data.Data[i].date);

                                date.push(data.Data[i].date);


                                if (data.Data[i].paymentType == "0") {//paid


                                    pay = parseFloat(pay) + parseFloat(data.Data[i].amount);
                                    $scope.paid = $scope.paid + parseFloat(data.Data[i].amount);


                                    paid.push(parseInt(data.Data[i].amount));


                                } else {
                                    paid.push(0);
                                }
                                if (data.Data[i].paymentType == "1") {
                                    ref = parseInt(ref) + parseInt(data.Data[i].amount);
                                    $scope.refund = $scope.refund + parseInt(data.Data[i].amount);
                                    refunded.push(parseInt(data.Data[i].amount));


                                } else {
                                    refunded.push(0);

                                }
                                var prof = parseInt(pay) - parseInt(ref);

                                profit.push(prof);

                                // console.log(refunded);

                            }
                            $scope.profit = $scope.paid - $scope.refund;
                            $scope.finaldata.date = date;
                            $scope.finaldata.paid = paid;
                            $scope.finaldata.refund = refunded;
                            $scope.finaldata.profit = profit;





                            var randomScalingFactor = function () {
                                return Math.round(Math.random() * 100)
                            };

                            $scope.dat = {
                                labels: $scope.finaldata.date,
                                datasets: [
                                    {
                                        label: 'Product1',
                                        fillColor: 'rgba(220,220,220,0.5)',
                                        strokeColor: 'rgba(220,220,220,0.8)',
                                        highlightFill: 'rgba(220,220,220,0.75)',
                                        highlightStroke: 'rgba(220,220,220,1)',
                                        data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(),randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()]
                                    },
                                    {
                                        label: 'Product2',
                                        fillColor: 'rgba(151,187,205,0.5)',
                                        strokeColor: 'rgba(151,187,205,0.8)',
                                        highlightFill: 'rgba(151,187,205,0.75)',
                                        highlightStroke: 'rgba(151,187,205,1)',
                                        data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(),randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()]
                                    }

                                ]
                            };















                        }
                        $timeout(function () {

                            //$("#example_paginate").hide();
                            var rowCount = $("#sample_1 tr").length;
                            console.log("Row count value is" + rowCount);
                            if (rowCount >= 0) {
                                console.log("Entered into Sorting");
                                TableAdvanced.init();
                            }
                        }, 200)

                    });

        }

    }]);




MetronicApp.controller('IncomebyProductController', ['$rootScope', '$timeout', '$scope', '$http', '$cookies', 'settings', function ($rootScope, $timeout, $scope, $http, $cookies, settings) {
        //console.log($cookies.admin.admin)
        $scope.response = {};


        $scope.init = function (data) {
            // Chart.js Data
            var date = [];
            // for (var i = 0; i <= 12; i++) {
            //
            //     var b = moment().add(i, 'months').format('YYYY-MM');
            //     date.push(b);
            // }

            $scope.data = {
                labels: date,
                datasets: [{
                        label: "Domian",
                        fillColor: 'rgba(151,187,205,0.2)',
                        strokeColor: 'rgba(151,187,205,1)',
                        pointColor: 'rgba(151,187,205,1)',
                        pointStrokeColor: '#fff',
                        pointHighlightFill: '#fff',
                        pointHighlightStroke: 'rgba(151,187,205,1)',
                        data: [10, 20, 30, 50, 20]
                    },
                    {
                        label: "Servers",
                        fillColor: "rgba(227,91,90,0.2)",
                        strokeColor: "rgba(227,91,90,1)",
                        pointColor: "rgba(227,91,90,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(227,91,90,1)",
                        data: [10, 10, 60, 70, 52]
                    }

                ]
            };


            // Chart.js Options
            $scope.options = {
                bezierCurve: true,
                datasetFill: true

                        //String - A legend template

            };


            $http.post('/admin/api/income-by-product', {
                token: $cookies.token

            }).
                    success(function (data, status, headers, config) {
                        // console.log(data.Data)
                        $scope.datatab = data.Data;
                        for (var i = 0; i < data.Data.length; i++) {
                            // console.log(data.Data[i].date);

                            date.push(data.Data[i].date);
                        }

                        $scope.finaldata = {}

                        $timeout(function () {

                            //$("#example_paginate").hide();
                            var rowCount = $("#sample_1 tr").length;
                            console.log("Row count value is" + rowCount);
                            if (rowCount >= 0) {
                                console.log("Entered into Sorting");
                                TableAdvanced.init();
                            }
                        }, 200);


                    });

        }

    }]);




MetronicApp.controller('PormocodeReportsController', ['$rootScope', '$timeout', '$scope', '$http', '$cookies', 'settings', function ($rootScope, $timeout, $scope, $http, $cookies, settings) {
        //console.log($cookies.admin.admin)
        $scope.response = {};


        $scope.init = function (data) {
            // Chart.js Data
            var date = [];
            // for (var i = 0; i <= 12; i++) {
            //
            //     var b = moment().add(i, 'months').format('YYYY-MM');
            //     date.push(b);
            // }



            $http.post('/admin/api/promocodes-report', {
                token: $cookies.token

            }).
                    success(function (data, status, headers, config) {
                        // console.log(data.Data)
                        $scope.datatab = data.Data;

                        $scope.finaldata = {}
                        $timeout(function () {

                            //$("#example_paginate").hide();
                            var rowCount = $("#sample_1 tr").length;
                            console.log("Row count value is" + rowCount);
                            if (rowCount >= 0) {
                                console.log("Entered into Sorting");
                                TableAdvanced.init();
                            }
                        }, 200);



                    });

        }

    }]);

// Adding Support section's Report Controllers by Syed Arshad 9/7/2015
//1. Response Time Per Tech Controller

MetronicApp.controller('RTPTController', ['$rootScope', '$scope', '$http', '$cookies', 'settings', function ($rootScope, $scope, $http, $cookies, settings) {
        $scope.searchRTPT = '';     // set the default search/filter term
        $scope.sortType = 'departId';
        $scope.sortReverse = false;

        $scope.init = function () {
            $http.post('/admin/api/calculateRTPT', {
                token: $cookies.token
            }).
                    success(function (data) {
                        $scope.totalTickets = data.count;
                        $scope.deptCount = data.deptCount;
                        $scope.ticketsPerDept = data.ticketsPerDept;
                    });
        }

    }]);

//2. Average Response Time calculation
MetronicApp.controller('ARTController', ['$rootScope', '$scope', '$http', '$cookies', 'settings', function ($rootScope, $scope, $http, $cookies, settings) {
        console.log("ARTController")
        $scope.searchART = '';     // set the default search/filter term
        $scope.sortType = 'adminId';
        $scope.sortReverse = false;

        $scope.init = function () {
            $http.post('/admin/api/calculateART', {
                token: $cookies.token
            }).
                    success(function (data) {
                        $scope.totalTickets = data.count;
                        $scope.adminCount = data.adminCount;
                        $scope.ticketsPerAdmin = data.ticketsPerAdmin;
                    });
        }

    }]);

//3. Average First Response Time calculation
MetronicApp.controller('AFRTController', ['$rootScope', '$scope', '$http', '$cookies', 'settings', function ($rootScope, $scope, $http, $cookies, settings) {
        console.log("AFRTController")
        $scope.searchAFRT = '';     // set the default search/filter term
        $scope.sortType = 'adminId';
        $scope.sortReverse = false;

        $scope.init = function () {
            $http.post('/admin/api/calculateAFRT', {
                token: $cookies.token
            }).
                    success(function (data) {
                        $scope.totalTickets = data.count;
                        $scope.adminCount = data.adminCount;
                        $scope.ticketsPerAdmin = data.ticketsPerAdmin;
                    });
        }

    }]);

MetronicApp.controller('ADTController', ['$rootScope', '$scope', '$http', '$cookies', 'settings', function ($rootScope, $scope, $http, $cookies, settings) {
        //console.log("ADTController")
        $scope.searchADT = '';     // set the default search/filter term
        $scope.sortType = 'selecteddate';
        $scope.sortReverse = false;

        $scope.date = new Date(); //set the current month in view

        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        $scope.currentMonthSelected = monthNames[$scope.date.getMonth()];
        $scope.currentYearSelected = $scope.date.getFullYear();

        $scope.dateChange = function (d, y)
        {
            $scope.calcADT(d + 1, y);
            $scope.currentMonthSelected = monthNames[$scope.date.getMonth(d)];
            $scope.currentYearSelected = y;
        }

        $scope.init = function () {
            var d = new Date(); //The Date object is used to work with dates and times.
            var getMonthId = d.getMonth();
            var currentMonth = getMonthId + 1;
            var currentYear = d.getFullYear();
            var monthId = currentMonth;
            var yearId = currentYear;
            $http.post('/admin/api/calculateADT', {
                token: $cookies.token,
                monthId: monthId,
                yearId: yearId
            }).
                    success(function (data) {
                        $scope.totalTickets = data.count;
                        $scope.deptCount = data.deptCount;
                        $scope.adminCount = data.adminCount;
                        $scope.ticketsPerAdmin = data.ticketsPerAdmin;
                        $scope.monthReport = data.monthReport;
                        $scope.monthlyTicketCount = data.monthlyTicket;
                        $scope.daysInMonth = data.daysInMonth;
                    });
        }

        $scope.calcADT = function (mid, yid) {
            var monthId = mid;
            var yearId = yid;
            $http.post('/admin/api/calculateADT', {
                token: $cookies.token,
                monthId: monthId,
                yearId: yearId
            }).
                    success(function (data) {
                        $scope.totalTickets = data.count;
                        $scope.deptCount = data.deptCount;
                        $scope.adminCount = data.adminCount;
                        $scope.ticketsPerAdmin = data.ticketsPerAdmin;
                        $scope.monthReport = data.monthReport;
                        $scope.monthlyTicketCount = data.monthlyTicket;
                        $scope.daysInMonth = data.daysInMonth;
                    });
        }

        $scope.formatDate = function (date) {
            var dateOut = new Date(date);
            return dateOut;
        };

    }]);

MetronicApp.controller('TDRController', ['$rootScope', '$scope', '$http', '$cookies', 'settings', function ($rootScope, $scope, $http, $cookies, settings) {
        console.log("TDRController")
        $scope.searchTDR = '';     // set the default search/filter term
        $scope.sortType = 'selecteddate';
        $scope.sortReverse = false;

        $scope.date = new Date(); //set the current month in view

        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        $scope.currentMonthSelected = monthNames[$scope.date.getMonth()];
        $scope.currentYearSelected = $scope.date.getFullYear();

        $scope.dateChange = function (d, y)
        {
            $scope.calcADT(d + 1, y);
            $scope.currentMonthSelected = monthNames[$scope.date.getMonth(d)];
            $scope.currentYearSelected = y;
        }

        $scope.init = function () {
            var d = new Date(); //The Date object is used to work with dates and times.
            var getMonthId = d.getMonth();
            var currentMonth = getMonthId + 1;
            var currentYear = d.getFullYear();
            var monthId = currentMonth;
            var yearId = currentYear;
            $http.post('/admin/api/calculateDTR', {
                token: $cookies.token,
                monthId: monthId,
                yearId: yearId
            }).
                    success(function (data) {
                        $scope.totalTickets = data.count;
                        $scope.deptCount = data.deptCount;
                        $scope.adminCount = data.adminCount;
                        $scope.ticketsPerAdmin = data.ticketsPerAdmin;
                        $scope.monthReport = data.monthReport;
                        $scope.monthlyTicketCount = data.monthlyTicket;
                        $scope.daysInMonth = data.daysInMonth;
                        $scope.ticketsRepliedThisMonth = data.ticketsRepliedThisMonth;
                    });
        }

        $scope.calcADT = function (mid, yid) {
            var monthId = mid;
            var yearId = yid;
            $http.post('/admin/api/calculateDTR', {
                token: $cookies.token,
                monthId: monthId,
                yearId: yearId
            }).
                    success(function (data) {
                        $scope.totalTickets = data.count;
                        $scope.deptCount = data.deptCount;
                        $scope.adminCount = data.adminCount;
                        $scope.ticketsPerAdmin = data.ticketsPerAdmin;
                        $scope.monthReport = data.monthReport;
                        $scope.monthlyTicketCount = data.monthlyTicket;
                        $scope.daysInMonth = data.daysInMonth;
                        $scope.ticketsRepliedThisMonth = data.ticketsRepliedThisMonth;
                    });
        }

        $scope.formatDate = function (date) {
            var dateOut = new Date(date);
            return dateOut;
        };

    }]);
