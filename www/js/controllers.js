angular.module('mynepapp.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('leftmenuCtrl', ['$scope','$state','$ionicSideMenuDelegate','LoginService','Websites', function($scope,$state,$ionicSideMenuDelegate,LoginService,Websites){
    /**
     * 点击跳转到登录页面
     * @return {[type]} [description]
     */
    $scope.tologin = function(){
        console.log('tologin');
        $state.go('tab.usercenter');
        $ionicSideMenuDelegate.toggleLeft();
    };

    /**
     * 点击选择类别
     * @return {[type]} [description]
     */
    $scope.toCategory = function(catId){
        localStorage.catId = catId;
        //localStorage.catName = 
        console.log(catId);
        $state.go('tab.home',{catId:catId});
        $ionicSideMenuDelegate.toggleLeft();
    };

    /**
     * 得到分类数据
     */
    Websites.getCategory($scope);

    $scope.haslogin = typeof(localStorage.haslogin) == 'undefined'?0:localStorage.haslogin;
    $scope.username = localStorage.username!='null' ? localStorage.username : localStorage.userid;
    $scope.headimg = localStorage.headimg != 'null' ? localStorage.headimg : 'img/man1.png';
    //对登录进行侦听
    $scope.$on('loginUser', function() {
        console.log('listen on');
        //$scope.username = LoginService.getUser();
        $scope.haslogin = typeof(localStorage.haslogin) == 'undefined'?0:localStorage.haslogin;
        $scope.username = localStorage.username!='null' ? localStorage.username : localStorage.userid;
        $scope.headimg = localStorage.headimg!='null' ? localStorage.headimg : 'img/man1.png';
        //console.log(window.localStorage['username']);
    });
    $scope.$on('changeheadimg', function() {
        console.log('change headimg on');
        $scope.headimg = localStorage.headimg!='null' ? localStorage.headimg : 'img/man1.png';
    });
}])

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AppCtrl', function($scope, $ionicPopup, $ionicModal, $timeout, $http, $ionicLoading, $location, $state) {

})
/**
 * [我的订单]
 * [by潘]
 */
.controller('OrderCtrl', function($scope, $ionicPopup, $ionicModal, $timeout, $http, $ionicLoading, $location, $state,Websites) {
  if (localStorage.haslogin != 1) {
      $state.go("tab.usercenter");
  }
  $ionicLoading.show({
      template: 'Loading...'
  });
  Websites.getOrderlist($scope).success(function(data){
    $scope.orderlist = data.responseData;
    console.log($scope.orderlist);
    if(data.responseData.length==0){
      $scope.emptytext = "没有订单记录";
    }
    console.log($scope.orderlist);
  }).error(function(data){

  })
  $ionicLoading.hide();
  //订单下拉刷新
  $scope.doRefresh = function(){
    Websites.getOrderlist($scope).success(function(data){
      $scope.orderlist = data.responseData;
      if(data.responseData.length==0){
        $scope.emptytext = "没有订单记录";
      }
      $scope.$broadcast('scroll.refreshComplete');
    }).error(function(data){})
  }
  //取消订单
  $scope.ordercancel = function(index,id){
    var confirmPopup = $ionicPopup.confirm({
          title: '取消订单？',
          buttons: [{ //Array[Object] (可选)。放在弹窗footer内的按钮。
            text: '否',
          }, {
            text: '是',
            type: 'button-calm',
            onTap: function(e) {
              // 返回的值会导致处理给定的值。
              return true;
            }
          }]
      });

      confirmPopup.then(function(res) {
        if(res) {
          Websites.Ordercancel($scope,id).success(function(data){
            if(data.responseData.status=='2'){
              $scope.orderlist[index]['status'] = '2';
              $scope.showMessage('订单取消成功');
            }
          }).error(function(data){
            $scope.showMessage('订单取消失败');
          })
        }
      });

  }
  $scope.showMessage = function(title){
    $ionicLoading.show({
      template: title
    });
    $timeout(function() {
      $ionicLoading.hide();
    }, 1000);
  }

})

/**我的答疑**/
.controller('AnswerlistCtrl', function($scope, Websites, $ionicPopup, $ionicModal, $timeout, $http, $ionicLoading, $location, $state,$ionicScrollDelegate,$ionicSideMenuDelegate) {
  if (localStorage.haslogin != 1) {
        $state.go("tab.usercenter");
  }
  //侧滑栏关闭
  $scope.$on('$ionicView.enter', function(){
    $ionicSideMenuDelegate.canDragContent(false);
  });
  //侧滑栏开启
  $scope.$on('$ionicView.leave', function(){
    $ionicSideMenuDelegate.canDragContent(true);
  });
  console.log($scope);

  $ionicLoading.show({
      template: 'Loading...'
  });
  $scope.userid = window.localStorage['userid'];
  //获取帖子
  Websites.getAnswerlist($scope).success(function(data){
    if(data.answerlist.length==0){
      $scope.emptytext = "没有提问记录";
    }
  });
  $ionicLoading.hide();
  //设置发帖内容（默认为空）
  $scope.answercreate = {
    'title': '',
    'content': ''
  };
  $scope.setscroll = function(){
    $ionicScrollDelegate.resize();
  }
  //定义发帖视图
  $ionicModal.fromTemplateUrl('templates/answer-create.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.answer = modal;
  });
  //帖子刷新
  $scope.doRefresh = function() {
    Websites.getAnswerlist($scope);
    //Stop the ion-refresher from spinning
    $scope.$broadcast('scroll.refreshComplete');
  }
  //推出发帖视图
  $scope.showanswer = function(){
    $scope.answer.show();
  } 
  //隐藏发帖视图
  $scope.closecreate = function(){
    $scope.answer.hide();
  } 
  $scope.create = function(){
	  console.log($scope.answercreate.courseid);
    if (!$scope.answercreate.courseid || $scope.answercreate.title == ''  || $scope.answercreate.content == '' ) {
                var alertPopup = $ionicPopup.alert({
                    title: '格式不合法',
                    template: '请确认课程或标题或内容不能为空！',
                    buttons: [{ //Array[Object] (可选)。放在弹窗footer内的按钮。
                      text: 'OK',
                      type: 'button-calm',
                    }]
                });
    }else{
      $http.jsonp(ENV.apiUrl + 'mobileanswer/create?access-token='+localStorage.access_token+'&courseid='+$scope.answercreate.courseid+'&title='+$scope.answercreate.title+'&content='+$scope.answercreate.content+'&callback=JSON_CALLBACK')
        .then(function(res){
          //console.log(res.data);
          //新发帖子添加到发帖列表
          //$scope.answerlist.push(res.data);
		  Websites.getAnswerlist($scope);
          //console.log($scope.answerlist);
          //隐藏发帖视图
          $scope.answer.hide();
          //发帖成功清除数据
          $scope.answercreate = {
            'title': '',
            'content': ''
          };
      })
    }
  }
})

.controller('AnswerCtrl', function($scope,$stateParams,Websites,$http,$ionicLoading,$ionicSideMenuDelegate) {
  if (localStorage.haslogin != 1) {
        $state.go("tab.usercenter");
  }
  $ionicLoading.show({
      template: 'Loading...'
  });
  //侧滑栏关闭
  $scope.$on('$ionicView.enter', function(){
    $ionicSideMenuDelegate.canDragContent(false);
  });
  //侧滑栏开启
  $scope.$on('$ionicView.leave', function(){
    $ionicSideMenuDelegate.canDragContent(true);
  });
  var userid = window.localStorage['userid'];
  //帖子id
  $scope.answer_id = $stateParams.id;
  $scope.discuss = {'con':''};
  //获取帖子内容
  Websites.getAnswerDetail($scope);
  $ionicLoading.hide();
  
  $scope.doRefresh = function() {
    Websites.getAnswerDetail($scope);
    $scope.$broadcast('scroll.refreshComplete');
  }

})
.controller('LearnCtrl', function($scope,$stateParams,Websites,$http,$ionicLoading,$rootScope) {
  if (localStorage.haslogin != 1) {
        $state.go("tab.usercenter");
  }
  //隐藏header-bar
  //$rootScope.showFooterBar.show = false;
  console.log($rootScope);
  $ionicLoading.show({
      template: 'Loading...'
  });
  //获取帖子内容
  //Websites.getAnswerDetail($scope);
  $ionicLoading.hide();
})
/*我的练习*/
.controller('PracticeCtrl', function($scope,$ionicPopup,$stateParams,Websites,$http,$ionicLoading,$rootScope,$ionicViewSwitcher,$ionicSideMenuDelegate) {
  //侧滑栏关闭
  $scope.$on('$ionicView.enter', function(){
    $ionicSideMenuDelegate.canDragContent(false);
  });
  //侧滑栏开启
  $scope.$on('$ionicView.leave', function(){
    $ionicSideMenuDelegate.canDragContent(true);
  });
  if (localStorage.haslogin != 1) {
        $state.go("tab.usercenter");
  }
  $ionicLoading.show({
      template: 'Loading...'
  });
  var userid = window.localStorage['userid'];
  console.log('PracticeCtrl');
  //$scope.processhide = true;
  $scope.errornum = 0;
  /*Websites.getMonilist($scope,userid).success(function(data) {
  }).error(function(data) {
  });
  Websites.getErrorlist($scope,userid).success(function(data) {
    $scope.errornum = data.responseData.length;
    //$ionicLoading.hide();
    console.log(data);
  }).error(function(data){
    //加载失败
  });*/
  $scope.productid = $stateParams.productid;
  console.log($scope.productid);
  Websites.getPracticelist($scope,userid,$stateParams.productid).success(function(data) {
    $scope.plist = data;
    console.log(data);
    if(data.length==0){
      $scope.emptytext = "该课程下没有练习";
    }
    //$ionicLoading.hide();
  }).error(function(data){
    //加载失败
  });
  $ionicLoading.hide();

})
//学习记录
.controller('RecordCtrl', function($scope,$stateParams,Websites,$http,$ionicLoading,$rootScope,$state,$ionicViewSwitcher) {
  if (localStorage.haslogin != 1) {
        $state.go("tab.usercenter");
  }
  //强制显示返回button，默认情况下tabs里面独立页面不显示back button
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
      viewData.enableBack = true;
  });
  $scope.plan_empty = "";
  $scope.search_empty = "";
  $scope.process_empty = "";
  $ionicLoading.show({
      template: 'Loading...'
  });
  $scope.userid = window.localStorage['userid'];
  //教学计划
  Websites.getPlanlist($scope).success(function(data) {
    if($scope.planlist.length==0){
      $scope.plan_empty = "无教学计划";
    }
  }).error(function(data){
      //加载失败
      console.log('failure');
  });
  Websites.getSearchlist($scope).success(function(data) {
    if($scope.searchlist.length==0){
      $scope.search_empty = "无成绩查询";
    }
  }).error(function(data){
      //加载失败
      console.log('failure');
  });
  Websites.getProcesslist($scope).success(function(data) {
    if($scope.processlist.length==0){
      $scope.process_empty = "无学习进度";
    }
  }).error(function(data){
      //加载失败
      console.log('failure');
  });
  $ionicLoading.hide();
})
/**
 * [教学计划]
 * [by潘]
 */
.controller('PlanCtrl', function($scope,$stateParams,Websites,$http,$ionicLoading,$rootScope,$ionicHistory) {
  $ionicLoading.show({
      template: 'Loading...'
  });
  $scope.userid = window.localStorage['userid'];
  //教学计划
  Websites.getPlanlist($scope);
  $ionicLoading.hide();
  $scope.back = function(){
    console.log(1);
    $ionicHistory.goBack();
  }
})
/**
 * [电子书列表]
 * [by潘]
 */
.controller('BooklistCtrl', function($scope,$stateParams,Websites,$http,$ionicLoading,$rootScope,$ionicHistory,$ionicSideMenuDelegate) {
  //侧滑栏关闭
  $scope.$on('$ionicView.enter', function(){
    $ionicSideMenuDelegate.canDragContent(false);
  });
  //侧滑栏开启
  $scope.$on('$ionicView.leave', function(){
    $ionicSideMenuDelegate.canDragContent(true);
  });
  var productid = $stateParams.productid;
  $scope.productid = productid;
  console.log(productid);
  console.log($scope.productid);
  Websites.getBooklist($scope,productid).success(function(data){
    if(data.responseData.length==0){
      $scope.emptytext = "该课程没有电子讲义";
    }
  });
})
/**
 * [电子书内容]
 * [by潘]
 */
