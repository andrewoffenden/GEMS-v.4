<?php
/*
 * gems_session_mgmt.php
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


class GemsSession 
{
    
    const GEMS_SESSION_NAME = "Education_Management_Site";

    function __construct() {}
   
    function gems_session_start() { 
        if (version_compare(PHP_VERSION, '7.0.0') >=0) {
            if(session_status() == PHP_SESSION_NONE) {
                session_name(self::GEMS_SESSION_NAME);
                session_start();
            }
        }
        else if (version_compare(PHP_VERSION, '5.4.0') >= 0) {
            if (session_status() == PHP_SESSION_NONE) {
                session_name(self::GEMS_SESSION_NAME);
                session_start();
            }
        }
    }

    function gems_session_destroy() {
        $_SESSION = array();
        //setcookie("Simple_Social_Site","",time()-36000,"/");
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }
        session_destroy();     
    }
}
$gems_session = new GemsSession();

$gems_session->gems_session_start();


//session_name("Education_Management_Site");
//session_start();

?>