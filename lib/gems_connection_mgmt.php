<?php
/*
 * gems_connection_mgmt.php
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

class GemsConnection extends SQLite3
{  
    /*
        This class extends SQLite3.  It is intended to create a connection 
        to the gems4 database.  It depends on the existence of a $GLOBALS["db"]
        which is a string representation of the directory/filename of the gems4.sql3
    */

    var $db;

    function __construct() {
        $this->db = $GLOBALS["db"];
        //try to open the database connection.
        try {
            $this->open($this->db);
        } 
        catch (Exception $e) {
            echo $e->getMessage();
        }
    }
    function __destruct() {
        //TODO: closing actions
        //print "Destroying".__CLASS__."\n";        //TRACE
     }
}

class EventConnection extends SQLite3 


{
    /*  
        This class will contain methods for the purpose of connecting to
        the event logging database specified in config.php
    */
    var $db;

    function __construct() {
        $this->db = $GLOBALS["eventdb"];

        try {
            $this->open($this->db);
        }
        catch (Exception $e) {
            echo $e->getMessage();
        }
    }

    function __destruct()  {
        //TODO: closing actions
        //print "Destroying".__CLASS__."\n";        //TRACE
     }  
}
?>