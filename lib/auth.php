<?php
include "gems_session_mgmt.php";
/*
 * auth.php
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
 * 
 */

 /*
    Composes authorization:
        $_POST["ID"] = idoc number from login modal (index.php)
        $_POST["passwd"] = password from login modal (index.php)
        
        1.  Instantiate GemsAdministrator to run method gems_auth_user.
        2.  If method returns true runs GemsDbQuery to query the database for values to be assigned to session variables.
        3.  Assigns session variables 
        4.  Stores avatar pic in local storage.
        5.  Runs GemsAdministrator method check_auth to verify auth_login permission in tblUserAuth of database.
        6.  Sets location to index.php.       
 */

include dirname(__FILE__).'/gems_admin_api.php';
// $_POST["ID"] = 74102;
// $_POST["passwd"] = "Password1";

if($_POST["ID"] && $_POST["passwd"]) {
    
    $gemsadmin = new GemsAdministrator();
    try {
        if(!$authorized =  $gemsadmin->gems_auth_user($_POST["ID"],$_POST["passwd"])) {
            throw new GemsException("Not authorized!");
        }
        $_SESSION["ID"] = $_POST["ID"];

        //query db for fName,lName,
        $gemsqry = new GemsDbQuery();
        $gemsqry(GemsDbQuery::GEMS_QUERY_USER_SETTINGS,$_POST);
        $results = $gemsqry->get_results();
    
        //loop through results and assign each key=>value to session global
        foreach($results as $key=>$value) {
            if (is_string($key)) {
              $_SESSION[$key] = $value;
            }
        }
        $check = getimagesizefromstring($_SESSION["avatarPic"]);
        echo '<html><head><script>localStorage.setItem("avatarPic","'.base64_encode($_SESSION["avatarPic"]).'");localStorage.setItem("avatarpicmime","'.$check["mime"].'");location.replace("../index.php");</script></head></html>';
    }
    catch (GemsException $e) {
        echo '<html><head><script>location.replace("../index.php");</script></head><body></body></html>';
    }
        
 }        
   
if($_GET["func"] == "logout") {
    $gems_session->gems_session_destroy();
    echo '<html><head><script>location.replace("../index.php");</script></head><body></body></html>';
}
// var_dump($_SESSION);


 ?>