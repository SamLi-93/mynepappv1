<?php

namespace common\models;

use Yii;

/**
 * This is the model class for table "lc_course_notes".
 *
 * @property integer $id
 * @property integer $courseid
 * @property integer $itemid
 * @property integer $userid
 * @property string $note
 * @property integer $note_time
 * @property integer $create_date
 */
class Coursenotes extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'lc_course_notes';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['courseid', 'itemid', 'userid', 'create_date'], 'integer'],
            [['note_time'], 'number'],
            [['note'], 'string'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'courseid' => '课程id',
            'itemid' => '课件id',
            'userid' => '用户id',
            'note' => '书签注释',
            'note_time' => '书签时间点',
            'create_date' => '添加时间',
        ];
    }
}