.controller('BookReadCtrl', function($scope,$stateParams,Websites,$http,$ionicLoading,$ionicHistory,$ionicModal,$timeout,$ionicSideMenuDelegate) {
  //侧滑栏关闭
  $scope.$on('$ionicView.enter', function(){
    $ionicSideMenuDelegate.canDragContent(false);
  });
  //侧滑栏开启
  $scope.$on('$ionicView.leave', function(){
    $ionicSideMenuDelegate.canDragContent(true);
  });
  //讲义id
  var bookid = $stateParams.bookid;
  //获取讲义章节,默认章节第一章，默认第一页
  var chapter = 1;
  var page = 1;
  var localbook = window.localStorage['book'];
  $scope.book = "";
  //是否有历史记录
  if(angular.isDefined(localbook)){
    var arr = JSON.parse(localbook);
    console.log(arr[bookid]);
    if(arr[bookid]){
      var b_arr = arr[bookid].split(",");
      chapter = b_arr[0];
      page = b_arr[1];
    }else{
      arr[bookid] = chapter+','+page;
      window.localStorage['book'] = JSON.stringify(arr);
    }
  }else{
    var arr = {};
    console.log(bookid);
    arr[bookid] = chapter+','+(page+1);
    window.localStorage['book'] = JSON.stringify(arr);
  }
  //获取电子讲义内容
  Websites.getBook($scope,bookid,chapter).success(function(data){
    $timeout(function() {
      JobReader.init_reader(bookid,chapter,page);
      JobReader.pageto(page);
    });
  })
  //$scope.book = '';
  //定义电子讲义章节视图
  $ionicModal.fromTemplateUrl('templates/book-menu.html', {
    scope: $scope,
  }).then(function(modal) {
    $scope.bookmenu = modal;
  });
  //打开章节选择页
  $scope.showmenu = function () {
    console.log('bookshow');
    $scope.bookmenu.show();
    pageAction.hide();
  }
  //章节选择
  $scope.tomenu = function(id){
    $scope.bookmenu.hide();
    old = window.localStorage['book'];
    if(old[bookid]){
      var b_arr = old[bookid].split(",");
      //同章节不跳转
      if(b_arr[0]!=id){
        //Websites.bookmenuto($scope,bookid,id).success(function(){
        Websites.getBook($scope,bookid,id).success(function(){
          //跳章节成功后保存本地浏览记录
          arr = JSON.parse(window.localStorage['book']);
          arr[bookid] = id+',1';
          window.localStorage['book'] = JSON.stringify(arr);
        }).error(function(){

        });
      }
    }
  }

  $scope.showMessage = function(title){
    if(title!=undefined){
      $ionicLoading.show({
        template: title
      });
      $timeout(function() {
        $ionicLoading.hide();
      }, 1000);
    }
  }
  //返回上一页
  $scope.readback = function(){
    $ionicHistory.goBack();
  }
  //数据加载完毕后进行渲染
  $scope.$watch('book',function(newValue,oldValue){
    $timeout(function() {
      if(oldValue!=""){
        JobReader.refurbish();
      }
    });
  })

})
/**
 * [学习记录成绩查询页面]
 * [by潘]
 */
.controller('SearchCtrl', function($scope,$stateParams,Websites,$http,$ionicLoading,$rootScope) {
  $ionicLoading.show({
      template: 'Loading...'
  });
  $scope.userid = window.localStorage['userid'];
  //教学计划
  Websites.getSearchlist($scope);
  $ionicLoading.hide();
})
/**
 * [我的笔记]
 * [by潘]
 */
.controller('NoteCtrl', function($scope,$stateParams,Websites,$http,$ionicLoading,$rootScope,$ionicScrollDelegate,$ionicHistory,$timeout,$ionicSideMenuDelegate,$ionicPopup) {
  $ionicLoading.show({
      template: 'Loading...'
  });
  //侧滑栏关闭
  $scope.$on('$ionicView.enter', function(){
    $ionicSideMenuDelegate.canDragContent(false);
  });
  //侧滑栏开启
  $scope.$on('$ionicView.leave', function(){
    $ionicSideMenuDelegate.canDragContent(true);
  });
  $scope.selected = false;
  userid = window.localStorage['userid'];
  //教学计划
  Websites.getNotelist($scope).success(function(data){
    if(data.length==0){
      $scope.emptytext = "你没有记录任何笔记";
    }
  });
  $ionicLoading.hide();
  //删除笔记
  $scope.deletenote = function(index1,index2,id){

    var confirmPopup = $ionicPopup.confirm({
          title: '确认删除？',
          buttons: [{ //Array[Object] (可选)。放在弹窗footer内的按钮。
            text: '否',
          }, {
            text: '是',
            type: 'button-calm',
            onTap: function(e) {
              // 返回的值会导致处理给定的值。
              // $ionicHistory.clearHistory();
              // $ionicHistory.clearCache();
              // $ionicHistory.clearCache(['tab.coursenote']);
              $rootScope.$emit('clearcousenote');
              console.log('clearcachetest');
              // console.log($ionicHistory.currentStateName());
              return true;
            }
          }]
      });
    confirmPopup.then(function(res) {          
      if(res){
        Websites.DeleteNote($scope,id).success(function(data){
          //删除成功
          if(data.flag==1){
            var str = $scope.notelist[index1].detail;
            str.splice(index2,1);
            $scope.notelist[index1].num = $scope.notelist[index1].num-1;
            if($scope.notelist[index1].num==0){
              $scope.notelist.splice(index1,1);
            }
            $scope.setscroll();
            if($scope.notelist.length==0){
              $scope.emptytext = "已经没有笔记了";
            }
          }else{
            //删除失败
            $ionicLoading.show({
              template: '删除出错'
            });
            $timeout(function() {
              $ionicLoading.hide();
            }, 1000);
          }
        })
      }
    });
  }
  //重置滚动条
  $scope.setscroll = function(){
    $ionicScrollDelegate.resize();
  }
})
/**
 * [课程搜索页面]
 * [by潘]
 */
.controller('CourseSearchCtrl', function($scope,$stateParams,Websites,$http,$ionicLoading,$rootScope,$state) {
  $ionicLoading.show({
      template: 'Loading...'
  });
  $scope.searchlist = ["会计基础","学前教育","心理学"];
  $scope.userid = window.localStorage['userid'];
  $scope.search = {};
  //教学计划
  //Websites.getSearchlist($scope);
  $scope.toresult = function(){
    //console.log('toresult');
    //console.log($scope.search);
    $state.go('tab.result', {content:$scope.search.value});
  }
  $ionicLoading.hide();
})
/**
 * [用户注册页面]
 * [by潘]
 */
.controller('RegisterCtrl', function($scope, $state, $ionicPopup, $ionicLoading, $timeout,LoginService,$ionicHistory) {

    $scope.data = {};
    $scope.timetext = '短信验证码';
    $scope.timeable = false;
    $scope.gotoaccount = function() {
        $state.go("tab.usercenter");
    }
    
    //打开服务条款
    $scope.openagree = function() {
      var alertPopup = $ionicPopup.alert({
          title: '用户服务条款',
          template: '<div >经习近平主席和中央军委批准，中国军队派出工作组于6月2日乘空军飞机赶赴马里加奥地区，代表习主席和中央军委看望慰问执行维和任务的中国官兵，做好遇袭伤亡人员善后和救治工作，协调联合国马里多层面综合稳定特派团和马里政府采取切实措施，确保维和部队安全，有效执行维和任务。工作组由国防部维和事务办公室代主任苏广辉少将带队，成员由解放军总医院的医疗专家和任务部队有关人员组成。中国将继续坚定支持联合国维和行动，坚定反对一切形式的恐怖主义，坚定维护世界和平。</div>',
          okText:'我同意',
          okType:'button-calm'
      });
    };
    //注册
    $scope.register = function() {
        //注册功能
        //检测用户输入
        //判断空的输入
        var code = $scope.data.code;
        var phone = $scope.data.phone;
        var password = $scope.data.password;
        if (checkPhone(phone)&&checkPassword(password)&&checkCode(code)) {
            //提交api，进行注册功能
            LoginService.register(code, phone, password).success(function(data) {
              if(data.success==1){
                $scope.showMessage('注册成功');

                LoginService.loginUser(phone, password).success(function(data) {
                  //登录成功
                  localStorage.haslogin = 1;
                  $ionicLoading.hide();
                  $state.go("tab.account");
                  console.log(1);
                  $ionicHistory.clearCache(['tab.mycourse']);
                  $ionicHistory.clearCache(['tab.usercenter']);
                })

                // $state.go("tab.usercenter");
              }else{
                $scope.showMessage('注册失败');
              }
            }).error(function(){
              $scope.showMessage('注册出错~！~');
            });
        } else {
          if(!checkPhone(phone)){
            $scope.showMessage('请输入正确手机号！');
          }else if(!checkPassword(password)){
            $scope.showMessage('密码至少6位！');
          }else{
            $scope.showMessage('请输入正确验证码！');
          }
        }
    };
    //验证邮箱
    var checkMail = function(szMail) {
        var szReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
        var bChk = szReg.test(szMail);
        return bChk;
    }
    //验证手机
    var checkPhone = function(a){
      var str = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i;
      var flag = str.test(a);
      return flag;
    }
    //验证密码
    var checkPassword = function(b){
      var flag = false;
      if(b!=undefined){
        if(b.length>=6){
          flag = true;
        }
      }
      return flag;
    }
    //验证验证码
    var checkCode = function(num){
      var flag = false;
      if(num!=undefined){
        if(!isNaN(num)&&num.length==4){
          flag = true;
        }
      }
      return flag;
    }
    //验证短信发送时间
    var checkTime = function(){
      var flag = false;
      var time = $scope.timetext;
      if(time=='短信验证码'){
        flag = true;
      }
      return flag;
    }
    //发送验证码
    $scope.sendcode = function(){
      var phone = $scope.data.phone;
      if(checkPhone(phone)&&checkTime()){//可以发送验证码
        LoginService.SendCode($scope,$scope.data.phone).success(function(data){
          $scope.showMessage('验证码已发送，注意查收!');
          $scope.timetext = 59;
          $scope.timeable = true;
          $scope.showTime();
        }).error(function(data){
          $scope.showMessage('验证码发送失败!');
        })
      }else{
        //不可以发送验证码
        if(!checkPhone(phone)){
          $scope.showMessage('请输入正确手机号');
        }
      }
    }
    //消息提示
    $scope.showMessage = function(title){
      $ionicLoading.show({
        template: title
      });
      $timeout(function() {
        $ionicLoading.hide();
      }, 1000);
    }
    //短信倒计时
    $scope.showTime = function(){
      if($scope.timetext>0){
        $timeout(function() {
          $scope.timetext--;
          $scope.showTime();
        }, 1000);
      }else{
        $scope.timetext = "短信验证码";
        $scope.timeable = false;
      }
    }
})

/**
 * [课程搜索结果]
 * [by潘]
 */
.controller('ResultCtrl', function($scope,$stateParams,Websites,$http,$ionicLoading,$rootScope, $state,$ionicHistory) {
  console.log($stateParams);
  $scope.course_empty = "";
  $ionicLoading.show({
      template: 'Loading...'
  });
  $scope.result = {'value':$stateParams.content};
  Websites.getCourseBykey($scope, $stateParams.content).success(function(data) {
      //console.log($scope.resultlist);
      var list = data.responseData;
      if(typeof(list)!='undefined'){
        $scope.course_empty = "搜索结果为空";
      }
      $ionicLoading.hide();
    }).error(function(data){
      //加载失败
      console.log('failure');
      $ionicLoading.hide();
  });
  //$scope.resultlist = [{'img':'http://10.82.97.236/mynepapp/www/img/cnsc_mbimg.png','name':'技能《出纳速成》','teacher_names':'陈聪','class_time':'2','free':'0','price':'20'},{'img':'','name':'技能《出纳速成》','teacher_names':'陈聪','class_time':'2','free':'1','price':'30'}];
  console.log($scope.resultlist);
  $scope.doresult = function(){
    $scope.course_empty = "";
    $ionicLoading.show({
      template: 'Loading...'
    });
    Websites.getCourseBykey($scope, $scope.result.value).success(function(data) {
      console.log('success');
      var list = data.responseData;
      if(list.length==0){
        $scope.course_empty = "搜索结果为空";
      }
      $ionicLoading.hide();
    }).error(function(data){
        //加载失败
        console.log('failure');
        $ionicLoading.hide();
    });
  }
  $scope.goBack = function() {
    //$ionicNavBarDelegate.back();
    $ionicHistory.goBack(-2);
  };
})
/**
 * [课程列表]
 * [by潘]
 */
.controller('CourselistCtrl', function($scope,$stateParams,Websites,$http,$ionicLoading,$rootScope, $state) {
  /*if (localStorage.haslogin != 1) {
        $state.go("tab.account");
  }*/
  $ionicLoading.show({
    template: '数据加载中...'
  });
  console.log('CourselistCtrl');
  var type_id = $stateParams.id;

  //加载分页默认配置
  var coursepage = 0;
  var courselimit = '6';

  $scope.course_title = $stateParams.name;
  $scope.course_empty = "";

  //加载更多配置true：是，false：否，默认不开启
  $scope.moreDataCanBeLoaded = false;

  //获取课程
  Websites.getCourselist($scope, type_id,coursepage,courselimit).success(function(data) {
      console.log('success');
      var courselist = data.responseData;
      $scope.courselist = courselist;
      //var list = data.responseData;
      if(courselist.length==0){
        $scope.course_empty = "暂无数据";
      }
      //返回数据数量与分页数量一致，开启加载更多配置
      if(courselist.length == courselimit){
        $scope.moreDataCanBeLoaded = true;
      }
      $ionicLoading.hide();
  }).error(function(data){
      //加载失败
      $scope.course_empty = "加载失败";
      console.log('failure');
      $ionicLoading.hide();
  });

  //加载更多
  $scope.loadMore = function() {
    console.log('loadmore');
    coursepage = coursepage + 1;
    Websites.getCourselist($scope, type_id,coursepage,courselimit).success(function(data) {
      console.log('success');
      for (var i = 0; i <data.responseData.length; i++) {
        $scope.courselist.push(data.responseData[i]);
      };
      console.log(data.responseData);
      console.log($scope.courselist);
      var returnlist = data.responseData;
      if(returnlist.length<6){
        $scope.moreDataCanBeLoaded = false;
      }
      $scope.course_empty = "无更多";
      $scope.$broadcast('scroll.infiniteScrollComplete');
      $ionicLoading.hide();
      
    }).error(function(data){
      //加载失败
      $scope.course_empty = "加载失败";
      console.log('failure');
      $ionicLoading.hide();
    });
  };
  //数据重新加载
  $scope.doRefresh = function() {
    Websites.getCourselist($scope, type_id,'0',courselimit).success(function(data) {
      console.log('success');
      var returnlist = data.responseData;
      if(returnlist.length<6){
        $scope.moreDataCanBeLoaded = false;
      }
      $scope.courselist = data.responseData
      //$scope.course_empty = "无更多";
      $scope.$broadcast('scroll.infiniteScrollComplete');
      $ionicLoading.hide();
      
    }).error(function(data){
      //加载失败
      $scope.course_empty = "加载失败";
      console.log('failure');
    });
    $scope.$broadcast('scroll.refreshComplete');
  }
})
/**
 * [课程更多列表]
 * [by潘]
 */
