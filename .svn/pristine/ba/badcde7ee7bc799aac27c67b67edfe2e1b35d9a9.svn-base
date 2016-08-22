<?php

namespace backend\models;

use Yii;

/**
 * This is the model class for table "exam_template_page".
 *
 * @property integer $id
 * @property string $name
 * @property string $remark
 * @property integer $course_id
 * @property integer $knowledge_id
 * @property integer $isdelete
 * @property string $program
 * @property integer $totalnum
 * @property integer $istry
 */
class Templatepage extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'exam_template_page';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['remark', 'program'], 'string'],
            [['course_id', 'knowledge_id', 'isdelete', 'totalnum', 'istry'], 'integer'],
            [['name'], 'string', 'max' => 128],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'name' => 'Name',
            'remark' => 'Remark',
            'course_id' => 'Course ID',
            'knowledge_id' => 'Knowledge ID',
            'isdelete' => 'Isdelete',
            'program' => 'Program',
            'totalnum' => 'Totalnum',
            'istry' => 'Istry',
        ];
    }
    public function getPage()
    {
        /**
        * 第一个参数为要关联的字表模型类名称，
        *第二个参数指定 通过子表的 customer_id 去关联主表的 id 字段
        */
        return $this->hasMany(Stupage::className(), ['examnum' => 'id']);
    }
}
