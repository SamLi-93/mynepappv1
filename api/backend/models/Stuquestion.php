<?php

namespace backend\models;

use Yii;

/**
 * This is the model class for table "exam_stu_question".
 *
 * @property string $id
 * @property integer $page_id
 * @property integer $question_id
 * @property string $question
 * @property string $remark
 * @property string $options
 * @property string $answer
 * @property double $score
 * @property double $answerscore
 * @property string $result
 * @property integer $type_id
 */
class Stuquestion extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'exam_stu_question';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['page_id', 'question_id', 'type_id'], 'integer'],
            [['question', 'remark', 'options', 'answer', 'result'], 'string'],
            [['score', 'answerscore'], 'number'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'page_id' => 'Page ID',
            'question_id' => 'Question ID',
            'question' => 'Question',
            'remark' => 'Remark',
            'options' => 'Options',
            'answer' => 'Answer',
            'score' => 'Score',
            'answerscore' => 'Answerscore',
            'result' => 'Result',
            'type_id' => 'Type ID',
        ];
    }
}
