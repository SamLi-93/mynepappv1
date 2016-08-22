<?php
/**
 * Created by PhpStorm.
 * User: admin
 * Date: 2016/6/13
 * Time: 16:46
 */

namespace backend\controllers;

use common\models\SmsOrder;
use common\models\SmsOrderDetail;
use Yii;
use common\models\Product;
use yii\web\Controller;
use yii\filters\auth\QueryParamAuth;
use backend\models\Coursecomment;
use yii\helpers\ArrayHelper;

class MobilecourseController extends Controller
{

    public function behaviors()
    {
        return [
            'authenticator' => [
                'class' => QueryParamAuth::className(),
                'only' => ['GetCoursecomments', 'coursebuy', 'test',],
            ],
        ];
    }

    public function actionGetCoursecomments()
    {
        echo 'test';
        exit;
        $comment = Coursecomment::find();
        var_dump($comment);
        exit;
    }

    public function actionTest()
    {
        echo 'test33';
        $t = Yii::$app->user->identity;
        var_dump($t);
        exit;
    }

    /**
     * 根据关键字获取产品
     */
    public function actionGetcoursebykeywords()
    {
        header("access-control-allow-origin: *");
        $request = Yii::$app->request;
        $web_imgurl = Yii::$app->params['web_imgurl'];
        $keywords = $request->get('keywords');
        $conn = Yii::$app->db;
        $sql = "select * from lc_product where name like '%" . $keywords . "%' and onsale=1";
        $c_arr = $conn->createCommand($sql)->queryAll();
        foreach ($c_arr as $key => $val) {
            $info = array();
            $info['id'] = $val['id'];
            $info['img'] = $web_imgurl . $val['mbpic'];
            $info['itemid'] = '0';
            $info['name'] = $val['name'];
            $info['teacher_names'] = '-';
            $info['price'] = $val['price'];
            $info['free'] = (empty($val['price']) ? 0 : 1);
            $info['vtype'] = '0';
            $info['authorize_flag'] = '0';
            $return_arr[] = $info;
        }
        $return_info = json_encode(array('responseData' => $return_arr));
        $callback = $request->get('callback');
        echo $callback . "(" . $return_info . ")";
        exit ();
    }

    //购买课程添加到sms_order表 接口
    public function actionCoursebuy()
    {
        $request = Yii::$app->request;
        $addressid = $request->get('addressid');
        $pid = $request->get('pid');
        $uid = Yii::$app->user->identity->idst;
        $phone_num = Yii::$app->user->identity->userid;

        $product = Product::find()->where(['id' => $pid])->one();
        $price = $product['price'];
        $order_no = "mynep_" . date('YmdHis') . "_" . Yii::$app->security->generateRandomString(4) . "_" . $uid;
        $time = time();

        $sql = "SELECT a . * , b.product_id, b.order_id FROM  `sms_order` AS a 
                LEFT JOIN sms_order_detail AS b ON a.id = b.order_id WHERE a.user_id =" . $uid . " AND b.product_id =" . $pid;
        $conn = Yii::$app->db;
        $dup = $conn->createCommand($sql)->queryAll();
        if (count($dup > 0 )) {
            foreach ($dup as $k => $v) {
                $tmp_id = $v['id'];
                $tmp_order = SmsOrder::find()->where(['id' => $tmp_id])->one();
                $tmp_order->state = 2;
                $tmp_order->save();
            }
//            $test = SmsOrder::find()->where(['id' => $duplicate_id])->all();
//            foreach ($test as $key => $value) {
//                $test[$key]->state = 2;
//                $test[$key]->save();
//            }
        }

        $order = new SmsOrder();
        $order_detail = new SmsOrderDetail();

        $order->order_no = $order_no;
        $order->price = $price;
        $order->order_time = $time;
        $order->user_id = $uid;
        $order->order_type = 1;
        $order->total_pay = $price;
        $order->address_id = $addressid;
        $order->invoice_title = "个人";
        $order->invoice_phone = $phone_num;
        $order->save();

        $order_one = SmsOrder::find()->where(['order_no' => $order_no])->one();
        $order_id = $order_one['id'];

        $order_detail->order_id = $order_id;
        $order_detail->order_no = $order_no;
        $order_detail->product_id = $pid;
        $order_detail->price = $price;
        if ($order_detail->save() > 0) {
            $callback = $request->get('callback');
            echo $callback . "('save success')";
            exit;
        } else {
            echo "error adding";
            exit;
        }


    }

}