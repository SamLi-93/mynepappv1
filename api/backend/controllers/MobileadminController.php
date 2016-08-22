<?php
/**
 * Created by PhpStorm.
 * User: Sam
 * Date: 2016/6/13
 * Time: 16:26
 */

namespace backend\controllers;


use Yii;
use yii\web\Controller;
use common\models\LoginForm;
use frontend\models\SignupForm;
use yii\filters\auth\QueryParamAuth;
use common\models\User;
use yii\filters\VerbFilter;
use yii\filters\AccessControl;

class MobileadminController extends Controller
{

    public function behaviors()
    {
        return [
            'access' => [
                'class' => AccessControl::className(),
                'only' => ['logout', 'signup'],
                'rules' => [
                    [
                        'actions' => ['signup'],
                        'allow' => true,
                        'roles' => ['?'],
                    ],
                    [
                        'actions' => ['logout'],
                        'allow' => true,
                        'roles' => ['@'],
                    ],
                ],
            ],
            'authenticator' => [
                'class' => QueryParamAuth::className(),
                'only' => ['userinfo','saveuser','uploadimg'],
            ],
            'verbs' => [
                'class' => VerbFilter::className(),
                'actions' => [
                    'logout' => ['post'],
                ],
            ],
        ];
    }

    /*
     *  注册接口
     */
    public function actionSignup()
    {
        $request = Yii::$app->request;
        $data['SignupForm']['userid'] = $request->get('userid');
        $data['SignupForm']['pass'] = $request->get('pass');

        $model = new SignupForm();
        if ($model->load($data)) {
            if ($user = $model->signup()) {
                if (Yii::$app->getUser()->login($user)) {
                    $access_token = Yii::$app->user->identity->access_token;

                    $itemArray = array(
                        'access_token' => $access_token,
                        'userid'=>Yii::$app->user->identity->userid,
                        'username'=>Yii::$app->user->identity->userid,
                        'headimg'=>Yii::$app->user->identity->pic,
    //                        'email'=>Yii::$app->user->identity->email,
                    );
                    $return_info = json_encode(['success'=>'1', 'userinfo'=>$itemArray]);
                    $callback = $request->get('callback');
                    echo $callback."(".$return_info.")";
                    exit;
                }
            }
        }
        echo 'error';exit;
    }

    /*
     *  登录接口
     */
    public function actionLogin()
    {
        $request = Yii::$app->request;
        $data['LoginForm']['userid'] = $request->get('userid');
        $data['LoginForm']['pass'] = $request->get('pass');
        $errormessage = '账号或密码不能为空';

        $model = new LoginForm();

        if ($model->load($data) && $model->login()) {
            if(Yii::$app->user->identity->finish==1){
                echo $errormessage = "对不起，该学生已经结业！"; exit;
            }else if(Yii::$app->user->identity->finish==4){
                echo $errormessage = "对不起，该学生已经休学！"; exit;
            }else if(Yii::$app->user->identity->valid!=1){
                echo $errormessage = "对不起，该学生未被确认开通！"; exit;
            } else {
                $logined = 1;
                $errormessage = '成功登陆';
            }

            $userid = Yii::$app->user->identity->userid;
//            $pass = Yii::$app->user->identity->pass;
//            $email = Yii::$app->user->identity->email;
            if (Yii::$app->user->identity->access_token) {
                $access_token = Yii::$app->user->identity->access_token;
            } else {
                $user =  User::find()->where(['userid' => $userid])->one();
                $access_token = Yii::$app->security->generateRandomString();
                $user->access_token = $access_token;
                $user->save();
            }

            $userinfo = array(
                'id'=>Yii::$app->user->identity->userid,
                'userid'=>Yii::$app->user->identity->userid,
                'username'=>Yii::$app->user->identity->name,
                'headimg'=>Yii::$app->user->identity->pic,
                'school'=>null,
                'email'=>Yii::$app->user->identity->email,
                'mobile'=>Yii::$app->user->identity->mobile,
                'postcode'=>Yii::$app->user->identity->postcode,
                'access_token' => $access_token,
                'loginTime'=>time(),
                "LoginStatus"=>1
            );

            $itemArray = array(
                'message' => $errormessage,
                'logined' => $logined,
                'userinfo' => $userinfo
            );
            $return_info = json_encode(array('responseData'=>$itemArray));
            $callback = $request->get('callback');
            echo $callback."(".$return_info.")";
            exit;

        } else {
            $errormessage = '对不起，该学生没有通过用户中心验证，请检查登录信息';
            $itemArray = array(
                'message' => $errormessage,
                'logined' => 0,
                'userinfo' => []
            );

            $return_info = json_encode(array('responseData'=>$itemArray));
            $callback = $request->get('callback');
            echo $callback."(".$return_info.")";
            exit;
        }
        die;
    }

