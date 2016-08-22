<?php

namespace backend\models;

use Yii;

/**
 * This is the model class for table "exam_generation_strategy".
 *
 * @property integer $id
 * @property string $itemno
 * @property string $name
 * @property string $remark
 * @property string $program
 * @property double $totalscore
 * @property integer $totalnum
 * @property integer $postdate
 * @property integer $isdelete
 * @property integer $page_id
 * @property integer $knowledge_id
 */
class Strategy extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'exam_generation_strategy';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['remark', 'program'], 'string'],
            [['totalscore'], 'number'],
            [['totalnum', 'postdate', 'isdelete', 'page_id', 'knowledge_id'], 'integer'],
            [['itemno'], 'string', 'max' => 64],
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
            'itemno' => 'Itemno',
            'name' => 'Name',
            'remark' => 'Remark',
            'program' => 'Program',
            'totalscore' => 'Totalscore',
            'totalnum' => 'Totalnum',
            'postdate' => 'Postdate',
            'isdelete' => 'Isdelete',
            'page_id' => 'Page ID',
            'knowledge_id' => 'Knowledge ID',
        ];
    }
}
