<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/7/4
 * Time: 15:40
 */

namespace backend\models;


use yii\db\ActiveRecord;

class Address extends ActiveRecord
{

    public static function tableName()
    {
        return '{{%sms_address}}';
    }

    









}