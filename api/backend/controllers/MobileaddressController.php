<?php
/**
 * Created by PhpStorm.
 * User: Sam
 * Date: 2016/7/4
 * Time: 15:31
 */

namespace backend\controllers;

use Yii;
use yii\web\Controller;
use yii\filters\auth\QueryParamAuth;
use backend\models\Address;
use yii\filters\VerbFilter;
use yii\filters\AccessControl;

class MobileaddressController extends Controller
{
    public function behaviors()
    {
        return [
            'authenticator' => [
                'class' => QueryParamAuth::className(),
                'only' => ['getaddress', 'addaddress', 'editaddress', 'deleteaddress', 'getselectedaddress', 'editselectedaddress'],
            ],
        ];
    }

    //得到个人地址接口
    public function actionGetaddress()
    {
        $request = Yii::$app->request;
        $idst = Yii::$app->user->identity->idst;
        $id = $request->get('id');
        if ($request->get('id')) {
            $address = Address::find()->where(['user_id' => $idst, 'is_delete' => '0', 'id' => $id])->one();
            $user_adderss_info = array(
                'id' => $address['id'],
                'name' => $address['name'],
                'text' => $address['address'],
                'phonenum' => $address['phone'],
                'user_province' => $address['province'],
                'user_city' => $address['city'],
                'choose_mark' => $address['check'],
            );
            $callback = $request->get('callback');
            echo $callback . "(" . json_encode(array('responseData' => $user_adderss_info)) . ")";
            exit;
        }
        $address = Address::find()->where(['user_id' => $idst, 'is_delete' => '0'])->orderBy('check DESC')->all();

        foreach ($address as $key => $row) {
            $user_adderss_info[] = array(
                'id' => $row['id'],
                'name' => $row['name'],
                'text' => $row['address'],
                'phonenum' => $row['phone'],
                'user_province' => $row['province'],
                'user_city' => $row['city'],
                'choose_mark' => $row['check'],
            );
        }

        $callback = $request->get('callback');
        echo $callback . "(" . json_encode(array('responseData' => $user_adderss_info)) . ")";
        exit;
    }

    //添加个人地址信息页面
    public function actionAddaddress()
    {
        $request = Yii::$app->request;
        $userid = Yii::$app->user->identity->idst;

        $username = $request->get('username');
        $phone_num = $request->get('phonenum');
        $province = $request->get('province');
        $city = $request->get('city');
        $address_text = $request->get('address');

        $address2 = Address::find()->where(['user_id' => $userid, 'is_delete' => '0'])->orderBy('check DESC')->all();
        $count_num = count($address2);
        $address = new Address();
        $address->user_id = $userid;
        $address->is_delete = 0;
        $count_num == 0 ?  $address->check = 1 : $address->check = 0;
//        $address->check = 0;
        $address->name = $username;
        $address->phone = $phone_num;
        $address->province = $province;
        $address->city = $city;
        $address->address = $address_text;
        if ($address->save() > 0) {
            $callback = $request->get('callback');
            echo $callback . "('save success')";
            exit;
        } else {
            echo "error adding";
            exit;
        }
    }

    //修改个人地址接口
    public function actionEditaddress()
    {
        $request = Yii::$app->request;
        $idst = Yii::$app->user->identity->idst;
        $id = $request->get('id');
        $address = Address::find()->where(['user_id' => $idst, 'is_delete' => '0', 'id' => $id])->one();
        $userid = $idst;

        $username = $request->get('username');
        $address->name = $username;
        $phone_num = $request->get('phonenum');
        $address->phone = $phone_num;
        $province = $request->get('province');
        $address->province = $province;
        $city = $request->get('city');
        $address->city = $city;
        $address_text = $request->get('address');
        $address->address = $address_text;

//        $address->user_id = $userid;
//        $address->check = 0;
//        if ($address->save() > 0) {
//            $address = Address::find()->where(['user_id' => $userid, 'id' => $id, 'is_delete' => '0'])->one();
//            $user_adderss_info[] = array(
//                'user_name' => $address['name'],
//                'user_address' => $address['address'],
//                'user_phone' => $address['phone'],
//                'user_province' => $address['province'],
//                'user_city' => $address['city'],
//                'user_check' => $address['check'],
//            );
//            echo json_encode(array('responseData' => $user_adderss_info));
//            exit;
//        } else {
//            echo "error editing";
//            exit;
//        }
        if ($address->save() > 0) {
            $callback = $request->get('callback');
            echo $callback . "('save success')";
            exit;
        } else {
            echo "error editing";
            exit;
        }
    }

    //删除地址接口
    public function actionDeleteaddress()
    {
        $request = Yii::$app->request;
        $idst = Yii::$app->user->identity->idst;
        $id = $request->get('id');
        $address = Address::find()->where(['user_id' => $idst, 'is_delete' => '0', 'id' => $id])->one();
        $address_count = Address::find()->where(['user_id' => $idst, 'is_delete' => '0'])->all();
        $count_num =  count($address_count);
        if ($address['check'] == 1 && $count_num > 1 ) {
            $address2 = Address::find()->where(['user_id' => $idst, 'is_delete' => '0', 'check' => '0'])->one();
            $address2->check = 1;
            $address2->save();

        }
        $address->is_delete = 1;
        if ($address->save() > 0) {
            $callback = $request->get('callback');
            echo $callback . "('save success')";
            exit;
        } else {
            echo "error delete";
            exit;
        }
    }

    //获取选择的地址  接口
    public function actionGetselectedaddress()
    {
        $request = Yii::$app->request;
        $idst = Yii::$app->user->identity->idst;
        $address = Address::find()->where(['user_id' => $idst, 'is_delete' => '0', 'check' => '1'])->all();

        foreach ($address as $key => $row) {
            $user_adderss_info[] = array(
                'id' => $row['id'],
                'name' => $row['name'],
                'text' => $row['address'],
                'phonenum' => $row['phone'],
                'user_province' => $row['province'],
                'user_city' => $row['city'],
                'choose_mark' => $row['check'],
            );
        }

        $callback = $request->get('callback');
        echo $callback . "(" . json_encode(array('responseData' => $user_adderss_info)) . ")";
        exit;
    }

    //修改个人地址接口
    public function actionEditselectedaddress()
    {
        $request = Yii::$app->request;
        $idst = Yii::$app->user->identity->idst;
        $id = $request->get('id');
        $address = Address::find()->where(['user_id' => $idst, 'is_delete' => '0', 'check' => '1'])->one();
        if ($address) {
            $address->check = 0;
            if ($address->save()) {
                echo 'success';
            }
        }

        $address = Address::find()->where(['user_id' => $idst, 'is_delete' => '0', 'id' => $id])->one();
        $address->check = 1;
        if ($address->save() > 0) {
            echo 'success';
            exit;
        } else {
            echo "error editing";
            exit;
        }
    }


}