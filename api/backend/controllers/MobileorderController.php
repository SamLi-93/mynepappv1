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
use common\models\LoginForm;
use frontend\models\SignupForm;
use yii\filters\auth\QueryParamAuth;
use yii\helpers\ArrayHelper;
use backend\models\Order;

class MobileorderController extends Controller
{
	
	public function behaviors()
	{
		return [
				'authenticator' => [
						'class' => QueryParamAuth::className(),
						'only' => ['getlist','ordercancel'],
				],
		];
	}
	
    /*
     *  订单列表
     */
    public function actionGetlist()
    {
        header("access-control-allow-origin: *");
        $request = Yii::$app->request;
        $userid = Yii::$app->user->identity->idst;
        $conn = Yii::$app->db;
        $web_imgurl = Yii::$app->params['web_imgurl'];
        //$sql = "select * from sms_order where user_id=".$userid;
        //$order_arr = $conn->createCommand ($sql)->queryAll ();
        //得到用户产品
        $order = Order::find()->where(['user_id'=>$userid])->all();
        $oids = ArrayHelper::getColumn($order, 'id');
        $oids[] = 0;
        $sql = "select order_id,product_id from sms_order_detail where order_id in (".implode(',',$oids).") ";
        $op_arr = $conn->createCommand ($sql)->queryAll ();
        $oplist = ArrayHelper::map($op_arr, 'order_id', 'product_id');
        $pids = ArrayHelper::getColumn($op_arr, 'product_id');
        $pids[] = 0;
        $sql = "select * from lc_product where id in (".implode(',',$pids).")";
        $pinfo_arr = $conn->createCommand ($sql)->queryAll ();
        $pinfo_list = ArrayHelper::mapObj($pinfo_arr,'id');
        $return = array();
        foreach ($order as $k =>$v){
        	$info = array();
        	$pid = empty($oplist[$v['id']])?0:$oplist[$v['id']];
        	if(empty($pinfo_list[$pid])){
        		$info['name'] = '-';
        		$info['pic'] = '-';
        	}else{
        		$pinfo = $pinfo_list[$pid];
        		$info['name'] = $pinfo['name'];
        		$info['pic'] = $web_imgurl.$pinfo['pic'];
        	}
        	$info['price'] = $v['price'];
        	$info['pay'] = $v['price'];
        	$info['status'] = $v['state'];
        	$info['id'] = $v['id'];
        	$return[] = $info;
        }
        $return_info = json_encode(array('responseData'=>$return)); 
        $callback = $request->get('callback');
        echo $callback."(".$return_info.")";
        exit;
    }
    
    /*
     *  取消订单
     */
    public function actionOrdercancel()
    {
        header("access-control-allow-origin: *");
        $request = Yii::$app->request;
        $id = $request->get('id');
        $sql = "update sms_order set state=2 where id=".$id;
        $conn = Yii::$app->db;
        $conn->createCommand ($sql)->query();
        $return = array('status'=>'2');
        $return_info = json_encode(array('responseData'=>$return));
        $callback = $request->get('callback');
        echo $callback."(".$return_info.")";
        exit;
    }

}