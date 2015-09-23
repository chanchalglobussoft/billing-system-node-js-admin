MetronicApp.controller('GatewayLogs', ['$rootScope', '$scope', '$http', '$cookies', '$cookieStore', 'settings', function ($rootScope, $scope, $http, $cookies, $cookieStore, settings) {

console.log("GatewayLogs Controller loaded and ready !!");

        $scope.response = {};
        $scope.searchManageOrders = ''; // set the default search/filter term
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


        $scope.$watch('searchManageOrders', function(term) {
          if(!$scope.searchManageOrders)
          {
            $scope.numPerPage = 10;
          }
          else {
              $scope.numPerPage = 100000; //maximum number of rows in table
          }
        });

        $scope.ranges = {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
            'Last 7 days': [moment().subtract('days', 7), moment()],
            'Last 30 days': [moment().subtract('days', 30), moment()],
            'This month': [moment().startOf('month'), moment().endOf('month')]
        };

          $scope.paymentMethods = {
                                 1: "Debit Card",
                                 2: "Credit Card",
                                 3: "Paypal",
                                 4: "Bitcoin",
                                 5: "Venmo",
                                 6: "Apple Pay",
                                 7: "Android Pay",
                                 8: "Other method"
          }

          $scope.response.status = {
              1: "Successful",
              2: "Failed",
              3: "Pending",
              4: "Incomplete"

          };
//         $scope.countries = {};
//         $scope.currencies = {};
//         $scope.securityQuestions = {};
//
//
//         $http.post('api/country/get-only-names', {
//             token: $cookies.token
//         }).success(function (data) {
//             console.log(data);
//             $scope.countries = data.Data;
//         }).error(function (data) {
//             console.log("Error in /country/get-all-data: " + data);
//         });
//
//         $http.post('api/country/get-only-currencies', {
//             token: $cookies.token
//         }).success(function (data) {
//             console.log(data);
//             $scope.currencies = data.Data;
//         }).error(function (data) {
//             console.log("Error in /country/get-all-data: " + data);
//         });
//
//         $http.post('api/security-questions/get-only-questions', {
//             token: $cookies.token
//         }).success(function (data) {
//             console.log(data);
//             $scope.securityQuestions = data.Data;
//         }).error(function (data) {
//             console.log("Error in /security-questions/get-only-questions: " + data);
//         });
//
//         $scope.selectedCountry = function (a)
//         {
//             $scope.session.currencyID = $scope.currencies.id_countries = a;
//         }
//         $scope.selectedSecurityQuestion = function (a)
//         {
//             console.log(a);
//         }
//
//         $scope.paymentMethods = {
//                                1: "Debit Card",
//                                2: "Credit Card",
//                                3: "Paypal",
//                                4: "Bitcoin",
//                                5: "Venmo",
//                                6: "Apple Pay",
//                                7: "Android Pay",
//                                8: "Other method"
//         }
//
//         $scope.init = function () {
//
//
//
//
//             // /country/get-all-data
//
//
// //            $scope.data = {
// //                1: "group1",
// //                2: "group2",
// //                3: "group3"
// //
// //            };
//             $scope.status = {
//                 1: "Active",
//                 2: "Inactive",
//                 3: "Dormant"
//
//             };
//
//         }
//
//         $scope.submit = function () {
//
//
//             console.log($scope.session);
//             if ($scope.session.eMail && $scope.session.phone && $scope.session.fName) {
//
//
//                 $http.post('/addclient', {
//                     data: $scope.session,
//                     token: $cookies.token,
//                     date: moment().format('YYYY-MM-DD'),
//                     source: "SignUp By Client"
//
//
//
//
//                 }).
//                         success(function (data, status, headers, config) {
//                             console.log(data);
//                             if (data.code == 200) {
//                                 registrationSuccess();
//                                 $scope.session ='';
//                             } else {
//                                 emailAlreadyExits();
//                             }
//                         }).
//                         error(function (data, status, headers, config) {
//                         });
//             } else {
//                 alert("Please Enter Valid Data")
//             }
//         }
    }]);
