<?php
/**
 * Created by PhpStorm.
 * User: Sam
 * Date: 2016/7/5
 * Time: 14:43
 */

namespace backend\controllers;

use yii\web\Controller;
use Yii;
use yii\filters\auth\QueryParamAuth;
use yii\helpers\ArrayHelper;

class MobileclassController extends Controller
{
    public function behaviors()
    {
        return [
            'authenticator' => [
                'class' => QueryParamAuth::className(),
                'only' => ['getusercourse'],
            ],
        ];
    }

	/**
	 * 已经购买的课程
	 */
    public function actionGetusercourse() {
    	header("access-control-allow-origin: *");
        $request = Yii::$app->request;
        $userid = Yii::$app->user->identity->idst;
        $conn = Yii::$app->db;
        $sql = "select * from lc_productuser where userid=:userid";
        $pu_arr = $conn->createCommand($sql,array('userid'=>$userid))->queryAll();
        $web_imgurl = Yii::$app->params['web_imgurl'];
        $pids = ArrayHelper::getColumn($pu_arr, 'productid');
        $pids[] = 0;

        $sql = "select * from lc_product_detail where pid in (".implode(',', $pids).")";
        $pd_arr = $conn->createCommand($sql)->queryAll();
        $pd_list = ArrayHelper::mapObjArr($pd_arr,'pid');

        $sql = "select * from lc_product where id in (".implode(',', $pids).")";
        $p_arr = $conn->createCommand($sql)->queryAll();
        $p_list = ArrayHelper::mapObj($p_arr,'id');
        $return_info = array();

        foreach ($pu_arr as $key => $puinfo){
        	$info = [];
        	$pinfo = $p_list[$puinfo['productid']];
        	$pd_arr = empty($pd_list[$puinfo['productid']])?array():$pd_list[$puinfo['productid']];
            $appimg = $pinfo['mbpic'] ? $pinfo['mbpic'] : $pinfo['pic'];
        	$info['id'] = $puinfo['productid'];
        	$info['name'] = $pinfo['name'];           
        	$info['img'] = $web_imgurl.$appimg;
        	$info['videocount'] = '0';
        	$info['ebook'] = '0';
        	$info['practice'] = '0';
        	//$info['vid'] = '0';
        	//$info['bid'] = '0';
        	$info['pid'] = '0';
        	foreach ($pd_arr as $k => $dinfo){
        		$type = $dinfo['type'];
        		switch ($type){
        			case 1://课程（视频）
        				$data = $this->getinfoByType($type, $dinfo['rid']);
        				$info['videocount'] = $data['num'];
        				$info['pid'] = $dinfo['pid'];
        				break;
        			case 2://练习
        				$data = $this->getinfoByType($type, $dinfo['rid']);
        				$info['practice'] = $data['num'];
        				$info['pid'] = $dinfo['pid'];
        				break;
        			case 3://电子书
        				$data = $this->getinfoByType($type, $dinfo['rid']);
        				$info['ebook'] = $data['num'];
        				$info['pid'] = $dinfo['pid'];
        				break;
        		}
        	}
        	$return_info[] = $info;
        }
        /*
        $return_info = '{
        "responseData": [
          {
            "id": "1",
            "name": "基金投资指南与实际操作",
            "img": "./img/baoban.png",
            "process": "79"
        		
        	"videocount": "21",
            "ebook": "11",
            "practice": "13",
        		
        	"pid":"1";
        	"bid":
        	"vid":
          },{
            "id": "2",
            "name": "基金投资指南与实际操作",
            "videocount": "22",
            "ebook": "72",
            "practice": "11",
            "img": "./img/baoban.png",
            "process": "14"
          }
        ]
      }';
        $return_arr = json_decode($return_info);*/
        $return_info = json_encode(array('responseData'=>$return_info));
        $callback = $request->get('callback');
        echo $callback . "(" . $return_info . ")";
        exit;
    }

