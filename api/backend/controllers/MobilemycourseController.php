<?php
/**
 * Created by PhpStorm.
 * User: Sam
 * Date: 2016/7/7
 * Time: 9:50
 */

namespace backend\controllers;

use Yii;
use yii\web\Controller;
use yii\filters\auth\QueryParamAuth;

class MobilemycourseController extends Controller
{
    public function behaviors()
    {
        return [
            'authenticator' => [
                'class' => QueryParamAuth::className(),
                'only' => ['getquestionlist', 'getmycoursenotelist','getbooklist'],
            ],
        ];
    }


    //我的课程中的答疑接口
    public function actionGetquestionlist()
    {
        $request = Yii::$app->request;
        $idst = Yii::$app->user->identity->idst;

        $return_info = '{
        "responseData": [
        {
          "id": 1,
          "question": "11网页中如何用css让两个DIV和表格居中我用css的margin已经测试过了，失效，请大家帮忙解决一下，在既不破坏当前",
          "answer": "两个DIV块本身是居中的，表格居中的话，就在你CSSlocked-column的div#tbl-container 里添加如下码"
        },
        {
          "id": 2,
          "question": "借贷记帐法 总是弄不清帐户性质。资产类是借=+ 贷=- 那么资产类的帐户一般都有哪些？负债类的呢？有什么好方法能容易的弄清会计分录时的帐户增减方",
          "answer": "借贷记账法：1.资产类和费用 (成本）类借增贷减。2.所有者权益类、负债类和收入类借减贷增。3.双重性（共同性）类，借方可登记资产、费用类的增加和负债、所有者权益的减少，贷方登记资产、费用的减少和负债、所有者权益、收入的增加。这类主要有本年利润，材料成本差异、应收账款、应付账款和其他往来账户等。\r\n你只要明白了那些科目是资产类，负债类，所有者权益类等等，你才能从根本上去认识这些问题。好好看看课本，你会受益无穷的。"
        },
        {
          "id": 3,
          "question": "问2",
          "answer": "答2"
        },
        {
          "id": 4,
          "question": "问3",
          "answer": "答3"
        },
        {
          "id": 5,
          "question": "问4",
          "answer": "答4"
        }
      ]
      }';
        $return_arr = json_decode($return_info);
        $return_info = json_encode($return_arr);
        $callback = $request->get('callback');
        echo $callback . "(" . $return_info . ")";
        exit;
    }

    //我的课程中的笔记接口
    public function actionGetmycoursenotelist()
    {
        $request = Yii::$app->request;
        $idst = Yii::$app->user->identity->idst;

        $return_info = '{
        "responseData": [
          {
            "id": "1",
            "text": "这里要想老师提问的内11容",
            "time": "05:06",
            "content": "我是演讲咖：3周成为演讲沟通高手（创业职场必备）"
          },{
            "id": "2",
            "text": "这里要想老师提问的内22容",
            "time": "12:43",
            "content": "这是测试历史测测试试测试测试测试测试测试测试测试测试测试测试测试测试测试测试"
          }
        ]
      }';
        $return_arr = json_decode($return_info);
        $return_info = json_encode($return_arr);
        $callback = $request->get('callback');
        echo $callback . "(" . $return_info . ")";
        exit;
    }

    //我的课程中的 得到电子讲义 接口
    public function actionGetbooklist()
    {
        $request = Yii::$app->request;
        $idst = Yii::$app->user->identity->idst;
        $productId = $request->get('productId');

        $return_info = '{
        "responseData": [
          {
            "bookId": "1",
            "bookname": "EXCEL在财务工资管理中的应用"
          },{
            "bookId": "2",
            "bookname": "企业工商税务注册变更那些事"
          },{
            "bookId": "3",
            "bookname": "职工工资及个税核算"
          },{
            "bookId": "4",
            "bookname": "总经理必备的财务知识和标准"
          },{
            "bookId": "5",
            "bookname": "EXCEL在财务工资管理中的应用"
          },{
            "bookId": "6",
            "bookname": "企业工商税务注册变更那些事"
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