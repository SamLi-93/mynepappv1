<?php

namespace common\models;

use Yii;

/**
 * This is the model class for table "lc_productuser".
 *
 * @property integer $id
 * @property integer $userid
 * @property integer $productid
 * @property integer $date_get
 * @property integer $openflag
 * @property integer $last_courseid
 */
class Productuser extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'lc_productuser';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['userid', 'productid'], 'required'],
            [['userid', 'productid', 'date_get', 'openflag', 'last_courseid'], 'integer'],
            [['userid', 'productid'], 'unique', 'targetAttribute' => ['userid', 'productid'], 'message' => 'The combination of 用户ID and 产品ID has already been taken.'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'userid' => '用户ID',
            'productid' => '产品ID',
            'date_get' => '产品获取日期',
            'openflag' => '开放标志',
            'last_courseid' => 'Last Courseid',
        ];
    }
}
