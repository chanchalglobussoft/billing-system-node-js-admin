MetronicApp.controller('ClientController', ['$rootScope', '$scope', '$http', '$cookies', 'settings', function ($rootScope, $scope, $http, $cookies, settings) {

        $scope.response = {};

        $scope.init = function () {
            //console.log("hello");



            $http.get('/admin/api/clientActivity/token?' + $cookies.token).
                    success(function (data, status, headers, config) {
                        $scope.response.data = data.Data;

                        console.log($scope.response.data);

                    }).
                    error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });


        }

    }]);




/* Setup general page controller */

MetronicApp.controller('SearchController', ['$rootScope', '$scope', '$http', '$cookies', 'settings', function ($rootScope, $scope, $http, $cookies, settings) {

  $scope.ranges = {
      'Today': [moment(), moment()],
      'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
      'Last 7 days': [moment().subtract('days', 7), moment()],
      'Last 30 days': [moment().subtract('days', 30), moment()],
      'This month': [moment().startOf('month'), moment().endOf('month')]
  };

        $scope.searchLogs = ''; // set the default search/filter term
        $scope.sortType = 'date';
        $scope.sortReverse = true;

        //Pagination
        $scope.currentPage = 1;
        $scope.numPerPage = 10;
        $scope.paginate = function (value) {
            var begin, end, index;
            begin = ($scope.currentPage - 1) * $scope.numPerPage;
            end = begin + $scope.numPerPage;
            index = $scope.response.data.indexOf(value);
            return (begin <= index && index < end);
        };
        //Pagination


                $scope.$watch('searchClients', function(term) {
                  if(!$scope.searchClients)
                  {
                    $scope.numPerPage = 10;
                  }
                  else {
                      $scope.numPerPage = 100000; //maximum number of rows in table
                  }
                });

          $scope.response = {};
          $scope.countries = {};


          $http.post('api/country/get-only-names', {
              token: $cookies.token
          }).success(function (data) {
              console.log(data);
              $scope.countries = data.Data;
          }).error(function (data) {
              console.log("Error in /country/get-all-data: " + data);
          });


        //console.log("dfh");

        $scope.init = function () {
            $scope.dateSwitch = false;

            $scope.data = {
                1: "Group 1",
                2: "Group 2",
                3: "Group 3"

            };
            $scope.status = {
                1: "Active",
                2: "Inactive",
                3: "Closed"

            };


            $http.get('/admin/api/testapi/listall?token=' + $cookies.token).
                    success(function (data) {
                        //  console.log(data);
                        $scope.response.data = data.Data;
                        $scope.totalItems = data.Data.length;
                        //                        console.log("All clients"+data);
                    }).
                    error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });




        }

        $scope.submit = function () {
            if ($scope.session) {
                console.log($scope.session);
                $http.post('/admin/api/findclient', {
                    data: $scope.session,
                    dateswitch: $scope.dateSwitch,
                    token: $cookies.token
                }).
                        success(function (data, status, headers, config) {
                            console.log(data);
                            if (data.Data.length > 0) {
                                $scope.response.data = data.Data;
                                $scope.totalItems = data.Data.length;
                                $scope.paginate();
                            } else {
                                noResults();
                            }
                        }).
                        error(function (data, status, headers, config) {



                        });


                //alert($scope.submitForm);
            } else {
                alert("Please Feed Some Data");
            }

        }

    }]);