.controller('CoursefreeCtrl', function($scope,$stateParams,Websites,$http,$ionicLoading,$rootScope, $state) {
  var free = $stateParams.free;
  var title = "畅销好课";
  if(free==1){
    title = "免费好课";
  }
  $scope.course_title = title;
  $ionicLoading.show({
        template: 'Loading...'
  });
  Websites.getCoursefree($scope, free).success(function(data) {
      console.log('success');
      var list = data.responseData;
      if(list.length==0){
        $scope.course_empty = "暂无数据";
      }
      $ionicLoading.hide();
  }).error(function(data){
      //加载失败
      console.log('failure');
      $ionicLoading.hide();
  });
  $scope.doRefresh = function() {
    $ionicLoading.show({
        template: 'Loading...'
    });
    Websites.getCoursefree($scope,free).success(function(data) {
      var list = data.responseData;
      if(list.length==0){
        $scope.course_empty = "暂无数据";
      }
      $ionicLoading.hide();
    }).error(function(data) {
      $ionicLoading.hide();
    });
    //Stop the ion-refresher from spinning
    $scope.$broadcast('scroll.refreshComplete');
  }

  
})
.controller('ProcessCtrl', function($scope,$stateParams,Websites,$http,$ionicLoading,$rootScope,$state) {
  $ionicLoading.show({
      template: 'Loading...'
  });
  $scope.userid = window.localStorage['userid'];
  //$scope.processhide = true;
  Websites.getProcesslist($scope).success(function(data) {
    $ionicLoading.hide();
  }).error(function(data) {
    //$scope.processhide = false;
    $ionicLoading.hide();
  });

  console.log($scope);
  console.log($scope.processlist);
  $scope.doRefresh = function() {
    console.log(1);
    $ionicLoading.show({
        template: 'Loading...'
    });
    Websites.getProcesslist($scope).success(function(data) {
      $ionicLoading.hide();
    }).error(function(data) {
      $ionicLoading.hide();
    });
    //Stop the ion-refresher from spinning
    $scope.$broadcast('scroll.refreshComplete');
  }

})
/**
 * [模拟练习]
 * [by潘]
 */
.controller('MoniCtrl', function($scope,$stateParams,Websites,$http,$ionicLoading,$rootScope,$state) {
  if (localStorage.haslogin != 1) {
        $state.go("tab.usercenter");
  }
  $ionicLoading.show({
      template: 'Loading...'
  });
  var userid = window.localStorage['userid'];
  console.log('MoniCtrl');
  //$scope.processhide = true;
  Websites.getMonilist($scope,userid).success(function(data) {
    $ionicLoading.hide();
  }).error(function(data) {
    $ionicLoading.hide();
  });

  //console.log($scope);
  //console.log($scope.processlist);
  $scope.doRefresh = function() {
    console.log(1);
    $ionicLoading.show({
        template: 'Loading...'
    });
    Websites.getMonilist($scope,userid).success(function(data) {
      $ionicLoading.hide();
    }).error(function(data) {
      $ionicLoading.hide();
    });
    //Stop the ion-refresher from spinning
    $scope.$broadcast('scroll.refreshComplete');
  }

})

/**
 * [答题页面]
 * [by潘]
 */
.controller('QuestionCtrl', function($scope,$stateParams,Websites,$http,$ionicLoading,$ionicSlideBoxDelegate,$ionicPopup,$ionicModal,$ionicHistory,$state,$timeout,$ionicSideMenuDelegate,$ionicScrollDelegate) {
  //侧滑栏关闭
  $scope.$on('$ionicView.enter', function(){
    $ionicSideMenuDelegate.canDragContent(false);
  });
  $scope.show = false;
  //侧滑栏开启
  $scope.$on('$ionicView.leave', function(){
    $timeout.cancel(timer);
    $ionicSideMenuDelegate.canDragContent(true);
    console.log('leave');
  });
  if (localStorage.haslogin != 1) {
        $state.go("tab.usercenter");
  }
  // $scope.checked = true;
  console.log('QuestionCtrl');
  $ionicLoading.show({
      template: 'Loading...'
  });
  $scope.choice = {'0':'A','1':'B','2':'C','3':'D'};
  //定义成绩结果
  $ionicModal.fromTemplateUrl('templates/question-result.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
    //$scope.modal.show();
  });
  $scope.qindex = 1;
  $scope.rate = '0';
  $scope.pagetitle = '练习';
  $scope.isUpActive = false;
  $scope.isDownActive = true;
  //定义答题卡
  $ionicModal.fromTemplateUrl('templates/question-card.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.card = modal;
  });
  //答题开始时间
  var myDate1 = new Date();
  var starttime = myDate1.getTime();
  var endtime = "";
  var pinde = $stateParams.t_id+'-'+$stateParams.course_id;
  Websites.getQuestion($scope,$stateParams.t_id,$stateParams.course_id).success(function(data){
      if(data['total']==0){
          $ionicLoading.hide();
          var alertPopup = $ionicPopup.alert({
              title: '提示框',
              template: '该试卷暂时无法练习，请联系老师',
              buttons: [{ //Array[Object] (可选)。放在弹窗footer内的按钮。
                  text: '确定',
                  type: 'button-calm',
              }]
          });
          alertPopup.then(function(res) {
            //console.log('Thank you for not eating my delicious ice cream cone');
            $ionicHistory.goBack();
          });
      }else{
          $scope.pagetitle = data['pagetitle'];
          $scope.questions = data['question'];
          $scope.total = data['total'];
          $scope.cardlist = data['card'];
          $scope.params = data['params'];
          $ionicSlideBoxDelegate.update();
          $ionicLoading.hide();
          timer = $timeout(function() {            
            //提取做题记录
            if(angular.isDefined(localStorage[pinde])){
              var pageindex = localStorage[pinde];
              $ionicSlideBoxDelegate.slide(pageindex);
            }else{
              var pageindex = 0;
              window.localStorage[pinde] = '0';
            }
            $scope.ChangeHeight(pageindex);
          });
      }
  })

  $scope.slideHasChanged = function(index){
    var num = $scope.total;
    $scope.qindex = index+1;
    $scope.rate =  index/(num-1)*100-4;
    //翻页判断按钮颜色
    if(index+1==num){
      $scope.isDownActive = false;
    }else{
      $scope.isDownActive = true;

    }
   
    if(index!=0){
      $scope.isUpActive = true;
    }else{
      $scope.isUpActive = false;

    }
    console.log($scope.qindex);
    console.log($scope.rate);
    //$(document).scrollTop(); 
    //$ionicScrollDelegate.resize();
    /*$timeout(function() {
      $("#job_scroll .scroll").css("transform","translate3d(0px, 0px, 0px) scale(1)");
    });*/
    $scope.ChangeHeight(index);
    $ionicScrollDelegate.scrollTop()
    window.localStorage[pinde] = index;

  }
  //console.log($(document.body).height());
  //控制答题内容页的高度
  $scope.ChangeHeight = function(index){
    var theight = $('.qtitle_'+index).outerHeight();
    var cheight = $('.qcontent_'+index).outerHeight();
    var bheight = $(document.body).height();
    var kheight = $(document.body).height()-154;
    console.log('title:'+theight+'content:'+cheight);
    console.log(bheight);
    console.log(kheight);
    if((theight+cheight)<kheight){
      $('.qslider').css('height',kheight);
    }else{
      $('.qslider').css('height',theight+cheight);
    }
  }

  var self = this;
  $scope.$watch(function(){
      return self;
  })
  $scope.showcard = function(){
    $scope.card.show();
  }
  $scope.toquestion = function(id){
    $ionicSlideBoxDelegate.slide(id-1);
    $scope.card.hide();
  }
  $scope.hidecard = function(){
    $scope.card.hide();
  }
  //上一题
  $scope.previous = function(){
    $ionicSlideBoxDelegate.previous();
  }
  //下一题
  $scope.next = function(){
    $ionicSlideBoxDelegate.next();
  }
  $scope.change = function(){

  }
  $scope.setanswer = function(id,val,qnum,qtype){
    console.log(qnum);
    $http.jsonp(ENV.apiUrl + 'mobilepractice/setanswer?id='+id+'&answer='+val+'&access-token='+localStorage.access_token+'&callback=JSON_CALLBACK').then(function(res){
      $scope.cardlist[qtype][qnum+1]['do'] = 'done';
    })

  }
  $scope.setanswercheckbox = function(id,val,qnum,qtype){
      console.log(id+'message'+val);
      $http.jsonp(ENV.apiUrl + 'mobilepractice/Setanswercheckbox?id='+id+'&&answer='+val+'&&callback=JSON_CALLBACK').then(function(res){
        $scope.cardlist[qtype][qnum+1]['do'] = 'done';
      })
    }
  $scope.repeat = function(){
    $scope.modal.hide();
    $ionicLoading.show({
      template: 'Loading...'
    });
    Websites.getQuestion($scope,$stateParams.t_id,$stateParams.course_id).success(function(data){
        if(data['total']==0){
          $ionicLoading.hide();
          var alertPopup = $ionicPopup.alert({
              title: '提示框',
              template: '该试卷暂时无法练习，请联系老师',
              buttons: [{ //Array[Object] (可选)。放在弹窗footer内的按钮。
                  text: '确定',
                  type: 'button-calm',
              }]
          });
          alertPopup.then(function(res) {
            //console.log('Thank you for not eating my delicious ice cream cone');
            $ionicHistory.goBack();
          });
        }else{
          $scope.pagetitle = data['pagetitle'];
          $scope.questions = data['question'];
          $scope.total = data['total'];
          $scope.cardlist = data['card'];
          $scope.params = data['params'];
          $ionicSlideBoxDelegate.update();
          $ionicSlideBoxDelegate.slide(0);
          $scope.qindex = 1;
          $scope.rate =  "0";
          $ionicLoading.hide();
        }
    })
  }
  $scope.setanswertext = function(id,val,qnum,qtype){
    console.log(id);
    console.log(val);
    if(val!=""&&val!=undefined){
        $scope.cardlist[qtype][qnum+1]['do'] = 'done';
    }
  }
  /**
     * 交卷
     * @return {[type]} [description]
  **/
    $scope.doSubmitPhase = function(t_id,pageid){
      console.log('submitphase');
        var confirmPopup = $ionicPopup.confirm({
          title: '交卷',
          template: '确定提交本次测验?',
            
          buttons: [{ //Array[Object] (可选)。放在弹窗footer内的按钮。
            text: '取消',
          }, {
            text: '确实',
            type: 'button-calm',
            onTap: function(e) {
              // 返回的值会导致处理给定的值。
              return true;
            }
          }]
      });
      confirmPopup.then(function(res) {
        if(res) {
            console.log('You are sure');
            //Edetail.submitphase.get({userid:window.localStorage['userid'],t_id:t_id,pageid:pageid});
            //$location.path('/app/pageresult/userid/'+window.localStorage['userid']+'/t_id/'+t_id);
            $scope.modal.show();
            $scope.card.hide();
            Websites.getResult($scope).success(function(data) {
              $scope.result = data;
              $ionicHistory.clearCache(['tab.ErrorlistCtrl']);
            }).error(function(data) {
            });
            $scope.lasttime = $scope.timediff();
            console.log($scope.lasttime);
            //$scope.examurl = '/tab/practice';
            window.localStorage[pinde] = 0;
            //window.localStorage['examurl'] = '/app/phaselist';
        }else{
            console.log('You are not sure');
        }
      });
    }
  //做题时间
  $scope.timediff = function(){
    var myDate2 = new Date();
    var endtime = myDate2.getTime();  
    time = endtime-starttime;
    var days    = Math.floor(time/(24*3600*1000));
    var leave1  = time%(24*3600*1000);    //计算天数后剩余的毫秒数
    var hours   = Math.floor(leave1/(3600*1000));
    //计算相差分钟数
    var leave2  = leave1%(3600*1000);        //计算小时数后剩余的毫秒数
    var minutes =  Math.floor(leave2/(60*1000));
    //计算相差秒数
    var leave3  = leave2%(60*1000);      //计算分钟数后剩余的毫秒数
    var seconds =  Math.round(leave3/1000);
    var str = '';
    if(days>0){
      str = days+'天';
    }
    if(hours>0){
      str += hours+':';
    }
    if(minutes>0){
      if(minutes>=10){
        str += minutes+':';
      }else{
        str += "0"+minutes+':';
      }
    }else{
      str += '00:';
    }
    if(seconds>0){
      if(seconds>=10){
        str += seconds;
      }else{
        str += "0"+seconds;
      }
    }else{
      str += '00';
    }
    return str;
  }
  $scope.gourl = function(url){
    console.log(url);
    $location.path(url);
    $scope.modal.hide();
  }
  $scope.resultback = function(){
    console.log('resultback');
    $state.go("tab.practice",{productid:$stateParams.productid});
    $scope.modal.hide();
  }
})
.controller('ViewCtrl', function($scope,$stateParams,Websites,$http,$ionicLoading,$state) {
  if (localStorage.haslogin != 1) {
        $state.go("tab.usercenter");
  }
  console.log('ViewCtrl');
  $ionicLoading.show({
      template: 'Loading...'
  });
  $scope.userid = window.localStorage['userid'];
  $scope.planid = $stateParams.planid;
  $scope.courseid = $stateParams.courseid;
  //获取学习进度详细
  Websites.getProcessview($scope).success(function(data) {
    $ionicLoading.hide();
  }).error(function(data) {
    $ionicLoading.hide();
  });
})
.controller('DetailCtrl', function($scope,$stateParams,Websites,$http,$ionicLoading,$state) {
  if (localStorage.haslogin != 1) {
        $state.go("tab.usercenter");
  }
  console.log('DetailCtrl');
  $scope.detailerror = "";
  $ionicLoading.show({
      template: 'Loading...'
  });
  $scope.userid = window.localStorage['userid'];
  $scope.title = $stateParams.title;
  $scope.item_track_id = $stateParams.item_track_id;
  //获取学习进度详细
  Websites.getProcessDetail($scope).success(function(data) {
    console.log($scope.detail);
    if($scope.detail.length==0){
      $scope.detailerror = "暂无数据";
    }
    $ionicLoading.hide();
  }).error(function(data) {
    $ionicLoading.hide();
  });
})


