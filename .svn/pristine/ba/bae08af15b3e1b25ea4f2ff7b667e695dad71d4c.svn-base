<?php

namespace common\models;

use Yii;
use yii\helpers\ArrayHelper;

/**
 * This is the model class for table "lc_courseuser".
 *
 * @property integer $id
 * @property integer $userid
 * @property integer $courseid
 * @property integer $date_get
 * @property integer $date_first_access
 * @property integer $date_complete
 * @property integer $status
 * @property integer $waiting
 * @property integer $subscribed_by
 * @property integer $date_begin_valid
 * @property integer $date_expire_valid
 * @property integer $credit
 * @property integer $back_only
 * @property integer $quiz_score
 * @property integer $test_score
 * @property double $finish
 * @property integer $login_time
 * @property integer $last_itemsid
 * @property string $username
 * @property integer $openflag
 * @property integer $course_total_time
 * @property integer $is_msg
 */
class Courseuser extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'lc_courseuser';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['userid', 'courseid', 'date_get', 'date_first_access', 'date_complete', 'status', 'waiting', 'subscribed_by', 'date_begin_valid', 'date_expire_valid', 'credit', 'back_only', 'quiz_score', 'test_score', 'login_time', 'last_itemsid', 'openflag', 'course_total_time', 'is_msg'], 'integer'],
            [['finish'], 'number'],
            [['username'], 'string', 'max' => 255],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'userid' => '用户ID',
            'courseid' => '课程ID',
            'date_get' => '课程获取日期',
            'date_first_access' => '课程首次访问日期',
            'date_complete' => '课程完成日期',
            'status' => '课程进行状态',
            'waiting' => '是否挂起',
            'subscribed_by' => '授权人ID',
            'date_begin_valid' => '有效课程开始日期',
            'date_expire_valid' => '有效课程结束日期',
            'credit' => '学分',
            'back_only' => '是否只能按顺序看课件',
            'quiz_score' => '课间学习总分',
            'test_score' => '课后练习总分',
            'finish' => '完成进度',
            'login_time' => '登录次数',
            'last_itemsid' => '最后一次看课件ID',
            'username' => 'Username',
            'openflag' => 'Openflag',
            'course_total_time' => 'Course Total Time',
            'is_msg' => '在线消息是否已读，老师每次评论+1，学生点击变为0',
        ];
    }
    public function getCourse()
    {
        return $this->hasOne(Course::className(), ['id' => 'courseid']);
    }

	function updateQuiz() {
		$itemids = ArrayHelper::getColumn($this->course->items, 'id');
		if (!$itemids) return;
        $trackings = Itemtrack::findAll(['userid'=>$this->userid, 'itemid'=>$itemids]);
		$score = 0;
		foreach ($trackings as $tracking) {
			$score += $tracking->quiz_score_max;
		}
		$this->quiz_score = $score;
	}

	function updateTest() {
		$itemids = ArrayHelper::getColumn($this->course->items, 'id');
		if (!$itemids) return;
        $trackings = Itemtrack::findAll(['userid'=>$this->userid, 'itemid'=>$itemids]);
		$score = 0;
		foreach ($trackings as $tracking) {
			$score += $tracking->test_score_max;
		}
		$this->test_score = $score;
	}

	function updateProgress() {
		$this->finish = $this->get_learn_progress();
        $this->save();
	}

	function get_learn_progress() {
        $cid = $this->course->cid;
        $ci_id_list = CC_Citems::findAll(['course_id'=>$cid]);
		$itemids = ArrayHelper::getColumn($ci_id_list, 'id');
        $cfinsh = 0;
        $trackings = Itemtrack::findAll(['userid'=>$this->userid, 'itemid'=>$itemids]);
        foreach ($trackings as $key => $val) {
            $temp_add = 0;
            if(($val->item->vtype-0)>0){
                if($val->lesson_status==2){
                    $temp_add = 1; 
                }else if($val->lesson_status==1){
                    if($val->total_time>$val->item->item_time){
                        $temp_add = 0.9;
                    }else{
                        $info_temp = round(($val->total_time-0)/($val->item->item_time-0),2);
                        $temp_add = ($info_temp>0.9)?0.9:$info_temp; 
                    }
                }
            }else{//非scorm
                if($val->lesson_status==2){
                    $temp_add = 1; 
                }else if($val->lesson_status==1){
                    $temp_info_time = round(($val->max_reach_time-0)/($val->item->item_time-0),2);
                    $temp_info_point = round(((($val->checkpoint_first-0)+($val->checkpoint_second-0)+($val->checkpoint_third-0))/3),2);
					if ($this->back_only||1) {//不能拖动
						$temp_add = $temp_info_time;
					}else{
                        $temp_add = $temp_info_point;
					}
                }
            }
            $cfinsh = $cfinsh + ($temp_add>1?1:$temp_add);
        }
        if(!empty($itemids))$finish = round($cfinsh/count($itemids),2);
        return $finish;
	}
}
