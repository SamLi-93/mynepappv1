<?php

namespace common\models;

use Yii;

/**
 * This is the model class for table "lc_product".
 *
 * @property integer $id
 * @property string $name
 * @property integer $type
 * @property string $short_intr
 * @property string $gprice
 * @property string $price
 * @property string $pic
 * @property integer $onsale
 * @property integer $seq
 * @property string $long_intr
 * @property string $clist
 * @property string $faq
 * @property integer $isdelete
 */
class Product extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'lc_product';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['type', 'onsale', 'seq', 'isdelete'], 'integer'],
            [['gprice', 'price'], 'number'],
            [['long_intr', 'clist', 'faq'], 'string'],
            [['name', 'short_intr', 'pic'], 'string', 'max' => 255],
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
            'type' => 'Type',
            'short_intr' => 'Short Intr',
            'gprice' => 'Gprice',
            'price' => 'Price',
            'pic' => 'Pic',
            'onsale' => 'Onsale',
            'seq' => 'Seq',
            'long_intr' => 'Long Intr',
            'clist' => 'Clist',
            'faq' => 'Faq',
            'isdelete' => 'Isdelete',
        ];
    }

	/*
	public function getDetails($type=1) {
		return $this->hasMany('lc_product_detail', ['pid' => 'id'])->onCondition(['type' => $type]);
	}
	*/

    public function getCourses()
    {
        return $this->hasMany(Course::className(), ['id' => 'rid'])
            ->viaTable('lc_product_detail', ['pid' => 'id'], 
                        function($query) {
                          $query->onCondition(['type' => 1]);
                      });
    }
}
