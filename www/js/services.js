angular.module('mynepapp.services', [])

.factory('Websites', function ($q,$http){
    var data = {
        percent : 0
    };

return {
    /**
     * [indexData 得到首页课程数据]
     * @param  {[type]} $scope [description]
     * @return {[type]}        [description]
     */
    indexData: function($scope,catId) {
        var d = $q.defer();
        var promise = d.promise;
        //catId = $scope.catId;
        $http.jsonp(ENV.apiUrl + 'course/indexcourse?catId='+catId+'&callback=JSON_CALLBACK',{timeout:10000})
            .success(function(data) {
                $scope.homeData = data.responseData;
                /*$scope.homeData[0]['address'] = 'applycourse';
                $scope.homeData[1]['address'] = 'coursepage';
                $scope.homeData[2]['address'] = 'applycourse';*/
                //console.log($scope.homeData[0]['id']);
                d.resolve(data);
            })
            .error(function(error) {
                d.reject(error);
            });
            
        promise.success = function(fn) {
            promise.then(fn);
            $scope.canrun = 1;
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            $scope.canrun = 0;
            return promise;
        }
        //return d.promise.$$state.status
        return d.promise;
    },

    /**
     * [getBanner 得到首页banner条数据]
     * @param  {[type]} $scope [description]
     * @return {[type]}        [description]
     */
    getBanner: function($scope) {
      var d = $q.defer();
      var promise = d.promise;
      $http.jsonp(ENV.apiUrl + 'course/lunbo?callback=JSON_CALLBACK')
            .success(function(data) {
                $scope.bannerData = data.responseData;
                d.resolve(data);
            })
            .error(function(error) {
                d.reject(error);
            });

        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }

        return d.promise;
    },

    
    /**
     * [bindCode 绑定课程码]
     * @param  {[type]} $scope [description]
     * @return {[type]}        [description]
     */
    bindCode: function($scope,code) {
        var d = $q.defer();
        var promise = d.promise;
        $http.jsonp(ENV.apiUrl + 'course/bindcode?access-token='+localStorage.access_token+'&code='+code+'&callback=JSON_CALLBACK')
            .success(function(data) {
                d.resolve(data);
            })
            .error(function(error) {
                d.reject(error);
            });

        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }

        return d.promise;
    },
    /**
     * [getCourseBykey 得到全部课程页面数据]
     * @param  {[type]} $scope [description]
     * @return {[type]}        [description]
     */
    getCourseBykey: function($scope,keywords) {
        var d = $q.defer();
        var promise = d.promise;
        $http.jsonp(ENV.apiUrl + 'mobilecourse/getcoursebykeywords?keywords='+keywords+'&callback=JSON_CALLBACK')
            .success(function(data) {
                $scope.resultlist = data.responseData;
                d.resolve(data);
            })
            .error(function(error) {
                d.reject(error);
            });

        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }

        return d.promise;
    },
    
    /**
     * [getUserDetail 根据课程类型，获取对应所有课程]
     * @param  {[type_id]} $scope [description]
     * @return {[type]}        [description]
     */
    getUserDetail: function($scope,userid) {
        var d = $q.defer();
        var promise = d.promise;
        $http.jsonp(ENV.apiUrl + 'mobileadmin/userdetail?stu_id='+userid+'&callback=JSON_CALLBACK')
            .success(function(data) {
                $scope.userdetail = data;
                d.resolve(data);
            })
            .error(function(error) {
                d.reject(error);
            });

        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }

        return d.promise;
    },
    
    /**
     * 得到新闻详细信息
     * @param  {[type]} $scope [description]
     * @return {[type]}        [description]
     */
    getQuestion: function($scope,t_id,course_id) {
       var d = $q.defer();
        var promise = d.promise;
        $http.jsonp(ENV.apiUrl +'mobilepractice/getquestion?course_id='+course_id+'&template_pageid='+t_id+'&access-token='+localStorage.access_token+'&callback=JSON_CALLBACK')
            .success(function(data) {
                d.resolve(data);
            })
            .error(function(error) {
                d.reject(error);
            });

        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }

        return d.promise; 
    },
    
    /**
     * 提交试卷
     * @param  {[type]} $scope [description]
     * @return {[type]}        [description]
     */
    getResult: function($scope,newsid) {
        var d = $q.defer();
        var promise = d.promise;
        $http.jsonp(ENV.apiUrl + "mobilepractice/examsubmit?access-token="+localStorage.access_token+"&t_id="+$scope.params.t_id+"&pageid="+$scope.params.pageid+"&callback=JSON_CALLBACK")
            .success(function(data) {
                d.resolve(data);
            })
            .error(function(error) {
                d.reject(error);
            });

        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }

        return d.promise; 
    },
    /**
     * [getAnswerlist 得到全部问答数据]
     * @param  {[type]} $scope [description]
     * @return {[type]}        [description]
     */
    getAnswerlist: function($scope) {
        var d = $q.defer();
        var promise = d.promise;
        $http.jsonp(ENV.apiUrl + 'mobileanswer/getlist?access-token='+localStorage.access_token+'&callback=JSON_CALLBACK')
            .success(function(data) {
                $scope.answerlist = data.answerlist;
				$scope.courselist = data.courselist;
                d.resolve(data);
            })
            .error(function(error) {
                d.reject(error);
            });

        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }

        return d.promise;
    },
    
    
    /**
     * [getNotelist 得到笔记]
     * @param  {[type]} $scope [description]
     * @return {[type]}        [description]
     */
    getNotelist: function($scope) {
        var d = $q.defer();
        var promise = d.promise;
        $http.jsonp(ENV.apiUrl + 'mobilenote/getlist?access-token='+localStorage.access_token+'&callback=JSON_CALLBACK')
            .success(function(data) {
                $scope.notelist = data;
				console.log($scope.notelist);
                d.resolve(data);
            })
            .error(function(error) {
                d.reject(error);
            });

        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }

        return d.promise;
    },
    /**
     * [DeleteNote 删除笔记]
     * @param  {[type]} $scope [description]
     * @return {[type]}        [description]
     */
    DeleteNote: function($scope,id) {
        var d = $q.defer();
        var promise = d.promise;
        $http.jsonp(ENV.apiUrl + 'mobilenote/delete?id='+id+'&callback=JSON_CALLBACK')
            .success(function(data) {
                d.resolve(data);
            })
            .error(function(error) {
                d.reject(error);
            });

        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }

        return d.promise;
    },
    //   Sam   错题集列表
    getErrorlist: function($scope,userid) {
      var d = $q.defer();
      var promise = d.promise
      $http.jsonp(ENV.apiUrl + 'mobileerror/getlist?access-token='+localStorage.access_token+'&callback=JSON_CALLBACK')
            .success(function(data) {
                $scope.errorlist = data.responseData;
                d.resolve(data);
            })
            .error(function(error) {
                d.reject(error);
            });

        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }

        return d.promise;
    },
    //   Sam   错题集列表
    DeleteError: function($scope,courseid,userid) {
      var d = $q.defer();
      var promise = d.promise;
      $http.jsonp(ENV.apiUrl + 'mobileerror/delete?access-token='+localStorage.access_token+'&courseid='+courseid+'&userid='+userid+'&callback=JSON_CALLBACK')
            .success(function(data) {
                d.resolve(data);
            })
            .error(function(error) {
                d.reject(error);
            });

        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }

        return d.promise;
    },
    //   Sam   错题集列表
    ErrorDetail: function($scope,courseid,typeid,userid) {
      var d = $q.defer();
      var promise = d.promise;
      $http.jsonp(ENV.apiUrl + 'mobileerror/detail?courseid='+courseid+'&typeid='+typeid+'&access-token='+localStorage.access_token+'&callback=JSON_CALLBACK')
            .success(function(data) {
                d.resolve(data);
            })
            .error(function(error) {
                d.reject(error);
            });

        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }

        return d.promise;
    },
    //   Sam  个人信息
    getUserinfo: function($scope) {
       var d = $q.defer();
        var promise = d.promise;
        $http.jsonp(ENV.apiUrl + "mobileadmin/userinfo?access-token="+localStorage.access_token+"&callback=JSON_CALLBACK")
            .success(function(data) {
                $scope.userdata = data.responseData;
                //window.localStorage['headimg'] =data.responseData[0]['content'];
                d.resolve(data);
            })
            .error(function(error) {
                d.reject(error);
            });

        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }

        return d.promise; 
    },

    //   Sam  我的课程 
    getUserCourse: function($scope) {
       var d = $q.defer();
        var promise = d.promise;
        $http.jsonp(ENV.apiUrl + "mobileclass/getusercourse?access-token="+localStorage.access_token+"&callback=JSON_CALLBACK")
            .success(function(data) {
                $scope.courselist = data.responseData;
                $scope.emptytext = '';
                d.resolve(data);
            })
            .error(function(error) {
                d.reject(error);
            });

        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }
        return d.promise; 
    },

    //   Sam  报班 
    applyCourse: function($scope,typeid) {
       var d = $q.defer();
        var promise = d.promise;
        $http.jsonp(ENV.apiUrl + "mobileclass/applycourse?access-token="+localStorage.access_token+"&typeid="+typeid+"&callback=JSON_CALLBACK")
            .success(function(data) {
                $scope.applycourse = data.responseData;
                d.resolve(data);
            })
            .error(function(error) {
                d.reject(error);
            });

        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }
        return d.promise; 
    },

    //   Sam  首页跳转课程页面
    coursePage: function($scope,typeid) {
       var d = $q.defer();
        var promise = d.promise;
        $http.jsonp(ENV.apiUrl + "mobileclass/coursepackge?access-token="+localStorage.access_token+"&typeid="+typeid+"&callback=JSON_CALLBACK")
            .success(function(data) {
                $scope.courselist = data.responseData;
                d.resolve(data);
            })
            .error(function(error) {
                d.reject(error);
            });

        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }
        return d.promise; 
    },

    //   Sam  得到地址
    getAddress: function($scope) {
       var d = $q.defer();
        var promise = d.promise;
        $http.jsonp(ENV.apiUrl + "mobileaddress/getaddress?access-token="+localStorage.access_token+"&callback=JSON_CALLBACK")
            .success(function(data) {
                // $scope.addresslist = data.responseData;
                // console.log($scope.addresslist);
                d.resolve(data);
            })
            .error(function(error) {
                d.reject(error);
            });

        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }
        return d.promise; 
    },

    //   Sam  得到要编辑的地址护具
    getEditingAddress: function($scope, id) {
       var d = $q.defer();
        var promise = d.promise;
        $http.jsonp(ENV.apiUrl + "mobileaddress/getaddress?access-token="+localStorage.access_token+"&id="+id+"&callback=JSON_CALLBACK")
            .success(function(data) {
                d.resolve(data);
            })
            .error(function(error) {
                d.reject(error);
            });

        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }
        return d.promise; 
    },

    //   Sam  得到选择地址
    getSelectedAddress: function($scope) {
       var d = $q.defer();
        var promise = d.promise;
        $http.jsonp(ENV.apiUrl + "mobileaddress/getselectedaddress?access-token="+localStorage.access_token+"&callback=JSON_CALLBACK")
            .success(function(data) {

                d.resolve(data);
            })
            .error(function(error) {
                d.reject(error);
            });

        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }
        return d.promise; 
    },

    //   Sam  设置选择地址
    editSelectedAddress: function($scope,id) {
       var d = $q.defer();
        var promise = d.promise;
        $http.jsonp(ENV.apiUrl + "mobileaddress/editselectedaddress?access-token="+localStorage.access_token+"&id="+id+"&callback=JSON_CALLBACK")
            .success(function(data) {
                console.log(id);
                d.resolve(data);
            })
            .error(function(error) {
                d.reject(error);
            });

        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }
        return d.promise; 
    },

    //   Sam  我的收藏 
    getMyCollection: function($scope) {
       var d = $q.defer();
        var promise = d.promise;
        $http.jsonp(ENV.apiUrl + "mobileusercenter/mycollection?access-token="+localStorage.access_token+"&callback=JSON_CALLBACK")
            .success(function(data) {
                $scope.applycourse = data.responseData;
                console.log($scope.applycourse);
                d.resolve(data);
            })
            .error(function(error) {
                d.reject(error);
            });

        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }
        return d.promise; 
    },

    //   Sam  我的历史 
    getMyHistory: function($scope) {
       var d = $q.defer();
        var promise = d.promise;
        $http.jsonp(ENV.apiUrl + "mobileusercenter/myhistory?access-token="+localStorage.access_token+"&productid="+localStorage.myhistory+"&callback=JSON_CALLBACK")
            .success(function(data) {
                $scope.applycourse = data.responseData;
                console.log($scope.applycourse);
                d.resolve(data);
            })
            .error(function(error) {
                d.reject(error);
            });

        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }
        return d.promise; 
    },

    //   Sam  我的课程中的答疑接口 
    getQuestionList: function($scope) {
       var d = $q.defer();
        var promise = d.promise;
        $http.jsonp(ENV.apiUrl + "mobilemycourse/getquestionlist?access-token="+localStorage.access_token+"&callback=JSON_CALLBACK")
            .success(function(data) {
                $scope.questionlist = data.responseData;
                d.resolve(data);
            })
            .error(function(error) {
                d.reject(error);
            });

        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }
        return d.promise; 
    },

    //   Sam  我的课程中的笔记接口 
    getNoteList: function($scope) {
       var d = $q.defer();
        var promise = d.promise;
        $http.jsonp(ENV.apiUrl + "mobilemycourse/getnotelist?access-token="+localStorage.access_token+"&callback=JSON_CALLBACK")
            .success(function(data) {
                $scope.notelist = data.responseData;
                console.log($scope.notelist);
                d.resolve(data);
            })
            .error(function(error) {
                d.reject(error);
            });

        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }
        return d.promise; 
    },
    /**
     * 课程详细页面中的目录页面
     * @return {[type]} [description]
     */
    getItemname: function($scope,p_id,itemid) {
        var d = $q.defer();
        var promise = d.promise;
        $http.jsonp(ENV.apiUrl + 'course/getitemname?productid='+p_id+'&itemid='+itemid+'&access-token='+localStorage.access_token+'&callback=JSON_CALLBACK')
            .success(function(data) {
                $scope.item = data.item;
                $scope.course = data.course;
                d.resolve(data);
            })
            .error(function(error) {
                d.reject(error);
            });

        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }

        return d.promise;
    },
    //   Sam  离线缓存 已完成接口 
    getDownloaded: function($scope) {
       var d = $q.defer();
        var promise = d.promise;
        $http.jsonp(ENV.apiUrl + "mobileusercenter/getdownloaded?access-token="+localStorage.access_token+"&callback=JSON_CALLBACK")
            .success(function(data) {
                $scope.downloadedlist = data.responseData;
                console.log($scope.notelist);
                d.resolve(data);
            })
            .error(function(error) {
                d.reject(error);
            });

        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }
        return d.promise; 
    },

    //   Sam   离线缓存 缓存ing 接口 
    getDownloading: function($scope) {
       var d = $q.defer();
        var promise = d.promise;
        $http.jsonp(ENV.apiUrl + "mobileusercenter/getdownloading?access-token="+localStorage.access_token+"&callback=JSON_CALLBACK")
            .success(function(data) {
                $scope.downloadinglist = data.responseData;
                console.log($scope.notelist);
                d.resolve(data);
            })
            .error(function(error) {
                d.reject(error);
            });

        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }
        return d.promise; 
    },

    discussData: function($scope) {
        var d = $q.defer();
        var promise = d.promise;
        $http.jsonp(ENV.apiUrl + 'course/getquestions?productid='+$scope.productid+'&callback=JSON_CALLBACK')
            .success(function(data) {
                $scope.discuss = data;
                d.resolve(data);
            })
            .error(function(error) {
                d.reject(error);
            });

        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }

        return d.promise;
    },


   
    /**
     * [getPracticelist 得到练习试卷]
     * @param  {[type]} $scope [description]
     * @return {[type]}        [description]
     */
    getPracticelist: function($scope,userid,productid) {
        var d = $q.defer();
        var promise = d.promise;
        $http.jsonp(ENV.apiUrl + 'mobilepractice/getpracticelist?access-token='+localStorage.access_token+'&product_id='+productid+'&callback=JSON_CALLBACK')
            .success(function(data) {
                d.resolve(data);
            })
            .error(function(error) {
                d.reject(error);
            });

        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }

        return d.promise;
    },
    
    
   
    /**
     * [getProcessDetail 得到成绩查询]
     * @param  {[type]} $scope [description]
     * @return {[type]}        [description]
     */
    getLoadedVideo: function($scope,p_id,item_id) {
        var d = $q.defer();
        var promise = d.promise;
        $http.jsonp(ENV.apiUrl + 'course/getloadedvideo?productid='+p_id+'&item_id='+item_id+'&access-token='+localStorage.access_token+'&callback=JSON_CALLBACK')
            .success(function(data) {
                $scope.loadedcourse = data;
                d.resolve(data);
            })
            .error(function(error) {
                d.reject(error);
            });

        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }

        return d.promise;
    },
    /**
     * [getOrderlist 得到订单数据]
     * @param  {[type]} $scope [description]
     * @return {[type]}        [description]
     */
    getOrderlist: function($scope) {
        var d = $q.defer();
        var promise = d.promise;
        $http.jsonp(ENV.apiUrl + 'mobileorder/getlist?userid='+$scope.userid+'&callback=JSON_CALLBACK&access-token='+localStorage.access_token)
            .success(function(data) {
                d.resolve(data);
            })
            .error(function(error) {
                d.reject(error);
            });

        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }

        return d.promise;
    },
    /**
     * [Ordercancel 取消订单]
     * @param  {[type]} $scope [description]
     * @return {[type]}        [description]
     */
    Ordercancel: function($scope,id) {
        var d = $q.defer();
        var promise = d.promise;
        $http.jsonp(ENV.apiUrl + 'mobileorder/ordercancel?access-token='+localStorage.access_token+'&id='+id+'&callback=JSON_CALLBACK')
            .success(function(data) {
                d.resolve(data);
            })
            .error(function(error) {
                d.reject(error);
            });

        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }

        return d.promise;
    },

    /**
     * 课程详细页面中的目录页面
     * @return {[type]} [description]
     */
    directoryData: function($scope) {
        var d = $q.defer();
        var promise = d.promise;
		var act = $scope.istry ? 'courseitems2' : 'courseitems';
        $http.jsonp(ENV.apiUrl + 'course/'+act+'?productid='+$scope.productid+'&access-token='+localStorage.access_token+'&callback=JSON_CALLBACK')
            .success(function(data) {
                $scope.courses = data.responseData;
				$scope.productData = data.productData;
				$scope.citemid = data.citemid;
				$scope.ccourseid = data.ccourseid;
                d.resolve(data);
            })
            .error(function(error) {
                d.reject(error);
            });

        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }

        return d.promise;
    },

    /**
     * 课程详细页面中的答疑页面
     * @return {[type]} [description]
     */
    questionData: function($scope) {
		if (!$scope.productid) {
			$scope.questionlist = [];
			return;
		}
        var d = $q.defer();
        var promise = d.promise;
        $http.jsonp(ENV.apiUrl + 'course/getquestions?productid='+$scope.productid+'&callback=JSON_CALLBACK')
            .success(function(data) {
                $scope.questionlist = data;
                d.resolve(data);
            })
            .error(function(error) {
                d.reject(error);
            });

        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }

        return d.promise;
    },

    /**
     * 课程详细页面中的笔记页面
     * @return {[type]} [description]
     */
    noteData: function($scope) {
		if (!$scope.productid) {
			$scope.notelist = [];
			return;
		}
        var d = $q.defer();
        var promise = d.promise;
        $http.jsonp(ENV.apiUrl + 'course/getnotes?access-token='+localStorage.access_token+'&productid='+$scope.productid+'&callback=JSON_CALLBACK')
            .success(function(data) {
                $scope.notelist = data;
                d.resolve(data);
            })
            .error(function(error) {
                d.reject(error);
            });

        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }

        return d.promise;
    },


    CourseData: function($scope) {
        var d = $q.defer();
        var promise = d.promise;
        $http.jsonp(ENV.apiUrl + 'course/getcoursebyid?productid='+$scope.productid+'&callback=JSON_CALLBACK&access-token='+localStorage.access_token)
            .success(function(data) {
                $scope.courseData = data.responseData;
                d.resolve(data);
            })
            .error(function(error) {
                d.reject(error);
            });

        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }

        return d.promise; 
    },

    /**
     * 公共函数，提示框，1s后自动隐藏
     * @param  {[type]} $scope        [description]
     * @param  {[type]} $ionicLoading [description]
     * @param  {[type]} message       [description]
     * @return {[type]}               [description]
     */
    showMessage: function($ionicLoading,message) {
        $ionicLoading.show({template: message});
        setTimeout(function () {
            $ionicLoading.hide();
        },
        2000);
    },

    /**
     * 得到课程所有分类
     * @param  {[type]} $scope [description]
     * @return {[type]}        [description]
     */
    getCategory: function($scope){
        var d = $q.defer();
        var promise = d.promise;
        $http.jsonp(ENV.apiUrl +'course/getcategory?callback=JSON_CALLBACK')
            .success(function(data) {
                $scope.categoryData = data.responseData;
                var categorystr = JSON.stringify(data.responseData);
                localStorage.categorystr = categorystr; 
                d.resolve(data);
            })
            .error(function(error) {
                d.reject(error);
            });

        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }

        return d.promise; 
    },

    
    /**
     * 得到课程指定分类
     * @param  {[type]} $scope [description]
     * @return {[type]}        [description]
     */
    getWxpayParams: function($scope){
        var d = $q.defer();
        var promise = d.promise;
        $http.jsonp(ENV.apiUrl + 'course/wxpayparams?callback=JSON_CALLBACK')
            .success(function(data) {
                $scope.wxparams = data;
                d.resolve(data);
            })
            .error(function(error) {
                d.reject(error);
            });

        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }

        return d.promise; 
    },

    /**
     * 得到用户课程信息
     * @param {[type]} $scope [description]
     */
    UserCourse: function($scope,courseid){
        var d = $q.defer();
        var promise = d.promise;
        //catId = $scope.catId;
        $http.jsonp(ENV.apiUrl + 'course/usercourse?access-token='+localStorage.access_token+'&productid='+courseid+'&callback=JSON_CALLBACK')
            .success(function(data) {
                $scope.buycourse = data.responseData.buycourse;
                //console.log('buycourse'+$scope.buycourse);
                d.resolve(data);
            })
            .error(function(error) {
                d.reject(error);
            });
            
        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }

        return d.promise;
    },

    /**
     * 得到电子讲义列表
     * @param  {[type]} $scope [description]
     * @return {[type]}        [description]
     */
    getBooklist: function($scope,productid){
        var d = $q.defer();
        var promise = d.promise;
        $http.jsonp(ENV.apiUrl + 'mobilebook/getlist?productid='+productid+'&access-token='+localStorage.access_token+'&&callback=JSON_CALLBACK')
            .success(function(data) {
                $scope.booklist = data.responseData;
                d.resolve(data);
            })
            .error(function(error) {
                d.reject(error);
            });

        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }

        return d.promise; 
    },
    /**
     * 得到电子讲义内容
     * @param  {[type]} $scope [description]
     * @return {[type]}        [description]
     */
    getBook: function($scope,bookid,chapter){
        var d = $q.defer();
        var promise = d.promise;
        $http.jsonp(ENV.apiUrl + 'mobilebook/getcontent?bookid='+bookid+'&chapter='+chapter+'&access-token='+localStorage.access_token+'&callback=JSON_CALLBACK')
            .success(function(data) {
                $scope.book = data.responseData;
                $scope.menulist = data.responseData.chapter;
                d.resolve(data);
            })
            .error(function(error) {
                d.reject(error);
            });

        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }

        return d.promise; 
    },
    /**
     * 电子讲义菜单跳转
     * @param  {[type]} $scope [description]
     * @return {[type]}        [description]
     */
    bookmenuto: function($scope,bookid,chapter){
        var d = $q.defer();
        var promise = d.promise;
        $http.jsonp(ENV.apiUrl + 'mobilebook/getmenucontent?bookid='+bookid+'&chapter='+chapter+'&access-token='+localStorage.access_token+'&&callback=JSON_CALLBACK')
            .success(function(data) {
                $scope.book = data.responseData;
                d.resolve(data);
            })
            .error(function(error) {
                d.reject(error);
            });

        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }

        return d.promise; 
    },

    /**
     * 添加、取消收藏
     * @return {[type]} [description]
     */
    dealcollection: function($scope,productid,favorites){
        var d = $q.defer();
        var promise = d.promise;
        $http.jsonp(ENV.apiUrl + 'mobileusercenter/dealcollection?productid='+productid+'&favorites='+favorites+'&access-token='+localStorage.access_token+'&&callback=JSON_CALLBACK')
            .success(function(data) {
                $scope.collection = data.responseData;
                d.resolve(data);
            })
            .error(function(error) {
                d.reject(error);
            });

        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }

        return d.promise; 
    },

    /**
     * 添加、取消收藏
     * @return {[type]} [description]
     */
    getcollection: function($scope){
        var d = $q.defer();
        var promise = d.promise;
        $http.jsonp(ENV.apiUrl + 'mobileusercenter/getcollection?productid='+$scope.productid+'&access-token='+localStorage.access_token+'&&callback=JSON_CALLBACK')
            .success(function(data) {
                $scope.favorites = data.responseData;
                d.resolve(data);
            })
            .error(function(error) {
                d.reject(error);
            });

        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }

        return d.promise; 
    },

     // Sam  购买接口 添加订单到sms_order表中 
    sendOrder: function($scope,addressid,pid) {
       var d = $q.defer();
        var promise = d.promise;
        $http.jsonp(ENV.apiUrl + "mobilecourse/coursebuy?access-token="+localStorage.access_token+"&addressid="+addressid+"&pid="+pid+" &callback=JSON_CALLBACK")
            .success(function(data) {
                d.resolve(data);
            })
            .error(function(error) {
                d.reject(error);
            });
    },

    
    setdownloadProgress: function(percent){
        data.percent = percent;
    },

    getdownloadProgress: function(){
        return data.percent;
    }


}})

