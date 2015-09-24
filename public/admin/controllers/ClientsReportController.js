MetronicApp.controller('ClientsStatementController', ['$rootScope','$timeout', '$scope', '$http', '$cookies', 'settings', function($rootScope,$timeout, $scope, $http, $cookies, settings) {

$scope.response={};
    $scope.count=1;
$scope.mydate = {date_start:'',

};

    $scope.timeout=function()
    {
        $timeout(function() {

            //$("#example_paginate").hide();
            var rowCount = $("#sample_1 tr").length;
            console.log("Row count value is"+rowCount);
            if (rowCount >= 0) {
                console.log("Entered into Sorting");
                TableAdvanced.init();
            }
        }, 200);
    }


$scope.init=function(){

$scope.submit=function(){
    $http.post('/admin/api/transaction-history', {

        token: $cookies.token,
        clientId: $scope.clientId

    }).
        success(function(data, status, headers, config) {
            $scope.transaction = data.Data;
               $scope.timeout();



        });

    var a=moment($scope.date_start).unix();
var b=moment($scope.date_end).unix();

  // var a= Date.parse("24-Nov-2009 17:57:35").getTime()/1000;
  console.log(a);
  console.log(b);
  console.log($scope.clientId);
  if($scope.date_start && $scope.date_end){


  $http.post('/admin/api/clients-statement', {

      token: $cookies.token,
      start_date:a,
      end_date:b,
      clientId:$scope.clientId

  }).
  success(function(data, status, headers, config) {
console.log(data.Data.length)

if(data.Data.length!=0){
  $scope.datatab=data.Data;

    if($scope.count==1){
        $scope.timeout();
        $scope.count++;
    }
}else{

  alert("No Recods Found");
}


  });
}
if(!$scope.date_start && !$scope.date_end){


$http.post('/admin/api/clients-statement-all', {

    token: $cookies.token,

    clientId:$scope.clientId

}).
success(function(data, status, headers, config) {
console.log(data.Data.length)
if(data.Data.length!=0){
$scope.datatab=data.Data;
    if($scope.count==1){
        $scope.timeout();
        $scope.count++;
    }
}else{

alert("No Recods Found");
}


});
}








}

}


}]);
MetronicApp.controller('ClientsByCountryController', ['$rootScope','$timeout', '$scope', '$http', '$cookies', 'settings', function($rootScope,$timeout, $scope, $http, $cookies, settings) {

$scope.init=function(){
  $http.post('/admin/api/clients-country', {

      token: $cookies.token

  }).
  success(function(data, status, headers, config) {
    $scope.datatab=data.Data;

          $timeout(function() {

              //$("#example_paginate").hide();
              var rowCount = $("#sample_1 tr").length;
              console.log("Row count value is"+rowCount);
              if (rowCount >= 0) {
                  console.log("Entered into Sorting");
                  TableAdvanced.init();
              }
          }, 200);
  })

}

}]);

MetronicApp.controller('ClientsByIncomeController', ['$rootScope','$timeout', '$scope', '$http', '$cookies', 'settings', function($rootScope,$timeout, $scope, $http, $cookies, settings) {
$scope.init=function(){

          $http.post('/admin/api/clients-income', {

              token: $cookies.token

          }).
          success(function(data, status, headers, config) {
            $scope.datatab=data.Data;
                  $timeout(function() {

                      //$("#example_paginate").hide();
                      var rowCount = $("#sample_1 tr").length;
                      console.log("Row count value is"+rowCount);
                      if (rowCount >= 0) {
                          console.log("Entered into Sorting");
                          TableAdvanced.init();
                      }
                  }, 200);
          })
}


}]);


