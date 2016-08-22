<?php
/**
 * Created by PhpStorm.
 * User: admin
 * Date: 2016/6/13
 * Time: 16:26
 */

namespace backend\controllers;


use Yii;
use yii\web\Controller;
use yii\filters\auth\QueryParamAuth;
use common\models\Ctype;
use yii\helpers\ArrayHelper;
use yii\helpers\Url;
use common\models\Product;
use common\models\Quiz;
use common\models\Coursenotes;
use common\models\Productuser;
use common\models\Courseuser;
use common\models\CC_Citems;
use common\models\Itemtrack;
use common\models\Trackhistory;
use common\models\User;
use common\models\Card;
use common\helpers\Util;
use backend\models\CcClass;

class CourseController extends Controller
{
	  public function behaviors()
    {
        return [
            'authenticator' => [
                'class' => QueryParamAuth::className(),
                'only' => ['usercourse', 'startupxml', 'addquiz', 'addnote', 'courseitems', 'getnotes', 'bindcode','getitemname','getloadedvideo'],
            ],
        ];
    }
     /**
     * 获取分类
     */
    public function actionGetcategory(){
    	$request = Yii::$app->request;
    	$conn = Yii::$app->db;
    	$sql = "select * from cc_class where pid=0 order by corder desc";
    	$data_info = $conn->createCommand ($sql)->queryAll();
    	$return_info = array();
    	foreach ($data_info as $k => $v){
    		$info = array();
    		$info['id'] = $v['id'];
    		$info['name'] = $v['val'];
    		$info['icon'] = $v['memo'];
    		$return_info[] = $info;
    	}
    	$return_info = json_encode ( array('responseData'=>$return_info) );
    	$callback = $request->get ( 'callback' );
    	echo $callback . "(" . $return_info . ")";
    	exit ();
    }

  /**
    * [获取banner图]
    * @return [type] [description]
    */
  public function actionLunbo(){
    $request = Yii::$app->request;
    $banner = CcClass::find()->where('app_banner!=""')->orderBy('id desc')->all();
    $return_arr = array();
    $web_imgurl = Yii::$app->params['web_imgurl'];
    foreach ($banner as $key => $val) {
      $txt = "";
      //$type = $val['type']==1 ? 'news':'course';
      $type = 'course';
      //$txt = "<div class='banner'><img type='".$type."' direction='".$val['app_url']."' src='".$web_imgurl.'/'.$val['app_banner']."'/></div>";
      $img = $web_imgurl.'/'.$val['app_banner'];
      $return_arr[] = array('img'=>$img,'infoid'=>$val['app_url'],'type'=>$type);
    }
    $return_info = json_encode(array('responseData'=>$return_arr));
    $callback = $request->get ( 'callback' );
    
    echo $callback."(".$return_info.")";
    die;

  }

