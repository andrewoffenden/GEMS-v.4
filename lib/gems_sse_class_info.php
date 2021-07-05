<?php

/*
 * gems_sse_class_info.php
 * copyright 2020 Douglas Post and David A. Woffenden 
 * 
 * many of the lines of code were written by Douglas Post, from his Simple Social
 * software and used here.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301, USA.
 * 
 */

//include_once dirname(__FILE__).'/gems_session_mgmt.php';
//include_once dirname(__FILE__).'/gems_db_api.php';

$test_array = array('json'=>[1,2,3,4]);
$json = json_encode($test_array);





header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');


echo "data: ".$json."\n\n";

flush();

 ?>