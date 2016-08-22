angular.module('mynepapp.coursecontrollers', [])

.controller('CouresCtrl', ['$scope', '$http', 'Websites', '$stateParams', '$ionicPopup', '$ionicLoading', '$ionicHistory', '$state',  '$timeout', '$cordovaFileTransfer', '$ionicPlatform', '$ionicModal', '$ionicSideMenuDelegate' ,function($scope, $http, Websites, $stateParams, $ionicPopup, $ionicLoading, $ionicHistory, $state,$timeout,$cordovaFileTransfer,$ionicPlatform,$ionicModal,$ionicSideMenuDelegate){
    /*$ionicLoading.show({
        template: '数据加载中...'
    });*/
    // var courseid = $stateParams.courseid;
    // courseid = typeof(courseid) == 'undefined'?'0':courseid;
    // console.log(courseid);

    //控制内容页高度
    var courseid = $stateParams.courseid;

    $scope.grid_height = {height:''+document.body.offsetHeight*0.7-104+'px'};
    var productid = $stateParams.productid;
    productid = typeof(productid) == 'undefined'?'0':productid;
    console.log(productid);
    $scope.productid = productid;
    $scope.userid = window.localStorage['userid'];


  //播放器id的后缀
  $scope.jpcid = 'jp_container_' + new Date().getTime();
  $scope.istry = true;

    $scope.input = {};

   
    // $scope.courseid = courseid;
    //var course_dtd = Websites.CourseData($scope);
    $scope.joinpanel = true;
    var course_dtd = Websites.directoryData($scope);
    //强制显示返回button，默认情况下tabs里面独立页面不显示back button
    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
      console.log('cache');
      viewData.enableBack = true;
      course_dtd.success(function(){
        if (!$scope.citemid) return;
          //播放器初始化
          //Job.proxyUrl = ENV.proxyUrl;
          Job.proxyUrl = ENV.apiUrl + 'course/proxy';
          var jpcid = $scope.jpcid;
          setTimeout(function initp() {
          var p = document.getElementById(jpcid);
          if (p) {
            Job.init_player(jpcid, {config: ENV.apiUrl + 'course/startupxml2?courseid='+$scope.ccourseid+'&itemid='+$scope.citemid}, $scope.citemid);
            Job.on('nextVideo', function() {
				var next_itemid = $scope.get_next_itemid();
				if (!next_itemid) {
				  Websites.showMessage($ionicLoading,'已到本课程试看的最后一节');
				  return;
				}
				$scope.setActive(next_itemid,0,$scope.ccourseid,1);
            });
            return;
          }
          setTimeout(initp, 50);
          }, 50);

          }).error(function(data){
            //加载失败
            $ionicLoading.hide();
          })
        $ionicSideMenuDelegate.canDragContent(false);
    });

	//获取下一个视频ID
	$scope.get_next_itemid = function() {
		var next_itemid = null;
		for (var i=0; i<$scope.courses.length; i++) {
		  if ($scope.courses[i].id != $scope.ccourseid) continue;
		  var items = $scope.courses[i].items;
		  var cflag = false;
		  for (var j=0; j<items.length; j++) {
			if (cflag) {
			  if (items[j].vtype != 0 || !items[j]['try']) continue;
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
    //返回的动画效果，默认情况下强制显示的返回button无动画效果
    $scope.$on('$ionicView.beforeLeave', function (event, viewData) {
	     //销毁播放器
	     Job.destroy();
       $ionicSideMenuDelegate.canDragContent(true);
    });
    
    $scope.gotoaccount = function() {
      console.log('backvideo');
      $ionicHistory.goBack();
      Job.destroy();
      //Job.player.pause();
      //$state.go('tab.home');
    };
    
    $scope.toJoinCourse = function() {
        if(localStorage.haslogin == 1){
            
                Job.destroy();
                $state.go('coursepay',{productid:$scope.productid});
                
            
        }else{
            var confirmPopup = $ionicPopup.confirm({
               title: '',
               template: '匿名用户无法参加课程，请登录',
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

	$scope.viewCourse = function() {
		$state.go('coursenote',{productid:$scope.productid});
	};
  
  $scope.haslogin = localStorage.haslogin;
  $scope.favorites = 0;
  if(localStorage.haslogin == 1){
      Websites.getcollection($scope);

  }

    //目录数据
    //设置课程模块
  /*Websites.directoryData($scope).success(function(data) {
      //$ionicLoading.hide();
	  if (!$scope.citemid) return;
	  //播放器初始化
	  //Job.proxyUrl = ENV.proxyUrl;
	  Job.proxyUrl = ENV.apiUrl + 'course/proxy';
	  var jpcid = $scope.jpcid;
	  setTimeout(function initp() {
		var p = document.getElementById(jpcid);
		if (p) {
		  Job.init_player(jpcid, {config: ENV.apiUrl + 'course/startupxml2?courseid='+$scope.ccourseid+'&itemid='+$scope.citemid}, $scope.citemid);
		  Job.on('nextVideo', function() {
		  	var next_itemid = null;
			for (var i=0; i<$scope.courses.length; i++) {
				if ($scope.courses[i].id != $scope.ccourseid) continue;
				var items = $scope.courses[i].items;
				var cflag = false;
				for (var j=0; j<items.length; j++) {
					if (cflag) {
						if (items[j].vtype != 0 || !items[j]['try']) continue;
						next_itemid = items[j].itemid;
						break;
					}
					if (items[j].itemid != $scope.citemid) continue;
					cflag = true;
				}
				break;
			}
			if (!next_itemid) {
				Websites.showMessage($ionicLoading,'已到本课程试看的最后一节');
				return;
			}
			$scope.setActive(next_itemid,0,$scope.ccourseid,1);
		  });
		  return;
		}
		setTimeout(initp, 50);
	  }, 50);

    }).error(function(data){
      //加载失败
      $ionicLoading.hide();
  });*/
  
    
    /**
     * 切换课件
     * @param {[type]} menuItem [description]
     */
    $scope.setActive = function(itemid,vtype,courseid,trysee) {
      if(trysee == 1){
		  if(vtype == 0){
					var courseData = $scope.courseData;
					if (itemid != $scope.citemid) {
						$scope.citemid = itemid;
						$scope.ccourseid = courseid;
						console.log(itemid, courseid);
						//Job.changeVideo(ENV.postUrl2 + 'courseid/'+courseData.id+'/itemid/'+menuItem+'/userid/'+$scope.userid, menuItem);
						Job.changeVideo(ENV.apiUrl + 'course/startupxml2?courseid='+courseid+'&itemid='+itemid, itemid);
						//courseData.itemid = menuItem;
					}
			}else{
				Websites.showMessage($ionicLoading,'本课件不是单屏课件，无法观看');
			}
        }else{
            Websites.showMessage($ionicLoading,'本课件不可预览，请购买课程');
        }
    };


    /**
     * 保存下载列表
     * @param {[type]} menuItem [description]
     */
    $scope.downloadVideoarr = [];
    $scope.setDownload = function(menuItem,selected) {
        console.log(selected);
        //selected=!selected;
        var len = 0;
        var index = $scope.downloadVideoarr.indexOf(menuItem);
        //if(selected){
            if(index<0){
              len = $scope.downloadVideoarr.push(menuItem);
            }
        //}else{
            //var index = $scope.downloadVideoarr.indexOf(menuItem);
            if(index>-1){
                $scope.downloadVideoarr.splice(index,1);
            }
            
        //}
        len = $scope.downloadVideoarr.length;
        $scope.len = len;
        //$scope.downloadVideoarr = downloadVideoarr;
        //console.log(downloadVideoarr);
        $scope.cselected = selected;
    };

    /**
     * 全选
     * @return {[type]} [description]
     */
    $scope.selectAll = function(all){
      var downloadVideoarr = [];
      if(all){
        $scope.selected = true;
        var len = 0;        
        for(i in $scope.courses){
            for(ii in $scope.courses[i].items){
                len = downloadVideoarr.push($scope.courses[i].items[ii].itemid);
            }
        }
        $scope.len = len;
      }else{
        $scope.selected = false;
        $scope.len = 0;
      }
      $scope.downloadVideoarr = downloadVideoarr;
      //console.log(downloadVideoarr);
    };

    /**
     * 下载视频
     * @return {[type]} [description]
     */
    $scope.downloadMultiVideo = function(){
        console.log($scope.downloadVideoarr);
    };

    /**
     * 下载课件视频
     * @param  {[type]} itemId [description]
     * @return {[type]}        [description]
     */
    //$scope.progressShow = false;
    //$scope.downloadShow = true;
    //$scope.trashShow = false;
    
    var activedownload = [];
    var downloadProgress = [];
    var downloadShow = [];
    var trashShow = [];
    var progressShow = [];

    $scope.activedownload = activedownload;
    $scope.downloadProgress = downloadProgress;
    $scope.downloadShow = downloadShow;
    $scope.trashShow = trashShow;
    $scope.progressShow = progressShow;

    $scope.downloadVideo = function(itemId,vpath) {
        console.log(itemId+vpath);
        activedownload[itemId] = true;
        $scope.activedownload = activedownload;
        if($scope.courseData.free == 1){
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
                    var targetPath = cordova.file.documentsDirectory + '/Video/' + $scope.courseid + '/' + itemId + video_ext;
                }else if (ionic.Platform.isAndroid()) {
                    var targetPath = cordova.file.externalRootDirectory + '/Video/' + $scope.courseid + '/' + itemId + video_ext;
                }
                
                var trustHosts = true;
                var options = {};

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
                  }, function(err) {
                    // Error
                  }, function (progress) {
                    $timeout(function () {
                      $scope.downloadProgress = (progress.loaded / progress.total) * 100;
                    });
                  });
            });
            
            /*var rate = 1;
            $timeout(function progresspp() {
                //$scope.downloadProgress = (progress.loaded / progress.total) * 100;
                if(rate<100){
                  rate++;
                  downloadProgress[itemId] = rate;
                  $scope.downloadProgress = downloadProgress;
                  $timeout(progresspp,50);
                }else{
                  progressShow[itemId] = false;  
                  activedownload[itemId] = false;
                  trashShow[itemId] = true
                  $scope.progressShow = progressShow;
                  $scope.trashShow = trashShow;
                  $scope.activedownload = activedownload;
                  return;
                }
            },50);*/
        }else{
            Websites.showMessage($ionicLoading,'本课件不可下载，请参加课程');
        }
    };



    /*
    Websites.resumeData($scope).success(function(data) {
      //$ionicLoading.hide();
    }).error(function(data){
      //加载失败
    });
    */

	//常见问题现在为产品的一个字段
    
    Websites.discussData($scope).success(function(data) {
      //$ionicLoading.hide();
    }).error(function(data){
      //加载失败
    });
    

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
        
        if(localStorage.haslogin == 1){
          /*$http.jsonp(ENV.apiUrl + 'mobileusercenter/checkbuyed?callback=JSON_CALLBACK&access-token='+localStorage.access_token+'&productid='+$scope.productid)
          .then(function(res){
              console.log('suc');
              if(res.responseData == 1){
                $scope.modal.show();
                $scope.selected = false;
                $scope.selectallv = false;
              }                
          })*/
              var confirmPopup = $ionicPopup.confirm({
               title: '',
               template: '用户未购买无法下载课程，请购买',
               cssClass: 'comfirmText',
               buttons: [
                { text: '再看看' },
                {
                  text: '立即购买',
                  type: 'button-calm',
                  onTap: function(e) {
                      $state.go('coursepay',{productid:$scope.productid});
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
    }

    /**
     * 收藏课程
     * @return {[type]} [description]
     */
    $scope.toFavorites=function(productid) {
        if(localStorage.haslogin == 1){
            console.log('toFavorites');
            var favorites = 1 - $scope.favorites;
            var msg = favorites == 1 ? '收藏成功': '取消收藏';
            $scope.favorites = favorites;
            console.log('favorites'+favorites);
            Websites.dealcollection($scope,productid,favorites).success(function(){
              Websites.showMessage($ionicLoading,msg);
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
     * 分享课程
     * @return {[type]} [description]
     */
    $scope.toShare=function() {
        console.log('toShare');
        if(typeof(Wechat) == 'undefined') {
            alert('Wechat is not defined');
            return;
        }
        Wechat.share({
            message: {
                title: "Hi, there",
                description: "This is description.",
                thumb: "http://d2okfajvs3iw45.cloudfront.net/post/image_1458214021645.jpg",
                media: {
                    type: Wechat.Type.WEBPAGE,
                    webpageUrl: "http://tech.qq.com/zt2012/tmtdecode/252.htm"
                }
            },
            scene: Wechat.Scene.TIMELINE   // share to Timeline
        }, function () {
            alert("Success");
        }, function (reason) {
            alert("Failed: " + reason);
        });
    };

}])

.controller('CouresCtrldirectory', ['$scope', 'Websites', '$stateParams', '$ionicLoading', '$ionicHistory', '$state', function($scope, Websites, $stateParams, $ionicLoading, $ionicHistory, $state){
    var courseid = $stateParams.courseid;
    courseid = typeof(courseid) == 'undefined'?'0':courseid;
    console.log(courseid);

    //强制显示返回button，默认情况下tabs里面独立页面不显示back button
    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        viewData.enableBack = true;
    });
    $scope.gotoaccount = function() {
      console.log('back');
      $ionicHistory.goBack();
      //$state.go('tab.home');
    };

    //目录数据
    //设置课程模块
    $scope.courseid = courseid;
    Websites.directoryData($scope).success(function(data) {
      //$ionicLoading.hide();
    }).error(function(data){
      //加载失败
      $ionicLoading.hide();
    });
  
    
    /**
     * 切换课件
     * @param {[type]} menuItem [description]
     */
    /*$scope.setActive = function(menuItem) {
        $scope.activeMenu = menuItem
        console.log(menuItem);
    };*/

    /**
     * 下载课件视频
     * @param  {[type]} itemId [description]
     * @return {[type]}        [description]
     */
    $scope.downloadVideo = function(itemId) {
        console.log(itemId);
    };



    Websites.resumeData($scope).success(function(data) {
      //$ionicLoading.hide();
    }).error(function(data){
      //加载失败
      $ionicLoading.hide();
    });

    Websites.discussData($scope).success(function(data) {
      //$ionicLoading.hide();
    }).error(function(data){
      //加载失败
      $ionicLoading.hide();
    });

}])

.controller('PayCtrl', ['$scope', '$stateParams', 'Websites', '$ionicHistory', function($scope,$stateParams,Websites,$ionicHistory){
    var productid = $stateParams.productid;
    console.log($stateParams);
    productid = typeof(productid) == 'undefined'?'0':productid;
    console.log(productid);
    $scope.productid = productid;

    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        viewData.enableBack = true;
    });


    if (localStorage.haslogin != 1) {
      $state.go("tab.usercenter");
      return;
    }else{
      Websites.getSelectedAddress($scope).success(function(data) {
        //$ionicLoading.hide();
        $scope.selectedaddress = data.responseData[0];
        console.log($scope.selectedaddress);
      }).error(function(data){
        //加载失败
        console.log('fail');
        // $ionicLoading.hide();
      });
    }



    Websites.CourseData($scope);

    $scope.data = {'payway':'alipay'};
    $scope.selectPay = function() {
        var howpay = $scope.data.payway;
        console.log($scope.data.payway);
        
    };

    /**
     * 提交订单
     * @return {[type]} [description]
     */
    $scope.submitOrder = function(){
      $ionicHistory.clearCache(['tab.order']);
      var addressid = $scope.selectedaddress['id'];
      console.log(addressid);
      console.log(typeof(productid));
      Websites.sendOrder($scope,addressid,productid);
      var howpay = $scope.data.payway;
      alert(howpay);
      if(howpay == 'alipay'){
            
            /*if (!job.alipay) {
                alert('job is not defined');
                return;
            }
            var notifyUrl = location.origin;
            var tradeNo = '34234234234234233244';
            var alipay = job.alipay;
            alipay.pay({
                "seller" : "huangyx@justep.com", // 卖家支付宝账号或对应的支付宝唯一用户号
                "subject" : "x5外卖", // 商品名称
                "body" : "x5外卖", // 商品详情
                "price" : "0.01", // 金额，单位为RMB
                "tradeNo" : tradeNo, // 唯一订单号
                "timeout" : "30m", // 超时设置
                "notifyUrl" : notifyUrl
            }, // 服务器通知路径
            function(message) {
                //var responseCode = parseInt(message);
                alert(message);
            }, function(msg) {
                
                alert(msg);
            });*/
            if(!window.alipay) {
                alert('alipay is not defined');
                return;
            }

            window.alipay.pay({
                tradeNo: new Date().getTime(),
                subject: "测试标题",
                body: "我是测试内容",
                price: 0.02,
                notifyUrl: "http://your.server.notify.url"
            }, 
            function(successResults){alert(successResults)}, 
            function(errorResults){alert(errorResults)});
            
        }else if(howpay == 'wxpay'){
            //alert('wxpay');
            /*if (!navigator.weixin) {
                //payDtd.reject(-13);
                return;
            }
            var notifyUrl = location.origin;
            var traceID = '11233123';
            var traceNo = 'asdfasdfasdd';

            var weixin = navigator.weixin;
            weixin.generatePrepayId({
                "body" : "x5外卖",
                "feeType" : "1",
                "notifyUrl" : notifyUrl,
                "totalFee" : "1",
                "traceId" : traceID,
                "tradeNo" : traceNo
            }, function(prepayId) {
                weixin.sendPayReq(prepayId, function(message) {
                    var responseCode = parseInt(message);
                    alert("成功");
                }, function(message) {
                    justep.Util.hint("微信支付失败1！");
                    payDtd.reject(-10);
                });
            }, function(message) {
                justep.Util.hint("微信支付失败2！");
            });*/
            Websites.getWxpayParams($scope).success(function(data){
              var params = $scope.wxparams;
              alert(params.prepayid);
              //console.log(params);
              if(typeof(Wechat) == 'undefined') {
                  alert('Wechat is not defined');
                  return;
              }
              
              Wechat.sendPaymentRequest(params, function () {
                  alert("Success");
              }, function (reason) {
                  alert("Failed: " + reason);
              });
            });
            //console.log($scope.wxparams);

            /*if(!Wechat) {
                alert('weixin is not defined');
                return;
            }

            Wechat.sendPaymentRequest(params, function () {
                alert("Success");
            }, function (reason) {
                alert("Failed: " + reason);
            });*/

            /*var params = {
                partnerid: '1260525001', // merchant id
                prepayid: 'wx201411101639507cbf6ffd8b0779950877', // prepay id
                noncestr: '1add1a30ac87aa2db72f57a2375d8fec', // nonce
                timestamp: '1439531364', // timestamp
                sign: '95F0C0BCE9FA25BD605EDB7E25FD7A96', // signed string
            };*/

            
        }
    }
}])

.controller('CouresCtrlresume', ['$scope', 'Websites', '$stateParams', '$ionicLoading', '$ionicHistory', '$state', function($scope, Websites, $stateParams, $ionicLoading, $ionicHistory, $state){

    var courseid = $stateParams.courseid;
    courseid = typeof(courseid) == 'undefined'?'0':courseid;
    console.log(courseid);

    //强制显示返回button，默认情况下tabs里面独立页面不显示back button
    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        viewData.enableBack = true;
    });
    $scope.gotoaccount = function() {
      console.log('back');
      $ionicHistory.goBack();
      //$state.go('tab.home');
    };

    //目录数据
    //设置课程模块
    $scope.courseid = courseid;
    Websites.resumeData($scope).success(function(data) {
      //$ionicLoading.hide();
    }).error(function(data){
      //加载失败
      $ionicLoading.hide();
    });
}])

.controller('CouresCtrldiscuss', ['$scope', 'Websites', '$stateParams', '$ionicLoading', '$ionicHistory', '$state', function($scope, Websites, $stateParams, $ionicLoading, $ionicHistory, $state,$ionicViewSwitcher){
    var courseid = $stateParams.courseid;
    courseid = typeof(courseid) == 'undefined'?'0':courseid;
    console.log(courseid);

    //强制显示返回button，默认情况下tabs里面独立页面不显示back button
    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        viewData.enableBack = true;
    });
    $scope.gotoaccount = function() {
      console.log('back');
      $ionicHistory.goBack();
      //$state.go('tab.home');
    };

    //目录数据
    //设置课程模块
    $scope.courseid = courseid;
    Websites.discussData($scope).success(function(data) {
      //$ionicLoading.hide();
    }).error(function(data){
      //加载失败
      $ionicLoading.hide();
    });
}])
