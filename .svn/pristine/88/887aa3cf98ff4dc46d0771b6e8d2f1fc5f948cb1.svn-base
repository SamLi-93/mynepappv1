<?php

namespace common\models;

use Yii;

/**
 * This is the model class for table "lc_course".
 *
 * @property integer $id
 * @property string $tag
 * @property integer $cid
 * @property string $code
 * @property string $name
 * @property string $name_short
 * @property string $desc_short
 * @property string $desc_long
 * @property string $img
 * @property integer $item_count
 * @property integer $total_time
 * @property integer $class_time
 * @property double $price
 * @property double $rprice
 * @property string $video_express
 * @property string $teacher_names
 * @property string $teacher_ids
 * @property integer $create_date
 * @property integer $update_date
 * @property integer $credit
 * @property string $classtype
 * @property string $memo
 * @property integer $isdelete
 * @property integer $type
 * @property string $exam_type
 * @property integer $liberty_type
 * @property integer $course_tag
 * @property string $course_lecturer
 * @property integer $class_id
 * @property integer $courseclass_id
 * @property integer $isfree
 * @property string $source
 * @property integer $ishot
 * @property integer $isbest
 * @property integer $isnew
 * @property integer $weights
 * @property integer $sellnum
 * @property integer $corder
 * @property integer $owner_type
 * @property integer $owner
 * @property double $rprice2
 * @property double $rprice3
 * @property double $order_amount
 * @property integer $order_stu
 * @property integer $share_type
 * @property string $share_ratio
 * @property string $desc_catalog
 * @property integer $status
 * @property integer $is_show
 * @property integer $study_num
 * @property integer $try_see_num
 * @property string $pinyin
 * @property double $score
 * @property integer $cover_id
 * @property integer $learnnum
 * @property integer $commentnum
 * @property integer $is_top
 * @property string $course_type
 * @property integer $is_live
 * @property integer $live_stime
 * @property integer $live_etime
 * @property integer $course_source
 * @property integer $share_mode
 * @property integer $copyright
 * @property integer $edu_lv
 * @property integer $edu_type
 * @property string $discipline
 * @property string $from_college
 * @property string $textbook_name
 * @property integer $class_total
 * @property integer $has_item
 * @property integer $has_quiz
 * @property integer $has_exambase
 * @property integer $video_type
 * @property string $try_items
 */
class Course extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'lc_course';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['cid', 'item_count', 'total_time', 'class_time', 'create_date', 'update_date', 'credit', 'isdelete', 'type', 'liberty_type', 'course_tag', 'class_id', 'courseclass_id', 'isfree', 'ishot', 'isbest', 'isnew', 'weights', 'sellnum', 'corder', 'owner_type', 'owner', 'order_stu', 'share_type', 'status', 'is_show', 'study_num', 'try_see_num', 'cover_id', 'learnnum', 'commentnum', 'is_top', 'is_live', 'live_stime', 'live_etime', 'course_source', 'share_mode', 'copyright', 'edu_lv', 'edu_type', 'class_total', 'has_item', 'has_quiz', 'has_exambase', 'video_type'], 'integer'],
            [['desc_long', 'desc_catalog'], 'string'],
            [['price', 'rprice', 'rprice2', 'rprice3', 'order_amount', 'score'], 'number'],
            [['tag', 'name', 'desc_short', 'img', 'video_express', 'classtype', 'memo', 'exam_type', 'discipline', 'from_college', 'textbook_name', 'try_items'], 'string', 'max' => 255],
            [['code', 'name_short', 'course_lecturer', 'share_ratio', 'pinyin', 'course_type'], 'string', 'max' => 50],
            [['teacher_names'], 'string', 'max' => 250],
            [['teacher_ids'], 'string', 'max' => 150],
            [['source'], 'string', 'max' => 64],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'tag' => 'Tag',
            'cid' => '课程中心课程ID',
            'code' => '课程编号',
            'name' => '课程名称',
            'name_short' => '缩写名称',
            'desc_short' => '文件简介',
            'desc_long' => '图文详细信息',
            'img' => '课程封面图片',
            'item_count' => '集数',
            'total_time' => '总时长',
            'class_time' => '课时数',
            'price' => '价格',
            'rprice' => '折扣价',
            'video_express' => '试听视频',
            'teacher_names' => '老师名字',
            'teacher_ids' => 'Teacher Ids',
            'create_date' => '授权日期',
            'update_date' => '更新日期',
            'credit' => '学分',
            'classtype' => '课程标签',
            'memo' => '信息备注',
            'isdelete' => '0:未删除1:已删除',
            'type' => 'Type',
            'exam_type' => 'Exam Type',
            'liberty_type' => 'Liberty Type',
            'course_tag' => 'Course Tag',
            'course_lecturer' => 'Course Lecturer',
            'class_id' => '培训机构',
            'courseclass_id' => '课程类型',
            'isfree' => '是否免费',
            'source' => '来源',
            'ishot' => '热门',
            'isbest' => '推荐',
            'isnew' => '新款',
            'weights' => '权重',
            'sellnum' => 'Sellnum',
            'corder' => 'Corder',
            'owner_type' => '所属人的类型 1-老师 2-协议方',
            'owner' => '所属的老师',
            'rprice2' => '团体价',
            'rprice3' => '协议价',
            'order_amount' => '订单金额',
            'order_stu' => '订单人数',
            'share_type' => '分成方式 1-两方分成 2-三方分成',
            'share_ratio' => '分成比例 :分隔',
            'desc_catalog' => '课程目录信息',
            'status' => '审核状态 0:未审核1:审核通过2:审核不通过',
            'is_show' => '是否上架（1：上架 2：下架）',
            'study_num' => '学习次数',
            'try_see_num' => '试看次数',
            'pinyin' => '老师姓名中文转拼音',
            'score' => '评分',
            'cover_id' => '封面id',
            'learnnum' => '学习人数',
            'commentnum' => '评论数',
            'is_top' => '是否置顶',
            'course_type' => '课程类型',
            'is_live' => '是否直播',
            'live_stime' => '直播开始时间',
            'live_etime' => '直播结束时间',
            'course_source' => '课程来源',
            'share_mode' => '分益模式',
            'copyright' => '版权',
            'edu_lv' => '学历层次',
            'edu_type' => '课程学历类型',
            'discipline' => '专业',
            'from_college' => '来源院校(单位)',
            'textbook_name' => '教材名称',
            'class_total' => '课时共计',
            'has_item' => '课件有无',
            'has_quiz' => '习题有无',
            'has_exambase' => '试题库有无',
            'video_type' => '视频类型',
            'try_items' => '试看章节IDs（逗号分隔）',
        ];
    }
    public function getItems()
    {
		return CC_Citems::find()->where(['course_id'=>$this->cid])->orderBy('index_id')->all();
    }
}
