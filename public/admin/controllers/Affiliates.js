MetronicApp.controller('AffiliatesController', ['$rootScope','$timeout', '$scope', '$http', '$cookies', 'settings', function($rootScope,$timeout, $scope, $http, $cookies, settings) {

    $scope.response = {};

    $scope.init = function() {


         var date = [];
         var data1=[];
           var date2 = [];
         var data2=[];
        // for (var i = 0; i <= 30; i++) {

        //     var b = moment().subtract(i, 'day').format('YYYY-MM-DD');
        //     date.push(b);
        // }





        $http.post('/admin/api/get-signups',{token: $cookies.token}).
         success(function(data) {

           //$scope.response.hits=data.Data;
             console.log(data.Data);

           for(var i=0;i<data.Data.length;i++){
           // console.log(data.Data[i].date_of_referral)

           date2.push(data.Data[i].date_of_referral);
           data2.push(data.Data[i].no_of_hits)
           }

           $scope.data2 = {

            labels: date2,
            datasets: [{
                label: "Pending",
                fillColor: "rgba(87,142,190,0.2)",
                strokeColor: "rgba(87,142,190,1)",
                pointColor: "rgba(87,142,190,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(87,142,190,1)",
                data: data2
            }]
        };


        });


        $http.post('/admin/api/get-affiliate-hits',{token: $cookies.token}).
         success(function(data) {

           //$scope.response.hits=data.Data;
            // console.log(data.Data);

           for(var i=0;i<data.Data.length;i++){
            // console.log(data.Data[i].date_of_referral)

           date.push(data.Data[i].date_of_referral);
           data1.push(data.Data[i].no_of_hits)
           $scope.options2 = {
            bezierCurve: $scope.a,
            datasetFill: $scope.b,

            //String - A legend template

        };
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
                data: data1
            }]
        };


        });




        $scope.a = false;
        $scope.b = true;



        // Chart.js Options
        $scope.options = {
            bezierCurve: $scope.a,
            datasetFill: $scope.b,

            //String - A legend template

        };


        $http.post('/admin/api/get-affiliates', {
            token: $cookies.token
        }).
        success(function(data) {
            if (data) {
                console.log(data);

                $scope.response.data = data.Data;


                $scope.response.total = parseInt($scope.response.data[1].affiliates_status) + parseInt($scope.response.data[2].affiliates_status);
                $scope.response.percentage = (parseInt($scope.response.data[2].affiliates_status) / $scope.response.total) * 100;
            }


        });

        //console.log("hello");

    }

}]);







MetronicApp.controller('AffiliatessalesController', ['$rootScope','$timeout', '$scope', '$http', '$cookies', 'settings', function($rootScope,$timeout, $scope, $http, $cookies, settings) {

    $scope.response = {};
$scope.init=function(){

        $http.post('/admin/api/affiliates-sales',{token: $cookies.token}).
         success(function(data) {
            $scope.response.data=data.Data;
             console.log(data.Data);


         })



         $scope.bardata = [{
                    value: 10,
                    color: "#ef4836",
                    highlight: "#FF5A5E",
                    label: "Not Verified"
                },

                {
                    value:15,
                    color: "#44b6ae",
                    highlight: "#5AD3D1",
                    label: "Active"
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



$timeout(function () {

                            //$("#example_paginate").hide();
                            var rowCount = $("#sample_1 tr").length;
                            console.log("Row count value is" + rowCount);
                            if (rowCount >= 0) {
                                console.log("Entered into Sorting");
                                TableAdvanced.init();
                            }
                        }, 200);


}




}]);

// AffiliatessalesController

MetronicApp.controller('AffiliaterevenueController', ['$rootScope','$timeout', '$scope', '$http', '$cookies', 'settings', function($rootScope,$timeout, $scope, $http, $cookies, settings) {

    $scope.response = {};
$scope.init=function(){

        $http.post('/admin/api/affiliates-revenue',{token: $cookies.token}).
         success(function(data) {
            $scope.response.data=data.Data;
             console.log(data.Data);


         })



         $scope.bardata = [{
                    value: 10,
                    color: "#ef4836",
                    highlight: "#FF5A5E",
                    label: "Not Verified"
                },

                {
                    value:15,
                    color: "#44b6ae",
                    highlight: "#5AD3D1",
                    label: "Active"
                },
                {
                    value: 10,
                    color: "#ef4836",
                    highlight: "#FF5A5E",
                    label: "Not Verified"
                },

                {
                    value:15,
                    color: "#44b6ae",
                    highlight: "#5AD3D1",
                    label: "Active"
                },
                {
                    value: 10,
                    color: "#ef4836",
                    highlight: "#FF5A5E",
                    label: "Not Verified"
                },

                {
                    value:15,
                    color: "#44b6ae",
                    highlight: "#5AD3D1",
                    label: "Active"
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


$timeout(function () {

                            //$("#example_paginate").hide();
                            var rowCount = $("#sample_1 tr").length;
                            console.log("Row count value is" + rowCount);
                            if (rowCount >= 0) {
                                console.log("Entered into Sorting");
                                TableAdvanced.init();
                            }
                        }, 200);

}
//




}]);

//Affiliates revenue ends here




MetronicApp.controller('AffiliatetrafficController', ['$rootScope','$timeout', '$scope', '$http', '$cookies', 'settings', function($rootScope,$timeout, $scope, $http, $cookies, settings) {

    $scope.response = {};
$scope.init=function(){

        $http.post('/admin/api/affiliates-traffic',{token: $cookies.token}).
         success(function(data) {
            $scope.response.data=data.Data;
             console.log(data.Data);


         })



$timeout(function () {

                            //$("#example_paginate").hide();
                            var rowCount = $("#sample_1 tr").length;
                            console.log("Row count value is" + rowCount);
                            if (rowCount >= 0) {
                                console.log("Entered into Sorting");
                                TableAdvanced.init();
                            }
                        }, 200);

}
//




}]);

//AffiliatetrafficController