  public function actionGetcategoryByid() {
    $request = Yii::$app->request;
    $return_info = array('id'=>1,'name'=>'会计','icon'=>'icon-uniE610');
    $return_info = json_encode(array('responseData'=>$return_info));
    $callback = $request->get('callback');
    echo $callback."(".$return_info.")";
    exit;
  }
  /* 离线下载 */
  function actionGetitemname(){
    header("access-control-allow-origin: *");
    $request = Yii::$app->request;
    $productid = $request->get('productid');
    $web_imgurl = Yii::$app->params['web_imgurl'];
    $itemid = $request->get('itemid');
    $item_arr = array();
    $course_arr = array();
    $product = Product::find()->where('id in('.$productid.')')->all();
    foreach ($product as $key => $value) {
      $arr['id'] = $value->id;
      $arr['img'] = $web_imgurl.$value->pic;
      $arr['name'] = $value->name;
      $course_arr[$value->id] = $arr;
      /*foreach ($value['courses'] as $k => $v) {
        $courseid[] = $v['cid'];
      }*/
    }
    //$cid_arr = implode($courseid, ',');
    //$items = CC_Citems::find()->where("course_id in(".$cid_arr.")")->orderBy('index_id')->all();
    if(!empty($itemid)){
      $items = CC_Citems::find()->where("id in(".$itemid.")")->orderBy('index_id')->all();
      foreach ($items as $m => $n) {
        $vinfo = $this->get_item_vinfo($n);
        $size = round($vinfo['size']/1024/1024);
        $i_arr['title'] = $n->title;
        $i_arr['size'] = $size;
        $item_arr[$n->id] = $i_arr;
      }
    }
    $return_info['item'] = $item_arr;
    $return_info['course'] = $course_arr;
    $return_info = json_encode($return_info);
    $callback = $request->get('callback');
    echo $callback."(".$return_info.")";
    exit;
    
  }
  /* 已下载视频 */
  function actionGetloadedvideo(){
    header("access-control-allow-origin: *");
    $request = Yii::$app->request;
    $productid = $request->get('productid');
    $item_id = $request->get('item_id');
    $web_imgurl = Yii::$app->params['web_imgurl'];

    $item_arr = array();
    $course_arr = array();
    $product = Product::findOne($productid);
    //$courses = $product->courses;
    $item_arr['title'] = $product['name'];
    if(!empty($item_id)){
      //$cid_arr = implode($courseid, ',');
      $items = CC_Citems::find()->where("id in(".$item_id.")")->orderBy('index_id')->all();
      foreach ($items as $m => $n) {
        $vinfo = $this->get_item_vinfo($n);
        $size = round($vinfo['size']/1024/1024);
        $i_arr['title'] = $n->title;
        $i_arr['size'] = $size;
        $item_arr[$n->id] = $i_arr;
      }
    }
    $return_info = $item_arr;
    $return_info = json_encode($return_info);
    $callback = $request->get('callback');
    echo $callback."(".$return_info.")";
    exit;
    
  }
  /**
   * 根据课程ID得到课件
   * @return [type] [description]
   */
  function actionCourseitems() {
  		header("access-control-allow-origin: *");
		$request = Yii::$app->request;
		$productid = $request->get('productid');
		//$userid = $request->get('userid');
		$userid = Yii::$app->user->identity->idst;
		$product = Product::findOne($productid);
		$courses = $product->courses;

		$puser = Productuser::findOne(['userid'=>$userid, 'productid'=>$productid]);
		if (!$puser) die;
		$courseid = $puser->last_courseid;
		if (!$courseid && $courses) {
			$courseid = $courses[0]->id;
		}
		$citemid = 0;

		$ret = [];
		foreach ($courses as $course) {
			$items = CC_Citems::find()->where(['course_id'=>$course->cid])->orderBy('index_id')->all();
			$data = [
				'id' => $course->id,
				'coursename' => $course->name,
				'icon' => 'icon1',
				'items' => [],
			];
			$try_items = $course->try_items ? explode(',', $course->try_items) : array();
			$itemid0 = null;
			foreach ($items as $item) {
				$vinfo = $this->get_item_vinfo($item);
        $size = round($vinfo['size']/1024/1024);
				$data['items'][] = [
					'itemid' => $item->id,
					'title' => $item->title,
					'vtype' => $item->vtype,
					'lock' => 0,
					'vpath' => $vinfo['path'],
					'try' => in_array($item->id, $try_items) ? 1 : 0,
					'size' => $size,
					'time' => Util::format_time($item->item_time),
				];
				if (!$itemid0 && $item->vtype == 0) $itemid0 = $item->id;
			}
			$ret[] = $data;

			if ($course->id == $courseid) {
				$cuser = Courseuser::findOne(['courseid'=>$courseid, 'userid'=>$userid]);
				$citemid = $cuser && $cuser->last_itemsid ? $cuser->last_itemsid : ($itemid0 ? $itemid0 : 0);
			}
		}

    $web_imgurl = Yii::$app->params['web_imgurl'];
		$appimg = $product->mbpic ? $product->mbpic : $product->pic;
		$product_arr = ['id'=>$productid, 'name'=>$product->name, 'appimg'=>$web_imgurl.$appimg];
		$return_arr = ['responseData' => $ret, 'productData'=>$product_arr, 'citemid'=>$citemid, 'ccourseid'=>$courseid];

		/*
		$return_info = '{
        "responseData": [
          {
            "id": "1",
            "coursename": "企管培训",
            "icon": "icon1",
            "items": [
              {
                "itemid": "9207",
                "title": "考试考情分析、会计法律制度构成",
                "vtype": "0",
                "type": 1,
                "lock": 0,
                "vpath": "http://cc1.mynep.com.cn:8081/uploads3/course/201510/cjfgykjzydd/1/vd_mb.mp4",
                "try": 0,
                "size": 23.3,
                "time": "23:3"
              },
              {
                "itemid": "9208",
                "title": "会计工作管理体制",
                "vtype": "0",
                "type": 1,
                "lock": 1,
                "vpath": "http://cc1.mynep.com.cn:8081/uploads3/course/201510/cjfgykjzydd/2/vd_mb.mp4",
                "try": 1,
                "size": 21.6,
                "time": "23:3"
              },
              {
                "itemid": "9209",
                "title": "会计核算",
                "vtype": "0",
                "type": 1,
                "lock": 2,
                "vpath": "http://cc1.mynep.com.cn:8081/uploads3/course/201510/cjfgykjzydd/3/vd_mb.mp4",
                "try": 0,
                "size": 13.1,
                "time": "23:3"
              },
              {
                "itemid": "9210",
                "title": "会计监督",
                "vtype": "0",
                "type": 1,
                "lock": 3,
                "vpath": "http://cc1.mynep.com.cn:8081/uploads3/course/201510/cjfgykjzydd/4/vd_mb.mp4",
                "try": 0,
                "size": 3.3,
                "time": "23:3"
              }
            ]
          },{
            "id": "2",
            "coursename": "会计基础应用",
            "icon": "icon2",
            "items": [
              {
                "itemid": "9211",
                "title": "考试考情分析、会计法律制度构成",
                "vtype": "0",
                "type": 1,
                "lock": 0,
                "vpath": "http://cc1.mynep.com.cn:8081/uploads3/course/201510/cjfgykjzydd/1/vd_mb.mp4",
                "try": 0,
                "size": 23.3,
                "time": "23:3"
              },
              {
                "itemid": "9212",
                "title": "会计工作管理体制",
                "vtype": "0",
                "type": 1,
                "lock": 1,
                "vpath": "http://cc1.mynep.com.cn:8081/uploads3/course/201510/cjfgykjzydd/2/vd_mb.mp4",
                "try": 0,
                "size": 23.3,
                "time": "23:3"
              },
              {
                "itemid": "9213",
                "title": "会计核算",
                "vtype": "0",
                "type": 1,
                "lock": 2,
                "vpath": "http://cc1.mynep.com.cn:8081/uploads3/course/201510/cjfgykjzydd/3/vd_mb.mp4",
                "try": 1,
                "size": 23.3,
                "time": "23:3"
              },
              {
                "itemid": "9214",
                "title": "会计工作管理体制",
                "vtype": "0",
                "type": 1,
                "lock": 1,
                "vpath": "http://cc1.mynep.com.cn:8081/uploads3/course/201510/cjfgykjzydd/2/vd_mb.mp4",
                "try": 0,
                "size": 23.3,
                "time": "23:3"
              },
              {
                "itemid": "9215",
                "title": "会计核算",
                "vtype": "0",
                "type": 1,
                "lock": 2,
                "vpath": "http://cc1.mynep.com.cn:8081/uploads3/course/201510/cjfgykjzydd/3/vd_mb.mp4",
                "try": 1,
                "size": 23.3,
                "time": "23:3"
              },
              {
                "itemid": "9216",
                "title": "会计工作管理体制",
                "vtype": "0",
                "type": 1,
                "lock": 1,
                "vpath": "http://cc1.mynep.com.cn:8081/uploads3/course/201510/cjfgykjzydd/2/vd_mb.mp4",
                "try": 0,
                "size": 23.3,
                "time": "23:3"
              },
              {
                "itemid": "9217",
                "title": "会计核算",
                "vtype": "0",
                "type": 1,
                "lock": 2,
                "vpath": "http://cc1.mynep.com.cn:8081/uploads3/course/201510/cjfgykjzydd/3/vd_mb.mp4",
                "try": 1,
                "size": 23.3,
                "time": "23:3"
              },
              {
                "itemid": "9218",
                "title": "会计监督",
                "vtype": "0",
                "type": 1,
                "lock": 3,
                "vpath": "http://cc1.mynep.com.cn:8081/uploads3/course/201510/cjfgykjzydd/4/vd_mb.mp4",
                "try": 0,
                "size": 23.3,
                "time": "23:3"
              }
            ]
          }
        ]
      }';

      $return_arr = json_decode($return_info);
		*/
      $return_info = json_encode($return_arr);
      $callback = $request->get('callback');
      echo $callback."(".$return_info.")";
      die;
  }

