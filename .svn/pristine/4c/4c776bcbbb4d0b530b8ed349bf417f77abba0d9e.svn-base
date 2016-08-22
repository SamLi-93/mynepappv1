<?php
/**
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 */

namespace yii\helpers;

/**
 * ArrayHelper provides additional array functionality that you can use in your
 * application.
 *
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @since 2.0
 */
class ArrayHelper extends BaseArrayHelper
{
	/**
	 * 二维数组，将$key作为Array的Key,同一个key的Obj放入一个Array中，与key对应的是Obj_arr
	 * @param $array
	 * @param $key
	 */
	public static function mapObjArr($array,$key){
		$return_arr = [];
		foreach ($array as $k=>$v){
			$return_arr[$v[$key]][] = $v;
		}
		return $return_arr;
	}
	
	/**
	 * 将$key作为Array的Key将整个Obj作为Array的Value
	 * @param $array
	 * @param $key
	 */
	public static function mapObj($array,$key){
		$return_arr = [];
		foreach ($array as $k=>$v){
			$return_arr[$v[$key]] = $v;
		}
		return $return_arr;
	}
}
