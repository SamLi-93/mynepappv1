<?php

namespace backend\models;

use Yii;

/**
 * This is the model class for table "exam_stu_questionwrong".
 *
 * @property string $id
 * @property integer $question_id
 * @property string $stu_id
 */
class Questionwrong extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'exam_stu_questionwrong';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['question_id'], 'integer'],
            [['stu_id'], 'string', 'max' => 50],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'question_id' => 'Question ID',
            'stu_id' => 'Stu ID',
        ];
    }
}