  /**
   * 根据课程ID得到课件（试看）
   * @return [type] [description]
   */
  function actionCourseitems2() {
  	header("access-control-allow-origin: *");
		$request = Yii::$app->request;
		$productid = $request->get('productid');
		//$userid = $request->get('userid');
		//$userid = Yii::$app->user->identity->idst;
		$product = Product::findOne($productid);
		$courses = $product->courses;

		$isbuy = 0;
		/*
		if ($userid) {
			$puser = Productuser::findOne(['userid'=>$userid, 'productid'=>$productid]);
			if ($puser) $isbuy = 1;
		}
		*/

		$ccourseid = 0;
		$citemid = 0;
		foreach ($courses as $course) {
			if (!$course->try_items) continue;
			$ccourseid = $course->id;
			$try_items = explode(',', $course->try_items);
			$citemid = $try_items[0];
			break;
		}

		$ret = [];
		foreach ($courses as $course) {
			$items = CC_Citems::find()->where(['course_id'=>$course->cid])->orderBy('index_id')->all();
			$data = [
				'id' => $course->id,
				'coursename' => $course->name,
				'icon' => 'icon1',
				'items' => [],
			];
			$try_items = $course->try_items ? explode(',', $course->try_items) : array();
			foreach ($items as $item) {
				$vinfo = $this->get_item_vinfo($item);
        $size = round($vinfo['size']/1024/1024);
				$data['items'][] = [
					'itemid' => $item->id,
					'title' => $item->title,
					'vtype' => $item->vtype,
					'lock' => 0,
					'vpath' => $vinfo['path'],
					'try' => in_array($item->id, $try_items) ? 1 : 0,
					'size' => $size,
					'time' => Util::format_time2($item->item_time),
				];
			}
			$ret[] = $data;
		}

        $web_imgurl = Yii::$app->params['web_imgurl'];
		$appimg = $product->mbpic ? $product->mbpic : $product->pic;
		$intr = preg_replace('/(<img [^>]*src=")(?:\/mynep)?\/sims\//', '\1/', $product->long_intr);
		$intr = preg_replace('/(<img [^>]*src=")\//', '\1'.$web_imgurl.'/', $intr);
		$product_arr = ['id'=>$productid, 'name'=>$product->name, 'appimg'=>$web_imgurl.$appimg, 'isbuy'=>$isbuy, 'price'=>$product->price, 'long_intr'=>$intr];
		$return_arr = ['responseData' => $ret, 'productData'=>$product_arr, 'citemid'=>$citemid, 'ccourseid'=>$ccourseid];
      $return_info = json_encode($return_arr);
      $callback = $request->get('callback');
      echo $callback."(".$return_info.")";
      die;
  }

  function get_item_vinfo($item) {
  	$keys = ['mb', 'st', 'hd'];
	$path = '';
	$size = 0;
	$croot = Yii::$app->params['course_center'];
	foreach ($keys as $key) {
		$p = $item["vd_${key}_path"];
		if ($p) {
			$path = $croot.$p;
			$size = $item["vd_${key}_size"];
			if (!$size) $size = 0;
			break;
		}
	}
	return ['path'=>$path, 'size'=>$size];
  }

  function actionGetquestions() {
  		header("access-control-allow-origin: *");
		$request = Yii::$app->request;
		$productid = $request->get('productid');
		//$userid = $request->get('userid');
		$product = Product::findOne($productid);
		$courses = $product->courses;
		//$details = $product->getDetails(1)->all();

		$courseids = ArrayHelper::getColumn($courses, 'id');
		$quizes = Quiz::find()->where(['course_id'=>$courseids])->orderBy('sendtime desc')->all();
		$ret = [];
		foreach ($quizes as $quiz) {
			if ($quiz->isanswer == 1) {
        $data = [
          'id' => $quiz->id,
          'title' => $quiz->title,
          'question' => $quiz->content,
          'quiz_time' => date('Y-m-d H:i:s', $quiz->sendtime),
        ];
				$data += [
					'answer' => $quiz->atxt,
					'answer_name' => $quiz->auser->name,
					'answer_time' => date('Y-m-d H:i:s', $quiz->atime),
				];
        $ret[] = $data;
			}
		}
        $return_info = json_encode($ret);
        $callback = $request->get('callback');
        echo $callback."(".$return_info.")";

  }

  function actionGetnotes() {
  		header("access-control-allow-origin: *");
		$request = Yii::$app->request;
		$productid = $request->get('productid');
		//$userid = $request->get('userid');
		$userid = Yii::$app->user->identity->idst;
		$product = Product::findOne($productid);
		$courses = $product->courses;
		//$details = $product->getDetails(1)->all();

		$courseids = ArrayHelper::getColumn($courses, 'id');
		$notes = Coursenotes::find()->where(['courseid'=>$courseids, 'userid'=>$userid])->orderBy('create_date desc')->all();
		$ret = [];
		foreach ($notes as $note) {
			$ret[] = [
				'id' => $note->id,
				'text' => $note->note,
				'video_time' => Util::format_time($note->note_time),
				'note_time' => date('Y-m-d H:i:s', $note->create_date),
			];
		}
        $return_info = json_encode($ret);
        $callback = $request->get('callback');
        echo $callback."(".$return_info.")";

  }

  function actionAddquiz() {
        header("access-control-allow-origin: *");
        $request = Yii::$app->request;
        //$userid = $request->get('userid');
        $userid = Yii::$app->user->identity->idst;
		$courseid = $request->get('courseid');
		$title = $request->get('title');
		$content = $request->get('content');

		$quiz = new Quiz();
		$quiz->course_id = $courseid;
		$quiz->title = $title;
		$quiz->content = $content;
		$quiz->userid = $userid;
		$quiz->sendtime = time();
		$quiz->add_time = 0;
		$quiz->ischeck = 1;
		$quiz->isend = 0;
		$quiz->ispublish = 0;
		$quiz->typeid = 17;
		$quiz->to_who = 2;
		if ($quiz->save()) {
			$flag = 1;
		} else {
			$flag = 0;
		}
        $return = array('flag'=>$flag);
        $return_info = json_encode($return);
        $callback = $request->get('callback');
        return $callback."(".$return_info.")";

  }

  function actionAddnote() {
    header("access-control-allow-origin: *");
    $request = Yii::$app->request;
    //$userid = $request->get('userid');
    $userid = Yii::$app->user->identity->idst;
		$courseid = $request->get('courseid');
		$itemid = $request->get('itemid');
		$content = $request->get('content');
		//$note_time = $request->get('note_time');
    $time = $request->get('note_time');
    $minute = intval($time/60);
    $second = $time%60;
    if($minute<10){
      $minute = '0'.$minute;
    }
    if($second<10){
      $second = '0'.$second;
    }
    $rtime = $minute.":".$second;
		$note = new Coursenotes();
		$note->userid = $userid;
		$note->courseid = $courseid;
		$note->itemid = $itemid;
		$note->note = $content;
		$note->note_time = $time;
		$note->create_date = time();
		if ($note->save()) {
			$flag = 1;
		} else {
			$flag = 0;
		}
    $return = array('flag'=>$flag,'time'=>$rtime,'id'=>$note->attributes['id']);
    $return_info = json_encode($return);
    $callback = $request->get('callback');
    return $callback."(".$return_info.")";

  }

  /**
   * 课程数据代理
   * @return [type] [description]
   */
  function actionProxy(){
	$request = Yii::$app->request;
	$url = $request->get('url');
	$callback = $request->get('callback');
	$html = file_get_contents($url);
	$html = preg_replace('/^\xef\xbb\xbf/', "", $html);
	return $callback."(".json_encode($html).");";
  }

