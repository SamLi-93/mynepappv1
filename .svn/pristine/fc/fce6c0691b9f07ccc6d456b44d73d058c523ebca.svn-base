<?php

namespace common\models;

use Yii;

/**
 * This is the model class for table "cc_class".
 *
 * @property integer $id
 * @property integer $pid
 * @property string $val
 * @property integer $lev
 * @property string $memo
 * @property integer $isdelete
 * @property string $color
 * @property integer $corder
 * @property string $class_id
 * @property integer $tab_id
 * @property integer $is_freeze
 */
class Ctype extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'cc_class';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['pid', 'lev', 'isdelete', 'corder', 'tab_id', 'is_freeze'], 'integer'],
            [['val'], 'string', 'max' => 50],
            [['memo', 'color', 'class_id'], 'string', 'max' => 255],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'pid' => 'Pid',
            'val' => 'Val',
            'lev' => 'Lev',
            'memo' => 'Memo',
            'isdelete' => 'Isdelete',
            'color' => 'Color',
            'corder' => 'Corder',
            'class_id' => 'Class ID',
            'tab_id' => 'Tab ID',
            'is_freeze' => 'Is Freeze',
        ];
    }
}