    //个人信息接口
    public function actionUserinfo()
    {
        $request = Yii::$app->request;
        $userid = Yii::$app->user->identity->userid;
        $return_arr = array();
        $user =  User::find()->where(['userid' => $userid])->one();
        if(!empty($user['photo'])){
            $photoimg = $user['photo'];
        }else{
            $photoimg = "resources/images/man".$user['gender'].".png";
        }
        $return_arr = array(
            array('title'=>'头像','content'=>$photoimg,'field' => 'avatar'),
            array('title'=>'姓名','content'=>$user['name'],'field'=>'name'),
            array('title'=>'电子邮件','content'=>$user['email'],'field'=>'email'),
            array('title'=>'移动电话','content'=>$user['mobile'],'field'=>'mobile'),
            array('title'=>'邮政编码','content'=>$user['postcode'],'field'=>'postcode'),
            array('title'=>'地址','content'=>$user['address'],'field'=>'address'),
            array('title'=>'修改密码','content'=>'','field'=>'pass')
        );
//        $return_arr = array(
//            array('title'=>'头像','content'=>Yii::$app->user->identity->photo,'field' => 'photoimg'),
//            array('title'=>'姓名','content'=>Yii::$app->user->identity->name,'field'=>'name'),
//            array('title'=>'电子邮件','content'=>Yii::$app->user->identity->email,'field'=>'email'),
//            array('title'=>'移动电话','content'=>Yii::$app->user->identity->mobile,'field'=>'mobile'),
//            array('title'=>'邮政编码','content'=>Yii::$app->user->identity->postcode,'field'=>'postcode'),
//            array('title'=>'地址','content'=>Yii::$app->user->identity->address,'field'=>'address'),
//            array('title'=>'密码','content'=>'修改密码','field'=>'pass')
//        );
        $return_info = json_encode(array('responseData'=>$return_arr));
        $callback = $request->get('callback');
        echo $callback."(".$return_info.")";
        exit;
    }

    //保存用户信息接口
    public function actionSaveuser()
    {
        $request = Yii::$app->request;
        $userid = Yii::$app->user->identity->userid;
        $usercontent = $request->get('usercontent');
        $field = $request->get('field');
        if($userid){
            $user =  User::find()->where(['userid' => $userid])->one();
            $user->$field = $usercontent;
            $user->save();

        }
        $callback = $request->get('callback');
        echo $callback."('save success')";
        exit;
    }

    public function actionTest() {
        echo 'test';exit;
    }


    /**
     * 上传头像信息
     * @return [type] [description]
     */
    public function actionUploadimg_bak(){
        //$userid = $this->_context->userid;
        //$userid = $params['userid'];
        //$userid = 26115;
        //if($this->_context->isPOST()){
        $request = Yii::$app->request;
        $userid = Yii::$app->user->identity->userid;

        if($_FILES['userimg']['tmp_name'] && $userid){
            //$base_dir = Q::ini('app_config/ROOT_DIR');
            $base_dir = '';
            $uploadfile = $_FILES['userimg'];
            $img_name = $_FILES['userimg']['name'];
            $cidinfo = explode(".",$img_name);
            $type = $cidinfo[(count($cidinfo)-1)];
            $uploadpath = Yii::$app->basePath.DIRECTORY_SEPARATOR.'uploads'.DIRECTORY_SEPARATOR.'stu_photo'.DIRECTORY_SEPARATOR;
            //$uploadpath = "uploads/stu_photo/";
            $rename = time().rand().".jpg";
            $filepath = $uploadpath.$rename;
            $filename = $base_dir.$filepath;
            //Helper_Util::mkdir(dirname($filename));
            $uploadfile['path'] = $filepath;
            move_uploaded_file($_FILES['userimg']['tmp_name'],  $filename);
            $user =  User::find()->where(['userid' => $userid])->one();
            $user->photo = $filepath;
            $user->save();
        }
        echo 'success';
        return $this->render('uploadimg');
        //exit();
    }


    public function actionUploadimg(){
        //$userid = $this->_context->userid;
        //$userid = $params['userid'];
        //$userid = 26115;
        //if($this->_context->isPOST()){
        $request = Yii::$app->request;
        $userid = Yii::$app->user->identity->userid;
        //echo $userid;
        if($_FILES['userimg']['tmp_name'] && $userid){
            echo 'post';
            $base_dir = '';
            //$uploadfile = $_FILES['userimg'];
            $img_name = $_FILES['userimg']['name'];
            $cidinfo = explode(".",$img_name);
            $type = $cidinfo[(count($cidinfo)-1)];
            $uploadpath = Yii::$app->basePath.DIRECTORY_SEPARATOR.'uploads'.DIRECTORY_SEPARATOR.'stu_photo'.DIRECTORY_SEPARATOR;
            $urlfilepath = Yii::$app->params['base_api_url'];
            $urlfilepath .= '/uploads/stu_photo/';
            $rename = time().rand().".jpg";
            $filepath = $uploadpath.$rename;
            $filename = $base_dir.$filepath;
            $urlpath = $urlfilepath.$rename;
            //$uploadfile['path'] = $filepath;
            move_uploaded_file($_FILES['userimg']['tmp_name'],  $filename);          
            $user =  User::find()->where(['userid' => $userid])->one();
            //echo Yii::$app->params['base_api_url'];
            $user->pic = $urlpath;
            $user->save();
            echo $urlpath;
        }/*else{
            echo 'success';
            return $this->render('uploadimg');
        }*/
        //echo 'success';
        exit();
    }


    public function beforeAction($action) {
        $this->enableCsrfValidation = false;
        return parent::beforeAction($action);
    }

    /**
     * 得到app版本
     */
    public function actionGetversion(){
        $request = Yii::$app->request;
        $return_arr = array(
            'version' => '0.0.3',
            'template' => '1、更新了播放器;<br>2、修复了电子书'
        );
        $return_info = json_encode(array('responseData'=>$return_arr));
        $callback = $request->get('callback');
        echo $callback."(".$return_info.")";
        exit;
    }



}