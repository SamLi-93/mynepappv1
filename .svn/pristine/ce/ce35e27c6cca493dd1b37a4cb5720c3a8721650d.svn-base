<?php

namespace common\models;

use Yii;

/**
 * This is the model class for table "lc_card".
 *
 * @property integer $id
 * @property integer $type
 * @property integer $pro_id
 * @property string $wcode
 * @property string $ccode
 * @property integer $isactive
 * @property integer $isbind
 * @property integer $saleid
 * @property integer $creator
 * @property integer $create_time
 * @property integer $activator
 * @property integer $active_time
 * @property integer $bind_userid
 * @property integer $bind_time
 */
class Card extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'lc_card';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['type', 'pro_id', 'isactive', 'isbind', 'saleid', 'creator', 'create_time', 'activator', 'active_time', 'bind_userid', 'bind_time'], 'integer'],
            [['pro_id', 'creator', 'create_time'], 'required'],
            [['wcode', 'ccode'], 'string', 'max' => 255],
            [['ccode'], 'unique'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'type' => '学习卡类型',
            'pro_id' => '学习卡对应产品包id',
            'wcode' => '卡片流水码',
            'ccode' => '课程绑定码',
            'isactive' => '是否激活',
            'isbind' => '是否绑定',
            'saleid' => '渠道商ID 0为直接网站零售',
            'creator' => '生成人ID',
            'create_time' => '生成时间',
            'activator' => '激活人ID',
            'active_time' => '激活时间',
            'bind_userid' => '绑定人',
            'bind_time' => '绑定时间',
        ];
    }

	function doBind($userid) {
		if (!$this->isactive || $this->isbind) return;
		$now = time();
		$puser = new Productuser();
		$puser->userid = $userid;
		$puser->productid = $this->pro_id;
		$puser->date_get = $now;
		$puser->save();

		$this->isbind = 1;
		$this->bind_userid = $userid;
		$this->bind_time = $now;
		$this->save();
	}
}