	//startup配置xml
	function actionStartupxml() {
		//header('Content-Type: text/xml');
		$request = Yii::$app->request;
		//$userid = $request->get('userid');
        $userid = Yii::$app->user->identity->idst;
		$isMobile = true;
		//if ($isMobile) $user = array('id'=>$this->_context->userId);
		$courseid = $request->get('courseid');
		$itemid = $request->get('itemid');
		$historyid = $request->get('historyid');
		$citem = CC_Citems::findOne($itemid);
		//$ccourse = CC_Course::find()->getById($citem->course_id);
		$cuser = Courseuser::findOne(['courseid'=>$courseid, 'userid'=>$userid]);
		$tracking = Itemtrack::findOne(['itemid'=>$itemid, 'userid'=>$userid]);

		$now = time();
		if (!$cuser) {
			$cuser = new Courseuser();
			$cuser->courseid = $courseid;
			$cuser->userid = $userid;
			$cuser->date_get = $now;
			$cuser->back_only = 1;
			$cuser->openflag = 1;
			$cuser->save();
		}
		if (!$historyid) {//手机端
			if (!$tracking) {
				$user = User::findOne($userid);
				$tracking = new Itemtrack([
					'itemid' => $citem->id,
					'userid' => $userid,
					'user_name' => $user->name,
					'lesson_status' => 1,
					'test_score_raw' => 0,
					'test_score_max' => 0,
					'quiz_score_raw' => 0,
					'quiz_score_max' => 0,
					'total_num' => 1,
					'total_time' => 0,
					'exit_time' => 0,
					'max_reach_time' => 0,
					'access_first' => $now,
					'access_last' => $now,
					'checkpoint_first' => 0,
					'checkpoint_second' => 0,
					'checkpoint_third' => 0,
					'is_learning' => 1,
				]);
				$tracking->save();
			} else {
				$tracking->total_num++;
				$tracking->access_last = $now;
				$tracking->is_learning = 1;
				//$tracking->save();
			}
			//同时只能看一个课
			Itemtrack::updateAll(['is_learning'=>0, 'learning_hisid'=>0], 'userid=:userid and itemid<>:itemid', [':userid'=>$userid, ':itemid'=>$itemid]);
			//生成History
			$history = new Trackhistory();
			$history->itemid = $tracking->id;
			$history->userid = $userid;
			$history->total_time = 0;
			$history->stime = $now;
			$history->etime = $now;
			$history->quiz_score = 0;
			$history->test_score = 0;
			$history->save();
			$historyid = $history->id;
			$tracking->learning_hisid = $history->id;
			$tracking->save();

			$cuser->last_itemsid = $citem->id;
			$cuser->save();
		}

		$croot = Yii::$app->params['course_center'];
		$backOnly = $cuser['back_only'];  //默认不允许拖动到未看过的内容
		$backOnly = false;
		$autostart = true; //默认不自动播放
		//if (!empty($_GET['start'])) $autostart = true; //如果是从笔记中跳转的，则必须自动播放
		$updInterval = 30;


		$fileNormalUrl = $citem['vd_st_path']?$croot.$citem['vd_st_path']:'';  //视频标清地址
		$fileHighUrl = $citem['vd_hd_path']?$croot.$citem['vd_hd_path']:'';  //视频高清地址
		$fileMobileUrl = $citem['vd_mb_path']?$croot.$citem['vd_mb_path']:'';  //视频移动端地址
		$catalogUrl = $citem['catalog_xml']?$croot.$citem['catalog_xml']:'';  //目录
		$quizUrl = $citem['quiz_xml']?$croot.$citem['quiz_xml']:'';  //测验
		//$noteUrl = $croot.$citem['note_xml'];  //笔记
		$bugUrl = $citem['wrong_xml']?$croot.$citem['wrong_xml']:'';  //纠错
		$noteUrl = Url::to(['course/note']);  //笔记
		//$updStatusUrl = "http://192.168.1.116/jobplayer/updStatus.php";  //学习状态提交地址
		$updStatusUrl = Url::to(['course/updstatus']);  //学习状态提交地址
		//$quizPostUrl = "http://192.168.1.116/jobplayer/quizPost.php";  //测验结果提交地址
		$quizPostUrl = Url::to(['course/quizpost']);  //测验结果提交地址
		$subtitleUrl = $citem['caption_file']?$croot.$citem['caption_file']:'';  //字幕
		$bugPostUrl = Url::to(['course/addbug']);  //纠错提交地址

		$start = empty($_GET['start']) ? $tracking['exit_time'] : $_GET['start'];  //开始时间点

		//人脸识别
		//$faceFlag = empty($user['faceLogined']);
		$faceFlag = true;
		$faceUrl = Url::to(['course/faceupload']);

		$xml = "";
		$xml .= "<fileUrl>\n";
		if ($fileNormalUrl) {
			$xml .= "<normal>".$fileNormalUrl."</normal>\n";
		}
		if ($fileHighUrl) {
			$xml .= "<high>".$fileHighUrl."</high>\n";
		}
		if ($fileMobileUrl) {
			$xml .= "<mobile>".$fileMobileUrl."</mobile>\n";
		}
		$fileQuality = 'mobile';
		if (!$fileMobileUrl) {
			$fileQuality = 'normal';
			if (!$fileNormalUrl) $fileQuality = 'high';
		}
		$xml .= "</fileUrl>\n";
		$xml .= "<fileQuality>".$fileQuality."</fileQuality>\n";
		$xml .= "<catalogUrl>".$catalogUrl."</catalogUrl>\n";
		$xml .= "<quizUrl>".$quizUrl."</quizUrl>\n";
		$xml .= "<backOnly>".($backOnly?"true":"false")."</backOnly>\n";
		$xml .= "<maxViewedTime>".($tracking['max_reach_time']?$tracking['max_reach_time']:0)."</maxViewedTime>\n";
		$xml .= "<lastViewedTime>".($start?$start:0)."</lastViewedTime>\n";
		$xml .= "<updInterval>$updInterval</updInterval>\n";
		$xml .= "<noteUrl>".$noteUrl."</noteUrl>\n";
		$xml .= "<bugUrl>".$bugUrl."</bugUrl>\n";
		$xml .= "<updStatusUrl>".$updStatusUrl."</updStatusUrl>\n";
		$xml .= "<quizPostUrl>".$quizPostUrl."</quizPostUrl>\n";
		$xml .= "<bugPostUrl>".$bugPostUrl."</bugPostUrl>\n";
		$xml .= "<subtitleUrl>".$subtitleUrl."</subtitleUrl>\n";
		$xml .= "<autostart>".($autostart?"true":"false")."</autostart>\n";
		$xml .= "<faceFlag>".($faceFlag?"true":"false")."</faceFlag>\n";
		$xml .= "<faceUrl>".$faceUrl."</faceUrl>\n";
		$xml .= "<userId>".$userid."</userId>\n";
		$xml .= "<courseId>".$courseid."</courseId>\n";
		$xml .= "<scoId>".$itemid."</scoId>\n";
		$xml .= "<scoTitle>".$citem['title']."</scoTitle>\n";
		if ($historyid) $xml .= "<historyId>".$historyid."</historyId>\n";
		$out = "<?xml version=\"1.0\" encoding=\"utf-8\"?".">\n";
		$out .= "<root>\n";
		$out .= $xml;
		$out .= "</root>";
		$callback = $request->get('callback');
		return $callback."(".json_encode($out).");";

	}

