angular.module('mynepapp.provincecontrollers', [])

// Sam 新建地址页面
.controller('CreateaddressCtrl', function($scope,$ionicViewSwitcher,$ionicPopup,$timeout,$http,Websites,$ionicLoading,$ionicHistory,$state,$stateParams) {
    //消息提示
    $scope.showMessage = function(title){
      $ionicLoading.show({
        template: title
      });
      $timeout(function() {
        $ionicLoading.hide();
      }, 1000);
    }

    $scope.data = {};
    $scope.address = {};
    $scope.data.username = $stateParams.text;
    $scope.data.phonenum = $stateParams.text;
    $scope.address.province = $stateParams.text;
    $scope.address.city = $stateParams.text;
    $scope.data.addresstext = $stateParams.text;

    $scope.saveaddress = function(){
    var phonenum = $scope.data.phonenum;
    var username = $scope.data.username;
    var addresstext = $scope.data.addresstext;
    var province = $scope.address.province;
    var city =$scope.address.city;
    console.log(province);
    console.log(city);

    if (checkName(username)&&checkPhone(phonenum)&&checkAddress(addresstext)&&checkProvince(province)&&checkCity(city)) {
        $http.jsonp(ENV.apiUrl + 'mobileaddress/addaddress?access-token='+localStorage.access_token+'&username='+ $scope.data.username+'&phonenum='+$scope.data.phonenum+'&province='+$scope.address.province+'&city='+$scope.address.city+'&address='+$scope.data.addresstext+'&callback=JSON_CALLBACK')
            .then(function(res){
              console.log('suc');
              $ionicLoading.show({ template: '保存成功', noBackdrop: true, duration: 1000 });
              $state.go('address', {}, { reload: true })
          })
      } else {
        if (!checkName(username)) {
            $scope.showMessage('请输入正确的收货人信息！');
        } else if(!checkPhone(phonenum)) {
            $scope.showMessage('请输入正确的联系方式！');
        } else if (!checkProvince(province)) {
            $scope.showMessage('请选择正确的省份！');
        } else if (!checkCity(city)) {
            $scope.showMessage('请选择正确的城市！');
        } else if (!checkAddress(addresstext)) {
            $scope.showMessage('请输入正确的地址！');
        }
      }
    }

    var checkName = function(b){
      var flag = false;
      if(b!=undefined){
        if(b.length>=2){
          flag = true;
        }
      }
      return flag;
    }

    var checkPhone = function(a){
      var str = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i;
      var flag = str.test(a);
      return flag;
    }

    var checkAddress = function(b){
      var flag = false;
      if(b!=undefined){
        if(b.length>=4){
          flag = true;
        }
      }
      return flag;
    }

    var checkProvince = function(a){
      var str = /\d{1,2}/i;
      var flag = str.test(a);
      return flag;
    }

    var checkCity = function(a){
      var str = /\d{1,2}/i;
      var flag = str.test(a);
      return flag;
    }

  //back button
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
      viewData.enableBack = true;
    });
  
  $scope.provincelist =  {
      '0' : '安徽省',
      '1' : '澳门特别行政区',
      '2' : '北京',
      '3' : '福建省',
      '4' : '甘肃省',
      '5' : '广东省',
      '6' : '广西壮族自治区',
      '7' : '贵州省',
      '8' : '海南省',
      '9' : '河北省',
      '10' : '河南省',
      '11' : '黑龙江省',
      '12' : '湖北省',
      '13' : '湖南省',
      '14' : '吉林省',
      '15' : '江苏省',
      '16' : '江西省',
      '17' : '辽宁省',
      '18' : '内蒙古自治区',
      '19' : '宁夏回族自治区',
      '20' : '青海省',
      '21' : '山东省',
      '22' : '山西省',
      '23' : '陕西省',
      '24' : '上海',
      '25' : '四川省',
      '26' : '台湾省',
      '27' : '天津',
      '28' : '西藏自治区',
      '29' : '香港特别行政区',
      '30' : '新疆维吾尔自治区',
      '31' : '云南省',
      '32' : '浙江省',
      '33' : '重庆',
};

  $scope.citylist = {
   '0' : ['合肥', '安庆', '蚌埠', '亳州', '巢湖', '池州', '滁州', '阜阳', '淮北', '淮南', '黄山', '六安', '马鞍山', '宿州', '铜陵', '芜湖', '宣城'],
   '1' : ['澳门'],
   '2' : ['昌平', '朝阳', '崇文', '大兴', '东城', '房山', '丰台', '海淀', '怀柔', '门头沟', '密云', '平谷', '石景山', '顺义', '通州', '西城', '宣武', '延庆'],
   '3' : ['福州', '龙岩', '南平', '宁德', '莆田', '泉州', '三明', '厦门', '漳州'],
   '4' : ['兰州', '白银', '定西', '甘南', '嘉峪关', '金昌', '酒泉', '临夏', '陇南', '平凉', '庆阳', '天水', '武威', '张掖'],
   '5' : ['广州', '潮州', '东莞', '佛山', '河源', '惠州', '江门', '揭阳', '茂名', '梅州', '清远', '汕头', '汕尾', '韶关', '深圳', '阳江', '云浮', '湛江', '肇庆', '中山', '珠海'],
   '6' : ['桂林', '百色', '北海', '崇左', '防城港', '贵港', '河池', '贺州', '来宾', '柳州', '南宁', '钦州', '梧州', '玉林'],
   '7' : ['贵阳', '安顺', '毕节', '六盘水', '黔东南', '黔南', '黔西南', '铜仁', '遵义'],
   '8' : ['海口', '白沙', '保亭', '昌江', '澄迈', '儋州', '定安', '东方', '乐东', '临高', '陵水', '南沙群岛', '琼海', '琼中', '三亚', '屯昌', '万宁', '文昌', '五指山', '西沙群岛', '中沙群岛'],
   '9' : ['石家庄', '保定', '沧州', '承德', '邯郸', '衡水', '廊坊', '秦皇岛', '唐山', '邢台', '张家口'],
   '10' : ['郑州', '安阳', '鹤壁', '焦作', '开封', '洛阳', '漯河', '南阳', '平顶山', '濮阳', '三门峡', '商丘', '新乡', '信阳', '许昌', '周口', '驻马店'],
   '11' : ['哈尔滨', '大庆', '大兴安岭', '鹤岗', '黑河', '鸡西', '佳木斯', '牡丹江', '七台河', '齐齐哈尔', '双鸭山', '绥化', '伊春'],
   '12' : ['武汉', '鄂州', '恩施', '黄冈', '黄石', '荆门', '荆州', '潜江', '神农架', '十堰', '随州', '天门', '仙桃', '咸宁', '襄樊', '孝感', '宜昌'],
   '13' : ['长沙', '常德', '郴州', '衡阳', '怀化', '娄底', '邵阳', '湘潭', '湘西', '益阳', '永州', '岳阳', '张家界', '株洲'],
   '14' : ['长春', '白城', '白山', '吉林', '辽源', '四平', '松原', '通化', '延边'],
   '15' : ['南京', '常州', '淮安', '连云港', '南通', '苏州', '宿迁', '泰州', '无锡', '徐州', '盐城', '扬州', '镇江'],
   '16' : ['南昌', '抚州', '赣州', '吉安', '景德镇', '九江', '萍乡', '上饶', '新余', '宜春', '鹰潭'],
   '17' : ['沈阳', '鞍山', '本溪', '朝阳', '大连', '丹东', '抚顺', '阜新', '葫芦岛', '锦州', '辽阳', '盘锦', '铁岭', '营口'],
   '18' : ['呼和浩特', '阿拉善', '巴彦淖尔', '包头', '赤峰', '鄂尔多斯', '呼伦贝尔', '通辽', '乌海', '乌兰察布', '锡林郭勒', '兴安'],
   '19' : ['银川', '固原', '石嘴山', '吴忠', '中卫'],
   '20' : ['西宁', '果洛', '海北', '海东', '海南', '海西', '黄南', '玉树'],
   '21' : ['济南', '滨州', '德州', '东营', '菏泽', '济宁', '莱芜', '聊城', '临沂', '青岛', '日照', '泰安', '威海', '潍坊', '烟台', '枣庄', '淄博'],
   '22' : ['太原', '长治', '大同', '晋城', '晋中', '临汾', '吕梁', '朔州', '忻州', '阳泉', '运城'],
   '23' : ['西安', '安康', '宝鸡', '汉中', '商洛', '铜川', '渭南', '咸阳', '延安', '榆林'],
   '24' : ['宝山', '长宁', '崇明', '奉贤', '虹口', '黄浦', '嘉定', '金山', '静安', '卢湾', '闵行', '南汇', '浦东', '普陀', '青浦', '松江', '徐汇', '杨浦', '闸北'],
   '25' : ['成都', '阿坝', '巴中', '达州', '德阳', '甘孜', '广安', '广元', '乐山', '凉山', '泸州', '眉山', '绵阳', '内江', '南充', '攀枝花', '遂宁', '雅安', '宜宾', '资阳', '自贡'],
   '26' : ['台北', '阿莲', '安定', '安平', '八德', '八里', '白河', '白沙', '板桥', '褒忠', '宝山', '卑南', '北斗', '北港', '北门', '北埔', '北投', '补子', '布袋', '草屯', '长宾', '长治', '潮州', '车城', '成功', '城中区', '池上', '春日', '刺桐', '高雄', '花莲', '基隆', '嘉义', '苗栗', '南投', '屏东', '台东', '台南', '台中', '桃园', '新竹', '宜兰', '彰化'],
   '27' : ['宝坻', '北辰', '大港', '东丽', '汉沽', '和平', '河北', '河东', '河西', '红桥', '蓟县', '津南', '静海', '南开', '宁河', '塘沽', '武清', '西青'],
   '28' : ['拉萨', '阿里', '昌都', '林芝', '那曲', '日喀则', '山南'],
   '29' : ['北区', '大埔区', '东区', '观塘区', '黄大仙区', '九龙', '葵青区', '离岛区', '南区', '荃湾区', '沙田区', '深水埗区', '屯门区', '湾仔区', '西贡区', '香港', '新界', '油尖旺区', '元朗区', '中西区'],
   '30' : ['乌鲁木齐', '阿克苏', '阿拉尔', '阿勒泰', '巴音郭楞', '博尔塔拉', '昌吉', '哈密', '和田', '喀什', '克拉玛依', '克孜勒苏柯尔克孜', '石河子', '塔城', '图木舒克', '吐鲁番', '五家渠', '伊犁'],
   '31' : ['昆明', '保山', '楚雄', '大理', '德宏', '迪庆', '红河', '丽江', '临沧', '怒江', '曲靖', '思茅', '文山', '西双版纳', '玉溪', '昭通'],
   '32' : ['杭州', '湖州', '嘉兴', '金华', '丽水', '宁波', '衢州', '绍兴', '台州', '温州', '舟山'],
   '33' : ['巴南', '北碚', '璧山', '长寿', '城口', '大渡口', '大足', '垫江', '丰都', '奉节', '涪陵', '合川', '江北', '江津', '九龙坡', '开县', '梁平', '南岸', '南川', '彭水', '綦江', '黔江', '荣昌', '沙坪坝', '石柱', '双桥', '铜梁', '潼南', '万盛', '万州', '巫山', '巫溪', '武隆', '秀山', '永川', '酉阳', '渝北', '渝中', '云阳', '忠县'],
  };

})


