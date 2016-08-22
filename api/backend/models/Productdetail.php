<?php

namespace backend\models;

use Yii;

/**
 * This is the model class for table "lc_product_detail".
 *
 * @property integer $id
 * @property integer $pid
 * @property integer $type
 * @property integer $rid
 */
class Productdetail extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'lc_product_detail';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['pid', 'type', 'rid'], 'integer'],
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
            'type' => 'Type',
            'rid' => 'Rid',
        ];
    }
}
