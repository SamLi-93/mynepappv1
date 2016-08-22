

var JobReader = {
      
      n:0,
      x:0,
      getDeviceWidth : function() {
          //iOS 9.2 window.innerWidth 值不是设备宽bug
          if(/os 9/ig.test(navigator.userAgent) && /safari/ig.test(navigator.userAgent)){
              return window.screen.availWidth
          } else {
              return window.innerWidth
          }
      },
      //localStorage.chapterNow="1";//记录章节和阅读位置    add by zhangxingning@zhangyue.com
      hidefont:function(){
        var oAction = document.getElementById('action');
        oAction.style.display = 'none';
      },
      refurbish:function(e){
        var oBox = document.querySelector('.read_page');
        var oCon = oBox.querySelector('.read_page_con');
        var columnWidth = JobReader.getDeviceWidth();
        oBox.style.WebkitColumnWidth = columnWidth + 'px';
        var clientHeight = document.documentElement.clientHeight;
        var pages = Math.ceil(oCon.offsetHeight / (clientHeight));//此处准确性待定
        //bug--部分机型浏览器（Chrome），column父级无宽渲染错误
        oBox.style.WebkitTransform = 'translateX(0px)';
        //oBox.style.height = clientHeight + 'px';
        var c = document.querySelector('.read_page_wrap');
        $(".page span").html('1/' + pages);
        JobReader.n = 0;
        this.x = 0;
      },
      //页码跳转
      pageto:function(index){
        var columnWidth = JobReader.getDeviceWidth();
        var oBox = document.querySelector('.read_page');
        var oCon = oBox.querySelector('.read_page_con');
        var position = -(index-1) * columnWidth;
        var clientHeight = document.documentElement.clientHeight;
        var pages = Math.ceil(oCon.offsetHeight / (clientHeight));//此处准确性待定
        oBox.style.WebkitTransform = 'translateX(' + position + 'px)';
        $(".page span").html(index+'/' + pages);
        JobReader.n = index-1;
      },
      //初始化
      init_reader : function(bookid,chapter,page){
          var fontArr = [
              [24, 14],
              [27, 16],
              [30, 18],
              [33, 20],
              [37, 22]
          ]
          var read_page = document.getElementById('read_page_con');
          //console.log(read_page);
          var chapterNum = '15';
          //var href = document.referrer;
          //var host = href.split('?');
          //var file  = host[0].split('/');
          //var php = file.pop();
          //var oHeader = document.getElementById('header');
          var oAction = document.getElementById('action');
          //var oFont = document.getElementById('font');
          var oList = document.getElementById('list');
          var oFontBig = document.querySelector('.reader-big');
          //减小
          var oFontSmall = document.querySelector('.reader-little')
          var oChapter = document.getElementById('chapter')
          var oJump = document.getElementById('jump');
          var oReader = document.querySelector('.reader-function')
          var c = document.querySelector('.read_page_wrap');
          var oBox = document.querySelector('.read_page');
          var oBackground = document.getElementById('background');
          var oHead = document.querySelector('page_tit');
          var oCon = oBox.querySelector('.read_page_con');
          //var oReaderjump = document.querySelector('.reader-jump')
          var x = 0;
          JobReader.n = page-1;
          var appElement = document.querySelector('[ng-controller=BookReadCtrl]');
          var $scope = angular.element(appElement).scope(); 
          $scope.showMessage();
          $scope.$apply();
          if (localStorage.fontSize) {
              oCon.style.fontSize = localStorage.fontSize;
              oCon.style.lineHeight = localStorage.lineHeight;
          };
          var columnWidth = JobReader.getDeviceWidth();
          oBox.style.WebkitColumnWidth = columnWidth + 'px';
          var clientHeight = document.documentElement.clientHeight;
          var pages = Math.ceil(oCon.offsetHeight / (clientHeight));//此处准确性待定
          //bug--部分机型浏览器（Chrome），column父级无宽渲染错误
          oBox.style.height = clientHeight + 'px';
          oBox.style.WebkitTransform = 'translateX(0px)';
          //oBox.style.height = clientHeight + 'px';
          var c = document.querySelector('.reader');
          $(".page span").html('1/' + pages);
          /*if (href) {
              if(host[1]){
                  var lastCha = host[1].split('chapterid=')[1];
              }
              
              if (lastCha == 2) {
                //向前一章翻的时候直接跳到章节的末页
                  n = pages - 1;
                  x = -n * columnWidth;
                  oBox.style.WebkitTransition = 'none';
                  oBox.style.WebkitTransform = 'translateX(' + x + 'px)';
              };
          };*/

          /*oFont.addEventListener('click', function() {
              var oList = document.getElementById('list');
              if (oList.style.display == 'block') {
                  oList.style.display = 'block';
              } else {
                  oList.style.display = 'none';
              }
          }, false);*/

          oFontBig.addEventListener('click', function() {
              var fontNow = getComputedStyle(oCon, false)['fontSize'];
              for (var i = 0; i < fontArr.length; i++) {
                  if (fontArr[i][1] == parseInt(fontNow)) {
                      if (i == fontArr.length - 1) return;
                      oCon.style.fontSize = fontArr[i + 1][1] + 'px';
                      oCon.style.lineHeight = fontArr[i + 1][0] + 'px';
                      localStorage.fontSize = fontArr[i + 1][1] + 'px';
                      localStorage.lineHeight = fontArr[i + 1][0] + 'px';
                  };
              };

              n = Math.ceil(oCon.offsetHeight / (document.documentElement.clientHeight)) * JobReader.n / pages; //当前总页数*转屏前的第n页/转屏前的总页数
              JobReader.n = Math.floor(n); //当前页，向下取整
              pages = Math.ceil(oCon.offsetHeight / (clientHeight));
              console.log(oCon.offsetHeight,clientHeight);
              x = -JobReader.n * columnWidth;
              var columnWidth = JobReader.getDeviceWidth();
              oBox.style.WebkitTransition = 'none';
              oBox.style.WebkitTransform = 'translateX(' + x + 'px)';
          }, false);

          oFontSmall.addEventListener('click', function() {
              var fontNow = getComputedStyle(oCon, false)['fontSize'];
              for (var i = 0; i < fontArr.length; i++) {
                  if (fontArr[i][1] == parseInt(fontNow)) {
                      if (i == 0) return;
                      oCon.style.fontSize = fontArr[i - 1][1] + 'px';
                      oCon.style.lineHeight = fontArr[i - 1][0] + 'px';
                      localStorage.fontSize = fontArr[i - 1][1] + 'px';
                      localStorage.lineHeight = fontArr[i - 1][0] + 'px';
                  };
              };
              n = Math.ceil(oCon.offsetHeight / (document.documentElement.clientHeight)) * JobReader.n / pages; //当前总页数*转屏前的第n页/转屏前的总页数
              JobReader.n = Math.floor(n); //当前页，向下取整
              pages = Math.ceil(oCon.offsetHeight / (clientHeight));
              console.log(oCon.offsetHeight,clientHeight);
              x = -JobReader.n * columnWidth;
              oBox.style.WebkitTransition = 'none';
              oBox.style.WebkitTransform = 'translateX(' + x + 'px)';
          }, false)

          /*oReaderjump.addEventListener('click', function() {
              if (oJump.style.display == 'block') {
                  oJump.style.display = 'none';
              } else {
                  oJump.style.display = 'block';
              };
              if (oList.style.display == 'block') {
                  oList.style.display = 'none';
              }
          }, false)*/

          var disX = 0,
              startX = 0,
              startY = 0;
          c.addEventListener('touchstart', function(ev) {
              oBox.style.WebkitTransition = 'none';
              disX = ev.targetTouches[0].pageX - x;
              startX = ev.targetTouches[0].pageX;
              startY = ev.targetTouches[0].pageY;

              c.addEventListener('touchmove', fnMove, false);
              c.addEventListener('touchend', fnEnd, false);

          }, false);

          function fnMove(ev) {
              x = ev.targetTouches[0].pageX - disX;
              oBox.style.WebkitTransform = 'translateX(' + x + 'px)';
              ev.preventDefault();
          }
          
          function fnEnd() {
              
              // localStorage.chapterNow=1;//记录章节和阅读位置
              // localStorage.pageNow=pages-1;
              console.log(JobReader.n);
              if (startX > columnWidth * 2 / 3 || startY > clientHeight * 2 / 3 && startX > columnWidth / 3) {
                  if ((JobReader.n + 1) == pages) {
                      //if ( 15 == chapterNum) {
                        $scope.showMessage('已经是这章最后一页');
                        //alert("已经是最后一章");//location.href = 'index.php?key=130W' + 11031215 +'&bn=' + bookName + '&' + argument;
                        //最后一页鼠标拖拽出现空白页问题
                        var lastwindth = JobReader.n*columnWidth;
                        oBox.style.WebkitTransform = 'translateX(-' + lastwindth + 'px)';

                      /*} else {
                          location.href = "index.php?r=ebookdemo/index&bookid=113&chapterid=2";
                      }*/
                      return;
                  };
                  JobReader.n++;
                  x = -JobReader.n * columnWidth;
                  oBox.style.WebkitTransition = '.2s all ease';
                  oBox.style.WebkitTransform = 'translateX(' + x + 'px)';
                  //oHeader.style.display = 'none';
                  oAction.style.display = 'none';
                  //oList.style.display = 'none';
                  //oJump.style.display = 'none';
              } else if (startX < columnWidth / 3 || startY < clientHeight / 3 && startX < columnWidth * 2 / 3) {
                  if (JobReader.n == 0) {
                      //if ( 1 == 1) {
                        $scope.showMessage('已经是这章第一页了');
                        //alert("已经是第一章");//location.href = 'index.php?key=17W' + 11031215 +'&' + argument;
                        oBox.style.WebkitTransform = 'translateX(0px)';
                      /*} else {
                        location.href = "index.php?r=ebookdemo/index&bookid=113&chapterid=1$?>";
                      }*/
                      //return;
                  };
                  JobReader.n--;
                  if (JobReader.n < 0) {
                      JobReader.n = 0
                  };
                  x = -JobReader.n * columnWidth;
                  oBox.style.WebkitTransition = '.2s all ease';
                  oBox.style.WebkitTransform = 'translateX(' + x + 'px)';
                  //oHeader.style.display = 'none';
                  oAction.style.display = 'none';
                  //oList.style.display = 'none';
                  //oJump.style.display = 'none';

              } else {
                  x = -JobReader.n * columnWidth;
                  oBox.style.WebkitTransition = '.2s all ease';
                  oBox.style.WebkitTransform = 'translateX(' + x + 'px)';
                  if (oAction.style.display == 'block') {

                      //oHeader.style.display = 'none';
                      oAction.style.display = 'none';
                      //oList.style.display = 'none';
                      //oJump.style.display = 'none';
                  } else {
                      //oHeader.style.display = 'block';
                      oAction.style.display = 'block';

                  }
              }
              var lbook = localStorage.book;
              console.log(lbook);
              //是否有历史记录
              if(lbook != undefined){
                var arr = JSON.parse(lbook);
                if(arr[bookid]){
                  var b_arr = arr[bookid].split(",");
                  arr[bookid] = b_arr[0]+','+(JobReader.n+1);
                  window.localStorage['book'] = JSON.stringify(arr);
                }else{
                  arr[bookid] = chapter+','+(JobReader.n+1);
                  window.localStorage['book'] = JSON.stringify(arr);
                }
              }else{
                var arr = {};
                arr[bookid] = chapter+','+(JobReader.n+1);
                window.localStorage['book'] = JSON.stringify(arr);
              }
              console.log(bookid);
              pages = Math.ceil(oCon.offsetHeight / (clientHeight));
              $(".page span").html((JobReader.n + 1) + '/' + pages);
              c.removeEventListener('touchmove', fnMove, false);
              c.removeEventListener('touchend', fnEnd, false);
          }


          $(".page span").html((JobReader.n + 1) + '/' + pages);
          window.addEventListener('orientationchange', function() {
              oCon.innerHTML = '';
              setTimeout(function() {
                  oCon.innerHTML = con;
                  columnWidth = JobReader.getDeviceWidth();
                  oBox.style.WebkitColumnWidth = columnWidth + 'px';
                  n = Math.ceil(oCon.offsetHeight / (document.documentElement.clientHeight)) * JobReader.n / pages; //当前总页数*转屏前的第n页/转屏前的总页数
                  JobReader.n = Math.floor(n); //当前页，向下取整
                  clientHeight = document.documentElement.clientHeight;
                  x = -JobReader.n * columnWidth;
                  oBox.style.height = (clientHeight) + 'px';
                  oBox.style.WebkitTransition = 'none';
                  oBox.style.WebkitTransform = 'translateX(' + x + 'px)';
                  pages = Math.ceil(oCon.offsetHeight / (document.documentElement.clientHeight));
                  $(".page span").html((JobReader.n + 1) + '/' + pages);
                  //onReady()
              }, 200);
          });

      }

}

      var scene = getLocalData('SCENE');
      if (scene == null) { //背景
          setLocalData('SCENE', 0);
          scene = 0;
      }
      changeColorMode();
      if (getLocalData('POINT') == null) { //提示
          setLocalData('POINT', 1);
          document.getElementById('screen').style.display = 'block';
          document.getElementById('point').style.display = 'block';
          document.getElementById('point').addEventListener('click', function(e) {
              setScreenPoint()
          }, false);
      }

      //非常重要，用于兼容不同机型，防止浏览器窗口移动
      document.addEventListener('touchmove', function(e) {
          e.preventDefault(e);
      }, false);

      var thisUrl = window.location.href;
      setLocalData('backUrl', thisUrl);

      //设置正文部分的高度
      //var read_page_height = window.screen.height-70;
      var read_page_height = document.body.clientHeight-60;
      console.log(read_page_height);
      $(".read_page").css('height',read_page_height+"px");
      $(".read_page_con img").css('max-height',read_page_height-20+"px");