/**
 * 用户中心
 * @param  {[type]} $scope  [description]
 * @param  {[type]} $state) {             if (localStorage.haslogin ! [description]
 * @return {[type]}         [description]
 */
.controller('UsercenterCtrl', function($scope, $state,LoginService,$ionicLoading,$ionicPopup,$ionicHistory) {
  $scope.data = {};
    //强制显示返回button，默认情况下tabs里面独立页面不显示back button
    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
      viewData.enableBack = false;
    });
    if (localStorage.haslogin == 1) {
        $state.go("tab.account");
    }

    $scope.login = function() {
        console.log($scope.data.username);
        
        LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
            //登录成功
            localStorage.haslogin = 1;
            $ionicLoading.hide();
            $state.go("tab.account");
            $ionicHistory.clearCache(['tab.mycourse']);

        }).error(function(data) {
            console.log('error login');
            localStorage.haslogin = 0
            var alertPopup = $ionicPopup.alert({
                title: '登录失败',
                okType: 'button-calm',
                okText: '确定',
                template: '请检查您填写的登陆信息！'
            });
        });
    }

    $scope.forget = function() {
        //进行API提交后，发送邮件，发送成功后，进行alert提醒
        $state.go('resetpassword');
    }

    $scope.goregister = function() {
        $state.go('tab.register');
    }

  /*$scope.user = {
    id:12,
    img:'http://127.0.0.1/mynepapp/www/img/u_02.png',
    name:'尚未登录'
    //name:'李元熙'
  };*/
})

/**
 * 首页控制器
 */
.controller('HomeCtrl', function($scope, Websites, StorageService, $ionicHistory, $ionicLoading, $ionicSlideBoxDelegate,$ionicSideMenuDelegate,$stateParams,$state,$timeout){
  var catId = $stateParams.catId == null ? localStorage.catId : $stateParams.catId;
  //console.log(catId);
  $scope.bannerData = "";
  $scope.canrun = 0;
  //得到指定分类名称
  //Websites.getCategoryById($scope,catId);
  $ionicLoading.show({
      template: '数据加载中...'
  });

  //强制隐藏返回button，默认情况下tabs里面独立页面不显示back button
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
      viewData.enableBack = false;
      /*var physicalScreenWidth = window.screen.width * window.devicePixelRatio;
      var physicalScreenHeight = window.screen.height ;
      alert(physicalScreenHeight);
      alert($scope.index_height.height);*/
      $scope.index_height = {
        "height":window.screen.height*0.25+"px"
        /*height:"200px"*/
      };
      //alert($scope.index_height.height);
  });


 

  if(typeof(localStorage.categorystr) == 'undefined'){
      Websites.getCategory($scope).success(function(data){
          var categorystr = localStorage.categorystr;
          var categoryarr = JSON.parse(categorystr);

          if(catId == null || typeof(catId) == 'undefined'){
              catId = categoryarr[0].id;
              localStorage.catId = catId;
          }

          for(var i in categoryarr){
              if(categoryarr[i].id == catId){
                  $scope.category = categoryarr[i];
                  
                  console.log($scope.catId);
                  break;
              }
          }
          Websites.indexData($scope,catId).success(function(data) {
            $ionicLoading.hide();
          }).error(function(data){
            //加载失败
            $ionicLoading.hide();
            //alert('首页加载失败');
            $scope.emptytext = '服务器在葛优躺，等程序猿哥哥拉起他';
            return;
          });
      }).error(function(data){
        //分类加载失败
        $ionicLoading.hide();
        $scope.emptytext = '服务器在葛优躺，等程序猿哥哥拉起他';
        return;
      });
  }else{
      var categorystr = localStorage.categorystr;
      var categoryarr = JSON.parse(categorystr);

      if(catId == null || typeof(catId) == 'undefined'){
          catId = categoryarr[0].id;
          localStorage.catId = catId;
      }

      for(var i in categoryarr){
          if(categoryarr[i].id == catId){
              $scope.category = categoryarr[i];
              console.log(catId);
              console.log($scope.category);
              break;
          }
      }
      Websites.indexData($scope,catId).success(function(data) {
        $ionicLoading.hide();

      }).error(function(data){
        //加载失败
        $ionicLoading.hide();
        /*Websites.showMessage($ionicLoading,'程序猿哥哥正在维护服务器');
        return;*/
        $scope.emptytext = '服务器在葛优躺，等程序猿哥哥拉起他';
        return;
      });
  }
  
  //设置banner模块
  Websites.getBanner($scope).success(function(data){
    $timeout(function() {
      $ionicSlideBoxDelegate.update();
      
      $scope.index_height = {
        "height":window.screen.height*0.25+"px",
      };
      //$ionicSlideBoxDelegate.$getByHandle("slideboximgs").update();
      $ionicSlideBoxDelegate.$getByHandle("slideboximgs").loop(true);
    });
  }).error(function(data){
      /*Websites.showMessage($ionicLoading,'程序猿哥哥正在维护服务器');
      return;*/
      $ionicLoading.hide();
      $scope.emptytext = '服务器在葛优躺，等程序猿哥哥拉起他';
      return;
  });

  //数据加载完毕后进行渲染
  $scope.$watch('bannerData',function(newValue,oldValue){
      if(newValue!=""){
        $ionicSlideBoxDelegate.update();
        $scope.index_height = {
          "height":window.screen.height*0.25+"px",
        };
        //$ionicSlideBoxDelegate.$getByHandle("slideboximgs").update();
        $ionicSlideBoxDelegate.$getByHandle("slideboximgs").loop(true);
        //alert('watch');
      }
  })

  $scope.doRefresh = function() {
    Websites.indexData($scope,localStorage.catId).success(function(){
      $scope.emptytext = '';
    }).error(function(){
      $scope.emptytext = '服务器在葛优躺，等程序猿哥哥拉起他';
    });
    //Stop the ion-refresher from spinning
    $scope.$broadcast('scroll.refreshComplete');
  };

  $scope.openMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
    console.log(localStorage.haslogin);  
  }

  $scope.slideHasChanged = function(index){
    //console.log(index);
  }
  /**
   * 点击课程
   * @param  {[type]} courseid [description]
   * @return {[type]}          [description]
   */
  
  // if history == localStorage.history history = history.split(",");
  $scope.toCoursedetail = function(courseid) {
    var courseid = parseInt(courseid);
    var local_downedarr = {};
    var downloadedarr = [];
    if(typeof(localStorage.myhistory)!='undefined'){
      local_downedarr = JSON.parse(localStorage.myhistory);
      console.log(local_downedarr);
      var index = local_downedarr.indexOf(courseid);
      if(index<0){
        local_downedarr.push(courseid);  
      }
      downloadedarr = local_downedarr;
    }else{
      console.log(courseid);
      downloadedarr.push(courseid);
    }
    var downloadstr = JSON.stringify(downloadedarr);
    localStorage.myhistory = downloadstr;

    $ionicHistory.clearCache(['tab.myhistory']);

    // localStorage.history.push(courseid);
    //判断该课程是否已经购买
    if(localStorage.haslogin == 1){
      Websites.UserCourse($scope,courseid).success(function(){
        console.log('buycourse'+$scope.buycourse);
        if($scope.buycourse == 1){
          $state.go('coursenote',{productid:courseid});
          return;
        }else{
          $state.go('coursedetail',{productid:courseid});
        }
      })      
    }else{
      $state.go('coursedetail',{productid:courseid});
    }
  }

})

.controller('AllCourseCtrl', ['$scope', 'Websites', '$ionicLoading', '$state','$ionicSideMenuDelegate', function($scope, Websites, $ionicLoading, $state,$ionicSideMenuDelegate){
  $ionicLoading.show({
      template: '数据加载中...'
  });
  Websites.getAllCourse($scope).success(function(data) {
                console.log(data);

    $ionicLoading.hide();
  }).error(function(data) {
    $ionicLoading.hide();
  });
  $scope.openMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
  }
  $scope.tosearch = function(){
    $state.go("tab.search");
    console.log("tab.search");
  }
}])

/**
 * [登录类控制器：登录、忘记密码、注册等]
 * @param  {[type]} $scope          [description]
 * @param  {[type]} LoginService    [description]
 * @param  {[type]} $ionicPopup     [description]
 * @param  {[type]} $state          [description]
 * @param  {[type]} $ionicLoading   [description]
 * @param  {[type]} $window         [description]
 * @param  {Object} $ionicPlatform) {               $scope.data [description]
 * @return {[type]}                 [description]
 */
.controller('AccountCtrl', function($scope, LoginService, $ionicPopup, $state, $ionicLoading, $window, $ionicPlatform,Websites, $ionicHistory) {
  console.log('AccountCtrl');
  $scope.login = localStorage.haslogin;
  //console.log($scope.login);
  //$ionicHistory.clearCache(['tab.mycourse']);
  //console.log($ionicHistory.viewHistory());
  if (localStorage.haslogin != 1) {
    $state.go("tab.usercenter");
  }else{
      /*Websites.getUserDetail($scope,window.localStorage['userid']).success(function(){
          $scope.detail = true;
      });*/
      $scope.headimg = localStorage.headimg!='null' ? localStorage.headimg : 'img/man1.png';
      $scope.name = localStorage.username!='null' ? localStorage.username : localStorage.userid;
      $scope.hide = true;
      $scope.settings = {
        enableFriends: true
      };
      
      $scope.toregister = function(){
        console.log(11);
      };
      $scope.downingnum = 0;
      if(typeof(localStorage.downloadingProduct) != 'undefined'){
        var loadingobj = JSON.parse(localStorage.downloadingProduct);
        var num = 0;
        for( var i in loadingobj){
          num += loadingobj[i].length;
        }
        $scope.downingnum = num;
        console.log(num);
      }
      
      /*$scope.$on('changeloadstatus',function(){
        console.log('setdownloadnum');
        var loadingobj = JSON.parse(localStorage.downloadingProduct);
        var num;
        for( var i in loadingobj){
          num += loadingobj[i].length;
        }
        $scope.downingnum = num;
        console.log('num'+num);
      })*/
  }    
})

/**
 * 新闻详细信息
 * @param  {[type]} $scope      [description]
 * @return {[type]}             [description]
 */
.controller('NewsCtrl', ['$scope', 'Websites', '$stateParams', '$ionicLoading', '$ionicHistory', function($scope, Websites, $stateParams, $ionicLoading, $ionicHistory){
    $ionicLoading.show({
        template: '数据加载中...'
    });
    
    var newsid = $stateParams.newsid;
    Websites.getNewsdetail($scope, newsid).success(function(data) {
      console.log('success');
      $ionicLoading.hide();
    }).error(function(data){
      //加载失败
      console.log('failure');
      $ionicLoading.hide();
    });

    //强制显示返回button，默认情况下tabs里面独立页面不显示back button
    /*$scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        viewData.enableBack = true;
    });

    $scope.gotoaccount = function() {
      $ionicHistory.goBack();
    }*/
}])


//   Sam   ------ 错题集列表控制器
.controller('ErrorlistCtrl', function($scope, $ionicPopup, $state, $ionicLoading, $ionicPlatform,Websites,$http,$ionicSideMenuDelegate) {
  //侧滑栏关闭
  $scope.$on('$ionicView.enter', function(){
    $ionicSideMenuDelegate.canDragContent(false);
  });
  //侧滑栏开启
  $scope.$on('$ionicView.leave', function(){
    $ionicSideMenuDelegate.canDragContent(true);
  });
    var userid = window.localStorage['userid'];
    Websites.getErrorlist($scope,userid).success(function(data) {
      //$ionicLoading.hide();
      console.log(data);
      if(data.responseData.length==0){
        $scope.emptytext = "没有错题集";
      }
    }).error(function(data){
      //加载失败
      $ionicLoading.hide();
    });
    $scope.errortype = {'1':'单项选择题','2':'多项选择题','3':'判断题','4':'课题解析'};
    //Sam   --------删除错题列表
    $scope.onItemDelete = function(index,courseid){
      var confirmPopup = $ionicPopup.confirm({
            title: '确认删除？',
            cancelText: '取消',
            okText: '确定'
        });
        confirmPopup.then(function(res) {
          if(res) {
            console.log('You are sure');
            Websites.DeleteError($scope,courseid,userid).success(function () {
              $scope.errorlist.splice(index,1);
              if(data.errorlist.length==0){
                $scope.emptytext = "没有错题集了";
              }
            })
          }else{
              console.log('You are not sure');
          }
        });
    }
})

