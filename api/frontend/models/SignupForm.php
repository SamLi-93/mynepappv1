<?php
namespace frontend\models;

use yii\base\Model;
use common\models\User;

/**
 * Signup form
 */
class SignupForm extends Model
{
    public $userid;
//    public $email;
    public $pass;


    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            ['userid', 'trim'],
            ['userid', 'required'],
            ['userid', 'unique', 'targetClass' => '\common\models\User', 'message' => 'This userid has already been taken.'],
            ['userid', 'string', 'min' => 2, 'max' => 255],

//            ['email', 'trim'],
//            ['email', 'required'],
//            ['email', 'email'],
//            ['email', 'string', 'max' => 255],
//            ['email', 'unique', 'targetClass' => '\common\models\User', 'message' => 'This email address has already been taken.'],

            ['pass', 'required'],
            ['pass', 'string', 'min' => 6],
        ];
    }

    /**
     * Signs user up.
     *
     * @return User|null the saved model or null if saving fails
     */
    public function signup()
    {
        if (!$this->validate()) {
            return null;
        }
        
        $user = new User();
        $user->userid = $this->userid;
//        $user->email = $this->email;
        $user->setPassword($this->pass);
        $user->generateAuthKey();
        
        return $user->save() ? $user : null;
    }
}
