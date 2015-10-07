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


    //mass mailer


    MetronicApp.controller('MassMailController', ['$rootScope', '$scope', '$http', '$cookies', 'settings', function ($rootScope, $scope, $http, $cookies, settings) {
      console.log("MassMailController loaded");
            $scope.response = {};

            $scope.allMatchingDomains = false;

            $scope.clientGroups =[
          { value: '1', name: "Group 1" },
          { value: '2', name: "Group 2" },
          { value: '3', name: "Group 3" },
          { value: '4', name: "Group 4" },
          { value: '5', name: "Group 5" }
                                ];


           $scope.languages =[
               { value: '1', name: "Default" },
               { value: '2', name: "English" }
            ];

            // clientStatus
            $scope.clientStatus =[
                { value: '1', name: "Active" },
                { value: '2', name: "Inactive" },
                { value: '3', name: "Closed" }
             ];


             $scope.productGroups =[
                 { value: '1', name: " Starter Package" },
                 { value: '2', name: " Advanced Package" },
                 { value: '3', name: "Home Package" }
              ];

              $scope.productStatus =[
                  { value: '1', name: " Pending " },
                  { value: '2', name: " Active " },
                  { value: '3', name: " Suspended " },
                  { value: '4', name: " Terminated " },
                  { value: '5', name: " Cancelled " },
                  { value: '6', name: " Fraud " }
               ];

               $scope.serverGroups =[
                   { value: '1', name: " Server - 1" },
                   { value: '2', name: " Server - 2" },
                   { value: '3', name: " Server - 3" }
                ];

                $scope.addonGroups =[
              { value: '1', name: "Addon 1" },
              { value: '2', name: "Addon 2" },
              { value: '3', name: "Addon 3" },
              { value: '4', name: "Addon 4" },
              { value: '5', name: "Addon 5" }
                                    ];


              $scope.addonStatus =[
                { value: '1', name: " Pending " },
                { value: '2', name: " Active " },
                { value: '3', name: " Suspended " },
                { value: '4', name: " Terminated " },
                { value: '5', name: " Cancelled " },
                { value: '6', name: " Fraud " }
             ];


             $scope.domainStatus =[
               { value: '1', name: " Pending " },
               { value: '2', name: " Active " },
               { value: '3', name: " Suspended " },
               { value: '4', name: " Terminated " },
               { value: '5', name: " Cancelled " },
               { value: '6', name: " Fraud " }
            ];

            $scope.init = function () {
                console.log("init function on load...");
              }


          //  $scope.getMailIDs = function(groupList, langList, cStatusList, productList, pstatusList, serverList, eachDomain, addonList, addonStatusList, domainStatusList){
  $scope.getMailIDs = function(groupList){
              $http.post('/admin/api/get-client-mail-ids', {
                  gList: groupList,
                  token: $cookies.token
              }).
                      success(function (data, status, headers, config) {
                          console.log(data);
                      });

            }



              $scope.clearAll = function(){
              delete $scope.selectedGroupList;
              delete $scope.selectedLanguage;
              delete $scope.selectClientStatus;
              $scope.noGroup = false;
              $scope.allMatchingDomains = false;
              }

            $scope.generalMail = function(){

              var groupList = [];
              var langList = [];
              var cStatusList = [];

              var cgJSON  = JSON.stringify($scope.selectedGroupList);
                var langJSON  = JSON.stringify($scope.selectedLanguage);
                  var cstatusJSON  = JSON.stringify($scope.selectClientStatus);

                  if(cgJSON)
                  {
                    // console.log("ok")
                    $scope.noGroup = false;
                    angular.forEach($scope.selectedGroupList, function(value, key) {
                      groupList.push(value.value);
                    });
                    console.log("Selected Groups array"+groupList);

                    if(langJSON)
                    {
                      angular.forEach($scope.selectedLanguage, function(value, key) {
                        langList.push(value.value);
                      });
                      console.log("Selected languages array"+langList);
                      }

                      if(cstatusJSON)
                      {
                        angular.forEach($scope.selectClientStatus, function(value, key) {
                          cStatusList.push(value.value);
                        });
                        console.log("Selected client status array"+cStatusList);
                        }

                        $scope.getMailIDs(groupList);

                        // $scope.sendMails(1);


                    // console.log("Detected generalMail Button click"+ cgJSON + langJSON + cstatusJSON);

                  }
                  else {
                    $scope.noGroup = true;
                    console.log("Select at least one group")
                  }
            }

            $scope.productMail = function(){
              console.log("Detected productMail Button click");

                var cgJSON  = JSON.stringify($scope.selectedGroupList);

                if(cgJSON){
                    $scope.noGroup = false;
                  $scope.generalMail();
                  console.log($scope.allMatchingDomains);
                  // $scope.sendMails(2);
                }
                else {
                    $scope.noGroup = true;
                  console.log("Select at least one group")
                }

            }

            $scope.addonMail = function(){
              console.log("Detected addonMail Button click");

              var cgJSON  = JSON.stringify($scope.selectedGroupList);

              if(cgJSON){
                $scope.noGroup = false;
                $scope.generalMail();
                  // $scope.sendMails(3);
              }
              else {
                  $scope.noGroup = true;
                console.log("Select at least one group")
              }
            }

            $scope.domainMail = function(){
              console.log("Detected domainMail Button click");

              var cgJSON  = JSON.stringify($scope.selectedGroupList);

              if(cgJSON){
                  $scope.noGroup = false;
                $scope.generalMail();
                  // $scope.sendMails(4);
              }
              else {
                  $scope.noGroup = true;
                console.log("Select at least one group")
              }
            }

            $scope.sendMails = function(option)
            {
              console.log(option);
            }



        }]);