//   Sam   ------  错题详细页面
.controller('ErrordetailCtrl', function ($scope,$http,$location,$ionicSlideBoxDelegate,$stateParams,$ionicModal,$ionicLoading,Websites,$ionicSideMenuDelegate){
  $scope.radio = {checked:''};
  //侧滑栏关闭
  $scope.$on('$ionicView.enter', function(){
    $ionicSideMenuDelegate.canDragContent(false);
  });
  //侧滑栏开启
  $scope.$on('$ionicView.leave', function(){
    $ionicSideMenuDelegate.canDragContent(true);
  });
  var userid = window.localStorage['userid'];
  var courseid = $stateParams.courseid;
  console.log(courseid);
  var coursename = $stateParams.course_name;
  var typeid = $stateParams.typeid;
  $scope.choice = {'0':'A','1':'B','2':'C','3':'D','4':'E','5':'F'};
  Websites.ErrorDetail($scope,courseid,typeid,userid).success(function(data){
    var res = data.responseData;
    $scope.questions = res['question'];
    $scope.questype = res['questype'];
    $scope.total = res['total'];
    $scope.cardlist = res['card'];
    $scope.pagetitle = res['pagetitle'];
    $scope.params = res['params'];
    console.log($scope.questions);
    $ionicSlideBoxDelegate.update();
  })
  //Sam------答题卡modal
  $ionicModal.fromTemplateUrl('templates/d.html', {
    scope: $scope
  }).then(function(cards) {
    $scope.cards = cards;
    //$scope.modal.show();
  });
  $scope.toquestion = function(id){
    $ionicSlideBoxDelegate.slide(id-1);
    $scope.cards.hide();
  }
  //Sam------答题卡测试
  $scope.cardsshow = function() {
    console.log($scope.danxuan);
    console.log($scope.total+1);
    //单选题目数量
    $scope.danxuancount = [];
    for(var danxuan = 1; danxuan<$scope.danxuan+1; danxuan++){
      $scope.danxuancount.push(danxuan);
      var danxuanlast = danxuan;
    }
    //多选题目数量
    $scope.duoxuancount = [];
    for(var duoxuan = danxuanlast; duoxuan<$scope.duoxuan+danxuanlast; duoxuan++){
      $scope.duoxuancount.push(duoxuan);
    }
    // console.log($scope.numlist);
    $scope.cards.show();
  }
  // Sam ------ 答题卡跳转
  $scope.redirect = function(value) {
        //接收key key是题目的编号
        // 跳转到指定的题目页面
        // $ionicSlideBoxDelegate.slide(4);
        $scope.cards.hide();
        $ionicSlideBoxDelegate.slide(value-1);
  }
  
  // Sam  ---------  隐藏答题卡
  $scope.cardsHide = function() {
      // console.log('test');
      $scope.cards.hide();
  }
  //  Sam   --------  成绩结果返回按钮
  $scope.examurl = '/practice/errorlist';
  $scope.gourl = function(url){
      $location.path(url);
      $scope.modal.hide();
    }
})


//  Sam   ------   个人信息设置页面 
.controller('UserinfoCtrl', function($scope,$http,Websites,$ionicLoading,$ionicHistory,$state) {
  $scope.user = {
    id:12,
    img:'http://127.0.0.1/mynepapp/www/img/u_02.png',
    name:'尚未登录'
    //name:'李元熙'
  };

  Websites.getUserinfo($scope).success(function(data) {
      console.log('success');
      console.log(data);
      $scope.userdata = data.responseData;
      console.log($scope.userdata);
      console.log($scope.userdata[0]['title']);
      //if($scope.userdata[0]['content'] == '') $scope.userdata[0]['content'] = './img/u_02.png';
      //$scope.headimg = $scope.userdata[0]['content'];
      $scope.headimg = localStorage.headimg!='null' ? localStorage.headimg : 'img/man1.png';
      //$ionicLoading.hide();
    }).error(function(data){
      //加载失败
      console.log('fail');
      $ionicLoading.hide();
    });

  $scope.logout = function () {
    // body...
    localStorage.haslogin = 0;
    localStorage.removeItem('access_token');
    $state.go('tab.usercenter');
    //$ionicHistory.goBack();
  };

  $scope.$on('changeheadimg', function() {
      
      $scope.headimg = localStorage.headimg!='null' ? localStorage.headimg : 'img/man1.png';
      //$scope.headimg = typeof(window.headimg)!='undefined' ? window.headimg : 'img/man1.png';
      //console.log($scope.headimg);
      //alert($scope.headimg);
  });

})

//  Sam   ------   个人信息更改详细页面 
.controller('InfosettingCtrl', function($scope,$ionicLoading,$http,$stateParams,$state,Websites,$rootScope) {
  console.log($stateParams);
  console.log($stateParams.infotype);
  console.log($stateParams.text);

  $scope.user = {
    id:12,
    img:'http://127.0.0.1/mynepapp/www/img/u_02.png',
    name:'尚未登录'
    //name:'李元熙'
  };

  $scope.headimg = localStorage.headimg!='null' ? localStorage.headimg : 'img/man1.png';
  $scope.content = {};
  $scope.content.value = $stateParams.text;

  $scope.save = function(){
    console.log('helo');
    console.log($scope.content.value);
    $http.jsonp(ENV.apiUrl + 'mobileadmin/saveuser?access-token='+localStorage.access_token+'&field='+$stateParams.infotype+'&usercontent='+$scope.content.value+'&callback=JSON_CALLBACK')
        .then(function(res){
          console.log('suc');
          console.log($scope.content.value);
          $ionicLoading.show({ template: '修改成功', noBackdrop: true, duration: 1000 });
          $state.go('tab.userinfo')
      })
  }

  $scope.userkey = $stateParams.infotype;
  if ($stateParams.infotype == 'avatar')  $scope.title = '头像设置';
  if ($stateParams.infotype == 'name')  $scope.title = '姓名设置';
  if ($stateParams.infotype == 'email')  $scope.title = '电子邮件设置';
  if ($stateParams.infotype == 'mobile')  $scope.title = '移动电话设置';
  if ($stateParams.infotype == 'postcode')  $scope.title = '邮政编码设置';
  if ($stateParams.infotype == 'pass')  $scope.title = '密码设置';
  console.log($stateParams);
  // $scope.key = $stateParams.text;
  $scope.cleartext = function() {
    console.log('textclear');
    $scope.content.value = "";
  }

  $scope.$on('changeheadimg', function() {
      
      $scope.headimg = localStorage.headimg!='null' ? localStorage.headimg : 'img/man1.png';
      $scope.$apply();
      //$scope.headimg = typeof(window.headimg)!='undefined' ? window.headimg : 'img/man1.png';
      //console.log($scope.headimg);
      //alert($scope.headimg);
  });

  $scope.tocamera = function() {
      //console.log('tocamera'+localStorage.headimg);
      //localStorage.headimg = 'http://10.82.97.232/mynepappv1/api/backend/uploads/stu_photo/11.jpg';
      //$scope.headimg = localStorage.headimg;
      //$rootScope.$broadcast('changeheadimg');
      if(!navigator.camera || typeof(navigator.camera) == 'undefined' || typeof(CameraPopoverOptions) == 'undefined') {
          alert('camera is not defined');
          return;
      }
      var popover = new CameraPopoverOptions(0, 100, 200, 200, Camera.PopoverArrowDirection.ARROW_ANY);
      navigator.camera.getPicture(
          function (imageUriToUpload){
            
              //localStorage.headimg = 'http://10.82.97.232/mynepappv1/api/backend/uploads/stu_photo/11.jpg';
              //$scope.headimg = localStorage.headimg;
              //$scope.headimg = imageUriToUpload;
              var url=encodeURI(ENV.apiUrl+"mobileadmin/uploadimg?access-token="+localStorage.access_token);
              var params = new Object();
              var options = new FileUploadOptions();
              options.fileKey = "userimg"; //depends on the api
              options.fileName = imageUriToUpload.substr(imageUriToUpload.lastIndexOf('/')+1);
              options.mimeType = "image/jpeg";
              options.params = params;
              options.chunkedMode = true; //this is important to send both data and files
              var headers={'headerParam':'headerValue'};
              options.headers = headers;
              var ft = new FileTransfer();
              ft.upload(imageUriToUpload, url,
                  function (r) {
                    if(r.response!=null){
                      localStorage.headimg = r.response.substr(4);
                      $rootScope.$broadcast('changeheadimg');
                      //$scope.headimg = localStorage.headimg;
                      //alert("headimg:"+ $scope.headimg);
                    }
                      //console.log("Code = " + r.responseCode);
                      //alert("Response = " + r.response);
                      //alert("Sent = " + r.bytesSent);
                  },
                  function (error) {
                      //alert("An error has occurred: Code = " + error.code);
                      //alert("upload error source " + error.source);
                      //alert("upload error target " + error.target);
                  },
                  options);
          }
          , function (message) {
              //alert('Failed because: ' + message);
          }, { 
              quality: 60,
              destinationType: Camera.DestinationType.FILE_URI,
              sourceType: Camera.PictureSourceType.CAMERA,  //from camera
              allowEdit : true,
              encodingType: Camera.EncodingType.JPEG,
              targetWidth: 300,
              targetHeight: 300,
              popoverOptions  : popover,
              sourceType: 1,      // 0:Photo Library, 1=Camera, 2=Saved Photo Album
              encodingType: 0
          }
      );
      //$rootScope.$broadcast('changeheadimg');
      //$scope.headimg = localStorage.headimg;
      //alert($scope.headimg);
      //$state.go("tab.userinfo");
  }

  $scope.toimagepicker = function() {
      //console.log('toimagepicker');
      //$rootScope.$broadcast('changeheadimg');
      if(!navigator.camera || typeof(navigator.camera) == 'undefined' || typeof(CameraPopoverOptions) == 'undefined') {
          alert('camera is not defined');
          return;
      }
      var popover = new CameraPopoverOptions(0, 100, 200, 200, Camera.PopoverArrowDirection.ARROW_ANY);
        navigator.camera.getPicture(

            function (imageUriToUpload){

                $scope.headimg = imageUriToUpload;

                var url=encodeURI(ENV.apiUrl+"mobileadmin/uploadimg?access-token="+localStorage.access_token);
                //alert(url);
                var params = new Object();
                //params.userid = window.userid;  //you can send additional info with the file
                
                var options = new FileUploadOptions();
                options.fileKey = "userimg"; //depends on the api
                options.fileName = imageUriToUpload.substr(imageUriToUpload.lastIndexOf('/')+1);
                options.mimeType = "image/jpeg";
                options.params = params;
                options.chunkedMode = true; //this is important to send both data and files
                var headers={'headerParam':'headerValue'};
                options.headers = headers;
                var ft = new FileTransfer();
                //alert('upload13');
                ft.upload(imageUriToUpload, url, 
                    function (r) {
                      //$rootScope.$broadcast('loginUser');
                      if(r.response!=null){
                        localStorage.headimg = r.response.substr(4);
                        //$scope.headimg = localStorage.headimg;
                        //window.headimg = r.response.substr(4);
                        //$scope.headimg = window.headimg;
                        
                        //alert("headimg"+ localStorage.headimg);                       
                      }
                      $rootScope.$broadcast('changeheadimg');

                        /*alert("Code = " + r.responseCode);
                        alert("Response = " + r.response);
                        alert("Sent = " + r.bytesSent);*/
                        
                    },
                    function (error) {
                        /*alert("An error has occurred: Code = " + error.code);
                        alert("upload error source " + error.source);
                        alert("upload error target " + error.target);*/
                    },
                    options);
            }
            , function (message) {
                //alert('Failed because: ' + message);
            }, { 
                maximumImagesCount: 1,
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY, //from photolibrary
                //sourceType: Camera.PictureSourceType.CAMERA, //from photolibrary
                allowEdit : true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions  : popover
            }
        );
        //$rootScope.$broadcast('changeheadimg');
        //$scope.headimg = localStorage.headimg;
        //$state.go("tab.userinfo");
  }
})

//Sam   --- 我的课程页面 
.controller('MycourseCtrl', function($scope,$ionicLoading,$http,$stateParams,$state,Websites,$ionicHistory) {

  $scope.$on("$ionicView.beforeEnter", function(event, data){
    // handle event
    console.log("State Params: ", data.stateParams);
    if (localStorage.haslogin != 1) {
      $state.go("tab.usercenter");
      return;
    }
  });
  if (localStorage.haslogin != 1) {
      $state.go("tab.usercenter");
      return;
  }else{
      Websites.getUserCourse($scope).success(function(data) {
      //$ionicLoading.hide();
      console.log($scope.courselist);

      if(data.responseData.length==0){
        $scope.emptytext = '你还没有购买过课程';
      }
    }).error(function(data){
      //加载失败
      console.log('fail');
      $ionicLoading.hide();
      $scope.emptytext = '服务器在葛优躺，等程序猿哥哥拉起他';
      return;
    });
  }

  $scope.toHis = function(courseid) {
    console.log(courseid);
    var courseid = parseInt(courseid);
    var local_downedarr = {};
    var downloadedarr = [];
    if(typeof(localStorage.myhistory)!='undefined'){
      local_downedarr = JSON.parse(localStorage.myhistory);
      console.log(local_downedarr);
      var index = local_downedarr.indexOf(courseid);
      if(index<0){
        local_downedarr.push(courseid);  
      }
      downloadedarr = local_downedarr;
    }else{
      console.log(courseid);
      downloadedarr.push(courseid);
    }
    var downloadstr = JSON.stringify(downloadedarr);
    localStorage.myhistory = downloadstr;

    $ionicHistory.clearCache(['tab.myhistory']);
  }

  $scope.doRefresh = function() {
    Websites.getUserCourse($scope);
    //Stop the ion-refresher from spinning
    $scope.$broadcast('scroll.refreshComplete');
  };

  $scope.$on('loginUser', function() {

  })
})

