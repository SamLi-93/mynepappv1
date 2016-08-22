<?php

namespace backend\models;

use Yii;

/**
 * This is the model class for table "exam_stu_page".
 *
 * @property string $id
 * @property integer $course_id
 * @property integer $flag
 * @property integer $stu_id
 * @property double $score
 * @property integer $status
 * @property integer $exam_date
 * @property integer $examnum
 */
class Stupage extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'exam_stu_page';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['course_id', 'flag', 'stu_id', 'status', 'exam_date', 'examnum'], 'integer'],
            [['score'], 'number'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'course_id' => 'Course ID',
            'flag' => 'Flag',
            'stu_id' => 'Stu ID',
            'score' => 'Score',
            'status' => 'Status',
            'exam_date' => 'Exam Date',
            'examnum' => 'Examnum',
        ];
    }
}
