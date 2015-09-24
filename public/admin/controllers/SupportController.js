MetronicApp.controller('SupportController', ['$rootScope', '$scope', '$http', '$cookies', '$cookieStore', 'settings', function ($rootScope, $scope, $http, $cookies, $cookieStore, settings) {
        var adminValueFromCookie = $cookieStore.get('adminId');
        // console.log("Got this value from cookie" + adminValueFromCookie);
        // console.log("Token ?" + $cookies.token);

        $scope.response = {};
        $scope.session = {};

        $scope.dateSwitch = false;
        $scope.daysAgoSwitch = true;
        //$scope.hitCount = true;

        $scope.session.daysAgo = 0;
        $scope.session.datesrange = "";

        $scope.$watch('dateSwitch', function (value) {
            if (value)
            {
                $scope.daysAgoSwitch = false;
                $scope.session.daysAgo = "";
            }
        });

        $scope.$watch('daysAgoSwitch', function (value) {
            if (value)
            {
                $scope.dateSwitch = false;
                $scope.session.datesrange = "";
            }
        });

        $scope.ranges = {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
            'Last 7 days': [moment().subtract('days', 7), moment()],
            'Last 30 days': [moment().subtract('days', 30), moment()],
            'This month': [moment().startOf('month'), moment().endOf('month')]
        };


        $scope.init = function () {



            $scope.bardata = [
                {
                    value: 300,
                    color: "#F7464A",
                    highlight: "#FF5A5E",
                    label: "0 to 1 hr"
                },
                {
                    value: 120,
                    color: "#4D5360",
                    highlight: "#616774",
                    label: "4 to 8 hrs"
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

            //end of bar chart


            var randomScalingFactor = function () {
                return Math.round(Math.random() * 100)
            };

            $scope.dat = {
                labels: ["00", "01"],
                datasets: [
                    {
                        label: 'My First dataset',
                        fillColor: 'rgba(220,220,220,0.5)',
                        strokeColor: 'rgba(220,220,220,0.8)',
                        highlightFill: 'rgba(220,220,220,0.75)',
                        highlightStroke: 'rgba(220,220,220,1)',
                        data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()]
                    },
                    {
                        label: 'My Second dataset',
                        fillColor: 'rgba(151,187,205,0.5)',
                        strokeColor: 'rgba(151,187,205,0.8)',
                        highlightFill: 'rgba(151,187,205,0.75)',
                        highlightStroke: 'rgba(151,187,205,1)',
                        data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()]

                    }
                ]
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
                legendTemplate: '&lt;ul class="tc-chart-js-legend"&gt;&lt;% for (var i=0; i&lt;datasets.length; i++){%&gt;&lt;li&gt;&lt;span style="background-color:&lt;%=datasets[i].fillColor%&gt;"&gt;&lt;/span&gt;&lt;%if(datasets[i].label){%&gt;&lt;%=datasets[i].label%&gt;&lt;%}%&gt;&lt;/li&gt;&lt;%}%&gt;&lt;/ul&gt;'
            };

// $scope.rangeTickets();
// console.log($cookies.token);
            // $scope.items = [
            //     {id: 1, name: 'Today'},
            //     {id: 2, name: 'Yesterday'},
            //     {id: 3, name: 'This Week'},
            //     {id: 4, name: 'This Month'},
            //     {id: 5, name: 'Last Month'}
            // ];

            // $scope.getStats = function (data) {
            //     $http.get('api/tickets/overview/' + adminValueFromCookie + '/' + data.id + '/?token=' + $cookies.token).
            //             success(function (data, status, headers, config) {
            //                 $scope.response.data = data.Data;
            //                 console.log($scope.response.data);
            //             }).
            //             error(function (data, status, headers, config) {
            //                 // called asynchronously if an error occurs
            //                 // or server returns response with an error status.
            //             });
            // }

            // $scope.selectedItem = $scope.items[0];

            // $http.get('api/tickets/overview/' + adminValueFromCookie + '/' + $scope.selectedItem + '/?token=' + $cookies.token).
            //         success(function (data, status, headers, config) {
            //             $scope.response.data = data.Data;
            //             console.log($scope.response.data);
            //         }).
            //         error(function (data, status, headers, config) {
            //             // called asynchronously if an error occurs
            //             // or server returns response with an error status.
            //         });



        }



        $scope.rangeTickets = function () {
            if ($scope.session) {

                $http.post('/admin/api/tickets/range-overview', {data: $scope.session, adminId: adminValueFromCookie, dateswitch: $scope.dateSwitch, dayswitch: $scope.daysAgoSwitch, token: $cookies.token}).
                        success(function (data, status, headers, config) {
                            $scope.response.data = data.Data;
                            console.log($scope.response.data);
                        })
            } else {
                alert("Please feed fome data to search");
            }
        }

    }]);