	//startup配置xml（试看）
	function actionStartupxml2() {
		//header('Content-Type: text/xml');
		$request = Yii::$app->request;
		$userid = $request->get('userid');
		$isMobile = true;
		//if ($isMobile) $user = array('id'=>$this->_context->userId);
		$courseid = $request->get('courseid');
		$itemid = $request->get('itemid');
		$citem = CC_Citems::findOne($itemid);
		//$ccourse = CC_Course::find()->getById($citem->course_id);

		$croot = Yii::$app->params['course_center'];
		$backOnly = false;
		$autostart = true; //默认不自动播放
		//if (!empty($_GET['start'])) $autostart = true; //如果是从笔记中跳转的，则必须自动播放
		$updInterval = 30;


		$fileNormalUrl = $citem['vd_st_path']?$croot.$citem['vd_st_path']:'';  //视频标清地址
		$fileHighUrl = $citem['vd_hd_path']?$croot.$citem['vd_hd_path']:'';  //视频高清地址
		$fileMobileUrl = $citem['vd_mb_path']?$croot.$citem['vd_mb_path']:'';  //视频移动端地址
		$catalogUrl = $citem['catalog_xml']?$croot.$citem['catalog_xml']:'';  //目录
		$quizUrl = $citem['quiz_xml']?$croot.$citem['quiz_xml']:'';  //测验
		//$noteUrl = $croot.$citem['note_xml'];  //笔记
		$bugUrl = $citem['wrong_xml']?$croot.$citem['wrong_xml']:'';  //纠错
		$noteUrl = Url::to(['course/note']);  //笔记
		//$updStatusUrl = "http://192.168.1.116/jobplayer/updStatus.php";  //学习状态提交地址
		$updStatusUrl = Url::to(['course/updstatus']);  //学习状态提交地址
		//$quizPostUrl = "http://192.168.1.116/jobplayer/quizPost.php";  //测验结果提交地址
		$quizPostUrl = Url::to(['course/quizpost']);  //测验结果提交地址
		$subtitleUrl = $citem['caption_file']?$croot.$citem['caption_file']:'';  //字幕
		$bugPostUrl = Url::to(['course/addbug']);  //纠错提交地址

		$start = 0;  //开始时间点

		//人脸识别
		//$faceFlag = empty($user['faceLogined']);
		$faceFlag = true;
		$faceUrl = Url::to(['course/faceupload']);

		$xml = "";
		$xml .= "<fileUrl>\n";
		if ($fileNormalUrl) {
			$xml .= "<normal>".$fileNormalUrl."</normal>\n";
		}
		if ($fileHighUrl) {
			$xml .= "<high>".$fileHighUrl."</high>\n";
		}
		if ($fileMobileUrl) {
			$xml .= "<mobile>".$fileMobileUrl."</mobile>\n";
		}
		$fileQuality = 'mobile';
		if (!$fileMobileUrl) {
			$fileQuality = 'normal';
			if (!$fileNormalUrl) $fileQuality = 'high';
		}
		$xml .= "</fileUrl>\n";
		$xml .= "<fileQuality>".$fileQuality."</fileQuality>\n";
		$xml .= "<catalogUrl>".$catalogUrl."</catalogUrl>\n";
		$xml .= "<quizUrl>".$quizUrl."</quizUrl>\n";
		$xml .= "<backOnly>".($backOnly?"true":"false")."</backOnly>\n";
		$xml .= "<maxViewedTime>0</maxViewedTime>\n";
		$xml .= "<lastViewedTime>".($start?$start:0)."</lastViewedTime>\n";
		$xml .= "<updInterval>$updInterval</updInterval>\n";
		$xml .= "<noteUrl>".$noteUrl."</noteUrl>\n";
		$xml .= "<bugUrl>".$bugUrl."</bugUrl>\n";
		$xml .= "<updStatusUrl>".$updStatusUrl."</updStatusUrl>\n";
		$xml .= "<quizPostUrl>".$quizPostUrl."</quizPostUrl>\n";
		$xml .= "<bugPostUrl>".$bugPostUrl."</bugPostUrl>\n";
		$xml .= "<subtitleUrl>".$subtitleUrl."</subtitleUrl>\n";
		$xml .= "<autostart>".($autostart?"true":"false")."</autostart>\n";
		$xml .= "<faceFlag>".($faceFlag?"true":"false")."</faceFlag>\n";
		$xml .= "<faceUrl>".$faceUrl."</faceUrl>\n";
		$xml .= "<userId>0</userId>\n";
		$xml .= "<courseId>".$courseid."</courseId>\n";
		$xml .= "<scoId>".$itemid."</scoId>\n";
		$xml .= "<scoTitle>".$citem['title']."</scoTitle>\n";
		$xml .= "<viewFlag>true</viewFlag>\n";
		$out = "<?xml version=\"1.0\" encoding=\"utf-8\"?".">\n";
		$out .= "<root>\n";
		$out .= $xml;
		$out .= "</root>";
		$callback = $request->get('callback');
		return $callback."(".json_encode($out).");";

	}

