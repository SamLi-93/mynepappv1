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
use yii\helpers\ArrayHelper;
use common\models\LoginForm;
use common\models\Coursenotes;
use common\models\Course;
use common\helpers\Util;
use frontend\models\SignupForm;
use yii\filters\auth\QueryParamAuth;

class MobilenoteController extends Controller
{
	public function behaviors()
	{
		return [
			'authenticator' => [
				'class' => QueryParamAuth::className(),
				'only' => ['getlist',''],
			],
		];
	}

    /*
     *  我的笔记列表
     */
    public function actionGetlist()
    {
        header("access-control-allow-origin: *");
        $request = Yii::$app->request;
//        $userid = $request->get('userid');
		$userid = Yii::$app->user->identity->idst;
        $template_pageid = $request->get('t_id');
        $page_id = $request->get('pageid');

		$notes = Coursenotes::find()->where(['userid'=>$userid])->orderBy('courseid')->all();
		$ret = [];
		$courseids = [];
		foreach ($notes as $note) {
			if (!isset($ret[$note->courseid])) {
				$ret[$note->courseid] = [];
				$courseids[] = $note->courseid;
			}
			$ret[$note->courseid][] = [
				'id' => $note->id,
				'content' => $note->note,
				'video_time' => Util::format_time($note->note_time),
				'note_time' => date('Y-m-d H:i:s', $note->create_date),
			];
		}
		$courses = Course::findAll($courseids);
		$course_names = ArrayHelper::map($courses, 'id', 'name');
		$return = [];
		foreach ($ret as $courseid=>$val) {
			if (!isset($course_names[$courseid])) continue;
			$return[] = [
				'name' => $course_names[$courseid],
				'num' => count($val),
				'detail' => $val,
			];
		}
        $return_info = json_encode($return); 
        $callback = $request->get('callback');
        echo $callback."(".$return_info.")";
        exit;
    }

    /*
     *  删除笔记
     */
    public function actionDelete()
    {
        header("access-control-allow-origin: *");
        $request = Yii::$app->request;
        $id = $request->get('id');
        $flag = 0;
		$note = Coursenotes::findOne($id);
        if($note){
            $note->delete();
            $flag = 1;
        }
        $return = array('flag'=>$flag);
        $return_info = json_encode($return); 
        $callback = $request->get('callback');
        echo $callback."(".$return_info.")";
        exit;
    }
}
