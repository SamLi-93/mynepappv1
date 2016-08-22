<?php
/**
 * Created by PhpStorm.
 * User: admin
 * Date: 2016/6/13
 * Time: 16:26
 */

namespace backend\controllers;


use Yii;
use yii\web\Controller;
use yii\helpers\ArrayHelper;
use common\models\LoginForm;
use common\models\Product;
use common\models\Course;
use backend\models\Productdetail;
use backend\models\Stupage;
use backend\models\Strategy;
use backend\models\Questions;
use backend\models\Stuquestion;
use backend\models\Questionwrong;
use backend\models\Templatepage;
use frontend\models\SignupForm;
use yii\filters\auth\QueryParamAuth;

class MobilepracticeController extends Controller
{
    public function behaviors()
    {
        return [
            'authenticator' => [
                'class' => QueryParamAuth::className(),
                'only' => ['getquestion','getpracticelist','examsubmit','setanswer'],
            ],
        ];
    }
    /*
     *  试卷
     */
    public function actionGetquestion()
    {
        header("access-control-allow-origin: *");
        $request = Yii::$app->request;
        $course_id = $request->get('course_id');
        $template_pageid = $request->get('template_pageid');
        $userid = Yii::$app->user->identity->idst;
        $flag = 0;
        //$qnum = 0;
        $time = time();
        $stupage = Stupage::find()->where(['examnum'=>$template_pageid,'stu_id'=>$userid,'status'=>'0'])->orderBy('id desc')->one();
        $examtemplate = Templatepage::find()->where(['id'=>$template_pageid])->one();
        $strategy = Strategy::find()->where(['page_id'=>$template_pageid])->all();
        $conn = Yii::$app->db;
        /*foreach ($strategy as $stra){
            $fangan = json_decode($stra['program'],true);
            foreach ($fangan as $key => $val){
                $examtype = $val['examtype'];
                $n = $val['num'];
                $quesnum = Questions::find("isdelete=0 and course_id = '$course_id' and type_id='$examtype' and FIND_IN_SET('{$stra['knowledge_id']}',knowledge_id) and FIND_IN_SET('{$examtemplate['knowledge_id']}',use_type)")->count();
                if($n>$quesnum)  $qnum++;
            }
        }*/
        //print_r($stupage);
        //exit;
        if($stupage['id']){
            $page_id = $stupage['id'];
        }else{
            $sql = " insert into exam_stu_page(course_id,flag,stu_id,exam_date,examnum) values('$course_id','{$examtemplate['knowledge_id']}','{$userid}','$time','$template_pageid') ";
            $p_arr = $conn->createCommand($sql)->execute();
            $command = $conn->createCommand("SELECT last_insert_id() as page_id");
            $result = $command->queryAll();
            $page_id = $result[0]['page_id'];
            foreach ($strategy as $stra){
                $fangan = json_decode($stra['program'],true);
                foreach ($fangan as $key => $val){
                    $examtype = $val['examtype'];
                    $n = $val['num'];
                    $score = $val['score'];
                    $sql = " select * from exam_questions where isdelete=0 and course_id = '$course_id' and type_id='$examtype' and FIND_IN_SET('{$stra['knowledge_id']}',knowledge_id) and FIND_IN_SET('{$examtemplate['knowledge_id']}',use_type) and not FIND_IN_SET( id ,IFNULL((SELECT GROUP_CONCAT(question_id) question_id  FROM `exam_stu_question` WHERE `page_id`='$page_id'),0)) ORDER BY RAND() LIMIT $n ";
                    $questions = $conn->createCommand($sql)->queryAll();
                    foreach ($questions as $queskey => $quesval){
                        $question = new Stuquestion();
                        $question->page_id = $page_id;
                        $question->question_id = $quesval['id'];
                        $question->question = $quesval['question'];
                        $question->remark = $quesval['remark'];
                        $question->options = $quesval['options'];
                        $question->result = $quesval['result'];
                        $question->type_id = $quesval['type_id'];
                        $question->score = $score;
                        if($examtype>3) $question->answerscore = $score;
                        $question->save();
                    }
                }
            }
        }
        $course = Course::find()->where(['id'=>$course_id])->one();

        $sql_where = " page_id = '$page_id'";       
        //得到学生试卷
        
        $question = array();
        $card = array();
        $sql = "select a.type_id,b.name,sum(a.score) as score,count(a.id) as n from exam_stu_question a left join exam_question_type b on a.type_id=b.id  WHERE a.page_id = '$page_id' GROUP BY a.type_id ORDER BY b.list";
        $questype = $conn->createCommand($sql)->queryAll();
        $stuquestion = Stuquestion::find()->where($sql_where)->all();
        $num = 1;
        $options =['0'=>'对','1'=>'错'];
        //得到每个题型的试题
        foreach ($questype as $typeline){
            foreach ($stuquestion as $stuq){
                if($typeline['type_id']==$stuq['type_id']){
                    //$question[$typeline['type_id']][] = $stuq;
                    $arr['id'] = $stuq['id'];
                    $arr['question'] = $stuq['question'];
                    $arr['options'] = json_decode($stuq['options']);
                    if($typeline['type_id']=='3'){
                        $arr['options'] = $options;
                    }
                    $arr['type_name'] = $typeline['name'];
                    $arr['answer'] = json_decode($stuq['answer']);
                    $arr['type_id'] = $stuq['type_id'];
                    $arr['result'] = json_decode($stuq['result']);
                    $question[] = $arr;
                    if(!empty($stuq['answer'])){
                        $card[$typeline['name']][$num]['do'] = 'done';
                    }else{
                        $card[$typeline['name']][$num]['do'] = 'none';
                    }
                    $card[$typeline['name']][$num]['qnum'] = $num;
                    $num++;
                }
            }
        }
        $return = [
            "question"  =>  $question,
            "card"      =>  $card,
            "params"    =>  ["t_id"=>$template_pageid,"pageid"=>$page_id],
            "total"     =>  $num-1,
            "pagetitle" =>  $examtemplate['name']
        ];

        $return_info = json_encode($return);
        $callback = $request->get('callback');
        echo $callback."(".$return_info.")";
        exit;
    }
    public function actionDelete(){
        $request = Yii::$app->request;
        $id = $request->get('id');
        Stuquestion::deleteAll('page_id not in(1,2,3)');
        Stupage::deleteAll('id not in(1,2,3,4)');
        Questionwrong::deleteAll('stu_id=1');
    }
    /*
     *  试卷提交
     */
    public function actionExamsubmit()
    {
        header("access-control-allow-origin: *");
        $request = Yii::$app->request;
        //$userid = $request->get('userid');
        $template_pageid = $request->get('t_id');
        $page_id = $request->get('pageid');
        $conn = Yii::$app->db;
        $userid = Yii::$app->user->identity->idst;
        $stuquestion = Stuquestion::find()->where(['page_id'=>$page_id])->all();
        foreach ($stuquestion as $i=>$row) {
            if($row->answerscore==0){
                $question_id = $row->question_id;
                $num = Questionwrong::find()->where(['question_id'=>$question_id,'stu_id'=>$userid])->count();
                if($num==0){
                    $sql = " insert into exam_stu_questionwrong(question_id,stu_id) values('$question_id','$userid') ";
                    $conn->createCommand($sql)->execute();
                }
            }
        }

        $submittime = time();
        $answerscore = Stuquestion::find()->where(['page_id'=>$page_id])->sum('answerscore');
        $sql = " insert into exam_stu_pitem(score,submittime,stu_id,template_pageid) values('$answerscore','$submittime','$userid','$template_pageid') ";
        $conn->createCommand($sql)->execute();
        $stupage = Stupage::findOne($page_id);
        if($stupage->score<$answerscore){
            $stupage->score = $answerscore;
        }
        $stupage->status = 1;
        $stupage->save();
        $page_sql = 'page_id='.$page_id;
        Stuquestion::deleteAll($page_sql);
        $return = array('score'=>$answerscore);
        $return_info = json_encode($return);
        $callback = $request->get('callback');
        echo $callback."(".$return_info.")";
        exit;
    }