MetronicApp.controller('ActiveticketsController', ['$rootScope', '$scope', '$http', '$cookies', '$cookieStore', 'settings', function ($rootScope, $scope, $http, $cookies, $cookieStore, settings) {
        var adminValueFromCookie = $cookieStore.get('adminId');
        $scope.response = {};
        $scope.init = function () {
            console.log($cookies.token);

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

            $http.get('api/tickets/on-hold/' + adminValueFromCookie + '/?token=' + $cookies.token).
                    success(function (data, status, headers, config) {
                        $scope.response.onholdtickets = data.Data;
                        console.log($scope.response.onholdtickets);
                    }).
                    error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });


        }
    }]);

MetronicApp.controller('OnholdticketsController', ['$rootScope', '$scope', '$http', '$cookies', '$cookieStore', 'settings', function ($rootScope, $scope, $http, $cookies, $cookieStore, settings) {
        var adminValueFromCookie = $cookieStore.get('adminId');
        $scope.response = {};
        $scope.init = function () {
            console.log($cookies.token);

            $http.get('api/tickets/on-hold/' + adminValueFromCookie + '/?token=' + $cookies.token).
                    success(function (data, status, headers, config) {
                        $scope.response.onholdtickets = data.Data;
                        console.log($scope.response.onholdtickets);
                    }).
                    error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
        }
    }]);