//Sam   --- 报班页面
.controller('ApplycourseCtrl', function($scope,$http,$stateParams,Websites,$ionicLoading,$ionicHistory,$state) {
  var typeid = $stateParams.typeid;
  console.log(typeid);
  $scope.tosearch = function(){
    $state.go("tab.search");
    console.log("tab.search");
  }

    Websites.applyCourse($scope, typeid).success(function(data) {
      //$ionicLoading.hide();
    }).error(function(data){
      //加载失败
      console.log('fail');
      $ionicLoading.hide();
    });


  $scope.toCoursedetail = function(courseid) {
    console.log(courseid);
    //判断该课程是否已经购买
    if(localStorage.haslogin == 1){
      Websites.UserCourse($scope,courseid).success(function(){
        console.log('buycourse'+$scope.buycourse);
        if($scope.buycourse == 1){
          $state.go('coursenote',{productid:courseid});
          return;
        }else{
          $state.go('coursedetail',{productid:courseid});
        }
      })      
    }else{
      $state.go('coursedetail',{productid:courseid});
    }

    /*StorageService.getLocalstorage().then(function(data){
      console.log(data.haslogin);
      if(data.haslogin == 1){
        Websites.UserCourse($scope,courseid).success(function(){
          //console.log('buycourse'+$scope.buycourse);
          if($scope.buycourse == 1){
            $state.go('coursenote',{courseid:courseid});
            return;
          }else{
            $state.go('coursedetail',{courseid:courseid});
          }
        })      
      }
      $state.go('coursedetail',{courseid:courseid});
    },function(){
      $state.go('coursedetail',{courseid:courseid});
    })*/
  }

})

//Sam  ---- 课程包页面
.controller('CoursepageCtrl', function($scope,$http,$stateParams,Websites,$ionicLoading,$ionicHistory,$state) {
  var typeid = $stateParams.typeid;

  if(typeid == 842) $scope.title = '课程';
  if(typeid == 843) $scope.title = '实训操作';
  if(typeid == 844) $scope.title = '练习';

    Websites.coursePage($scope,typeid).success(function(data) {
      //$ionicLoading.hide();
      if(data.responseData.length==0){
        $scope.emptytext = "该分类下还没有课程";
      }
    }).error(function(data){
      //加载失败
      console.log('fail');
      $ionicLoading.hide();
    });
  
  $scope.tosearch = function() {
    $state.go("tab.search");
    console.log("tab.search");
  }

  $scope.toCoursedetail = function(courseid) {
    console.log(courseid);
    //判断该课程是否已经购买
    if(localStorage.haslogin == 1){
      Websites.UserCourse($scope,courseid).success(function(){
        console.log('buycourse'+$scope.buycourse);
        if($scope.buycourse == 1){
          $state.go('coursenote',{productid:courseid});
          return;
        }else{
          $state.go('coursedetail',{productid:courseid});
        }
      })      
    }else{
      $state.go('coursedetail',{productid:courseid});
    }

    /*StorageService.getLocalstorage().then(function(data){
      console.log(data.haslogin);
      if(data.haslogin == 1){
        Websites.UserCourse($scope,courseid).success(function(){
          //console.log('buycourse'+$scope.buycourse);
          if($scope.buycourse == 1){
            $state.go('coursenote',{courseid:courseid});
            return;
          }else{
            $state.go('coursedetail',{courseid:courseid});
          }
        })      
      }
      $state.go('coursedetail',{courseid:courseid});
    },function(){
      $state.go('coursedetail',{courseid:courseid});
    })*/
  }


})

// Sam  地址页面
.controller('AddressCtrl', function($scope,$http,Websites,$ionicLoading,$ionicHistory,$state) {
  if (localStorage.haslogin != 1) {
      $state.go("tab.usercenter");
      return;
  }else{
      Websites.getAddress($scope).success(function(data) {
      //$ionicLoading.hide();
      $scope.addresslist = data.responseData;
      console.log($scope.addresslist);
      for(var i in $scope.addresslist) {
        console.log($scope.addresslist[i].choose_mark);
        if ($scope.addresslist[i].choose_mark==1) {
          $scope.addressid = $scope.addresslist[i].id;
          console.log($scope.addressid);
        }
      }
    }).error(function(data){
      //加载失败
      console.log('fail');
      $ionicLoading.hide();
    });
  }
   $scope.getMark = function(addressid){
    $scope.addressid = addressid;
    var id = addressid;
    Websites.editSelectedAddress($scope,id);
  }
})

//Sam  ---- 课程包页面
.controller('MycollectionCtrl', function($scope,$http,Websites,$ionicLoading,$ionicHistory,$state,$ionicSideMenuDelegate,$ionicPopup) {
  //侧滑栏关闭
  $scope.$on('$ionicView.enter', function(){
    $ionicSideMenuDelegate.canDragContent(false);
  });
  //侧滑栏开启
  $scope.$on('$ionicView.leave', function(){
    $ionicSideMenuDelegate.canDragContent(true);
  });
  $scope.items = [1, 2, 3, 4];
  $scope.moveItem = function(item, fromIndex, toIndex) {
    //把该项移动到数组中
    $scope.items.splice(fromIndex, 1);
    $scope.items.splice(toIndex, 0, item);
  };
  $scope.data = {
    showDelete: false
  };
  if (localStorage.haslogin != 1) {
      $state.go("tab.usercenter");
      return;
  }else{
      Websites.getMyCollection($scope).success(function(data) {
      if(data.responseData.length==0){
        $scope.emptytext = "你还没有收藏过";
      }
      //$ionicLoading.hide();
    }).error(function(data){
      //加载失败
      console.log('fail');
      $ionicLoading.hide();
    });
  }
  $scope.onItemDelete = function(id,index){
    console.log(id);
    var confirmPopup = $ionicPopup.confirm({
          title: '确认删除？',
          buttons: [{ //Array[Object] (可选)。放在弹窗footer内的按钮。
            text: '否',
            type: '',
          }, {
            text: '是',
            type: 'button-calm',
            onTap: function(e) {
              // 返回的值会导致处理给定的值。
              return true;
            }
          }]
      });
    confirmPopup.then(function(res) {          
      if(res){
        Websites.dealcollection($scope,id,0).success(function(){
          $scope.applycourse.splice(index,1);
        });
      }
    });
  }
  /**

   * 点击课程

   * @param  {[type]} courseid [description]

   * @return {[type]}          [description]

   */

  $scope.toCoursedetail = function(courseid) {

    console.log(courseid);

    //判断该课程是否已经购买

    if(localStorage.haslogin == 1){

      Websites.UserCourse($scope,courseid).success(function(){

        console.log('buycourse'+$scope.buycourse);

        if($scope.buycourse == 1){

          $state.go('coursenote',{productid:courseid});

          return;

        }else{

          $state.go('coursedetail',{productid:courseid});

        }

      })      

    }else{

      $state.go('coursedetail',{productid:courseid});

    }
  }
})

//Sam  ---- 历史记录
.controller('MyhistoryCtrl', function($scope,$http,Websites,$ionicPopup,$ionicLoading,$ionicHistory,$state) {
  if (localStorage.haslogin != 1) {
      $state.go("tab.usercenter");
      return;
  }else{
      Websites.getMyHistory($scope).success(function(data) {
      //$ionicLoading.hide();
      if(data.responseData.length==0){
        $scope.emptytext = "你还没有浏览过任何课程";
      }
    }).error(function(data){
      //加载失败
      console.log('fail');
      $ionicLoading.hide();
    });
  }
  $scope.data = {
    showDelete: false
  };
    $scope.toCoursedetail = function(courseid) {
    console.log(courseid);
    //判断该课程是否已经购买
    if(localStorage.haslogin == 1){
      Websites.UserCourse($scope,courseid).success(function(){
        console.log('buycourse'+$scope.buycourse);
        if($scope.buycourse == 1){
          $state.go('coursenote',{productid:courseid});
          return;
        }else{
          $state.go('coursedetail',{productid:courseid});
        }
      })      
    }else{
      $state.go('coursedetail',{productid:courseid});
    }
  }

  // Sam 删除
  $scope.onItemDelete = function(courseid){
    console.log(courseid);
    var confirmPopup = $ionicPopup.confirm({
          title: '确认删除？',
          buttons: [{ //Array[Object] (可选)。放在弹窗footer内的按钮。
            text: '否',
            type: '',
          }, {
            text: '是',
            type: 'button-calm',
            onTap: function(e) {
              // 返回的值会导致处理给定的值。
              return true;
            }
          }]
      });
    confirmPopup.then(function(res) {          
      if(res){
        historyarr = JSON.parse(localStorage.myhistory);
        var index = historyarr.indexOf(courseid);
        console.log((index));
        if (index != -1) {
          historyarr.splice(index,1);

          localStorage.myhistory = JSON.stringify(historyarr);
          console.log(localStorage.myhistory);
          if (localStorage.myhistory == '[]') {
            localStorage.removeItem('myhistory');
            // location.reload() 
          }
          Websites.getMyHistory($scope).success(function(data) {
          //$ionicLoading.hide();
          if(data.responseData.length==0){
            $scope.emptytext = "你还没有浏览过任何课程";
          }
        }).error(function(data){
          //加载失败
          console.log('fail');
          $ionicLoading.hide();
        });
        }
        console.log(historyarr);

      }
    });
  }


})