    /*
     *  试卷列表
     */
    public function actionGetpracticelist()
    {
        header("access-control-allow-origin: *");
        $request = Yii::$app->request;
        $product_id = $request->get('product_id');
        $conn = Yii::$app->db;
        $userid = Yii::$app->user->identity->idst;
        //$product = Product::find()->where(['id'=>$product_id])->all();
        $sql_where = "";
        //$course_ids = Productdetail::find('pid=? and type=2', $product_id)->getAll()->values('rid');
        $course = Productdetail::find()->where(['pid'=>$product_id,'type'=>'2'])->all();

        $course_ids = ArrayHelper::getColumn($course, 'rid');
        if ($course_ids){
            $sql_where .= " and exam_template_page.course_id in (".implode(',', $course_ids).")";
            $sql = "select id,name,type from lc_course where id in (".implode(',', $course_ids).")";
            //$c_arr = $db->getAll($sql);
            $c_arr = $conn->createCommand($sql)->queryAll();
            $cinfo = array(0);
            $kjlinfo = array(0);
            foreach ($c_arr as $key => $val) {
                if($val['type']!=99){
                    $cinfo[$val['id']] = $val['name'];  
                }else{
                    $kjlinfo[] = $val['id'];    
                }
            }
            $sql_where .= " and  course_id not in (".implode(',',$kjlinfo).")";
        }else{
            $sql_where .= " and 1<>1";
        }

        //获取会计乐课程
        //$sql = "select * from lc_course where id in (".implode(',',$kjlinfo).")";
        //$kjl_list = $db->getAll($sql);
        //$this->_view['kjl_list'] = $kjl_list;
        //$list = Templatepage::find()->where('exam_template_page.isdelete=0'.$sql_where)->joinWith('page')->orderBy('exam_template_page.course_id desc,exam_template_page.knowledge_id asc,exam_stu_page.exam_date desc')->all();
        $list = Templatepage::find()->where('exam_template_page.isdelete=0'.$sql_where)->orderBy('exam_template_page.course_id desc,exam_template_page.knowledge_id asc')->all();
        $return = array();
        foreach ($list as $key => $value) {
            $arr['status'] = '开始';
            /*if(count($value['page'])>0){
                $status = $value['page'][0]['status'];
                if($status==1){
                    $arr['status'] = '继续';
                }
            }*/
            $arr['cname'] = $cinfo[$value['course_id']];
            $arr['pname'] = $value['name'];
            $arr['num'] = $value['totalnum'];
            $arr['id'] = $value['id'];
            $arr['course_id'] = $value['course_id'];
            $return[] = $arr;
        }
        $return_info = json_encode($return);
        $callback = $request->get('callback');
        echo $callback."(".$return_info.")";
        exit;
    }
    /*
     *  试卷列表
     */
    public function actionSetanswer()
    {
        header("access-control-allow-origin: *");
        $request = Yii::$app->request;
        $id = $request->get('id');
        $answer = $request->get('answer');
        $question = Stuquestion::find()->where(["id"=>$id])->one();
        if(isset($answer)){
            if($question['type_id']==1){
                $arranswer = explode('==*,*==',$answer);
            }else if($question['type_id']==2){
                $arrtemp = explode('==*,*==',$answer);
                $arranswer=array();
                foreach($arrtemp as $val){
                    $arranswer[] = json_decode($val);
                }
            }else{
                $arranswer = explode('==*,*==',$answer);            
            }
            $jsonanswer = json_encode($arranswer);

        }else{ 
            $jsonanswer = '';
        }
        
        if($question['type_id']<4){
            $result = array_diff(json_decode($question['result']), $arranswer);
            if(empty($result)&&count(json_decode($question['result']))==count($arranswer)){
                $question->answerscore = $question->score;
            }else{
                $question->answerscore = 0;
            }
        }
        $question->answer = $jsonanswer;
        $question->save();
        $return_info = json_encode(array('flag'=>'0','question_id'=>$id));
        $callback = $request->get('callback');
        echo $callback."(".$return_info.")";
        exit;
    }

}