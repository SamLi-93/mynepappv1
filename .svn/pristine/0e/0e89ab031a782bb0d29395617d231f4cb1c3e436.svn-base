<?php
/**
 * Created by PhpStorm.
 * User: Sam
 * Date: 2016/7/4
 * Time: 15:31
 */

namespace backend\controllers;

use app\models\LcItemsTracking;
use app\models\LcUserkeep;
use common\models\Product;
use Yii;
use yii\helpers\ArrayHelper;
use yii\web\Controller;
use yii\filters\auth\QueryParamAuth;


/**
 *
 */
class MobileusercenterController extends Controller
{
    public function behaviors()
    {
        return [
            'authenticator' => [
                'class' => QueryParamAuth::className(),
                'only' => ['mycollection', 'myhistory', 'getdownloaded', 'getdownloading','dealcollection','getcollection','Checkbuyed'],
            ],
        ];
    }

    public function actionCheckbuyed(){
        $request = Yii::$app->request;
        $productid = $request->get('productid');
        $idst = Yii::$app->user->identity->idst;
        $puser = Productuser::findOne(['userid'=>$idst, 'productid'=>$productid]);
        if(!$puser)
            $buyed = 0;
        else
            $buyed = 1;
        $callback = $request->get('callback');
        echo $callback . "(" . json_encode(array('responseData' => $buyed)) . ")";
        exit;
    }

    /**
     * 判断是否收藏
     * @return [type] [description]
     */
    public function actionGetcollection(){
        $request = Yii::$app->request;
        $productid = $request->get('productid');
        $idst = Yii::$app->user->identity->idst;
        $num = LcUserkeep::find()->where(['uid'=>$idst,'pid'=>$productid])->count();
        if($num > 0){
            $favorites = 1;
        }else{
            $favorites = 0;
        }
        $callback = $request->get('callback');
        echo $callback . "(" . json_encode(array('responseData' => $favorites)) . ")";
        exit;
    }

    /**
     * 添加、取消收藏
     * @return [type] [description]
     */
    public function actionDealcollection(){
        $request = Yii::$app->request;
        $productid = $request->get('productid');
        $favorites = $request->get('favorites');
        $idst = Yii::$app->user->identity->idst;
        if($favorites == 1){
            $userkeep = LcUserkeep::find()->where(['uid'=>$idst,'pid'=>$productid])->one();
            if(!$userkeep){
                $keep = array(
                    'pid' => $productid,
                    'uid' => $idst
                );
                //$userkeep->save($keep);
                $userkeep = new LcUserkeep($keep);
                $userkeep->save();
            }
        }elseif($favorites == 0){
            LcUserkeep::deleteAll(['uid'=>$idst,'pid'=>$productid]);
        }
        $callback = $request->get('callback');
        echo $callback . "(" . json_encode(array('responseData' => array('deal'=>$favorites))) . ")";
        exit;

    }

    //我的收藏 接口
    public function actionMycollection()
    {
        $web_imgurl = Yii::$app->params['web_imgurl'];
        $request = Yii::$app->request;
        $idst = Yii::$app->user->identity->idst;
        $keep = LcUserkeep::find()->where(['uid' => $idst])->all();
        $keepids = ArrayHelper::getColumn($keep, 'pid');
        $product = Product::find()->where(['id' => $keepids])->asArray()->all();
        $user_keep_info = [];
        foreach ($product as $key => $row) {
            $appimg = $row['mbpic'] ? $row['mbpic'] : $row['pic'];
            $user_keep_info[] = array(
                'id' => $row['id'],
                'name' => $row['name'],
                'pic' => $web_imgurl.$appimg,
                'price' => $row['price'],
                'orginprice' => $row['gprice'],
                'content' => $row['short_intr'],
            );
        }
//        $return_info = '{
//        "responseData": [
//          {
//            "id": "1",
//            "name": "基金投资指南与实际操作1",
//            "price": "21",
//            "orginprice": "300",
//            "orgin": "0",
//            "free": "0",
//            "img": "./img/baoban.png",
//            "content": "我是演讲咖：3周成为演讲沟通高手（创业职场必备）"
//          },{
//            "id": "2",
//            "name": "基金投资指南与实际操作2",
//            "price": "22",
//            "orginprice": "30",
//            "orgin": "0",
//            "free": "0",
//            "img": "./img/baoban.png",
//            "content": "这是测试历史测测试试测试测试测试测试测试测试测试测试测试测试测试测试测试测试"
//          }
//        ]
//      }';
        $callback = $request->get('callback');
        echo $callback . "(" . json_encode(array('responseData' => $user_keep_info)) . ")";
        exit;
    }

