<?php

namespace app\models;

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
class LcItemsTracking extends \yii\db\ActiveRecord
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
            [['itemid', 'userid', 'total_num', 'total_time', 'exit_time', 'max_reach_time', 'access_first', 'access_last', 'checkpoint_first', 'checkpoint_second', 'checkpoint_third', 'is_learning', 'learning_hisid'], 'integer'],
            [['test_score_raw', 'test_score_max', 'quiz_score_raw', 'quiz_score_max'], 'number'],
            [['quiz_score_detail'], 'string'],
            [['user_name'], 'string', 'max' => 255],
            [['lesson_status'], 'string', 'max' => 24],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'itemid' => 'Itemid',
            'userid' => 'Userid',
            'user_name' => 'User Name',
            'lesson_status' => 'Lesson Status',
            'test_score_raw' => 'Test Score Raw',
            'test_score_max' => 'Test Score Max',
            'quiz_score_raw' => 'Quiz Score Raw',
            'quiz_score_max' => 'Quiz Score Max',
            'total_num' => 'Total Num',
            'total_time' => 'Total Time',
            'exit_time' => 'Exit Time',
            'max_reach_time' => 'Max Reach Time',
            'access_first' => 'Access First',
            'access_last' => 'Access Last',
            'checkpoint_first' => 'Checkpoint First',
            'checkpoint_second' => 'Checkpoint Second',
            'checkpoint_third' => 'Checkpoint Third',
            'is_learning' => 'Is Learning',
            'learning_hisid' => 'Learning Hisid',
            'quiz_score_detail' => 'Quiz Score Detail',
        ];
    }
}