MetronicApp.controller('TicketviewController', ['$rootScope', '$scope', '$http', '$cookies', '$cookieStore', 'settings', '$location', 'Upload', '$timeout', function ($rootScope, $scope, $http, $cookies, $cookieStore, settings, $location, Upload, $timeout) {
        var adminValueFromCookie = $cookieStore.get('adminId');
        var ticketId = $location.$$search.ticketId;

        $scope.name = ''; // set the default search/filter term
        $scope.product = '';

        $scope.currentPageReplies = 1;
        $scope.currentPageProducts = 1;
        $scope.numPerPage = 10;


        $scope.paginateReplies = function (value) {
          var begin, end, index;
          begin = ($scope.currentPageReplies - 1) * $scope.numPerPage;
          end = begin + $scope.numPerPage;
          index = $scope.allAdminReplies.indexOf(value);
          return (begin <= index && index < end);
      };

      $scope.$watch('name', function () {
          if (!$scope.name)
          {
              $scope.numPerPage = 10;
          }
          else {
              $scope.numPerPage = 100000; //maximum number of rows in table
          }
      });

      $scope.addPredefinedReply = function () {
        var replyDetails = JSON.parse($scope.response.myPredefinedReply);//parsing string to json
        if(!$scope.reply.replyToTicket)
          $scope.reply.replyToTicket = replyDetails.reply + ' ';
        else
        $scope.reply.replyToTicket += replyDetails.reply + ' ';
      }

        $scope.uploadFiles = function (files) {
            $scope.files = files;
            console.log("uploadFiles");
//        angular.forEach(files, function(file) {
//            if (file && !file.$error) {
//         		file.upload = Upload.upload({
//                  url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
//                  file: file
//                });
//
//                file.upload.then(function (response) {
//                  $timeout(function () {
//                    file.result = response.data;
//                  });
//                }, function (response) {
//                  if (response.status > 0)
//                    $scope.errorMsg = response.status + ': ' + response.data;
//                });
//
//                file.upload.progress(function (evt) {
//                  file.progress = Math.min(100, parseInt(100.0 *
//                                           evt.loaded / evt.total));
//                });
//    		}
//        });
        }

        $scope.single = function (image) {
            var data = image;
//          $scope.imgdata = data.resized['dataURL'];
//            var postdata  = {image:data.resized['dataURL'],
//                          name:data['file'].name,
//                          type:data['file'].type,
//                          size:data['file'].size,
//                        }

            console.log(data);

//            $http.post('/admin/api/file', {id: userid, image : postdata , multiple: multi}).success(function(result) {
//                // $scope.uploadedImgSrc = result.src;
//                // $scope.sizeInBytes = result.size;
//               if(result.token){
//                    $window.localStorage.setItem('token', result.token);
//                    $rootScope.user.profilePic = result.profilePic;
//                }
//            });
        }


        $scope.getAllAttachements = function () {
//             var files = document.getElementById("addMoreAttachments").querySelectorAll(".adminAttachments");
//                for (var i = 0; i < files.length; i++) {
//                console.log(i+" " +JSON.stringify(files[i]));
//                }

            console.log($scope.myFile);
        }

//        $scope.upload = function (files) {
//        if (files && files.length) {
//            for (var i = 0; i < files.length; i++) {
//                console.log("inside files");
//                var file = files[i];
//                console.log(file);
//            }
//        }
//    };

        $scope.sortType = '';
        $scope.sortReverse = false;

        //two way binding with ticket response, add reply, add note,...
        $scope.reply = {};

        //0:Awaiting Reply, 1:Flagged Ticket, 2:Active Ticket, 3:Open, 4:Answered, 5:Customer-Reply, 6:On Hold, 7:In Progress, 8:Closed
        $scope.response = {};
        $scope.items = [
            {id: 0, name: 'Awaiting Reply'},
            {id: 1, name: 'Flagged Ticket'},
            {id: 2, name: 'Active Ticket'},
            {id: 3, name: 'Open'},
            {id: 4, name: 'Answered'},
            {id: 5, name: 'Customer-Reply'},
            {id: 6, name: 'On Hold'},
            {id: 7, name: 'In Progress'},
            {id: 8, name: 'Closed'}
        ];

        $scope.replyOptions = [
            {id: 0, name: 'Set to Answered & Return to Ticket List'},
            {id: 1, name: 'Set to Answered & Remain in Ticket View'},
            {id: 2, name: 'Set to On Hold & Remain in Ticket View'},
            {id: 3, name: 'Set to In Progress & Remain in Ticket View'},
            {id: 4, name: 'Close & Return to Ticket List'},
            {id: 5, name: 'Add as a Private Ticket Note'}
        ];

        $scope.selectedreplyOptions = $scope.replyOptions[0];

        $scope.selectedreplyOptionsOnChange = function (selectedReplyOptionObj) {
          //  console.log(selectedReplyOptionObj.id);
            $scope.selectedreplyOptions = selectedReplyOptionObj;
        }

        //two way binding with Add Billing Entry data
        $scope.billingDescription = {};

        $scope.billingEntryOptions = [
            {id: 0, name: 'Invoice Immediately'},
            {id: 1, name: 'Don\'t Invoice for Now'},
            {id: 2, name: 'Invoice on Next Cron Run'},
            {id: 3, name: 'Add to User\'s Next Invoice'}
        ];

        $scope.selectedBillingEntryOptions = $scope.billingEntryOptions[0];

        $scope.selectedBillingEntryOptionsOnChange = function (selectedbillingEntryOptionsObj) {
            console.log("selectedbillingEntryOptionsObj" + selectedbillingEntryOptionsObj.id);
            console.log("Full billingDescription object" + $scope.billingDescription);
            console.log("Entered bill desc" + $scope.billingDescription.desc);
            console.log("Entered bill amount" + $scope.billingDescription.amount);
            $scope.selectedBillingEntryOptions = selectedbillingEntryOptionsObj;
        }

        $scope.addReply = function () {
            //
            // var answer = confirm("The status of this ticket has changed since you started replying which could indicate another staff member has already replied. Are you sure you still want to submit this reply?")
            // if (answer) {
            //     console.log("Clicked ok");
            // } else
            // {
            //     console.log("Clicked cancelled");
            // }

            var addReplyText = $scope.reply.replyToTicket;

            if (addReplyText === undefined || addReplyText === "")
            {
                addReplyText = 0;
            }

            var countFiles = 0;
            var files = document.getElementById("addMoreAttachments").querySelectorAll(".adminAttachments");
            angular.forEach(files, function (file) {
                if (file.value !== "")
                {
                    countFiles++;
                }
            });

            var replyOption = $scope.selectedreplyOptions.id;


            if (replyOption === 0) {
                $scope.selectedItem.id = 4; //set to answered
                $scope.changeStatus();
                $location.url($location.path());
                $location.path('/support-tickets.html');
                // console.log("0: Set to Answered & Return to Ticket List");
            }
            else if (replyOption === 1)
            {
              $scope.selectedItem.id = 4; //set to answered
              $scope.changeStatus();
              //  console.log("1: Set to Answered & Remain in Ticket View");
            }
            else if (replyOption === 2)
            {
              $scope.selectedItem.id = 6;
              $scope.changeStatus();
                // console.log("2: Set to On Hold & Remain in Ticket View");
            }
            else if (replyOption === 3)
            {
              $scope.selectedItem.id = 7;
              $scope.changeStatus();
              // console.log("3: Set to In Progress & Remain in Ticket View");
            }
            else if (replyOption === 4)
            {
              $scope.selectedItem.id = 8; //set to answered
              $scope.changeStatus();
              $location.url($location.path());
              $location.path('/support-tickets.html');
                // console.log("4: Close & Return to Ticket List");
            }
            else if (replyOption === 5)
            {
                console.log("5: Add as a Private Ticket Note");
            }

            console.log("Number of files attached" + countFiles);
            console.log("Add reply");
            console.log("Selected replyoption is" + replyOption);
            console.log("Entered reply" + addReplyText);
            console.log("File" + JSON.stringify(files));

            $http.post('/admin/api/get-info', {
                token: $cookies.token,
                adminId: adminValueFromCookie
            }).
                    success(function (data) {
                        $scope.response.adminDetails = data.Data;
                        $http.post('api/tickets/ticket-reply',
                                {
                                    ticketId: ticketId,
                                    adminId: adminValueFromCookie,
                                    adminfname: $scope.response.adminDetails[0].fname,
                                    adminlname: $scope.response.adminDetails[0].lname,
                                    token: $cookies.token,
                                    addReplyText: addReplyText,
                                    countFiles: countFiles,
                                    files: files,
                                    replyOption: replyOption
                                }).
                                success(function (data) {
                                    $scope.init();
                                });
//                        console.log("Got admin details inside saveTicketReply"+$scope.response.adminDetails[0].fname + "and " + $scope.response.adminDetails[0].fname)
                    });




        }

        $scope.insertReply = function () {
            console.log("insertPredefinedReply");
        }

        $scope.insertKbLink = function () {
            console.log("insertKbLink");
        }

        $scope.addNote = function () {

            var addNoteText = $scope.reply.replyNote;

            if (addNoteText === undefined || addNoteText === "")
            {
                addNoteText = 0;
            }

            console.log("Note text" + addNoteText);
        }
        //to close a ticket
        $scope.closeTicket = function () {
            $scope.selectedItem = $scope.items[8];
            console.log("Got the ticket id " + ticketId);
            console.log("Currently selected item " + $scope.selectedItem.id);
            $http.get('api/tickets/set-ticket-status/' + adminValueFromCookie + '/' + ticketId + '/?token=' + $cookies.token).
                    success(function (info) {
                        console.log("Done setting the status to close " + JSON.stringify(info.Data.affectedRows))
                        $scope.init();
                    }).error(function () {
                console.log("Error in 'closeTicket");
            });
        }

        $scope.changeStatus = function () {
            console.log("Change detected");
            console.log("Currently selected item " + $scope.selectedItem.id);
            $http.get('api/tickets/change-ticket-status/' + adminValueFromCookie + '/' + ticketId + '/' + $scope.selectedItem.id + '/?token=' + $cookies.token).
                    success(function () {
                        console.log("Done setting the status to" + $scope.selectedItem.id)
                        $scope.init();
                    }).error(function () {
                console.log("Error in 'changeStatus");
            });
        }

        $scope.init = function () {
            console.log("Came inside TicketviewController");
            $http.post('api/tickets/getticket/', {ticketId: ticketId, token: $cookies.token}).
                    success(function (data) {
                        if (data.Data.length > 0) {
                            $scope.response.data = data.Data;
                            passCid($scope.response.data[0].clientId);
                            $scope.selectedItem = $scope.items[$scope.response.data[0].status];
                            console.log($scope.response.data[0].lastReplyDate);
                            var tgd = $scope.response.data[0].ticketGeneratedDate;
                            var timeago_tgd = moment(tgd).fromNow();
                            $scope.ticketGeneratedDate = timeago_tgd;
                            var lrd = $scope.response.data[0].lastReplyDate;
                            var timeago_lrd = moment(lrd).fromNow();
                            $scope.lastReplyDate = timeago_lrd;
                            var lsd = $scope.response.data[0].lastStatusChangeDate;
                            var timeago_lsd = moment(lsd).fromNow();
                            $scope.lastStatusDate = timeago_lsd;
                        } else {
                            alert("No Results Found ");
                        }
                    });

            function passCid(pushedcId)
            {
                console.log("Got the client ID: REady to hit him" + pushedcId);
                $http.get('api/tickets/get-product-services/' + pushedcId + '/?token=' + $cookies.token).
                        success(function (data) {
                            $scope.productServices = data.Data;
                        }).
                        error(function () {
                            console.log("Something went wrong in api/tickets/get-product-services/")
                        });
            }

            $http.post('api/tickets/get-ticket-replies',
                    {
                        ticketId: ticketId,
                        adminId: adminValueFromCookie,
                        token: $cookies.token
                    }).
                    success(function (data) {
                        $scope.allTicketReplies = data.Data;
                    });


          $http.post('api/get-my-predefined-replies',
                            {
                                adminId: adminValueFromCookie,
                                // catId: 1, //can mention category if required
                                token: $cookies.token
                            }).
                            success(function (data) {
                                $scope.allAdminReplies = data.Data;
                                // $scope.paginateReplies();
                                $scope.totalAdminReplies = data.Data.length;
                            });

        }


        $scope.editThisReply = function (a)
        {
            console.log("Edit this reply " + a)
        }

        $scope.deleteThisReply = function (a)
        {
            console.log("Edit this reply " + a);
            $http.post('api/tickets/delete-this-reply',
                    {
                        replyObjectId: a,
                        adminId: adminValueFromCookie,
                        ticketId: ticketId,
                        token: $cookies.token
                    }).
                    success(function () {
                        $scope.init();
                    });
        }

    }]);
