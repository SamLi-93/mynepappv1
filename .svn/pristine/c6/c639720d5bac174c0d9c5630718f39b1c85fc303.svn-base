<?php

namespace common\models;

use Yii;

/**
 * This is the model class for table "lc_items_tracking_history".
 *
 * @property integer $id
 * @property integer $itemid
 * @property integer $userid
 * @property integer $total_time
 * @property integer $stime
 * @property integer $etime
 * @property integer $test_score
 * @property integer $quiz_score
 */
class Trackhistory extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'lc_items_tracking_history';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['itemid', 'userid', 'total_time', 'stime', 'etime', 'test_score', 'quiz_score'], 'integer'],
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
            'total_time' => 'Total Time',
            'stime' => 'Stime',
            'etime' => 'Etime',
            'test_score' => 'Test Score',
            'quiz_score' => 'Quiz Score',
        ];
    }
}