    //首页跳转报班接口
    public function actionApplycourse()
    {
        $request = Yii::$app->request;
        $web_imgurl = Yii::$app->params['web_imgurl'];
		$typeid = $request->get('typeid');
		$conn = Yii::$app->db;
        $sql = "select * from lc_product where onsale=1 and type=".$typeid;//得到产品
        $p_arr = $conn->createCommand($sql)->queryAll();
        $return_info = [];
        foreach ($p_arr as $k => $pinfo){

        	$info = [];
        	$info['id'] = $pinfo['id'];
        	$info['name'] = $pinfo['name'];
        	$info['price'] = $pinfo['price'];
        	$info['orginprice'] = $pinfo['gprice'];
        	$info['orgin'] = (empty($pinfo['gprice'])?0:1);
        	$info['free'] = (empty($pinfo['price'])?1:0);
			$info['img'] =(empty($pinfo['mbpic'])?$info['img'] = $web_imgurl.$pinfo['pic']:$info['img'] = $web_imgurl.$pinfo['mbpic']);

        	$info['content'] = $pinfo['short_intr'];
        	$return_info[] = $info;
        }
        /*
        $return_info = '{
        "responseData": [
          {
            "id": "1",
            "name": "基金投资指南与实际操作1",
            "price": "21",
            "orginprice": "300",
            "orgin": "0",
            "free": "0",
            "img": "./img/baoban.png",
            "content": "我是演讲咖：3周成为演讲沟通高手（创业职场必备）"
          },{
            "id": "2",
            "name": "基金投资指南与实际操作2",
            "price": "22",
            "orginprice": "740",
            "orgin": "0",
            "free": "0",
            "img": "./img/baoban.png",
            "content": "这是测试历史测测试试测试测试测试测试测试测试测试测试测试测试测试测试测试测试"
          }
        ]
      }';
        $return_arr = json_decode($return_info);*/
        $return_info = json_encode(array('responseData'=>$return_info));
        $callback = $request->get('callback');
        echo $callback . "(" . $return_info . ")";
        exit;
    }

    //首页跳转课程接口
    public function actionCoursepackge()
    {
        $request = Yii::$app->request;
        $web_imgurl = Yii::$app->params['web_imgurl'];
        $typeid = $request->get('typeid');
        $conn = Yii::$app->db;
        $sql = "select * from lc_product where onsale=1 and type=".$typeid;//得到产品
        $p_arr = $conn->createCommand($sql)->queryAll();
        $return_info = [];
        foreach ($p_arr as $k => $pinfo){
        	$info = [];
        	$info['id'] = $pinfo['id'];
        	$info['name'] = $pinfo['name'];
        	$info['price'] = $pinfo['price'];
        	$info['orginprice'] = $pinfo['gprice'];
        	$info['orgin'] = (empty($pinfo['gprice'])?0:1);
        	$info['free'] = (empty($pinfo['price'])?1:0);
			$info['img'] =(empty($pinfo['mbpic'])?$info['img'] = $web_imgurl.$pinfo['pic']:$info['img'] = $web_imgurl.$pinfo['mbpic']);
        	$info['content'] = $pinfo['short_intr'];
        	$return_info[] = $info;
        }
        /*
         $return_info = '{
         "responseData": [
         {
         "id": "1",
         "name": "基金投资指南与实际操作1",
         "price": "21",
         "orginprice": "300",
         "orgin": "0",
         "free": "0",
         "img": "./img/baoban.png",
         "content": "我是演讲咖：3周成为演讲沟通高手（创业职场必备）"
         },{
         "id": "2",
         "name": "基金投资指南与实际操作2",
         "price": "22",
         "orginprice": "740",
         "orgin": "0",
         "free": "0",
         "img": "./img/baoban.png",
         "content": "这是测试历史测测试试测试测试测试测试测试测试测试测试测试测试测试测试测试测试"
         }
         ]
         }';
         $return_arr = json_decode($return_info);*/
        $return_info = json_encode(array('responseData'=>$return_info));
        $callback = $request->get('callback');
        echo $callback . "(" . $return_info . ")";
        exit;
    }


    /**
     * 根据类型 以及ID获取需要的信息
     * @param unknown $type
     * @param unknown $infoid
     */
    public function getinfoByType($type,$infoid){
    	header("access-control-allow-origin: *");
    	$return_data = 0;
    	if($type == 1){//获取视频的数量
    		$c_conn = Yii::$app->get('cdb');
    		$sql = "select count(id) as num from cc_course_items where course_id=:course_id";
    		$return_data = $c_conn->createCommand($sql,array('course_id'=>$infoid))->queryOne();
    	}else if($type == 2){//练习 根据课程id获取练习数量
    		$conn = Yii::$app->db;
    		$sql = "select count(id) as num from exam_template_page where course_id=:course_id and totalnum>0";
    		$return_data = $conn->createCommand($sql,array('course_id'=>$infoid))->queryOne();
    	}else if($type == 3){
    		$conn = Yii::$app->db;
    		$sql = "select count(id) as num from sms_ebook where course_id=:course_id and is_delete=0";
    		$return_data = $conn->createCommand($sql,array('course_id'=>$infoid))->queryOne();
    	}
    	return $return_data;
    }
}