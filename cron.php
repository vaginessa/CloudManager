<?php

$host = 'csetutorials.com';
$port = '60992';
$cron = true; // Set $cron = false to Stop cron

if(@$_SERVER['SERVER_PORT'] > 1){
	die('Not accesible via the web !');
}

if($cron == true){
	$checkconn = @fsockopen($host, $port, $errno, $errstr, 5);
	if(empty($checkconn)){
		exec('export HOME=/home/healthut/nodejs; cd /home/healthut/home/csetutorials.com; /home/healthut/nodejs/bin/node index.js > /dev/null 2>/dev/null &');		
	}
}

?>