<?php

namespace common\models;

use Yii;

/**
 * This is the model class for table "lc_question".
 *
 * @property integer $id
 * @property integer $typeid
 * @property string $title
 * @property string $content
 * @property integer $to_who
 * @property integer $ischeck
 * @property string $check_memo
 * @property integer $isend
 * @property integer $userid
 * @property integer $sendtime
 * @property string $add_content
 * @property integer $add_time
 * @property integer $ispublish
 * @property string $close_memo
 * @property integer $isclose
 * @property integer $to_publish
 * @property integer $course_id
 * @property integer $isrepaly
 * @property string $repaly_content
 * @property integer $repaly_time
 * @property integer $repalyer
 * @property integer $org_id
 * @property string $org_uname
 * @property integer $org_qid
 * @property integer $view_cnt
 * @property integer $qtime
 * @property string $atxt
 * @property integer $atea
 * @property integer $atime
 * @property integer $isanswer
 * @property integer $qtype
 */
class Quiz extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'lc_question';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['typeid', 'to_who', 'ischeck', 'isend', 'userid', 'sendtime', 'add_time', 'ispublish', 'isclose', 'to_publish', 'course_id', 'isrepaly', 'repaly_time', 'repalyer', 'org_id', 'org_qid', 'view_cnt', 'qtime', 'atea', 'atime', 'isanswer', 'qtype'], 'integer'],
            [['content', 'add_content', 'repaly_content'], 'string'],
            [['title', 'check_memo', 'close_memo', 'atxt'], 'string', 'max' => 255],
            [['org_uname'], 'string', 'max' => 50],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'typeid' => '问题类型id',
            'title' => '标题',
            'content' => '内容',
            'to_who' => '提问对象',
            'ischeck' => '是否审核',
            'check_memo' => '审核意见',
            'isend' => '是否关闭',
            'userid' => '提问人',
            'sendtime' => '提问时间',
            'add_content' => '追加说明',
            'add_time' => '追加时间',
            'ispublish' => '是否发布',
            'close_memo' => 'Close Memo',
            'isclose' => 'Isclose',
            'to_publish' => 'To Publish',
            'course_id' => '课程id',
            'isrepaly' => 'Isrepaly',
            'repaly_content' => 'Repaly Content',
            'repaly_time' => 'Repaly Time',
            'repalyer' => 'Repalyer',
            'org_id' => '来自哪个平台',
            'org_uname' => '平台用户名称',
            'org_qid' => '平台推送过来的帖子id',
            'view_cnt' => '查看数',
            'qtime' => '提问定位时间',
            'atxt' => '回答的内容',
            'atea' => '回答的老师',
            'atime' => '老师回答的时间',
            'isanswer' => '是否已经回答',
            'qtype' => '问题属于哪个大分类下面的',
        ];
    }

	public function getAuser() {
		return $this->hasOne(Admin::className(), ['id' => 'atea']);
	}
}