// Sam  地址页面
.controller('EditaddressCtrl', function($scope,$ionicPopup,$timeout,$ionicViewSwitcher,$http,Websites,$ionicViewSwitcher,$stateParams,$ionicLoading,$ionicHistory,$state) {
  //back button
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
      viewData.enableBack = true;
    });

  console.log($stateParams.addressid);
  var id = $stateParams.addressid;
  //消息提示
    $scope.showMessage = function(title){
      $ionicLoading.show({
        template: title
      });
      $timeout(function() {
        $ionicLoading.hide();
      }, 1000);
    }


  if (localStorage.haslogin != 1) {
      $state.go("tab.usercenter");
      return;
  }else{
      Websites.getEditingAddress($scope, id).success(function(data) {
      $scope.address = data.responseData;
      $scope.data.username = $scope.address.name;
      $scope.data.phonenum = $scope.address.phonenum;
      $scope.address.province = $scope.address.user_province;
      $scope.address.city = $scope.address.user_city;
      $scope.data.addresstext = $scope.address.text;
    }).error(function(data){
      //加载失败
      console.log('fail');
      $ionicLoading.hide();
    });
  }

    $scope.data = {};
    $scope.address = {};
    $scope.data.username = $stateParams.text;
    $scope.data.phonenum = $stateParams.text;
    $scope.address.province = $stateParams.text;
    $scope.address.city = $stateParams.text;
    $scope.data.addresstext = $stateParams.text;

  $scope.saveaddress = function(id){
    var id = $stateParams.addressid;
    var phonenum = $scope.data.phonenum;
    var username = $scope.data.username;
    var addresstext = $scope.data.addresstext;
    var province = $scope.address.province;
    var city =$scope.address.city;

    if (checkName(username)&&checkPhone(phonenum)&&checkAddress(addresstext)&&checkProvince(province)&&checkCity(city)) {
        $http.jsonp(ENV.apiUrl + 'mobileaddress/editaddress?access-token='+localStorage.access_token+'&username='+ $scope.data.username+'&phonenum='+$scope.data.phonenum+'&province='+$scope.address.province+'&city='+$scope.address.city+'&address='+$scope.data.addresstext+'&id='+id+'&callback=JSON_CALLBACK')
            .then(function(res){
              console.log('suc');
              $ionicLoading.show({ template: '保存成功', noBackdrop: true, duration: 1000 });
              $state.go('address', {}, { reload: true })
          })
      } else {
        if (!checkName(username)) {
            $scope.showMessage('请输入正确的收货人信息！');
        } else if(!checkPhone(phonenum)) {
            $scope.showMessage('请输入正确的联系方式！');
        } else if (!checkProvince(province)) {
            $scope.showMessage('请选择正确的省份！');
        } else if (!checkCity(city)) {
            $scope.showMessage('请选择正确的城市！');
        } else if (!checkAddress(addresstext)) {
            $scope.showMessage('请输入正确的地址！');
        }
      }
    }

    var checkName = function(b){
      var flag = false;
      if(b!=undefined){
        if(b.length>=2){
          flag = true;
        }
      }
      return flag;
    }

    var checkPhone = function(a){
      var str = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i;
      var flag = str.test(a);
      return flag;
    }

    var checkAddress = function(b){
      var flag = false;
      if(b!=undefined){
        if(b.length>=4){
          flag = true;
        }
      }
      return flag;
    }

    var checkProvince = function(a){
      var str = /\d{1,2}/i;
      var flag = str.test(a);
      return flag;
    }

    var checkCity = function(a){
      var str = /\d{1,2}/i;
      var flag = str.test(a);
      return flag;
    }

    $scope.deleteaddress = function(id) {
      var confirmPopup = $ionicPopup.confirm({
          title: '确认删除？',
          cancelText: '取消',
          okText: '确定'
      });
      confirmPopup.then(function(res) {
        if(res) {
          console.log('You are sure');
          $http.jsonp(ENV.apiUrl + 'mobileaddress/deleteaddress?access-token='+localStorage.access_token+'&id='+$stateParams.addressid+'&callback=JSON_CALLBACK')
            .then(function(res){
              console.log('suc');
              $ionicLoading.show({ template: '删除成功', noBackdrop: true, duration: 1000 });
              $state.go('address', {}, { reload: true })
        })              
        }else{
            console.log('You are not sure');
        }
      });
    }

    $scope.provincelist =  {
      '0' : '安徽省',
      '1' : '澳门特别行政区',
      '2' : '北京',
      '3' : '福建省',
      '4' : '甘肃省',
      '5' : '广东省',
      '6' : '广西壮族自治区',
      '7' : '贵州省',
      '8' : '海南省',
      '9' : '河北省',
      '10' : '河南省',
      '11' : '黑龙江省',
      '12' : '湖北省',
      '13' : '湖南省',
      '14' : '吉林省',
      '15' : '江苏省',
      '16' : '江西省',
      '17' : '辽宁省',
      '18' : '内蒙古自治区',
      '19' : '宁夏回族自治区',
      '20' : '青海省',
      '21' : '山东省',
      '22' : '山西省',
      '23' : '陕西省',
      '24' : '上海',
      '25' : '四川省',
      '26' : '台湾省',
      '27' : '天津',
      '28' : '西藏自治区',
      '29' : '香港特别行政区',
      '30' : '新疆维吾尔自治区',
      '31' : '云南省',
      '32' : '浙江省',
      '33' : '重庆',
};

  $scope.citylist = {
   '0' : ['合肥', '安庆', '蚌埠', '亳州', '巢湖', '池州', '滁州', '阜阳', '淮北', '淮南', '黄山', '六安', '马鞍山', '宿州', '铜陵', '芜湖', '宣城'],
   '1' : ['澳门'],
   '2' : ['昌平', '朝阳', '崇文', '大兴', '东城', '房山', '丰台', '海淀', '怀柔', '门头沟', '密云', '平谷', '石景山', '顺义', '通州', '西城', '宣武', '延庆'],
   '3' : ['福州', '龙岩', '南平', '宁德', '莆田', '泉州', '三明', '厦门', '漳州'],
   '4' : ['兰州', '白银', '定西', '甘南', '嘉峪关', '金昌', '酒泉', '临夏', '陇南', '平凉', '庆阳', '天水', '武威', '张掖'],
   '5' : ['广州', '潮州', '东莞', '佛山', '河源', '惠州', '江门', '揭阳', '茂名', '梅州', '清远', '汕头', '汕尾', '韶关', '深圳', '阳江', '云浮', '湛江', '肇庆', '中山', '珠海'],
   '6' : ['桂林', '百色', '北海', '崇左', '防城港', '贵港', '河池', '贺州', '来宾', '柳州', '南宁', '钦州', '梧州', '玉林'],
   '7' : ['贵阳', '安顺', '毕节', '六盘水', '黔东南', '黔南', '黔西南', '铜仁', '遵义'],
   '8' : ['海口', '白沙', '保亭', '昌江', '澄迈', '儋州', '定安', '东方', '乐东', '临高', '陵水', '南沙群岛', '琼海', '琼中', '三亚', '屯昌', '万宁', '文昌', '五指山', '西沙群岛', '中沙群岛'],
   '9' : ['石家庄', '保定', '沧州', '承德', '邯郸', '衡水', '廊坊', '秦皇岛', '唐山', '邢台', '张家口'],
   '10' : ['郑州', '安阳', '鹤壁', '焦作', '开封', '洛阳', '漯河', '南阳', '平顶山', '濮阳', '三门峡', '商丘', '新乡', '信阳', '许昌', '周口', '驻马店'],
   '11' : ['哈尔滨', '大庆', '大兴安岭', '鹤岗', '黑河', '鸡西', '佳木斯', '牡丹江', '七台河', '齐齐哈尔', '双鸭山', '绥化', '伊春'],
   '12' : ['武汉', '鄂州', '恩施', '黄冈', '黄石', '荆门', '荆州', '潜江', '神农架', '十堰', '随州', '天门', '仙桃', '咸宁', '襄樊', '孝感', '宜昌'],
   '13' : ['长沙', '常德', '郴州', '衡阳', '怀化', '娄底', '邵阳', '湘潭', '湘西', '益阳', '永州', '岳阳', '张家界', '株洲'],
   '14' : ['长春', '白城', '白山', '吉林', '辽源', '四平', '松原', '通化', '延边'],
   '15' : ['南京', '常州', '淮安', '连云港', '南通', '苏州', '宿迁', '泰州', '无锡', '徐州', '盐城', '扬州', '镇江'],
   '16' : ['南昌', '抚州', '赣州', '吉安', '景德镇', '九江', '萍乡', '上饶', '新余', '宜春', '鹰潭'],
   '17' : ['沈阳', '鞍山', '本溪', '朝阳', '大连', '丹东', '抚顺', '阜新', '葫芦岛', '锦州', '辽阳', '盘锦', '铁岭', '营口'],
   '18' : ['呼和浩特', '阿拉善', '巴彦淖尔', '包头', '赤峰', '鄂尔多斯', '呼伦贝尔', '通辽', '乌海', '乌兰察布', '锡林郭勒', '兴安'],
   '19' : ['银川', '固原', '石嘴山', '吴忠', '中卫'],
   '20' : ['西宁', '果洛', '海北', '海东', '海南', '海西', '黄南', '玉树'],
   '21' : ['济南', '滨州', '德州', '东营', '菏泽', '济宁', '莱芜', '聊城', '临沂', '青岛', '日照', '泰安', '威海', '潍坊', '烟台', '枣庄', '淄博'],
   '22' : ['太原', '长治', '大同', '晋城', '晋中', '临汾', '吕梁', '朔州', '忻州', '阳泉', '运城'],
   '23' : ['西安', '安康', '宝鸡', '汉中', '商洛', '铜川', '渭南', '咸阳', '延安', '榆林'],
   '24' : ['宝山', '长宁', '崇明', '奉贤', '虹口', '黄浦', '嘉定', '金山', '静安', '卢湾', '闵行', '南汇', '浦东', '普陀', '青浦', '松江', '徐汇', '杨浦', '闸北'],
   '25' : ['成都', '阿坝', '巴中', '达州', '德阳', '甘孜', '广安', '广元', '乐山', '凉山', '泸州', '眉山', '绵阳', '内江', '南充', '攀枝花', '遂宁', '雅安', '宜宾', '资阳', '自贡'],
   '26' : ['台北', '阿莲', '安定', '安平', '八德', '八里', '白河', '白沙', '板桥', '褒忠', '宝山', '卑南', '北斗', '北港', '北门', '北埔', '北投', '补子', '布袋', '草屯', '长宾', '长治', '潮州', '车城', '成功', '城中区', '池上', '春日', '刺桐', '高雄', '花莲', '基隆', '嘉义', '苗栗', '南投', '屏东', '台东', '台南', '台中', '桃园', '新竹', '宜兰', '彰化'],
   '27' : ['宝坻', '北辰', '大港', '东丽', '汉沽', '和平', '河北', '河东', '河西', '红桥', '蓟县', '津南', '静海', '南开', '宁河', '塘沽', '武清', '西青'],
   '28' : ['拉萨', '阿里', '昌都', '林芝', '那曲', '日喀则', '山南'],
   '29' : ['北区', '大埔区', '东区', '观塘区', '黄大仙区', '九龙', '葵青区', '离岛区', '南区', '荃湾区', '沙田区', '深水埗区', '屯门区', '湾仔区', '西贡区', '香港', '新界', '油尖旺区', '元朗区', '中西区'],
   '30' : ['乌鲁木齐', '阿克苏', '阿拉尔', '阿勒泰', '巴音郭楞', '博尔塔拉', '昌吉', '哈密', '和田', '喀什', '克拉玛依', '克孜勒苏柯尔克孜', '石河子', '塔城', '图木舒克', '吐鲁番', '五家渠', '伊犁'],
   '31' : ['昆明', '保山', '楚雄', '大理', '德宏', '迪庆', '红河', '丽江', '临沧', '怒江', '曲靖', '思茅', '文山', '西双版纳', '玉溪', '昭通'],
   '32' : ['杭州', '湖州', '嘉兴', '金华', '丽水', '宁波', '衢州', '绍兴', '台州', '温州', '舟山'],
   '33' : ['巴南', '北碚', '璧山', '长寿', '城口', '大渡口', '大足', '垫江', '丰都', '奉节', '涪陵', '合川', '江北', '江津', '九龙坡', '开县', '梁平', '南岸', '南川', '彭水', '綦江', '黔江', '荣昌', '沙坪坝', '石柱', '双桥', '铜梁', '潼南', '万盛', '万州', '巫山', '巫溪', '武隆', '秀山', '永川', '酉阳', '渝北', '渝中', '云阳', '忠县'],
  };

});