	//学习状态提交
	function actionUpdstatus() {
		$request = Yii::$app->request;
		$userid = $request->get('userId');
		$isMobile = true;
		//if ($isMobile) $user = array('id'=>$this->_context->userId);
		$scoId = $request->get('scoId');
		$courseId = $request->get('courseId');
		$historyId = $request->get('historyId');
		$addTime = $request->get('addTime');
		//print_r($scoId."|".$courseId."|".$historyId."|".$addTime);exit;
		$currentTime = $request->get('currentTime');//当前时间，可用来更新最后一次访问时间，学习到达最远时间点等
		$hasCheckOne = $this->cbool($request->get('hasCheckOne')) ? 1 : 0;
		$hasCheckTwo = $this->cbool($request->get('hasCheckTwo')) ? 1 : 0;
		$hasCheckThree = $this->cbool($request->get('hasCheckThree')) ? 1: 0;
		$firstUpdate = $this->cbool($request->get('firstUpdate'));
		$tracking = Itemtrack::findOne(['itemid'=>$scoId, 'userid'=>$userid]);

		$status = 1;
		//检查是否已经停止学习状态（如果另开了一个窗口看课的话）
		if ($tracking && $historyId && (!$tracking->is_learning || $tracking->learning_hisid != $historyId)) {
			$status = -1;
		}else {
			$now = time();
			if (!$tracking) {
				$user = User::findOne($userid);
				$tracking = new Itemtrack(array(
					'itemid' => $scoId,
					'userid' => $userid,
					'user_name' => $user->name,
					'lesson_status' => 1,
					'test_score_raw' => 0,
					'test_score_max' => 0,
					'quiz_score_raw' => 0,
					'quiz_score_max' => 0,
					'total_num' => 1,
					'total_time' => 0,
					'max_reach_time' => 0,
					'access_first' => $now,
					'access_last' => $now,
					'checkpoint_first' => 0,
					'checkpoint_second' => 0,
					'checkpoint_third' => 0,
					'is_learning' => 1,
				));
				$tracking->save();
			}
			//更新
			$history = Trackhistory::findOne($historyId);
			if (!$historyId) {
				$tracking->total_num += 1;  //学习次数
				$history = new Trackhistory();
				$history->itemid = $scoId;
				$history->userid = $userid;
				$history->total_time = $addTime;
				$history->stime = $now;
				$history->etime = $now;
				$history->quiz_score = 0;
				$history->test_score = 0;
				$history->save();
				$tracking->learning_hisid = $history->id;
				$tracking->is_learning = 1;
				//同时只能看一个课
				Itemtrack::updateAll(['is_learning'=>0, 'learning_hisid'=>0], 'userid=:userid and itemid<>:itemid', [':userid'=>$userid, ':itemid'=>$scoId]);
			} else {
				$history->total_time += $addTime;
				$history->etime = $now;
			}

			$tracking['total_time'] = ($tracking['total_time']-0) + ($addTime-0);  //学习总时间
			$tracking['exit_time'] = $currentTime;  //最后退出时间点
			$tracking['max_reach_time'] = max($tracking['max_reach_time'], $currentTime);  //该课件中最大到达时间点
			if (!$tracking['access_first'])
				$tracking['access_first'] = $now;  //初次访问时间
			$tracking['access_last'] = $now;  //最后一次访问时间
			if (!$tracking['checkpoint_first']) $tracking['checkpoint_first'] = $hasCheckOne;  //时间点1
			if (!$tracking['checkpoint_second']) $tracking['checkpoint_second'] = $hasCheckTwo;  //时间点2
			if (!$tracking['checkpoint_third']) $tracking['checkpoint_third'] = $hasCheckThree;  //时间点3
			//判断是否完成
			if ($tracking->checkpoint_first && $tracking->checkpoint_second && $tracking->checkpoint_third
					&& $tracking->total_time >= $tracking->item->item_time - 6) //留下6秒的缓冲余地
				$tracking->lesson_status = 2;



			$history->save();
			$tracking->save();

			//更新学习进度
			$cuser = Courseuser::findOne(['courseid'=>$courseId, 'userid'=>$userid]);
			$cuser->updateProgress();
			$cuser->save();
		}
		//输出结果xml
		$resultXml = "<?xml version=\"1.0\" encoding=\"utf-8\"?".">\n";
		$resultXml .= "<root>\n";
		$resultXml .= "<status>$status</status>\n";
		if (!$historyId) $resultXml .= "<historyId>".$history->id."</historyId>\n";
		$resultXml .= "</root>";
		$callback = $request->get('callback');
		return $callback."(".json_encode($resultXml).");";
	}

	function cbool($v) {
		if (!$v) return false;
		return $v != 'false';
	}

	//测验提交
	function actionQuizpost() {
		$request = Yii::$app->request;
		$userid = $request->get('userId');
		$isMobile = true;
		//if ($isMobile) $user = array('id'=>$this->_context->userId);
		$scoId = $request->get('scoId');
		$courseId = $request->get('courseId');
		$historyId = $request->get('historyId');
		$quizCorrectNum = $request->get('quizCorrectNum');
		$quizNum = $request->get('quizNum');
		$quizScore = $request->get('quizScore');
		$quizScoreAll = $request->get('quizScoreAll');
		$quizIndex = $request->get('quizIndex');
		$isTest = $this->cbool($request->get('isTest'));
		$tracking = Itemtrack::findOne(['itemid'=>$scoId, 'userid'=>$userid]);
		if (!$tracking) {
			$user = User::findOne($userid);
			$tracking = new Itemtrack([
				'itemid' => $scoId,
				'userid' => $userid,
				'user_name' => $user->name,
				'lesson_status' => 1,
			    'test_score_raw' => 0,
			    'test_score_max' => 0,
			    'quiz_score_raw' => 0,
			    'quiz_score_max' => 0,
				'total_num' => 1,
				'total_time' => 0,
				'max_reach_time' => 0,
				'access_first' => 0,
				'access_last' => 0,
				'checkpoint_first' => 0,
				'checkpoint_second' => 0,
				'checkpoint_third' => 0,
			]);
		}

		$tracking->setQuiz($quizScore, $isTest, $quizIndex);
		$tracking->save();

		//总分
		$cuser = Courseuser::findOne(['courseid'=>$courseId, 'userid'=>$userid]);
		if (!$isTest) {
			$cuser->updateQuiz();
		} else {
			$cuser->updateTest();
		}
		$cuser->save();

		//更新历史记录
		$history = Trackhistory::findOne($historyId);
		if ($history) {
			if (!$isTest) {
				$history->quiz_score = $quizScoreAll;
			} else {
				$history->test_score = $quizScore;
			}
			$history->save();
		}
	}

