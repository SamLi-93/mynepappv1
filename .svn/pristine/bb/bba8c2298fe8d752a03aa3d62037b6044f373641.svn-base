<?php

namespace common\models;

use Yii;

/**
 * This is the model class for table "cc_course_items".
 *
 * @property integer $id
 * @property integer $course_id
 * @property string $title
 * @property integer $item_time
 * @property string $t_name
 * @property integer $t_id
 * @property string $catalog_xml
 * @property string $quiz_xml
 * @property string $wrong_xml
 * @property string $caption_file
 * @property string $vd_st_path
 * @property string $vd_st_size
 * @property string $vd_st_type
 * @property string $vd_st_encpt
 * @property string $vd_hd_path
 * @property string $vd_hd_size
 * @property string $vd_hd_type
 * @property string $vd_hd_encpt
 * @property string $key_cd
 * @property integer $order_id
 * @property integer $index_id
 * @property integer $create_date
 * @property integer $update_date
 * @property integer $vtype
 * @property string $img
 * @property integer $has_test
 * @property string $vd_mb_path
 * @property string $vd_mb_size
 * @property string $vd_mb_type
 * @property string $vd_mb_encpt
 * @property integer $is_sliced
 * @property integer $is_moved
 * @property integer $slice_time
 * @property string $slice_data
 * @property string $m3u8_st_path
 * @property string $m3u8_hd_path
 * @property string $m3u8_mb_path
 */
class CC_Citems extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'cc_course_items';
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
            [['course_id', 'item_time', 't_id', 'order_id', 'index_id', 'create_date', 'update_date', 'vtype', 'has_test', 'is_sliced', 'is_moved', 'slice_time'], 'integer'],
            [['catalog_xml', 'quiz_xml', 'wrong_xml', 'caption_file', 'slice_data'], 'string'],
            [['title', 'vd_st_path', 'vd_st_encpt', 'vd_hd_path', 'vd_hd_encpt', 'key_cd', 'img', 'vd_mb_path', 'vd_mb_encpt'], 'string', 'max' => 255],
            [['t_name'], 'string', 'max' => 150],
            [['vd_st_size', 'vd_st_type', 'vd_hd_size', 'vd_hd_type', 'vd_mb_size', 'vd_mb_type'], 'string', 'max' => 50],
            [['m3u8_st_path', 'm3u8_hd_path', 'm3u8_mb_path'], 'string', 'max' => 200],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'course_id' => 'Course ID',
            'title' => 'Title',
            'item_time' => 'Item Time',
            't_name' => 'T Name',
            't_id' => 'T ID',
            'catalog_xml' => 'Catalog Xml',
            'quiz_xml' => 'Quiz Xml',
            'wrong_xml' => 'Wrong Xml',
            'caption_file' => 'Caption File',
            'vd_st_path' => 'Vd St Path',
            'vd_st_size' => 'Vd St Size',
            'vd_st_type' => 'Vd St Type',
            'vd_st_encpt' => 'Vd St Encpt',
            'vd_hd_path' => 'Vd Hd Path',
            'vd_hd_size' => 'Vd Hd Size',
            'vd_hd_type' => 'Vd Hd Type',
            'vd_hd_encpt' => 'Vd Hd Encpt',
            'key_cd' => 'Key Cd',
            'order_id' => 'Order ID',
            'index_id' => 'Index ID',
            'create_date' => 'Create Date',
            'update_date' => 'Update Date',
            'vtype' => 'Vtype',
            'img' => 'Img',
            'has_test' => 'Has Test',
            'vd_mb_path' => 'Vd Mb Path',
            'vd_mb_size' => 'Vd Mb Size',
            'vd_mb_type' => 'Vd Mb Type',
            'vd_mb_encpt' => 'Vd Mb Encpt',
            'is_sliced' => '是否已切片',
            'is_moved' => 'Is Moved',
            'slice_time' => 'Slice Time',
            'slice_data' => 'Slice Data',
            'm3u8_st_path' => 'M3u8 St Path',
            'm3u8_hd_path' => 'M3u8 Hd Path',
            'm3u8_mb_path' => 'M3u8 Mb Path',
        ];
    }
}
