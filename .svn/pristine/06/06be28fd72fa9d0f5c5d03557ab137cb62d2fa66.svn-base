<?php

namespace common\models;

use Yii;

/**
 * This is the model class for table "lc_items_tracking".
 *
 * @property integer $id
 * @property integer $itemid
 * @property integer $userid
 * @property string $user_name
 * @property string $lesson_status
 * @property double $test_score_raw
 * @property double $test_score_max
 * @property double $quiz_score_raw
 * @property double $quiz_score_max
 * @property integer $total_num
 * @property integer $total_time
 * @property integer $exit_time
 * @property integer $max_reach_time
 * @property integer $access_first
 * @property integer $access_last
 * @property integer $checkpoint_first
 * @property integer $checkpoint_second
 * @property integer $checkpoint_third
 * @property integer $is_learning
 * @property integer $learning_hisid
 * @property string $quiz_score_detail
 */
class Itemtrack extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'lc_items_tracking';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['itemid', 'userid', 'total_num', 'access_first', 'access_last', 'checkpoint_first', 'checkpoint_second', 'checkpoint_third', 'is_learning', 'learning_hisid'], 'integer'],
            [['test_score_raw', 'test_score_max', 'quiz_score_raw', 'quiz_score_max', 'total_time', 'exit_time', 'max_reach_time'], 'number'],
            [['quiz_score_detail'], 'string'],
            [['user_name'], 'string', 'max' => 255],
            //[['lesson_status'], 'string', 'max' => 24],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'itemid' => '课件id',
            'userid' => '用户id',
            'user_name' => '用户名',
            'lesson_status' => '课程状态',
            'test_score_raw' => '课后练习最后一次得分',
            'test_score_max' => '课后练习最高分',
            'quiz_score_raw' => '课间练习最后一次得分',
            'quiz_score_max' => '课间练习最高分',
            'total_num' => '学习次数',
            'total_time' => '学习总时间',
            'exit_time' => '最后退出时间点',
            'max_reach_time' => '学习到达最远时间点',
            'access_first' => '初次访问时间',
            'access_last' => '最后一次访问时间',
            'checkpoint_first' => '检验点1',
            'checkpoint_second' => '检验点2',
            'checkpoint_third' => '检验点3',
            'is_learning' => '是否正在学习',
            'learning_hisid' => '当前正在学习的historyid',
            'quiz_score_detail' => 'Quiz Score Detail',
        ];
    }

	function setQuiz($score, $isTest, $quizIndex) {
		if (!$isTest) {
			$this->quiz_score_raw = $score;
			$scores = $this->quiz_score_detail ? json_decode($this->quiz_score_detail, true) : array();
			$old_score = isset($scores[$quizIndex]) ? $scores[$quizIndex] : 0;
			$scores[$quizIndex] = max($old_score, $score);
			$score_max = 0;
			foreach ($scores as $v) {
				$score_max += $v;
			}
			$this->quiz_score_max = $score_max;
			$this->quiz_score_detail = json_encode($scores);
		} else {
			$this->test_score_raw = $score;
			$this->test_score_max = max($this->test_score_max, $score);
		}
	}

	function getItem() {
		return CC_Citems::findOne($this->itemid);
	}
}