  /**
   * 首页课程、类别数据
   * @return [type] [description]
   */
  function actionIndexcourse(){
        $request = Yii::$app->request;
        $catId = $request->get('catId');
        $web_imgurl = Yii::$app->params['web_imgurl'];
        if(empty($catId)){
          $catId = Yii::$app->params['catId'];
        }
        $ctype_arr = Ctype::find()->where(['pid'=>$catId])->orderBy('corder desc')->all();
        $cids = ArrayHelper::getColumn($ctype_arr, 'id');
        $cids[] = 0;
        $p_arr = Product::find()->where('type in ('.implode(',', $cids).') and onsale=:onsale',array('onsale'=>1))->limit('6')->all();
        $pinfo_list = ArrayHelper::mapObjArr($p_arr, 'type');
        $return_info = array();
        //var_dump($p_arr);
        foreach ($ctype_arr as $k=>$v){
        	$info = [];
        	$info['id'] = $v['id'];
        	$info['title'] = $v['val'];
        	$info['free'] = '1';
        	$info['address'] = empty($v['app_address'])?"coursepage":$v['app_address'];
        	$courselists = [];
        	if(!empty($pinfo_list)&&!empty($pinfo_list[$v['id']])){
        		foreach ($pinfo_list[$v['id']] as $pkey => $pval){
              $appimg = $pval->mbpic ? $pval->mbpic : $pval->pic;
        			$pinfo = [];
        			$pinfo['id'] = $pval->id;
        			$pinfo['img'] = $web_imgurl.$appimg;
        			$pinfo['itemid'] = '0';
        			$pinfo['name'] = $pval->name;
        			$pinfo['teacher_names'] = '-';
        			$pinfo['price'] = $pval->price;
        			$pinfo['free'] = (empty($pval->price)?1:0);
        			$pinfo['vtype'] = '0';
        			$pinfo['authorize_flag'] = '0';
        			$courselists[] = $pinfo;
					if (count($courselists)>5)
						break;
        		}
        	}
        	$info['courselists'] = $courselists;
        	$return_info[] = $info;
        }
        /*
        $return_info = '{
      "responseData": [
        {
          "id": 2,
          "title": "畅销好课",
          "free": 1,
          "courselists": [
            {
              "id": "3",
              "img": "http://cc1.mynep.com.cn:8081/uploads3/course/201510/CJKJSW/CJKJSW_mbimg.png",
              "itemid": "9524",
              "name": "2015年初级《初级会计实务》",
              "teacher_names": "何爽",
              "price": 0,
              "free": 1,
              "vtype": 0,
              "authorize_flag": 1
            },
            {
              "id": "8",
              "img": "http://cc1.mynep.com.cn:8081/uploads3/course/201510/cjfgykjzydd/cjfgykjzydd_mbimg.png",
              "itemid": "9207",
              "name": "2016年从业《财经法规与会计职业道德》",
              "teacher_names": "何爽,迟小岩,刘磊",
              "price": 0,
              "free": 1,
              "vtype": 0,
              "authorize_flag": 1
            },
            {
              "id": "9",
              "img": "http://cc1.mynep.com.cn:8081/uploads3/course/201510/kjjc/kjjc_mbimg.png",
              "itemid": "9232",
              "name": "2016年从业《会计基础》",
              "teacher_names": "何爽,郑少艳,李艳,迟小岩,李平英",
              "price": 0,
              "free": 1,
              "vtype": 0,
              "authorize_flag": 1
            }
          ]
        },
        {
          "id": 31,
          "title": "课程",
          "free": 0,
          "courselists": [
            {
              "id": "2",
              "img": "http://cc1.mynep.com.cn:8081/uploads3/course/201510/kjdsh/kjdsh_mbimg.png",
              "itemid": "9330",
              "name": "2016年从业《会计电算化》",
              "teacher_names": "张娜，徐胜国",
              "price": "10",
              "free": 0,
              "vtype": 0,
              "authorize_flag": 1
            },
            {
              "id": "9",
              "img": "http://cc1.mynep.com.cn:8081/uploads3/course/201510/kjjc/kjjc_mbimg.png",
              "itemid": "9232",
              "name": "2016年从业《会计基础》",
              "teacher_names": "何爽,郑少艳,李艳,迟小岩,李平英",
              "price": 0,
              "free": 1,
              "vtype": 0,
              "authorize_flag": 1
            }
          ]
        },
        {
          "id": 31,
          "title": "报班",
          "free": 0,
          "courselists": [
            {
              "id": "2",
              "img": "http://cc1.mynep.com.cn:8081/uploads3/course/201510/kjdsh/kjdsh_mbimg.png",
              "itemid": "9330",
              "name": "2016年从业《会计电算化》",
              "teacher_names": "张娜，徐胜国",
              "price": "10",
              "free": 0,
              "vtype": 0,
              "authorize_flag": 1
            },
            {
              "id": "9",
              "img": "http://cc1.mynep.com.cn:8081/uploads3/course/201510/kjjc/kjjc_mbimg.png",
              "itemid": "9232",
              "name": "2016年从业《会计基础》",
              "teacher_names": "何爽,郑少艳,李艳,迟小岩,李平英",
              "price": 0,
              "free": 1,
              "vtype": 0,
              "authorize_flag": 1
            },
            {
              "id": "8",
              "img": "http://cc1.mynep.com.cn:8081/uploads3/course/201510/cjfgykjzydd/cjfgykjzydd_mbimg.png",
              "itemid": "9207",
              "name": "2016年从业《财经法规与会计职业道德》",
              "teacher_names": "何爽,迟小岩,刘磊",
              "price": 0,
              "free": 1,
              "vtype": 0,
              "authorize_flag": 1
            }
          ]
        }
      ]
    }';*/
        //$return_arr = json_decode($return_info);
        $return_arr = json_encode(array('responseData'=>$return_info));
        $callback = $request->get('callback');
        echo $callback."(".$return_arr.")";
        die;
    }
    /**
   * 绑定课程码
   * @return [type] [description]
   */
  public function actionBindcode(){
    $request = Yii::$app->request;
	$userid = Yii::$app->user->identity->idst;
    $code = $request->get('code');
	$error = '';
	$card = Card::findOne(['ccode'=>$code, 'isactive'=>1, 'isbind'=>0]);
	do {
		if (!$card) {
			$error = '该产品绑定编码无效！';
			break;
		}
		$puser = Productuser::findOne(['userid'=>$userid, 'productid'=>$card->pro_id]);
		if ($puser) {
			$error = '您已经拥有该产品，不需要重复绑定！';
			break;
		}
		$card->doBind($userid);
	} while (0);
	if ($error) {
		$return_arr = ['flag'=>0, 'error'=>$error];
	} else {
		$return_arr = ['flag'=>1];
	}
    $return_info = json_encode($return_arr);
    $callback = $request->get('callback');
    echo $callback."(".$return_info.")";
    die;
  }

