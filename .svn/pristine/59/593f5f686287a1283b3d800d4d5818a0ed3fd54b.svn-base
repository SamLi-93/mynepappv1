<?php

namespace common\models;

use Yii;

/**
 * This is the model class for table "cc_course".
 *
 * @property integer $id
 * @property integer $class_id
 * @property string $code
 * @property string $name
 * @property string $name_short
 * @property string $desc_short
 * @property string $desc_long
 * @property string $img
 * @property integer $item_count
 * @property integer $total_time
 * @property integer $class_time
 * @property integer $status
 * @property double $price
 * @property string $video_express
 * @property string $teacher_names
 * @property string $teacher_ids
 * @property integer $create_date
 * @property integer $update_date
 * @property integer $open_date
 * @property integer $item_code
 * @property string $hard_disk
 * @property string $mbimg
 * @property string $desc_catalog
 * @property integer $from_site
 */
class CC_Course extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'cc_course';
    }

    /**
     * @return \yii\db\Connection the database connection used by this AR class.
     */
    public static function getDb()
    {
        return Yii::$app->get('cdb');
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['class_id', 'item_count', 'total_time', 'class_time', 'status', 'create_date', 'update_date', 'open_date', 'item_code', 'from_site'], 'integer'],
            [['desc_long', 'desc_catalog'], 'string'],
            [['price'], 'number'],
            [['code', 'name_short'], 'string', 'max' => 50],
            [['name', 'teacher_ids'], 'string', 'max' => 150],
            [['desc_short', 'img', 'video_express', 'teacher_names', 'hard_disk', 'mbimg'], 'string', 'max' => 255],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'class_id' => 'Class ID',
            'code' => 'Code',
            'name' => 'Name',
            'name_short' => 'Name Short',
            'desc_short' => 'Desc Short',
            'desc_long' => 'Desc Long',
            'img' => 'Img',
            'item_count' => 'Item Count',
            'total_time' => 'Total Time',
            'class_time' => 'Class Time',
            'status' => 'Status',
            'price' => 'Price',
            'video_express' => 'Video Express',
            'teacher_names' => 'Teacher Names',
            'teacher_ids' => 'Teacher Ids',
            'create_date' => 'Create Date',
            'update_date' => 'Update Date',
            'open_date' => 'Open Date',
            'item_code' => 'Item Code',
            'hard_disk' => 'Hard Disk',
            'mbimg' => 'Mbimg',
            'desc_catalog' => '课程目录信息',
            'from_site' => '来自哪个平台 0为课程中心',
        ];
    }
}
