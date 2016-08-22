<?php

namespace common\helpers;

class Util
{
	public static function format_time2($t) {
		$h = floor($t/3600);
		$m = floor($t%3600/60);
		return sprintf('%02d:%02d', $h, $m);
	}
	public static function format_time($t) {
		$minute = intval($t/60);
	    $second = $t%60;
	    $rtime = $minute.":".$second;
	    return sprintf('%02d:%02d', $minute, $second);
	}
}