    /**
   * 得到课程详细页-常见问题
   * @return [type] [description]
   */
  public function actionGetanswer(){
    $request = Yii::$app->request;
    $courseid = $request->get('courseid');

    $return_info = array(
        array(
          'id'=>1,
          'question'=>'网页中如何用css让两个DIV和表格居中我用css的margin已经测试过了，失效，请大家帮忙解决一下，在既不破坏当前',
          'answer'=>'两个DIV块本身是居中的，表格居中的话，就在你CSSlocked-column的div#tbl-container 里添加如下码'),
        array('id'=>2,'question'=>'借贷记帐法 总是弄不清帐户性质。资产类是借=+ 贷=- 那么资产类的帐户一般都有哪些？负债类的呢？有什么好方法能容易的弄清会计分录时的帐户增减方','answer'=>'借贷记账法：1.资产类和费用 (成本）类借增贷减。2.所有者权益类、负债类和收入类借减贷增。3.双重性（共同性）类，借方可登记资产、费用类的增加和负债、所有者权益的减少，贷方登记资产、费用的减少和负债、所有者权益、收入的增加。这类主要有本年利润，材料成本差异、应收账款、应付账款和其他往来账户等。
你只要明白了那些科目是资产类，负债类，所有者权益类等等，你才能从根本上去认识这些问题。好好看看课本，你会受益无穷的。'),
        array('id'=>3,'question'=>'问2','answer'=>'答2'),
        array('id'=>4,'question'=>'问3','answer'=>'答3'),
        array('id'=>5,'question'=>'问4','answer'=>'答4')
    );
    $return_info = json_encode(array('responseData'=>$return_info));
    $callback = $request->get('callback');
    echo $callback."(".$return_info.")";
    exit;
  }

	public function actionGetcoursebyid(){
		$request = Yii::$app->request;
		$productid = $request->get('productid');
    $product = Product::findOne($productid);
    //var_dump($productid);
    $return_arr = ['responseData'=>['price'=>$product->price,'name'=>$product->name]];
		
	    $return_info = json_encode($return_arr);
	    $callback = $request->get('callback');
	    echo $callback."(".$return_info.")";
	    die;
	}
  /* 笔记提交 */
  public function actionNotesubmit(){
    $request = Yii::$app->request;
    $value = $request->get('value');
    $time = $request->get('time');
    $minute = intval($time/60);
    $second = $time%60;
    if($minute<10){
      $minute = '0'.$minute;
    }
    if($second<10){
      $second = '0'.$second;
    }
    $rtime = $minute.":".$second;
    $return_arr = array('flag'=>'1','time'=>$rtime,'id'=>rand(1,100));
    $return_info = json_encode($return_arr);
    $callback = $request->get('callback');
    echo $callback."(".$return_info.")";
    die;
  }
  /* 笔记提交 */
  public function actionNotedelete(){
    $request = Yii::$app->request;
    $id = $request->get('id');
    $return_arr = array('flag'=>'1');
    $return_info = json_encode($return_arr);
    $callback = $request->get('callback');
    echo $callback."(".$return_info.")";
    die;
  }
  /* 答疑提交 */
  public function actionDayisubmit(){
    $request = Yii::$app->request;
    $value = $request->get('value');
    $return_arr = array('flag'=>'1');
    $return_info = json_encode($return_arr);
    $callback = $request->get('callback');
    echo $callback."(".$return_info.")";
    die;
  }
  /**
   * 得到微信支付参数
   * @return [type] [description]
   */
  public function actionWxpayparams(){
    $request = Yii::$app->request;
    define("APP_ID",  "wx7f1cf94ef1ea9163");
    // 商户号 (开户邮件中可查看)
    define("MCH_ID",  "1260525001");
    // 商户支付密钥 (https://pay.weixin.qq.com/index.php/account/api_cert)
    define("APP_KEY", "C6B64B44003000013DD711AF15089430");
    // get prepay id
    $prepay_id = $this->generatePrepayId(APP_ID, MCH_ID);
    // re-sign it
    $response = array(
        'appid'     => APP_ID,
        'partnerid' => MCH_ID,
        'prepayid'  => $prepay_id,
        'package'   => 'Sign=WXPay',
        'noncestr'  => $this->generateNonce(),
        'timestamp' => time(),
    );
    $response['sign'] = $this->calculateSign($response, APP_KEY);
    // send it to APP
    $return_info = json_encode($response);
    $callback = $request->get('callback');
    echo $callback."(".$return_info.")";
    die;
  }

  /**
   * Generate a nonce string
   *
   * @link https://pay.weixin.qq.com/wiki/doc/api/app.php?chapter=4_3
   */
  public function generateNonce()
  {
      return md5(uniqid('', true));
  }
  /**
   * Get a sign string from array using app key
   *
   * @link https://pay.weixin.qq.com/wiki/doc/api/app.php?chapter=4_3
   */
  public function calculateSign($arr, $key)
  {
      ksort($arr);
      $buff = "";
      foreach ($arr as $k => $v) {
          if ($k != "sign" && $k != "key" && $v != "" && !is_array($v)){
              $buff .= $k . "=" . $v . "&";
          }
      }
      $buff = trim($buff, "&");
      return strtoupper(md5($buff . "&key=" . $key));
  }
  /**
   * Get xml from array
   */
  public function getXMLFromArray($arr)
  {
      $xml = "<xml>";
      foreach ($arr as $key => $val) {
          if (is_numeric($val)) {
              $xml .= sprintf("<%s>%s</%s>", $key, $val, $key);
          } else {
              $xml .= sprintf("<%s><![CDATA[%s]]></%s>", $key, $val, $key);
          }
      }
      $xml .= "</xml>";
      //echo $xml;
      return $xml;
  }
  /**
   * Generate a prepay id
   *
   * @link https://pay.weixin.qq.com/wiki/doc/api/app.php?chapter=9_1
   */
  public function generatePrepayId($app_id, $mch_id)
  {
      $params = array(
          'appid'            => $app_id,
          'mch_id'           => $mch_id,
          'nonce_str'        => $this->generateNonce(),
          'body'             => 'Test product name',
          'out_trade_no'     => time(),
          'total_fee'        => 1,
          'spbill_create_ip' => '221.12.59.212',
          'notify_url'       => 'http://localhost',
          'trade_type'       => 'APP',
      );
      // add sign
      $params['sign'] = $this->calculateSign($params, APP_KEY);
      // create xml
      $xml = $this->getXMLFromArray($params);
      //var_dump($xml);
      // send request
      $ch = curl_init();
      curl_setopt_array($ch, array(
          CURLOPT_URL            => "https://api.mch.weixin.qq.com/pay/unifiedorder",
          CURLOPT_POST           => true,
          CURLOPT_RETURNTRANSFER => true,
          CURLOPT_HTTPHEADER     => array('Content-Type: text/xml'),
          CURLOPT_POSTFIELDS     => $xml,
      ));
      curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
      curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
      $result = curl_exec($ch);
      curl_close($ch);
      //echo $result;
      // get the prepay id from response
      $xml = simplexml_load_string($result);
      //var_dump(APP_KEY);
      return (string)$xml->prepay_id;
  }
  //end wxpay

  public function actionUsercourse(){
      $request = Yii::$app->request;
      $productid = $request->get('productid');
      $userid = Yii::$app->user->identity->idst;
      $puser = Productuser::findOne(['userid'=>$userid, 'productid'=>$productid]);
      if (!$puser)
        $buycourse = 0;
      else
        $buycourse = 1;
      $return_info = array('buycourse'=>$buycourse,'productid'=>$productid,'userId'=>$userid);
      $return_info = json_encode(array('responseData'=>$return_info));
      $callback = $request->get('callback');
      echo $callback."(".$return_info.")";
      die;
  }

}