.service('LoginService', function($q, $http, $rootScope) {

    return {
        loginUser: function(name, pw) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            var loginResult = new Object();
            //ajax请求
            $http.jsonp(ENV.apiUrl + "mobileadmin/login?userid=" + name + "&pass=" + pw + "&callback=JSON_CALLBACK")
                .success(function(response) {
                    loginResult = response.responseData.userinfo;
                    console.log(loginResult);
                    if (loginResult.LoginStatus == 1) {
                        localStorage.access_token = loginResult.access_token;
                        localStorage.userid = loginResult.id;
                        localStorage.username = loginResult.username;
                        localStorage.headimg = loginResult.headimg;
                        localStorage.haslogin = 1;
                        $rootScope.$broadcast('loginUser');

                        //设置客户端的别名，用于定向接收消息的推送
                        //window.plugins.jPushPlugin.setAlias("Client" + loginResult.UserId);

                        var arrayObj = new Array("Tags" + loginResult.userid);
                        //window.plugins.jPushPlugin.setTags(arrayObj);

                        deferred.resolve('Welcome ' + name + '!');
                    } else {
                        deferred.reject('Wrong credentials.');
                    }
                });

            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        },

        getUser: function() {
            return localStorage;
        },

        register: function(code, phone, password) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            //ajax请求
            $http.jsonp(ENV.apiUrl+"mobileadmin/signup?userid=" + phone + "&code=" + code + "&pass=" + password + "&callback=JSON_CALLBACK")
                .success(function(data) {
                    deferred.resolve(data);
                })
                .error(function(error) {
                    deferred.reject(error);
                });

            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        },
        SendCode: function(scope,phone) {
            var d = $q.defer();
            var promise = d.promise;
            //ajax请求
            $http.jsonp(ENV.apiUrl + "mobileadmin/sendcode?phone=" + name +"&callback=JSON_CALLBACK")
                .success(function(data) {
                    d.resolve(data);
                })
                .error(function(error) {
                    d.reject(error);
                });

            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        },
        resetpassword: function(email) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            //ajax请求
            $http.jsonp("http://api.mynep.com/account/resetpassword?email=" + email + "&callback=JSON_CALLBACK")
                .success(function(response) {
                    if (response == 1) {
                        deferred.resolve('reset password successfully');
                    } else {
                        deferred.reject('Wrong request');
                    }
                });
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        },
        getsetting: function($scope) {
            var d = $q.defer();
            var promise = d.promise;
            //ajax请求
            $http.jsonp("http://api.mynep.com/account/GetUserSetting?userId=" + localStorage.userid + "&signToken=" + localStorage.signtoken + "&callback=JSON_CALLBACK")
                .success(function(data) {
                    $scope.apppush.checked = data.AppPush;
                    $scope.smspush.checked = data.SmsPush;
                    $scope.phonepush.checked = data.PhonePush;
                    $scope.userphone = data.UserPhone;
                    $scope.data.userphone = data.UserPhone;
                    $scope.phonevalidated = data.PhoneValidated;
                    d.resolve(data);
                })
                .error(function(error) {
                    d.reject(error);
                });

            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }

            return d.promise;
        },

        sendcode: function($scope, $ionicPopup) {
            var d = $q.defer();
            var promise = d.promise;
            //ajax请求
            $http.jsonp("http://api.mynep.com/account/SendPhoneValidateCode?userId=" + localStorage.userid + "&signToken=" + localStorage.signtoken + "&phone=" + $scope.data.userphone + "&callback=JSON_CALLBACK")
                .success(function(data) {
                    if (data.SetPushStatus != 1) {
                        var confirmPopup = $ionicPopup.alert({
                            title: '推送设置',
                            template: data.SetPushStatusComment
                        });
                    };
                    d.resolve(data);
                })
                .error(function(error) {
                    var confirmPopup = $ionicPopup.alert({
                        title: '推送设置',
                        template: '验证码发送失败，请重试！'
                    });
                    d.reject(error);
                });

            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }

            return d.promise;
        },

        finalbind: function($scope, $ionicPopup) {
            var d = $q.defer();
            var promise = d.promise;
            //ajax请求
            $http.jsonp("http://api.mynep.com/account/FinalBind?userId=" + localStorage.userid + "&phone=" + $scope.data.userphone + "&code=" + $scope.data.code + "&signToken=" + localStorage.signtoken + "&callback=JSON_CALLBACK")
                .success(function(data) {
                    if (data.SetPushStatus != 1) {
                        var confirmPopup = $ionicPopup.alert({
                            title: '推送设置',
                            template: data.SetPushStatusComment
                        });
                    };
                    d.resolve(data);
                })
                .error(function(error) {
                    var confirmPopup = $ionicPopup.alert({
                        title: '推送设置',
                        template: '手机号码绑定失败，请重试！'
                    });
                    d.reject(error);
                });

            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }

            return d.promise;
        },
        switchnotify: function($scope, $ionicPopup, type) {
            var d = $q.defer();
            var promise = d.promise;
            var value;
            if (type == 1) {
                value = $scope.apppush.checked;
            }
            if (type == 2) {
                value = $scope.smspush.checked;
            }
            if (type == 3) {
                value = $scope.phonepush.checked;
            }
            //ajax请求
            $http.jsonp("http://api.mynep.com/account/SetPush?userId=" + localStorage.userid + "&signToken=" + localStorage.signtoken + "&type=" + type + "&value=" + value + "&callback=JSON_CALLBACK")
                .success(function(data) {
                    if (data.SetPushStatus != 1) {
                        var confirmPopup = $ionicPopup.alert({
                            title: '推送设置',
                            template: data.SetPushStatusComment
                        });
                    };
                    d.resolve(data);
                })
                .error(function(error) {
                    var confirmPopup = $ionicPopup.alert({
                        title: '推送设置',
                        template: '手机号码绑定失败，请重试！'
                    });
                    d.reject(error);
                });

            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }

            return d.promise;
        }
    }
})

.service('StorageService',function($q){
    return {
        getLocalstorage:function(){
            var d = $q.defer();
            var promise = d.promise;
            //return localStorage;
            if(localStorage.catId){
                d.resolve(localStorage);
            }else{
                d.reject();
            }
            return d.promise;
        }
    }
});