MetronicApp.controller('ClientSourceController', ['$rootScope','$timeout', '$scope', '$http', '$cookies', 'settings', function($rootScope,$timeout, $scope, $http, $cookies, settings) {


    $scope.init = function(data) {


        $http.post('/admin/api/clients-source', {

            token: $cookies.token

        }).
        success(function(data, status, headers, config) {
            console.log(data.Data)
            $scope.datatab = data.Data;
            var withoutref=0;
            var clientref=0;
            var adminref=0;
            var socialnetworkingsitesref=0;
            var othereadvertismentref=0;
            for(var i=0;i<data.Data.length;i++){
if( data.Data[i].source==0){
  data.Data[i].source="Without Referral";
withoutref++;
  }
   if(data.Data[i].source==1)
{
  data.Data[i].source="Referral By A Client";
  clientref++;
  }

if(data.Data[i].source==2)
{
   data.Data[i].source="Referral By Admin";
   adminref++;

}
if(data.Data[i].source==3)
{
   data.Data[i].source="Social Networking Sites";
   socialnetworkingsitesref++;
}
if(data.Data[i].source==4)
{
   data.Data[i].source="Other Advertisments";
   othereadvertismentref++;
}



              //  console.log(month);
}

$scope.bardata = [{
        value: withoutref,
        color: "#ef4836",
        highlight: "#FF5A5E",
        label: "Without Referral"
    },

    {
        value: clientref,
        color: "#44b6ae",
        highlight: "#5AD3D1",
        label: "Referral By A Client"
    }, {
        value: adminref,
        color: "#8e5fa2",
        highlight: "#7E61E0",
        label: "Referral By Admin"
    }, {
        value: socialnetworkingsitesref,
        color: "#5c9bd1",
        highlight: "#A8B3C5",
        label: "Social Networking Sites"
    }
    ,
    {
       value: othereadvertismentref,
       color: "#FFEC82",
       highlight: "#F9E147",
       label: "Other Advertisments"
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






                $timeout(function() {

                    //$("#example_paginate").hide();
                    var rowCount = $("#sample_1 tr").length;
                    console.log("Row count value is"+rowCount);
                    if (rowCount >= 0) {
                        console.log("Entered into Sorting");
                        TableAdvanced.init();
                    }
                }, 200);






});
}


}]);

MetronicApp.controller('ClientsReportController', ['$rootScope','$timeout', '$scope', '$http', '$cookies', 'settings', function($rootScope,$timeout, $scope, $http, $cookies, settings) {
    //console.log($cookies.admin.admin)
    $scope.response = {};


    $scope.init = function(data) {


        $http.post('/admin/api/clients-report', {

            token: $cookies.token

        }).
        success(function(data, status, headers, config) {
            // console.log(data.Data)
            $scope.datatab = data.Data;
            var active = 0;
            var inactive = 0;
            var cancelled = 0;
            var not_varified = 0;


            for (var i = 0; i < data.Data.length; i++) {

                if (data.Data[i].status == 1) {
                    active++;
                } else if (data.Data[i].status == 2) {
                    inactive++;
                } else if (data.Data[i].status == 3) {
                    cancelled++;
                } else {
                    not_varified++;
                }




            }

            $scope.response.active = active;
            $scope.response.inactive = inactive;
            $scope.response.cancelled = cancelled;
            $scope.response.not_varified = not_varified;
            console.log($scope.response.active)
            $scope.bardata = [{
                    value: $scope.response.not_varified,
                    color: "#ef4836",
                    highlight: "#FF5A5E",
                    label: "Not Verified"
                },

                {
                    value: $scope.response.active,
                    color: "#44b6ae",
                    highlight: "#5AD3D1",
                    label: "Active"
                }, {
                    value: $scope.response.inactive,
                    color: "#8e5fa2",
                    highlight: "#FFC870",
                    label: "InActive"
                }, {
                    value: $scope.response.cancelled,
                    color: "#5c9bd1",
                    highlight: "#A8B3C5",
                    label: "Cancelled"
                }

            ];




                $timeout(function() {

                    //$("#example_paginate").hide();
                    var rowCount = $("#sample_1 tr").length;
                    console.log("Row count value is"+rowCount);
                    if (rowCount >= 0) {
                        console.log("Entered into Sorting");
                        TableAdvanced.init();
                    }
                }, 200);

        });



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

        $scope.transaction = function(id) {
            console.log(id);

            $http.post('/admin/api/transaction-history', {

                token: $cookies.token,
                clientId: id

            }).
            success(function(data, status, headers, config) {
                $scope.transaction = data.Data;
                console.log(data);



            });


        }



    }


}]);

MetronicApp.controller('NewCustomersController', ['$rootScope','$timeout', '$scope', '$http', '$cookies', 'settings', function($rootScope,$timeout, $scope, $http, $cookies, settings) {
    $scope.response = {};
    $scope.count=1;
    var year = $scope.response.year = moment().format('YYYY');
    $scope.response.now = moment().format('YYYY');

    $scope.init = function(year) {

        $http.post('/admin/api/clients-reg', {

            token: $cookies.token,
            data: year

        }).
        success(function(data, status, headers, config) {
            console.log(data.Data)



           if(data.code==200){
              for(var i=0;i<data.Data.length;i++){

                 var month=moment(data.Data[i].reg_date).format('MMMM-YYYY');
                 data.Data[i].reg_date=month


                //  console.log(month);
}

            }
            $scope.response.datatab=data.Data;
if($scope.count==1){
    $scope.timeout();
    $scope.count++;
}



        });

        var randomScalingFactor = function() {
            return Math.round(Math.random() * 100)
        };

        $scope.dat = {
            labels: ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ],
            datasets: [{
                label: $scope.response.year,
                fillColor: 'rgba(220,220,220,0.5)',
                strokeColor: 'rgba(220,220,220,0.8)',
                highlightFill: 'rgba(220,220,220,0.75)',
                highlightStroke: 'rgba(220,220,220,1)',
                data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()]
            }, {
                label: $scope.response.year - 1,
                fillColor: 'rgba(151,187,205,0.5)',
                strokeColor: 'rgba(151,187,205,0.8)',
                highlightFill: 'rgba(151,187,205,0.75)',
                highlightStroke: 'rgba(151,187,205,1)',
                data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()]

            }]
        };

        // Chart.js Options
        $scope.opt = {
            // Sets the chart to be responsive
            responsive: true,
            //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
            scaleBeginAtZero: true,
            //Boolean - Whether grid lines are shown across the chart
            scaleShowGridLines: true,
            //String - Colour of the grid lines
            scaleGridLineColor: "rgba(0,0,0,.05)",
            //Number - Width of the grid lines
            scaleGridLineWidth: 1,
            //Boolean - If there is a stroke on each bar
            barShowStroke: true,
            //Number - Pixel width of the bar stroke
            barStrokeWidth: 2,
            //Number - Spacing between each of the X value sets
            barValueSpacing: 5,
            //Number - Spacing between data sets within X values
            barDatasetSpacing: 1,
            //String - A legend template
            legendTemplate: '<ul class="tc-chart-js-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].fillColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
        };

        $scope.timeout=function()
        {
            $timeout(function() {

                //$("#example_paginate").hide();
                var rowCount = $("#sample_1 tr").length;
                console.log("Row count value is"+rowCount);
                if (rowCount >= 0) {
                    console.log("Entered into Sorting");
                    TableAdvanced.init();
                }
            }, 200);
        }

    }

    $scope.current = function(value) {
        $scope.response.year = parseInt($scope.response.year) + parseInt(value);
        //alert($scope.response.year);
        $scope.init($scope.response.year);
    }

}]);
