// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('mynepapp', ['ionic', 'mynepapp.controllers', 'mynepapp.services', 'mynepapp.directives', 'ngCordova','mynepapp.coursecontrollers','mynepapp.provincecontrollers'])

.run(function($ionicPlatform,$http,$rootScope,$ionicLoading,$ionicPopup,$cordovaNetwork,$cordovaAppVersion,$cordovaFileTransfer,$cordovaFileOpener2,$timeout) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
      StatusBar.overlaysWebView(true);
    }
    //alert(navigator.userAgent);
    //判断网络状态
    document.addEventListener("deviceready", function() {
        //alert(screen.orientation);
        //console.log('Orientation is ' + screen.orientation);
        // listen for Online event
        navigator.splashscreen.hide();

        $rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
            var onlineState = networkState;
            console.log("device online...");
            //alert("device online...");
        })

        // listen for Offline event
        $rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
            var offlineState = networkState;
            //提醒用户的网络异常
            //alert("device offline...");
            $ionicLoading.show({
                template: '网络异常，不能连接到服务器！' , duration: 2000
            });
        })

    }, false);

    if(window.cordova){
      checkUpdate();
    }

    // 检查更新
    function checkUpdate() {
        console.log('checkUpdate');
        var serverAppVersion = "0.0.1"; //从服务端获取最新版本
        $http.jsonp(ENV.apiUrl+"mobileadmin/getversion?callback=JSON_CALLBACK")
          .success(function (data) {
              console.log(data);
              //获取版本
              serverAppVersion = data.responseData.version;
              tempaltecontent = data.responseData.template;
              $cordovaAppVersion.getVersionNumber().then(function (version) {
                  //如果本地与服务端的APP版本不符合
                  //alert(version+"-"+serverAppVersion);
                  if (version != serverAppVersion) {
                      if (ionic.Platform.isAndroid()) {
                        showAndroidUpdateConfirm(serverAppVersion,tempaltecontent);
                      }
                      if (ionic.Platform.isIOS()){
                        showIosUpdateConfirm(serverAppVersion,tempaltecontent);
                      }
                  }
              });
          })
          .error(function (data, status, headers, config) {
              $ionicLoading.show({template: '读取版本信息失败！', noBackdrop: true, duration: 2000});
          });
    }

    //提示更新
    function showAndroidUpdateConfirm(version,tempaltecontent) {
        console.log(version);
        var confirmPopup = $ionicPopup.confirm({
            title: '版本升级-' + version,
            template: tempaltecontent, //从服务端获取更新的内容
            cancelText: '取消',
            okText: '升级'
        });
        confirmPopup.then(function (res) {
            if (res) {
                $ionicLoading.show({
                    template: "已经下载：0%"
                });
                var url = ENV.apkUrl + "mynep/mynep.apk"; //可以从服务端获取更新APP的路径
                var targetPath = cordova.file.externalRootDirectory+"mynep/mynep.apk"; //APP下载存放的路径，可以使用cordova file插件进行相关配置
                var trustHosts = true
                var options = {};
                //alert(url+'-'+targetPath);
                $cordovaFileTransfer.download(url, targetPath, options, trustHosts).then(function (result) {
                    // 打开下载下来的APP
                    $cordovaFileOpener2.open(targetPath, 'application/vnd.android.package-archive'
                    ).then(function () {
                            // 成功
                        }, function (err) {
                            // 错误
                        });
                    $ionicLoading.hide();
                }, function (err) {
                    $ionicLoading.show({template: '下载失败！', noBackdrop: true, duration: 2000});
                    alert("download error source " + err.source);
                    alert("download error target " + err.target);
                    alert("download error code" + err.code);
                }, function (progress) {
                    //进度，这里使用文字显示下载百分比
                    $timeout(function () {
                        var downloadProgress = (progress.loaded / progress.total) * 100;
                        $ionicLoading.show({
                            template: "已经下载：" + Math.floor(downloadProgress) + "%"
                        });
                        if (downloadProgress > 99) {
                            $ionicLoading.hide();
                        }
                    })
                });
            } else {
                // 取消更新
            }
        });
    }

    function showIosUpdateConfirm(version,tempaltecontent){
      var confirmPopup = $ionicPopup.confirm({
            title: '版本升级-' + version,
            template: tempaltecontent, //从服务端获取更新的内容
            cancelText: '取消',
            okText: '升级'
        });
        confirmPopup.then(function (res) {
            if (res) {
                //window.location.href='https://itunes.apple.com/us/app/ji-ke-tang/id929059429?l=zh&ls=1&mt=8';
                window.open('https://itunes.apple.com/us/app/ji-ke-tang/id929059429?l=zh&ls=1&mt=8', '_system');
                return;
            } else {
                // 取消更新
            }
        });
    }

    $ionicPlatform.registerBackButtonAction(function (event) {
        if($state.current.name=="tab.home"){
           var confirmPopup = $ionicPopup.confirm({
            title: '确认退出？',
            buttons: [{ //Array[Object] (可选)。放在弹窗footer内的按钮。
              text: '否',
              type: '',
            }, {
              text: '是',
              type: 'button-calm',
              onTap: function(e) {
                return true;
              }
            }]
        });
        confirmPopup.then(function(res) {
          if(res) {
            console.log('You are sure');
            navigator.app.exitApp(); //<-- remove this line to disable the exit
          }else{
            console.log('You are not sure');
          }
        });     
      }
      else {
        navigator.app.backHistory();
      }
    }, 100);

    
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  //if(!ionic.Platform.isIOS())$ionicConfigProvider.scrolling.jsScrolling(false);
  $ionicConfigProvider.views.transition('ios') 
  $ionicConfigProvider.platform.android.tabs.position('bottom');
  $ionicConfigProvider.backButton.previousTitleText(false);
  $ionicConfigProvider.platform.android.navBar.alignTitle('center');
  //class默认添加tabs-
  $ionicConfigProvider.platform.android.tabs.style('android-calm'); 
  $ionicConfigProvider.platform.ios.tabs.style('color-active-calm'); 
  //$ionicConfigProvider.views.maxCache(0);
  //ionic.Platform.isFullScreen = true;
  //var jsScrolling = (ionic.Platform.isAndroid() ) ? false : true;
  //$ionicConfigProvider.scrolling.jsScrolling(jsScrolling);
  

  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })
  // Each tab has its own nav history stack:
  //学习记录公用页
  .state('record', {
    url: '/record',
    abstract: true,
    templateUrl: 'templates/record.html'
  })
  //学习记录
  .state('learn', {
      url: '/learn',
      templateUrl: 'templates/tab-learn.html',
      controller: 'RecordCtrl',
      //params: {'courseid':null},
      cache: true
  })
  //我的练习公用页
  .state('tab.practice', {
    url: '/practice/:productid',
    cache:true,
    views: {
      'tab-allcourse': {
          templateUrl: 'templates/tab-practice.html',
          controller: 'PracticeCtrl'
      }
    }    
  })
  //教学计划
  .state('record.plan', {
    url: '/plan',
    views: {
      'record-plan': {
        templateUrl: 'templates/record-plan.html',
        controller: 'PlanCtrl'
      }
    }
  })
  //成绩查询
  .state('record.search', {
    url: '/search',
    views: {
      'record-search': {
        templateUrl: 'templates/record-search.html',
        controller: 'SearchCtrl'
      }
    }
  })
  //学习进度
  .state('record.process', {
    url: '/process',
    views: {
      'record-process': {
        templateUrl: 'templates/record-process.html',
        controller: 'ProcessCtrl'
      }
    }
  })
  //模拟练习
  .state('practice.moni', {
    url: '/moni',
    views: {
      'practice-moni': {
        templateUrl: 'templates/practice-moni.html',
        controller: 'MoniCtrl'
      }
    }
  })

  //Sam   ------   错题集列表页面
  .state('tab.errorlist', {
    url: '/errorlist',
    views: {
      'tab-account': {
        templateUrl: 'templates/practice-errorlist.html',
        controller: 'ErrorlistCtrl'
      }
    }
  })
  
  //Sam   ------错题集详细页面
  .state('tab.errordetail',{
    url: '/errordetail/courseid/:courseid/typeid/:typeid',
    cache:false,
    views: {
      'tab-account': {
        templateUrl: 'templates/practice-errordetail.html',
        controller: 'ErrordetailCtrl'
      }
    }
        //templateUrl: 'templates/practice-errordetail.html',
        //controller: 'ErrordetailCtrl'
  })


  //模拟练习答题
  .state('tab.question', {
    url: '/question/:t_id/:course_id/:productid',
    cache:false,
    views: {
      'tab-allcourse': {
        templateUrl: 'templates/moni-question.html',
        controller: 'QuestionCtrl'
      }
    }
  })
  //学习进度第二页面
  .state('view', {
    url: '/view/planid/:planid/courseid/:courseid',
    cache:true,
    
        templateUrl: 'templates/process-view.html',
        controller: 'ViewCtrl'
    
  })
  //学习进度第三页面
  .state('detail', {
    url: '/detail/track_id/:item_track_id/title/:title',
    cache:true,
    
        templateUrl: 'templates/process-detail.html',
        controller: 'DetailCtrl'
  })
  //用户注册
  .state('tab.register', {
      url: '/register',
      cache: true,
      views: {
        'tab-account': {
          templateUrl: 'templates/user-register.html',
          controller: 'RegisterCtrl'
        }
      }
  })
  //我的订单
  .state('tab.order', {
    url: '/order',
    cache:true,
    views: {
      'tab-account': {
        templateUrl: 'templates/user-order.html',
        controller: 'OrderCtrl'
     }
    } 
  })
  //我的问答
  .state('tab.answerlist', {
    url: '/answerlist',
    cache:true,
    views: {
      'tab-account': {
          templateUrl: 'templates/user-answerlist.html',
          controller: 'AnswerlistCtrl'
      }
    }    
  })
  //我的笔记
  .state('tab.note', {
    url: '/note',
    cache:true,
    views: {
      'tab-account': {
          templateUrl: 'templates/user-note.html',
          controller: 'NoteCtrl'
      }
    }    
  })
  //我的电子书
  .state('tab.booklist', {
    url: '/booklist/:productid',
    cache:true,
    views: {
      'tab-allcourse': {
          templateUrl: 'templates/user-booklist.html',
          controller: 'BooklistCtrl'
      }
    }    
  })
  //我的电子书
  .state('tab.bookread', {
    url: '/bookread/:bookid',
    cache:false,
    views: {
      'tab-allcourse': {
          templateUrl: 'templates/book-read.html',
          //controller: 'BookReadCtrl'
      }
    }    
  })
  //帖子内容
  .state('tab.answer', {
    url: '/answer/id/:id',
    cache:false,
    views: {
      'tab-account': {
        templateUrl: 'templates/user-answer.html',
        controller: 'AnswerCtrl'
      }
    } 
  })
  //首页
  .state('tab.home', {
    url: '/home/:catId',
    params: {'catId': null},
    cache:true,
    views: {
      'tab-home': {
        templateUrl: 'templates/tab-index.html',
        controller: 'HomeCtrl'
      }
    }
  })

  .state('tab.allcourse',{
    url: '/allcourse',
    views: {
      'tab-allcourse': {
        templateUrl: 'templates/tab-allcourse.html',
        controller: 'AllCourseCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
  
  .state('tab.chat-detail', {
    url: '/chats/:chatId',
    views: {
      'tab-chats': {
        templateUrl: 'templates/chat-detail.html',
        controller: 'ChatDetailCtrl'
      }
    }
  })

  .state('tab.usercenter', {
      url: '/usercenter',
      cache: true,
      views: {
        'tab-account': {
            templateUrl: 'templates/tab-usercenter.html',
            controller: 'UsercenterCtrl'
        }
      }
  })

  .state('tab.account', {
    url: '/account',
    cache:false,
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })

  // Sam  我的课程公用页
  .state('tab.mycourse', {
    url: '/mycourse',
    cache:true,
    views: {
      'tab-allcourse': {
          templateUrl: 'templates/tab-mycourse.html',
          controller: 'MycourseCtrl'
      }
    }    
  })

  // Sam  报班页面
  .state('tab.applycourse', {
    url: '/applycourse/typeid/:typeid',
    views: {
      'tab-home': {
          templateUrl: 'templates/tab-applycourse.html',
          controller: 'ApplycourseCtrl'
      }
    }    
  })

  // Sam  课程页面
  .state('tab.coursepage', {
    url: '/coursepage/typeid/:typeid',
    views: {
      'tab-home': {
          templateUrl: 'templates/tab-coursepage.html',
          controller: 'CoursepageCtrl'
      }
    }    
  })

  // Sam  地址页面
  .state('address', {
    url: '/address',
    templateUrl: 'templates/tab-address.html',
    controller: 'AddressCtrl',
    cache:false

  })

  // Sam  新建地址页面
  // .state('tab.createaddress', {
  //   url: '/createaddress',
  //   templateUrl: 'templates/tab-createaddress.html',
  //   controller: 'CreateaddressCtrl' 
  // })

  // Sam  我的收藏
  .state('tab.createaddress', {
    url: '/createaddress',
    cache:false,
    views: {
      'tab-account': {
          templateUrl: 'templates/tab-createaddress.html',
          controller: 'CreateaddressCtrl'
      }
    }    
  })

  // Sam  地址修改页面
  .state('tab.editaddress', {
    url: '/editaddress/addressid/:addressid',
    cache:false,
    views: {
      'tab-account': {
          templateUrl: 'templates/tab-editaddress.html',
          controller: 'EditaddressCtrl'
      }
    }    
  })

  // Sam  我的收藏
  .state('tab.mycollection', {
    url: '/mycollection',
    views: {
      'tab-account': {
          templateUrl: 'templates/tab-mycollection.html',
          controller: 'MycollectionCtrl'
      }
    }    
  })

  // Sam  个人账号中的历史记录页面
  .state('tab.myhistory', {
    url: '/myhistory',
    views: {
      'tab-account': {
          templateUrl: 'templates/tab-myhistory.html',
          controller: 'MyhistoryCtrl'
      }
    }    
  })

  // Sam  离线换存 下载页面
  .state('download', {
      url: '/download',
      templateUrl: 'templates/tab-download.html',
      controller: 'DownloadCtrl',
      cache: false
  })

  // Sam  离线换存 二级页面
  .state('dlsecpage', {
      url: '/dlsecpage/:id',
      cache:false,
      templateUrl: 'templates/tab-dlsecpage.html',
      controller: 'DlsecpageCtrl'  
  })
  // Sam  课程答疑、笔记页面
  .state('coursenote', {
      url: '/coursenote/:productid/:itemid',
      params:{itemid: null},
      templateUrl: 'templates/tab-coursenote.html',
      controller: 'CoursenoteCtrl',
      //params: {'courseid':null},
      cache: true
  })

  .state('tab.news',{
      url: '/news/:newsid',
      cache:false,
      views: {
          'tab-home': {
              templateUrl: 'templates/tab-newsdetail.html',
              controller: 'NewsCtrl'
          }
      }
  })
  .state('tab.search',{
      url: '/search',
      cache:false,
      views: {
          //'tab-allcourse': {
          'tab-home': {
              templateUrl: 'templates/course-search.html',
              controller: 'CourseSearchCtrl'  
          }
      }
  })
  .state('tab.result',{
      params: {'content': null},
      url: '/result/:content',
      cache:false,
      views: {
          //'tab-allcourse': {
          'tab-home': {
              templateUrl: 'templates/course-result.html',
              controller: 'ResultCtrl'  
          }
      }
  })
  .state('tab.courselist',{
      url: '/courselist/id/:id/name/:name',
      cache:true,
      views: {
          'tab-allcourse': {
              templateUrl: 'templates/course-list.html',
              controller: 'CourselistCtrl'  
          }
      }
  })
  .state('tab.coursefree',{
      url: '/courselist/free/:free',
      cache:true,
      views: {
          'tab-home': {
              templateUrl: 'templates/course-list.html',
              controller: 'CoursefreeCtrl'  
          }
      }
  })
  //课程绑定码
  .state('tab.coursecode',{
      url: '/code',
      cache:true,
      views: {
          'tab-account': {
              templateUrl: 'templates/tab-code.html',
              controller: 'CodeCtrl'  
          }
      }
  })
  //Sam  ------   个人信息详细页面
  .state('tab.userinfo', {
      url: '/userinfo',
      cache:'false', 
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-userinfo.html',
          controller: 'UserinfoCtrl'
        }
      }
    })

  //Sam  ------- 账号信息更改页面
    .state('tab.infosetting', {
      url: '/infosetting/infotype/:infotype/text/:text',
      cache:'false', 
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-infosetting.html',
          controller: 'InfosettingCtrl'
        }
      }
    })  



  /*.state('tab.course',{
      url: '/course',
      cache:false,
      views: {
          'tab-home': {
              templateUrl: 'templates/tab-newsdetail.html',
              controller: 'NewsCtrl'  
          }
      }
  })*/
  /*.state('tab.course',{
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'    
  })*/

  

  /*.state('course', {
      url: '/course',
      templateUrl: 'templates/tab-coursedetail.html',
      controller: 'CouresCtrl',
      params: {'courseid':null},
      cache: false,
      abstract: true
  })

  .state('course.detail', {
      url: '/detail/:courseid',
      cache: false,
      views: {
          'course-tabs': {
              templateUrl: 'templates/course-tabs.html',
              controller: 'CouresCtrldirectory'
          }
      }
  })*/

  /*.state('course.detail.directory', {
      url: '/directory/:courseid',
      cache: false,
      views: {
          'course-directory': {
              templateUrl: 'templates/course-directory.html',
              controller: 'CouresCtrldirectory'
          },
          'course-resume': {
              templateUrl: 'templates/course-resume.html',
              controller: 'CouresCtrlresume'
          },
          'course-discuss': {
              templateUrl: 'templates/course-discuss.html',
              controller: 'CouresCtrldiscuss'
          }
      }
  })*/

  /*.state('course.detail.resume', {
      url: '/resume/:courseid',
      cache: true,
      //templateUrl: 'templates/tab-course-directory.html',
      //controller: 'CouresCtrl'
      views: {
          'course-resume': {
              templateUrl: 'templates/course-resume.html',
              controller: 'CouresCtrlresume'
          }
      }
  })

  .state('course.detail.discuss', {
      url: '/discuss/:courseid',
      cache: false,
      //templateUrl: 'templates/tab-course-directory.html',
      //controller: 'CouresCtrl'
      views: {
          'course-discuss': {
              templateUrl: 'templates/course-discuss.html',
              controller: 'CouresCtrldiscuss'
          }
      }
  })*/

  .state('coursedetail', {
      url: '/coursedetail/:productid',
      templateUrl: 'templates/tab-coursedetail.html',
      controller: 'CouresCtrl',
      //params: {'courseid':null},
      cache: true
  })

  /*.state('coursemenu', {
      url: '/',
      templateUrl: 'templates/menu.html',
      controller: 'leftmenuCtrl',
      //params: {'courseid':null},
      cache: false
  })*/

  .state('coursepay', {
      url: '/coursepay/:productid',
      templateUrl: 'templates/course-pay.html',
      controller: 'PayCtrl',
      params: {'productid':null},
      cache: false
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/home/');

})


.config(function($ionicConfigProvider) {
    //设置返回文字为空
    $ionicConfigProvider.backButton.text('').icon('ion-ios-arrow-back');
    $ionicConfigProvider.views.swipeBackEnabled(false);
});

/*.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  var jsScrolling = (ionic.Platform.isAndroid() ) ? false : true;
  $ionicConfigProvider.scrolling.jsScrolling(jsScrolling);
});*/
