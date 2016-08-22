<?php

namespace common\models;

use Yii;

/**
 * This is the model class for table "sms_order_detail".
 *
 * @property integer $id
 * @property integer $order_id
 * @property string $order_no
 * @property integer $courseid
 * @property integer $product_id
 * @property double $price
 */
class SmsOrderDetail extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'sms_order_detail';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['order_id', 'courseid', 'product_id'], 'integer'],
            [['price'], 'number'],
            [['order_no'], 'string', 'max' => 255],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'order_id' => 'Order ID',
            'order_no' => 'Order No',
            'courseid' => 'Courseid',
            'product_id' => 'Product ID',
            'price' => 'Price',
        ];
    }
}