//Sam  ---- 课程答疑、笔记页面
//.controller('CoursenoteCtrl', function($scope,$http,Websites,$ionicLoading,$ionicHistory,$state) {
.controller('CoursenoteCtrl', ['$scope', '$http', 'Websites', '$stateParams', '$rootScope', '$ionicPopup', '$ionicLoading', '$ionicHistory', '$state', '$ionicViewSwitcher', '$timeout', '$cordovaFileTransfer', '$ionicPlatform', '$ionicModal', '$ionicSideMenuDelegate', '$cordovaKeyboard' ,function($scope, $http, Websites, $stateParams, $rootScope, $ionicPopup, $ionicLoading, $ionicHistory, $state,$ionicViewSwitcher,$timeout,$cordovaFileTransfer,$ionicPlatform,$ionicModal,$ionicSideMenuDelegate,$cordovaKeyboard){
  //判断screen orientation
  document.addEventListener("orientationchange", function() {
      alert(screen.orientation);
      console.log('Orientation is ' + screen.orientation);
  },false);
  //强制显示返回button，默认情况下tabs里面独立页面不显示back button
  
  $ionicModal.fromTemplateUrl('templates/courseinput.html', {
      scope: $scope,
      animation: 'slide-in-up'
  }).then(function(modal) {
      $scope.bookmodal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/dayiinput.html', {
      scope: $scope,
      animation: 'slide-in-up'
  }).then(function(modal) {
      $scope.dayimodal = modal;
  });
  //返回的动画效果，默认情况下强制显示的返回button无动画效果
  //播放器id的后缀
  //控制内容页高度
  $scope.grid_height = {height:''+document.body.offsetHeight*0.7-104+'px'};
  var productid = $stateParams.productid;
  console.log(productid);
  productid = typeof(productid) == 'undefined'?'0':productid;
  $scope.productid = productid;
  console.log($scope.productid);
  $scope.userid = window.localStorage['userid'];

  $scope.jpcid = 'jp_container_' + new Date().getTime();
  var course_dtd = Websites.directoryData($scope);

  //Sam   个人中心删除笔记  我的课程详细页面中   同步删除笔记
  $rootScope.$on('clearcousenote', function() {
    console.log('sammmmy');
    Websites.noteData($scope).success(function(data){
      if(data.length==0){
        $scope.emptytext2 = "记录你的想法吧";
      }
    });

  });

  
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
  console.log($ionicHistory.currentStateName());

      viewData.enableBack = true;
      console.log('cache');
      course_dtd.success(function(data) {
          //$ionicLoading.hide();
        if($stateParams.itemid){
          $scope.citemid = $stateParams.itemid;
        }
        console.log($scope.citemid);
        if (!$scope.citemid) return;
        //播放器初始化
        //Job.proxyUrl = ENV.proxyUrl;
        Job.proxyUrl = ENV.apiUrl + 'course/proxy';
        var jpcid = $scope.jpcid;
        setTimeout(function initp() {
        var p = document.getElementById(jpcid);
        if (p) {
          Job.init_player(jpcid, {config: ENV.apiUrl + 'course/startupxml?courseid='+$scope.ccourseid+'&itemid='+$scope.citemid+'&access-token='+localStorage.access_token}, $scope.citemid);
          Job.on('nextVideo', function() {
			  var next_itemid = $scope.get_next_itemid();
			  if (!next_itemid) {
				Websites.showMessage($ionicLoading,'已到本课程最后一节');
				return;
			  }
			  $scope.setActive(next_itemid,0,$scope.ccourseid);
          });
          return;
        }
        setTimeout(initp, 50);
        }, 50);

        }).error(function(data){
          //加载失败
          $ionicLoading.hide();
      });
      $ionicSideMenuDelegate.canDragContent(false);
  });

  $scope.get_next_itemid = function() {
	  var next_itemid = null;
	  for (var i=0; i<$scope.courses.length; i++) {
		if ($scope.courses[i].id != $scope.ccourseid) continue;
		var items = $scope.courses[i].items;
		var cflag = false;
		for (var j=0; j<items.length; j++) {
		  if (cflag) {
			if (items[j].vtype != 0) continue;
			next_itemid = items[j].itemid;
			break;
		  }
		  if (items[j].itemid != $scope.citemid) continue;
		  cflag = true;
		}
		break;
	  }
	  return next_itemid;
  };
  $scope.$on('$ionicView.beforeLeave', function (event, viewData) {
	    //销毁播放器
	    Job.destroy();
      $ionicSideMenuDelegate.canDragContent(true);
  });

  $scope.gotoaccount = function() {
      console.log('backvideo');
      $ionicHistory.goBack();
  };
  // //back button
  // $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
  //     viewData.enableBack = true;
  //   });


  $scope.haslogin = localStorage.haslogin;
  $scope.favorites = 0;
  //取到收藏状态
  Websites.getcollection($scope);
  
  
  $scope.ChangeHeight = function(){
    $scope.grid_height = {'height':''+document.body.offsetHeight*0.7-104+'px'};
    $rootScope.$broadcast('grid_height');
    console.log($scope.grid_height);

  }
  $scope.answer = function () {
    // body...
    $scope.bookmodal.show();
    //$cordovaKeyboard.show();
  }
  $scope.answerclose = function () {
    // body...
    $scope.bookmodal.hide();
  }
  $scope.dayi = function () {
    // body...
    $scope.dayimodal.show();
  }
  $scope.dayiclose = function () {
    // body...
    $scope.dayimodal.hide();
  }
  if (localStorage.haslogin != 1) {
      $state.go("tab.usercenter");
      return;
  }else{
	  Websites.questionData($scope).success(function(data){
      if(data.length==0){
        $scope.emptytext1 = "还没有任何提问";
      }
    });
	  Websites.noteData($scope).success(function(data){
      if(data.length==0){
        $scope.emptytext2 = "记录你的想法吧";
      }
    });
  }

    //$scope.timelast = '15:02';
    
    /**
     * 切换课件
     * @param {[type]} menuItem [description]
     */
    $scope.setActive = function(itemid,vtype,courseid) {
      if(vtype == 0){
      			var courseData = $scope.courseData;
      			if (itemid != $scope.citemid) {
					$scope.citemid = itemid;
					$scope.ccourseid = courseid;
					console.log(itemid, courseid);
      				//Job.changeVideo(ENV.postUrl2 + 'courseid/'+courseData.id+'/itemid/'+menuItem+'/userid/'+$scope.userid, menuItem);
      				Job.changeVideo(ENV.apiUrl + 'course/startupxml?courseid='+courseid+'&itemid='+itemid+'&access-token='+localStorage.access_token, itemid);
      				//courseData.itemid = menuItem;
      			}
        }else{
            Websites.showMessage($ionicLoading,'本课件不是单屏课件，无法观看');
        }
    };

	  //设置答疑内容（默认为空）
	  $scope.quizcreate = {
		'title': '',
		'content': ''
	  };
	  //设置笔记内容（默认为空）
	  $scope.notecreate = {
		'content': ''
	  };
    /**
     * 提交答疑
     * @param {[type]} menuItem [description]
     */
	$scope.addQuiz = function() {
		if (!$scope.ccourseid) {
			var alertPopup = $ionicPopup.alert({
				title: '无法提交',
				template: '该产品包没有课程，无法提交答疑！',
				buttons: [{ //Array[Object] (可选)。放在弹窗footer内的按钮。
				  text: 'OK',
				  type: 'button-calm',
				}]
			});
		} else if (!$scope.quizcreate.content) {
			var alertPopup = $ionicPopup.alert({
				title: '格式不合法',
				template: '请确认答疑内容不能为空！',
				buttons: [{ //Array[Object] (可选)。放在弹窗footer内的按钮。
				  text: 'OK',
				  type: 'button-calm',
				}]
			});
		}else{
			$http.jsonp(ENV.apiUrl + 'course/addquiz?access-token='+localStorage.access_token+'&courseid='+$scope.ccourseid+'&title='+$scope.quizcreate.title+'&content='+$scope.quizcreate.content+'&callback=JSON_CALLBACK')
				.success(function(data) {
					Websites.showMessage($ionicLoading,'提交成功，耐心等待老师解答');
				  //Websites.questionData($scope);
				  //发帖成功清除数据
          $scope.dayiclose();
          $ionicHistory.clearCache(['tab.answerlist']);
				  $scope.quizcreate = {
					'title': '',
					'content': ''
				  };
				});
		}
	};
    /**
     * 提交笔记
     * @param {[type]} menuItem [description]
     */
	$scope.addNote = function() {
		if (!$scope.citemid) {
			var alertPopup = $ionicPopup.alert({
				title: '无法提交',
				template: '该产品包没有课件，无法添加笔记！',
				buttons: [{ //Array[Object] (可选)。放在弹窗footer内的按钮。
				  text: 'OK',
				  type: 'button-calm',
				}]
			});
		} else if (!$scope.notecreate.content) {
			var alertPopup = $ionicPopup.alert({
				title: '格式不合法',
				template: '请确认笔记内容不能为空！',
				buttons: [{ //Array[Object] (可选)。放在弹窗footer内的按钮。
				  text: 'OK',
				  type: 'button-calm',
				}]
			});
		}else{
			//var note_time = Job.conf && Job.conf.lastViewedTime || 0;
      var note_time = Job.player && Job.player.currentTime() || 0;
			$http.jsonp(ENV.apiUrl + 'course/addnote?access-token='+localStorage.access_token+'&courseid='+$scope.ccourseid+'&itemid='+$scope.citemid+'&content='+$scope.notecreate.content+'&note_time='+note_time+'&callback=JSON_CALLBACK')
				.success(function(data) {
					Websites.showMessage($ionicLoading,'发布成功');
				  //Websites.noteData($scope);
				  //发帖成功清除数据
          $scope.answerclose();
          var arr = {'id':data.id,'text':$scope.notecreate.content,'video_time':data.time};
          $scope.notelist.unshift(arr);
				  $scope.notecreate = {
					'content': ''
				  };
				  $scope.dayiclose();
          $ionicHistory.clearCache(['tab.note']);
				});
		}
	};
  //删除笔记
  $scope.deletenote = function(id){
    var confirmPopup = $ionicPopup.confirm({
          title: '确认删除？',
          buttons: [{ //Array[Object] (可选)。放在弹窗footer内的按钮。
            text: '否',
            type: '',
          }, {
            text: '是',
            type: 'button-calm',
            onTap: function(e) {
              // 返回的值会导致处理给定的值。
              return true;
            }
          }]
      });
    confirmPopup.then(function(res) {          
      if(res){
        Websites.DeleteNote($scope,id).success(function(data){
          //删除成功
          if(data.flag==1){
            Websites.noteData($scope);
            $ionicHistory.clearCache(['tab.note']);
          }else{
            //删除失败
            $ionicLoading.show({
              template: '删除出错'
            });
            $timeout(function() {
              $ionicLoading.hide();
            }, 1000); 
          }
        });
      }
    });
  };

    /**
     * 收藏课程
     * @return {[type]} [description]
     */
    $scope.toFavorites=function(productid) {
        if(localStorage.haslogin == 1){
            console.log('toFavorites');
            var favorites =  1-$scope.favorites;
            var msg = favorites == 1 ? '收藏成功': '取消收藏';
            Websites.dealcollection($scope,productid,favorites).success(function(){
              Websites.showMessage($ionicLoading,msg);
              $scope.favorites = favorites;
              console.log('favorites'+favorites);
              $ionicHistory.clearCache(['tab.mycollection']);
            });
        }else{
            var confirmPopup = $ionicPopup.confirm({
               title: '',
               template: '匿名用户无法收藏课程，请登录',
               cssClass: 'comfirmText',
               buttons: [
                { text: '再看看' },
                {
                  text: '立即登录',
                  type: 'button-calm',
                  onTap: function(e) {
                      $state.go("tab.usercenter");
                  }
                }
              ]
             });
             confirmPopup.then(function(res) {
               if(res) {
                 console.log('You are sure');
               } else {
                 console.log('You are not sure');
               }
             });
        }        
        //console.log($scope.courseData);
    };

    /**
     * 显示下载视频页面
     * @return {[type]} [description]
     */
    
    $ionicModal.fromTemplateUrl('templates/downloadvideo.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;

    });

    $scope.toDownlaod = function(){
        console.log('download video');
        //Websites.directoryData($scope);
        
        if(localStorage.haslogin == 1){
            $scope.modal.show();
            $scope.selected = false;
            $scope.selectallv = false;
            var downloadedarr = [];
            //localStorage.downloadedProduct
            if(typeof(localStorage.downloadedProduct) != 'undefined'){
              var local_downedarr = JSON.parse(localStorage.downloadedProduct);
              downloadedarr = local_downedarr[$scope.productid];
            }
            $scope.downloadedarr = downloadedarr;
        }else{
            var confirmPopup = $ionicPopup.confirm({
               title: '',
               template: '匿名用户无法下载课程，请登录',
               cssClass: 'comfirmText',
               buttons: [
                { text: '再看看' },
                {
                  text: '立即登录',
                  type: 'button-calm',
                  onTap: function(e) {
                      $state.go("tab.usercenter");
                  }
                }
              ]
             });

             confirmPopup.then(function(res) {
               if(res) {
                 console.log('You are sure');
               } else {
                 console.log('You are not sure');
               }
             });
        }
    };

    /**
     * 关闭modal
     * @return {[type]} [description]
     */
    $scope.toClose = function(){
        $scope.modal.hide();
        $scope.downloadVideoarr = [];
        $scope.downloadPath = {};
        $scope.len = 0;
    }

    /**
     * 保存下载列表
     * @param {[type]} menuItem [description]
     */
    $scope.downloadVideoarr = [];
    $scope.downloadPath = {};
    var downloadCourse   = {};
    var downloadingProduct = {}
    var d_obj = {};
    //downloadCourse.push(new Array());
    $scope.setDownload = function(menuItem,courseid,selected,vpath) {
        if($scope.downloadedarr.indexOf(menuItem) > -1)
          return;
        console.log(selected);
        //selected=!selected;
        var len = 0;
        var index = $scope.downloadVideoarr.indexOf(menuItem);
        //if(selected){
            if(index<0){
              len = $scope.downloadVideoarr.push(menuItem);
              d_obj[menuItem] = vpath;
            }
        //}else{
            //var index = $scope.downloadVideoarr.indexOf(menuItem);
            if(index>-1){
                $scope.downloadVideoarr.splice(index,1);
                delete d_obj[menuItem];
            }
            
        //}
        len = $scope.downloadVideoarr.length;
        $scope.len = len;
        $scope.cselected = selected;
        $scope.downloadPath = d_obj;
        //result.push(new Array());
        /*downloadCourse[courseid] = $scope.downloadVideoarr;
        downloadProduct[$scope.productid] = downloadCourse;
        console.log(downloadProduct);*/
    };

    /**
     * 全选
     * @return {[type]} [description]
     */
    $scope.selectAll = function(all){
      var downloadVideoarr = [];
      var downloadCoursearr = [];
      var downloadedarr = [];
      if(typeof(localStorage.downloadedProduct) != 'undefined'){
        var local_downedarr = JSON.parse(localStorage.downloadedProduct);
        downloadedarr = local_downedarr[$scope.productid];
        
      }
      if(all){
        $scope.selected = true;
        var len = 0;        
        for(i in $scope.courses){
          downloadCoursearr.push($scope.courses[i].id);
            for(ii in $scope.courses[i].items){
                var index = downloadedarr.indexOf($scope.courses[i].items[ii].itemid);
                if(index<0){
                  len = downloadVideoarr.push($scope.courses[i].items[ii].itemid);
                  d_obj[$scope.courses[i].items[ii].itemid] = $scope.courses[i].items[ii].vpath;
                }                
            }
        }
        $scope.len = len;
      }else{
        $scope.selected = false;
        $scope.len = 0;

      }
      $scope.downloadVideoarr = downloadVideoarr;
      $scope.downloadPath = d_obj;
      console.log(downloadVideoarr);
    };

    /**
     * 下载视频
     * @return {[type]} [description]
     */
    $scope.downloadMultiVideo = function(){
        //console.log($scope.downloadVideoarr);
        //console.log($scope.productid);
        Websites.showMessage($ionicLoading,'成功加入下载列表！');
        
        var storageDownload = {};
        storageDownload[$scope.productid] = $scope.downloadVideoarr;
        $scope.downloadVideoarr = [];
        
        var downloadedarr = [];
        if(typeof(localStorage.downloadingProduct)!='undefined'){
          var local_downedarr = JSON.parse(localStorage.downloadingProduct);
          if(local_downedarr.hasOwnProperty(productid)){
            downloadedarr = local_downedarr[productid];
            var len = downloadedarr.length;
            if(len > 0){
              for(var i in downloadedarr){
                var index = storageDownload[productid].indexOf(downloadedarr[i]);
                if(index<0){
                  storageDownload[productid].push(downloadedarr[i]);
                }
              }
            }
          }
        }

        var downloadstr = JSON.stringify(storageDownload);
        localStorage.downloadingProduct = downloadstr;
        for(var i in $scope.downloadPath){
          if ($scope.downloadPath.hasOwnProperty(i)) {
            console.log(i+'-'+$scope.downloadPath[i]);
            downloadSingleVideo(i,$scope.downloadPath[i]);
          }
        }
        $scope.downloadPath = {};
        d_obj = {};
    };

    var activedownload = [];
    var downloadProgress = {};
    var downloadShow = [];
    var trashShow = [];
    var progressShow = [];

    $scope.activedownload = activedownload;
    $scope.downloadProgress = downloadProgress;
    $scope.downloadShow = downloadShow;
    $scope.trashShow = trashShow;
    $scope.progressShow = progressShow;

    var downloadSingleVideo = function(itemId,vpath){
        console.log('downloadSingleVideo');
        var productid = $scope.productid;
        //alert(itemId+'-'+vpath);
        activedownload[itemId] = true;
        $scope.activedownload = activedownload;
            progressShow[itemId] = true;
            $scope.progressShow = progressShow;
            $ionicPlatform.ready(function() {
                var url = vpath;
                if (!/\.\w+$/.test(url)) {
                  Websites.showMessage($ionicLoading,'视频地址不正确！');
                  return;
                }
                var video_ext = RegExp['$&'];
                //var fileURL = window.storeRoot + '/Video/' + window.courseid + '/' + id + video_ext;
                if (ionic.Platform.isIOS()) {
                    var targetPath = cordova.file.documentsDirectory + '/mynep/Video/' + productid + '/' + itemId + video_ext;
                }else if (ionic.Platform.isAndroid()) {
                    var targetPath = cordova.file.externalRootDirectory + '/mynep/Video/' + productid + '/' + itemId + video_ext;
                }
                
                var trustHosts = true;
                var options = {};
                //alert(url+'-'+targetPath);
                $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
                  .then(function(result) {
                    // Success!
                    // console.log("result : " + JSON.stringify(result));
                      progressShow[itemId] = false;  
                      activedownload[itemId] = false;
                      trashShow[itemId] = true
                      $scope.progressShow = progressShow;
                      $scope.trashShow = trashShow;
                      $scope.activedownload = activedownload;
                      //
                      //$rootScope.$broadcast('downloadingVideo');
                  }, function(err) {
                      //alert("download error source " + err.source);
                      //alert("download error target " + err.target);
                      alert("download error code" + err.code);
                  }, function (progress) {
                    $timeout(function () {
                      percent = (progress.loaded / progress.total) * 100;
                      percent = parseInt(percent);
                      $scope.downloadProgress[itemId] = percent;
                      
                      if(percent == 100){
                        //删除localstorage中的视频下载item
                        deleteDownloadingLocalstorage(itemId,productid);
                        addDownloadedLocalstorage(itemId,productid);
                        setVideoLocalstorage(itemId,targetPath);
                        $rootScope.$broadcast('changeloadstatus');
                        return;
                      }
                    });
                  });
            });

            $scope.$watch('downloadProgress', function (newValue, oldValue) {
                if (newValue !== oldValue) Websites.setdownloadProgress(newValue);
            },true);
    };

    var downloadSingleVideo_demo = function(itemId,vpath){
        console.log('downloadSingleVideo');
        var productid = $scope.productid;
        //alert(itemId+'-'+vpath);
        activedownload[itemId] = true;
        $scope.activedownload = activedownload;
            progressShow[itemId] = true;
            $scope.progressShow = progressShow;
            $ionicPlatform.ready(function() {
                var url = vpath;
                if (!/\.\w+$/.test(url)) {
                  Websites.showMessage($ionicLoading,'视频地址不正确！');
                  return;
                }
                var video_ext = RegExp['$&'];
                //var fileURL = window.storeRoot + '/Video/' + window.courseid + '/' + id + video_ext;
                if (ionic.Platform.isIOS()) {
                    var targetPath =  '/mynep/Video/' + productid + '/' + itemId + video_ext;
                }else if (ionic.Platform.isAndroid()) {
                    var targetPath =  '/mynep/Video/' + productid + '/' + itemId + video_ext;
                }
                
                var trustHosts = true;
                var options = {};  


                  var rate = 1;
                  $timeout(function progresspp() {
                      //$scope.downloadProgress = (progress.loaded / progress.total) * 100;
                      if(rate<100){
                        rate++;
                        $scope.downloadProgress[itemId] = rate;
                        $timeout(progresspp,500);
                      }else{
                        deleteDownloadingLocalstorage(itemId,productid);
                        addDownloadedLocalstorage(itemId,productid);
                        setVideoLocalstorage(itemId,targetPath);
                        $rootScope.$broadcast('changeloadstatus');
                        //$rootScope.$broadcast('setdownloadnum');
                        return;
                      }
                  },500);
            });

            $scope.$watch('downloadProgress', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                  //console.log($scope.downloadProgress);
                  Websites.setdownloadProgress(newValue);
                }
            },true);
    };

    var deleteDownloadingLocalstorage = function(itemId,productid){
      var itemId = parseInt(itemId);
      var local_downingarr = JSON.parse(localStorage.downloadingProduct);
      var downloadedarr = local_downingarr[productid];
      var index = downloadedarr.indexOf(itemId);
      if(index>-1){
        console.log(itemId);
        downloadedarr.splice(index,1);
      }
      //var storageDownload = {};
      if(downloadedarr.length == 0){
        delete local_downingarr[productid];       
      }else{
        local_downingarr[productid] = downloadedarr;
      }
      var downloadstr = JSON.stringify(local_downingarr);
      localStorage.downloadingProduct = downloadstr;
    };


    var addDownloadedLocalstorage = function(itemId,productid){
      var itemId = parseInt(itemId);
      var local_downedarr = {};
      var downloadedarr = [];
      if(typeof(localStorage.downloadedProduct)!='undefined'){
        local_downedarr = JSON.parse(localStorage.downloadedProduct);
        downloadedarr = local_downedarr[productid];
        var index = downloadedarr.indexOf(itemId);
        if(index<0){
          downloadedarr.push(itemId);
        }
      }else{
        console.log(itemId);
        downloadedarr.push(itemId);
      }
      local_downedarr[productid] = downloadedarr;
      var downloadstr = JSON.stringify(local_downedarr);
      localStorage.downloadedProduct = downloadstr;
    };

    var setVideoLocalstorage = function(itemId,vpath){
      localStorage.setItem('offline_'+itemId,vpath);
    };
 
}])

