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
use yii\helpers\ArrayHelper;
use common\models\LoginForm;
use common\models\User;
use common\models\Course;
use common\models\Courseuser;
use common\models\Quiz;
use frontend\models\SignupForm;
use yii\filters\auth\QueryParamAuth;

class MobileanswerController extends Controller
{
	public function behaviors()
	{
		return [
			'authenticator' => [
				'class' => QueryParamAuth::className(),
				'only' => ['getlist','create'],
			],
		];
	}
    /*
     *  试卷列表
     */
    public function actionGetlist()
    {
        header("access-control-allow-origin: *");
        $request = Yii::$app->request;
//        $userid = $request->get('userid');
		$userid = Yii::$app->user->identity->idst;
        $template_pageid = $request->get('t_id');
        $page_id = $request->get('pageid');

		$cusers = Courseuser::find()->where(['userid'=>$userid])->all();
		$mycourseids = ArrayHelper::getColumn($cusers, 'courseid');
		//$courselist = Course::find()->select('id, name')->where(['id'=>$mycourseids])->asArray()->all();

		$user = User::findOne($userid);
		$quizes = Quiz::find()->where(['userid'=>$userid])->orderBy('course_id')->all();
//		print_r($quizes);exit;
		$ret = [];
		$courseids = [];
		foreach ($quizes as $quiz) {
			if (!isset($ret[$quiz->course_id])) {
				$ret[$quiz->course_id] = [];
				$courseids[] = $quiz->course_id;
			}
			$data = [
				'id' => $quiz->id,
				'title' => strip_tags($quiz->content),
                'pic' => $user->pic,
				'quiz_time' => date('Y-m-d H:i', $quiz->sendtime),
			];
			if ($quiz->isanswer == 1) {
				$data += [
					'content' => $quiz->atxt,
					'answer_name' => $quiz->auser['name'],
					'answer_time' => date('Y-m-d H:i:s', $quiz->atime),
				];
			}
			$ret[$quiz->course_id][] = $data;
		}
		$courses = Course::findAll($courseids);
		$course_names = ArrayHelper::map($courses, 'id', 'name');
		$return = [];
		foreach ($ret as $courseid=>$val) {
			if (!isset($course_names[$courseid])) continue;
			$return[] = [
				'name' => $course_names[$courseid],
				'num' => count($val),
				'user_name' => $user->name,
				'detail' => $val,
			];
		}

        /*
        $return = array(
                array(
                'name'=>'java基础应用',
                'num'=>'2',
                'user_name'=>'李晓雨',
                'detail'=>array(
                        array(
                            'content'=>'莎士比亚曾说过“即使我们沉默不语，我们的服饰与体态也会泄露我们过去的经历”。随着我国经济水平稳步提高，人们参与的社会活动越来越丰富，而第一印象的形成往往是由视觉形象来完成的。如何用得体、悦目的形象来表达自身优秀的内在素养，是很多人都面临的问题。',
                            'answer_name'=>'陈源老师',
                            'answer_time'=>'2016-6-15  12:11:00',
                            'title'=>'形象设计的思路是怎么样的',
                            'quiz_time'=>'2016-6-15  12:11:00',
                            'id'=>'2'
                        ),
                        array(
                            'content'=>'莎士比亚曾说过“即使我们沉默不语，。因而，市场在呼唤具有较高专业素质的人才来提升国人的形象力。',
                            'video_time'=>'20:10',
                            'answer_name'=>'陈源老师',
                            'answer_time'=>'2016-6-15  12:11:00',
                            'title'=>'形象设计的思路是怎么样的',
                            'quiz_time'=>'2016-6-15  12:11:00',
                            'id'=>'3'
                        )
                    )
                ),
                array(
                'name'=>'会计实训操作练习',
                'num'=>'1',
                'user_name'=>'李晓雨',
                'detail'=>array(
                        array(
                            'content'=>'又是一年毕业季，你最需要的是什么？[最右]超美摄像，你的御用摄像师？超长待机，聚会刷夜不当机？超大内存，珍贵记忆永留存？OPPO R9在手，通通满足你！[心]转发本微博，小艺将随机送出15个【OPPO原装高品质MH126耳机】[礼物]让我们红尘作伴，毕业旅行说走就走！',
                            'answer_name'=>'陈源老师',
                            'title'=>'形象设计的思路是怎么样的',
                            'answer_time'=>'2016-6-15  12:11:00',
                            'quiz_time'=>'2016-6-15  12:11:00',
                            'id'=>'5'
                        ),array(
                            'content'=>'又是一年毕业季，你最需要的是什么？[最右]超美摄像，你的御用摄像师？超长待机，聚会刷夜不当机？超大内存，珍贵记忆永留存？OPPO R9在手，通通满足你！[心]转发本微博，小艺将随机送出15个【OPPO原装高品质MH126耳机】[礼物]让我们红尘作伴，毕业旅行说走就走！',
                            'answer_name'=>'陈源老师',
                            'title'=>'形象设计的思路是怎么样的',
                            'answer_time'=>'2016-6-15  12:11:00',
                            'quiz_time'=>'2016-6-15  12:11:00',
                            'id'=>'7'
                        )
                    )
                )
            );
        */
        //$return_info = json_encode($return);
        //$return_info = json_encode(array('answerlist'=>$return, 'courselist'=>$courselist));
        $return_info = json_encode(array('answerlist'=>$return));
        $callback = $request->get('callback');
        echo $callback."(".$return_info.")";
        exit;
    }

	public function actionCreate() {
        header("access-control-allow-origin: *");
        $request = Yii::$app->request;
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

}
