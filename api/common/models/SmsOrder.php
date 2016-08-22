<?php

namespace common\models;

use Yii;

/**
 * This is the model class for table "sms_order".
 *
 * @property integer $id
 * @property string $order_no
 * @property double $price
 * @property integer $order_time
 * @property integer $state
 * @property integer $user_id
 * @property double $pay
 * @property integer $paytime
 * @property string $trade_no
 * @property string $trade_status
 * @property integer $isdelete
 * @property string $memo
 * @property string $paymethod
 * @property string $paybank
 * @property integer $order_type
 * @property integer $stu_num
 * @property double $share_percent
 * @property double $total_pay
 * @property integer $org_id
 * @property integer $org_uid
 * @property integer $p_id
 * @property string $p_order
 * @property string $agreement
 * @property string $agreement_name
 * @property integer $years
 * @property integer $address_id
 * @property string $invoice_title
 * @property string $invoice_phone
 */
class SmsOrder extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'sms_order';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['price', 'pay', 'share_percent', 'total_pay'], 'number'],
            [['order_time', 'state', 'user_id', 'paytime', 'isdelete', 'order_type', 'stu_num', 'org_id', 'org_uid', 'p_id', 'years', 'address_id'], 'integer'],
            [['order_no', 'p_order', 'agreement', 'agreement_name'], 'string', 'max' => 100],
            [['trade_no', 'trade_status', 'memo', 'paymethod', 'paybank', 'invoice_title'], 'string', 'max' => 255],
            [['invoice_phone'], 'string', 'max' => 20],
            [['order_no'], 'unique'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'order_no' => 'Order No',
            'price' => 'Price',
            'order_time' => 'Order Time',
            'state' => 'State',
            'user_id' => 'User ID',
            'pay' => 'Pay',
            'paytime' => 'Paytime',
            'trade_no' => 'Trade No',
            'trade_status' => 'Trade Status',
            'isdelete' => 'Isdelete',
            'memo' => 'Memo',
            'paymethod' => 'Paymethod',
            'paybank' => 'Paybank',
            'order_type' => 'Order Type',
            'stu_num' => 'Stu Num',
            'share_percent' => 'Share Percent',
            'total_pay' => 'Total Pay',
            'org_id' => 'Org ID',
            'org_uid' => 'Org Uid',
            'p_id' => 'P ID',
            'p_order' => 'P Order',
            'agreement' => 'Agreement',
            'agreement_name' => 'Agreement Name',
            'years' => 'Years',
            'address_id' => 'Address ID',
            'invoice_title' => 'Invoice Title',
            'invoice_phone' => 'Invoice Phone',
        ];
    }
}