//课程绑定码
.controller('CodeCtrl', function($scope,Websites,$state,$ionicLoading,$timeout,$ionicSideMenuDelegate) {
  //侧滑栏关闭
  $scope.$on('$ionicView.enter', function(){
    $ionicSideMenuDelegate.canDragContent(false);
  });
  //侧滑栏开启
  $scope.$on('$ionicView.leave', function(){
    $ionicSideMenuDelegate.canDragContent(true);
  });
  $scope.code = {'text':''};
  $scope.binding = function(){
    console.log($scope.code.text.length);
	var ccode = $scope.code.text;
	if (ccode && /\w{20}/.test(ccode)) {
      console.log($scope.code);
      Websites.bindCode($scope,ccode).success(function(data){
        if (data.flag) {
          $scope.codeSuccess('绑定成功');
		  $scope.code = {'text':''};
        }else{
          $scope.showMessage(data.error);
        }
      })
    }else{
      $scope.showMessage('绑定码格式不对');
    }
  }
  $scope.showMessage = function(title){
    $ionicLoading.show({
      template: title
    });
    $timeout(function() {
      $ionicLoading.hide();
    }, 1000);
  }
  $scope.codeSuccess = function(title){
    $ionicLoading.show({
      template: title
    });
    $timeout(function() {
      $ionicLoading.hide();
      $state.go('tab.account');
    }, 1000);
  }

})
//Sam  ----  离线换存 下载页面
.controller('DownloadCtrl', function($scope,$http,Websites,$ionicLoading,$ionicViewSwitcher,$ionicHistory,$state,$ionicSideMenuDelegate) {
  //侧滑栏关闭
  $scope.$on('$ionicView.enter', function(){
    $ionicSideMenuDelegate.canDragContent(false);
  });
  //侧滑栏开启
  $scope.$on('$ionicView.leave', function(){
    $ionicSideMenuDelegate.canDragContent(true);
  });
  //强制显示返回button，默认情况下tabs里面独立页面不显示back button
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
      viewData.enableBack = true;
  });

  if (localStorage.haslogin != 1) {
      $state.go("tab.usercenter");
      return;
  }else{
    //localStorage.catId = catId
    if(typeof(localStorage.downloadingProduct) != 'undefined')
      var loadingvideo = JSON.parse(localStorage.downloadingProduct);
    if(typeof(localStorage.downloadedProduct) != 'undefined')
      var loadedvideo = JSON.parse(localStorage.downloadedProduct);
    
    var p_id = [];
    var item_id = [];
    for(var k in loadingvideo){
      p_id.push(k);
      for(var a in loadingvideo[k]){
        item_id.push(loadingvideo[k][a]);
      }
    }
    for(var k in loadedvideo){
      p_id.push(k);
    }
    console.log(p_id);
    console.log(item_id);
    var p_len = p_id.length;
    if(p_len > 0){
      Websites.getItemname($scope,p_id,item_id).success(function(data){
        $scope.loaded = loadedvideo;
        $scope.loading = loadingvideo;
        if(angular.isDefined(loadingvideo)){
        if(loadingvideo.length==0){
            $scope.emptytext1 = "没有下载完毕的视频";
          }
        }
        if(angular.isDefined(loadedvideo)){
          if(loadedvideo.length==0){
            $scope.emptytext2 = "没有下载中的视频";
          }
        }
      });
    }else{
      $scope.emptytext1 = "没有下载完毕的视频";
      $scope.emptytext2 = "没有下载中的视频";
    }
  }
  
  $scope.$watch(function () { return Websites.getdownloadProgress(); }, function (newValue, oldValue) {
        if (newValue !== oldValue) {
          $scope.downloadProgress = newValue;
        }
    }, true);

  $scope.$on('changeloadstatus',function(){
      $scope.loaded = JSON.parse(localStorage.downloadedProduct);
      $scope.loading = JSON.parse(localStorage.downloadingProduct);
  });

  $scope.process = function(itemid){
    var str = 0;
    if(angular.isDefined($scope.downloadProgress) && angular.isDefined($scope.item[itemid])){
      var size = $scope.item[itemid]['size'];
      str = size*$scope.downloadProgress[itemid]/100;
    }
    return str;
  }
})

//Sam  ----  离线换存 二级页面
.controller('DlsecpageCtrl', function($scope,$http,Websites,$ionicLoading,$ionicHistory,$state,$stateParams,$cordovaFile,$ionicSideMenuDelegate,$ionicPopup) {
  //侧滑栏关闭
  $scope.$on('$ionicView.enter', function(){
    $ionicSideMenuDelegate.canDragContent(false);
  });
  //侧滑栏开启
  $scope.$on('$ionicView.leave', function(){
    $ionicSideMenuDelegate.canDragContent(true);
  });
  //强制显示返回button，默认情况下tabs里面独立页面不显示back button
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
      viewData.enableBack = true;
  });
  var item_id = [];
  if(typeof(localStorage.downloadedProduct) != 'undefined'){
    var loadedvideo = JSON.parse(localStorage.downloadedProduct);
    item_id = loadedvideo[$stateParams.id];
  }
    
  $scope.productid = $stateParams.id;
  Websites.getLoadedVideo($scope,$stateParams.id,item_id).success(function(data){
    var loaded = JSON.parse(localStorage.downloadedProduct);
    $scope.loaded = loaded[$stateParams.id];
    $scope.title = data.title;
  });
  //删除视频
  $scope.onItemDelete = function(itemid){

    var confirmPopup = $ionicPopup.confirm({
            title: '确认删除？',
            buttons: [{ //Array[Object] (可选)。放在弹窗footer内的按钮。
              text: '否',
            }, {
              text: '是',
              type: 'button-calm',
              onTap: function(e) {
                // 返回的值会导致处理给定的值。
                return true;
              }
            }]
        });
        confirmPopup.then(function(res) {          
          if(res){
            $ionicLoading.show({
              template: '正在删除...'
            });
            var video_ext = '.mp4';
            var filename = itemid + video_ext;
            if (ionic.Platform.isIOS()) {
              var targetPath = cordova.file.documentsDirectory + '/mynep/Video/' + $stateParams.id + '/';
            }else if (ionic.Platform.isAndroid()) {
              var targetPath = cordova.file.externalRootDirectory + '/mynep/Video/' + $stateParams.id + '/';
            }
            alert(targetPath+filename);
            $cordovaFile.removeFile(targetPath,filename)
            .then(function (success) {
              // success
              deleteDownloadedLocalstorage(itemid,$stateParams.id);
              var loaded = JSON.parse(localStorage.downloadedProduct);
              $scope.loaded = loaded[$stateParams.id];
              $scope.$apply();
              Websites.showMessage($ionicLoading,'删除成功..');
            }, function (error) {
              // error
              alert("download error code" + error.code);
              Websites.showMessage($ionicLoading,'删除失败..');
            });
              /*deleteDownloadedLocalstorage(itemid,$stateParams.id);
              var loaded = JSON.parse(localStorage.downloadedProduct);
              $scope.loaded = loaded[$stateParams.id];
              $scope.$apply();
              Websites.showMessage($ionicLoading,'删除成功..');*/           
          }        

    });

  }

  var deleteDownloadedLocalstorage = function(itemId,productid){
      //var deferred = $q.defer();
      var itemId = parseInt(itemId);
      var local_downingarr = JSON.parse(localStorage.downloadedProduct);
      var downloadedarr = local_downingarr[productid];
      var index = downloadedarr.indexOf(itemId);
      if(index>-1){
        console.log(itemId);
        downloadedarr.splice(index,1);
      }
      if(downloadedarr.length == 0){
        delete local_downingarr[productid];       
      }else{
        local_downingarr[productid] = downloadedarr;
      }
      var downloadstr = JSON.stringify(local_downingarr);
      localStorage.downloadedProduct = downloadstr;

      localStorage.removeItem('offline_'+itemId);
  };

});
