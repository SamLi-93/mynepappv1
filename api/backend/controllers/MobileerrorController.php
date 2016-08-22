<?php

namespace backend\controllers;

use Yii;
use yii\web\Controller;
use common\models\LoginForm;
use frontend\models\SignupForm;
use yii\filters\auth\QueryParamAuth;
use yii\helpers\ArrayHelper;

class MobileerrorController extends Controller {
	
	public function behaviors()
	{
		return [
				'authenticator' => [
						'class' => QueryParamAuth::className(),
						'only' => ['getlist','detail','delete'],
				],
	
		];
	}
	/*
	 * 错题集
	 */
	public function actionGetlist() {
		header ( "access-control-allow-origin: *" );
		$request = Yii::$app->request;
		$userid = Yii::$app->user->identity->idst;
		$conn = Yii::$app->db;
		$sql = "select * from exam_stu_questionwrong where stu_id=:uid"; // 获得用户所有的错题
		$data_info = $conn->createCommand ( $sql, array ('uid' => $userid ) )->queryAll ();
		$rid_arr = ArrayHelper::getColumn ( $data_info, 'question_id' );
		$rid_arr [] = 0;
		$sql = "select * from exam_questions where id in (" . implode ( ',', $rid_arr ) . ")";
		$q_arr = $conn->createCommand ( $sql )->queryAll (); // 所有的题目
		$sql = "select id,name from lc_course";
		$c_arr = $conn->createCommand ( $sql )->queryAll ();
		$clist = ArrayHelper::map ( $c_arr, 'id', 'name' ); // 课程信息
		$return = array ();
		foreach ( $q_arr as $k => $v ) {
			if (empty ( $return [$v ['course_id']] )) {
				$dinfo = array ();
				$return [$v ['course_id']] ['name'] = $clist [$v ['course_id']];
			} else {
				$dinfo = $return [$v ['course_id']] ['detail'];
			}
			if (empty ( $dinfo [$v ['type_id']] )) { // 创建错题类型
				$dinfo [$v ['type_id']] = array (
						'type_id' => $v ['type_id'],
						'num' => '1' 
				);
			} else { // 变更num的数量
				$tinfo = $dinfo [$v ['type_id']];
				$tnum = ( int ) $tinfo ['num'];
				$tinfo ['num'] = $tnum + 1;
				$dinfo [$v ['type_id']] = $tinfo;
			}
			$return [$v ['course_id']] ['detail'] = $dinfo;
		}
		$return_info = json_encode(array('responseData'=>$return)); 
		$callback = $request->get ( 'callback' );
		echo $callback . "(" . $return_info . ")";
		exit ();
	}
	
	/*
	 * 删除错题
	 */
	public function actionDelete() {
		header ( "access-control-allow-origin: *" );
		$request = Yii::$app->request;
		$userid = Yii::$app->user->identity->idst;
		$return = array (
				'success' 
		);
		$return_info =  json_encode(array('responseData'=>$return)); 
		$callback = $request->get ( 'callback' );
		echo $callback . "(" . $return_info . ")";
		exit ();
	}
	/*
	 * 错题页面
	 */
	public function actionDetail() {
		header ( "access-control-allow-origin: *" );
		$request = Yii::$app->request;
		$userid = Yii::$app->user->identity->idst;
		$courseid = $request->get ( 'courseid' );
		$typeid = $request->get ( 'typeid' );
		$conn = Yii::$app->db;
		$sql = "select id,name from exam_question_type";
		$qt_info = $conn->createCommand ( $sql )->queryAll ();
		$qt_arr = ArrayHelper::map($qt_info,'id','name');
		$sql = "select * from exam_stu_questionwrong where stu_id=:uid"; // 获得用户所有的错题
		$data_info = $conn->createCommand ( $sql, array ('uid' => $userid ) )->queryAll ();
		$rid_arr = ArrayHelper::getColumn ( $data_info, 'question_id' );
		$rid_arr [] = 0;
		$sql = "select * from exam_questions where id in (" . implode ( ',', $rid_arr ) . ") and type_id=:typeid and course_id=:courseid";
		$data_info = $conn->createCommand ( $sql, array ('typeid' => $typeid,'courseid' => $courseid) )->queryAll ();
		$return = array('total' => (empty($data_info)?0:count($data_info)));
		$questions = array();
		$cards = array();
		$choice = ['0'=>'A','1'=>'B','2'=>'C','3'=>'D','4'=>'E','5'=>'F'];
		foreach ($data_info as $k => $v){
			$info = array();
			$card = array();
			$info['type_id'] = $v['type_id'];
			$info['question'] = $v['question'];
			$info['type_name'] = $qt_arr[$v['type_id']];
			$info['options'] = json_decode($v['options'],true);
			$info['id'] = $v['id'];
			//$info['result'] = json_decode($v['result'],true);
			$result = json_decode($v['result'],true);
			$info['result'] = "";
			switch ($typeid) {
				case '1':
					$options = $info['options'];
					foreach ($options as $x => $y) {
						if(in_array($y,$result)){
							$info['result'] = $choice[$x];
							break;
						}
					}
					break;
				case '2':
					foreach ($options as $x => $y) {
						if(in_array($y,$result)){
							$info['result'] = $info['result']==''? $choice[$x] : $info['result'].'、'.$choice[$x];
						}
					}
					break;
				case '3':
					$r = $result[0];
					$info['result'] = $r==1?'对':'错';
					break;
				default:
					$info['result'] = $result[0];
					break;
			}
			$info['remark'] = $v['remark'];
			$questions[] = $info;
			if(empty($cards[$qt_arr[$v['type_id']]])){
				$card[$v['id']] = array('qnum'=>($k+1));
				$cards[$qt_arr[$v['type_id']]] = $card;
			}else{
				$card = $cards[$qt_arr[$v['type_id']]];
				$card[$v['id']] = array('qnum'=>($k+1));
				$cards[$qt_arr[$v['type_id']]] = $card;
			}
		}
		$return['question'] = $questions;
		$return['card'] = $cards;
        $return_info = json_encode(array('responseData'=>$return)); 
        $callback = $request->get('callback');
        echo $callback."(".$return_info.")";
        exit;
    }
}