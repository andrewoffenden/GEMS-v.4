<?php
/*
 * gems_admin_api.php
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

include_once dirname(__FILE__).'/gems_db_api.php';

class GemsAdministrator extends GemsDbManager {
    /*
        This class will compose gems queries and edits to the database that
        have to do with administrative functions.  These include password verification,
        and password updates.
    */
    function __construct() {
        /*  
            call parent constructor, this gives access to the connection objects
            $this->gemsdb  and   $this->eventdb.
            additionally it gives acess to the log_events method of GemsDbManager
        */
        parent::__construct();
    }

    function gems_auth_user($ID, $passwd) {
        /*
            1.  Queries the database for the values of the ID and passwd. 
            2.  Stores the value of $passwd.
            3.  checks the hash of $passwd, against the value of the queried passwd in the db.
        */
     
        //query the database using the users input.
        $qrystr = "SELECT ID, passwd FROM vwUserAuth WHERE ID = :ID";
        $gemsqry = new GemsDbQuery();
        
        $params =  array("ID"=>$ID);                                                      //GemsDbQuery expects array parameter.
 
        try {
            if (!$gemsqry($qrystr, $params)) {
                throw new GemsException("Invalid User Name");
            }
        }
        catch (GemsException $e) {
            echo $e;                                                                   //TODO:: later this login response should be more informative.
            return FALSE;
        }
        //if successful check it against user input.
        $dbpasswd = $gemsqry->get_results($RESULTS_FORMAT=1)["passwd"];
        
        try {
            if (!password_verify($passwd, $dbpasswd)==TRUE) {
                throw new GemsException("Invalid Password!");
            }
            else {
                return TRUE;
            }
        }
        catch (GemsException $e) {
            echo $e;
            return FALSE;
        }  
    }
    //TODO:: Table construction method.

    public static function check_auth($perm,$group) {
        $qrystr = "SELECT ".$perm." FROM tblSecGroups WHERE secGroupName = :secGroupName";
        $gemsqry = new GemsDbQuery();

        $params = array("secGroupName"=>$group);
        try {
            if(!$gemsqry($qrystr,$params)) {
                throw new GemsException("Invalid group or permission.");
            }
        }
        catch (GemsException $e){
            echo $e;
        }
        $auth = $gemsqry->get_results($RESULTS_FORMAT=0);
        if($auth==1){
            return TRUE;
        }
        else
        {
            return FALSE;
        }
    }
}

//echo password_hash('Password1',PASSWORD_DEFAULT);
// $_POST["ID"] = 54564;
// $_POST["passwd"] = "Bjapeam1";
////$_SESSION["secGroupName"]="gems_admin";
// $gemsadmin = new GemsAdministrator();
// $gemsadmin->gems_auth_user($_POST["ID"], $_POST["passwd"]);
//$gemsadmin->check_auth("auth_login",$_SESSION["secGroupName"]);
//GemsAdministrator::check_auth("auth_login",$_SESSION["secGroupName"]);
//GemsAdministrator::check_auth("view_admin_options",$_SESSION["secGroupName"]);
?>