<?php

namespace backend\models;

use Yii;

/**
 * This is the model class for table "exam_questions".
 *
 * @property integer $id
 * @property integer $type_id
 * @property integer $course_id
 * @property string $itemno
 * @property integer $isdelete
 * @property string $knowledge_id
 * @property string $use_type
 * @property string $question
 * @property string $result
 * @property string $options
 * @property string $remark
 */
class Questions extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'exam_questions';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['type_id', 'course_id', 'isdelete'], 'integer'],
            [['question', 'result', 'options', 'remark'], 'string'],
            [['itemno'], 'string', 'max' => 64],
            [['knowledge_id'], 'string', 'max' => 100],
            [['use_type'], 'string', 'max' => 20],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'type_id' => 'Type ID',
            'course_id' => 'Course ID',
            'itemno' => 'Itemno',
            'isdelete' => 'Isdelete',
            'knowledge_id' => 'Knowledge ID',
            'use_type' => 'Use Type',
            'question' => 'Question',
            'result' => 'Result',
            'options' => 'Options',
            'remark' => 'Remark',
        ];
    }
}