    //历史记录接口
    public function actionMyhistory()
    {
        $web_imgurl = Yii::$app->params['web_imgurl'];
        $request = Yii::$app->request;
        $productid = $request->get('productid');
        $productid_str = ltrim(rtrim($productid, "]"),"[");
        $proid = explode(',',$productid_str);
        $idst = Yii::$app->user->identity->idst;
        $user_total_time = '';

        $product = Product::find()->where(['id' => $proid])->all();
        $user_history_info = [];
//        foreach ($time as $key => $row) {
//            $hour = floor($row / 3600);
//            $row = $row - $hour * 3600;
//            $minutes = floor(($row - $hour * 3600) / 60);
//            $row = $row - $minutes * 60;
//            $second = $row;
//            $user_max_learn_time[] = $hour . '时' . $minutes . '分' . $second . '秒';
//        }

        foreach ($product as $key => $row) {
            $appimg = $row['mbpic'] ? $row['mbpic'] : $row['pic'];
            $user_history_info[] = array(
                'id' => $row['id'],
                'name' => $row['name'],
                'pic' => $web_imgurl.$appimg,
                'time' => empty($user_total_time) ? null : $user_total_time ,
                'content' => $row['short_intr'],
            );
        }
        
//        $return_info = '{
//        "responseData": [
//          {
//            "id": "1",
//            "name": "基金投资指南与实际操作1",
//            "img": "./img/baoban.png",
//            "content": "我是演讲咖：3周成为演讲沟通高手（创业职场必备）",
//            "time": "23秒"
//          },{
//            "id": "2",
//            "name": "基金投资指南与实际操作2",
//            "img": "./img/baoban.png",
//            "content": "这是测试历史测测试试测试测试测试测试测试测试测试测试测试测试测试测试测试测试",
//            "time": "53秒"
//          }
//        ]
//      }';
        $callback = $request->get('callback');
        echo $callback . "(" . json_encode(array('responseData' => $user_history_info)) . ")";
        exit;
    }

    //离线缓存 已完成接口
    public function actionGetdownloaded()
    {
        $web_imgurl = Yii::$app->params['web_imgurl'];
        $request = Yii::$app->request;
        $idst = Yii::$app->user->identity->idst;

        $return_info = '{
        "responseData": [
          {
            "id": "1",
            "name": "基金投资指南与实际操作1",
            "img":  "http://10.82.97.204/mynep/sims/uploads/tempproduct/1467942843_919428938.jpg",
            "cache_num": "2"
          },{
            "id": "2",
            "name": "基金投资指南与实际操作2",
            "img":  "http://10.82.97.204/mynep/sims/uploads/tempproduct/1467942843_919428938.jpg",
            "cache_num": "15"
          }
        ]
      }';
        $return_arr = json_decode($return_info);
        $return_info = json_encode($return_arr);
        $callback = $request->get('callback');
        echo $callback . "(" . $return_info . ")";
        exit;
    }

    //离线缓存 缓存ing接口
    public function actionGetdownloading()
    {
        $request = Yii::$app->request;
        $idst = Yii::$app->user->identity->idst;

        $return_info = '{
        "responseData": [
          {
            "id": "1",
            "name": "1-8制作证件照",
            "current_size": "6.36m",
            "total_size":"15.6m",
            "speed":"536",
            "process":"27"
          },{
            "id": "2",
            "name": "1-98制作证件照",
            "current_size": "8.36m",
            "total_size":"15.6m",
            "speed":"200",
            "process":"37"
          }
        ]
      }';
        $return_arr = json_decode($return_info);
        $return_info = json_encode($return_arr);
        $callback = $request->get('callback');
        echo $callback . "(" . $return_info . ")";
        exit;
    }


}