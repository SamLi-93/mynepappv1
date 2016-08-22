<?php

namespace common\models;

use Yii;

/**
 * This is the model class for table "sms_admin".
 *
 * @property integer $id
 * @property string $username
 * @property string $password
 * @property string $name
 * @property integer $gender
 * @property integer $level
 * @property integer $orgid
 * @property string $orgname
 * @property integer $power
 * @property integer $update_id
 * @property integer $update_date
 * @property integer $isdelete
 * @property integer $valid
 * @property string $perms_bysj
 * @property integer $groupid
 * @property string $mclassids
 * @property integer $autosync
 * @property string $perms
 * @property integer $marketer_id
 * @property string $logo
 * @property string $phone
 * @property integer $ccclass_id
 */
class Admin extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'sms_admin';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['gender', 'level', 'orgid', 'power', 'update_id', 'update_date', 'isdelete', 'valid', 'groupid', 'autosync', 'marketer_id', 'ccclass_id'], 'integer'],
            [['perms_bysj', 'perms'], 'string'],
            [['username', 'name'], 'string', 'max' => 30],
            [['password'], 'string', 'max' => 32],
            [['orgname', 'logo'], 'string', 'max' => 255],
            [['mclassids'], 'string', 'max' => 100],
            [['phone'], 'string', 'max' => 20],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'username' => 'Username',
            'password' => 'Password',
            'name' => 'Name',
            'gender' => 'Gender',
            'level' => 'Level',
            'orgid' => 'Orgid',
            'orgname' => 'Orgname',
            'power' => 'Power',
            'update_id' => 'Update ID',
            'update_date' => 'Update Date',
            'isdelete' => 'Isdelete',
            'valid' => 'Valid',
            'perms_bysj' => 'Perms Bysj',
            'groupid' => 'Groupid',
            'mclassids' => 'Mclassids',
            'autosync' => '权限是否和用户组的权限自动同步：1：同步；0：不同步；',
            'perms' => '权限',
            'marketer_id' => '绑定的市场人员id',
            'logo' => 'logo',
            'phone' => 'Phone',
            'ccclass_id' => '产品类型id',
        ];
    }
}
