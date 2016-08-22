<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "lc_userkeep".
 *
 * @property integer $id
 * @property integer $pid
 * @property integer $uid
 * @property integer $isbuy
 */
class LcUserkeep extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'lc_userkeep';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['pid', 'uid', 'isbuy'], 'integer'],
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
            'uid' => 'Uid',
            'isbuy' => 'Isbuy',
        ];
    }
}
