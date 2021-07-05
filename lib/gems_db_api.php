<?php
/*
 * gems_db_api.php
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

include_once dirname(__FILE__).'/../config.php';
include_once dirname(__FILE__).'/gems_sql_const.php';
include_once dirname(__FILE__).'/gems_db_setup.php';
include_once dirname(__FILE__).'/gems_connection_mgmt.php';
include_once dirname(__FILE__).'/gems_exception_mgmt.php';


interface GemsConstants extends GemsSQLConstants, GemsSchema
{
    const ONE_COLUMN = 0;
    const ONE_ROW = 1;
    const ALL_ROWS =2;
}



class GemsDbManager implements GemsConstants
{
    /*
        This class provides common methods and properties for implementation by the
        subclasses *GemsDbQuery* and *GemsEditor*.  When instantiated it will initialize
        a connection to both the gems database and the event database, and attach both objects
        to properties intended for use by the descendants.
    */

    var $gemsdb;
    var $eventdb;

    function __construct() {
        $this->gemsdb = new GemsConnection();
        $this->eventdb = new EventConnection();

        return $this;
    }
    public function enable_foreign_keys($db) {
        $stmt = "PRAGMA foreign_keys = 1";
        $db->exec($stmt);
    }
    public function log_event($ID,$lName,$fName,$event,$displayevent=FALSE) {
     
        $stmt = $this->eventdb->prepare(' INSERT INTO tblEvents (eventby_id,eventby_lname,eventby_fname,event)
                                 VALUES(:ID, :lName, :fName, :event)');  
        $stmt->bindParam(":ID", $ID, SQLITE3_TEXT);
        $stmt->bindParam(":lName", $lname, SQLITE3_TEXT);
        $stmt->bindParam(":fName", $fname, SQLITE3_TEXT);
        $stmt->bindParam(":event", $event, SQLITE3_TEXT);

        try {
            $stmt->execute();
            return TRUE;
        } 
        catch (Exception $e) {
            echo $e->getMessage();
            return FALSE;
        }  finally {
            if ($displayevent === TRUE) 
                {echo $event;}
        }
    }

    public function validate_params($sqlstmt, array $params) {
        /*  This function will check each element of the $params array passed.  It will check 
            the $sqlstmt string to see if the elements key matches a target parameter stated in the query.
            It returns an associative array containing only elements whose key names match target
            parameters in the SQL statement.
        */
        $results_array = array();
        $s = $sqlstmt;

        foreach ($params as $key => $value) {
            if (strstr($s, $key) == FALSE) {
                continue;
            }
            else {
                $results_array[$key] = $value;
            }
        }
        return $results_array;
    }
    
     //convenience method for fetching one row from $this->results  
     public function get_results($RESULTS_FORMAT=self::ONE_ROW) 
     {
         switch($RESULTS_FORMAT) {
 
             //used if only one column is desired, typically in a single instance where
             //a string result will be used immediately.
             case 0 :  
                 $result = $this->results->fetchArray($mode=SQLITE3_ASSOC);
                 return current($result);
             //typical use case returns all columns, one row as an array.
             case 1 :
                 $result = $this->results->fetchArray($mode=SQLITE3_ASSOC);
                 return $result;
             // returns a multi-dimensional array, of result set rows.
             case 2 :
                 $results_array = array();
 
                 while($row = $this->results->fetchArray($mode=SQLITE3_ASSOC)) {
                     array_push($results_array,$row);
                 }
                 return $results_array;
         }
     }
 
}

class GemsDbQuery extends GemsDbManager
{
    /*
        This class manages and executes queries on the gems database.   
        It will also implement methods that will deal with result sets.
        Rather than return a value, the methods will return TRUE on success,
        FALSE on failure. The result of the query will be stored in $this->results.
    */
   

    public $results;
    public $sqlstr;
    public $params;
    
    function __construct()
    {
        parent::__construct();
        $this->enable_foreign_keys($this->gemsdb);
        return $this;
    }

     /*
        This method allows the GemsDbQuery class to be called as a function.
        Executes a query on the gems database.  
        Accepts the following parameters:
            $query - The SELECT statement of the form:  "SELECT * FROM table "
            $params - An associative array of parameters of the form: $param["ID"] = 12345
        Assigns the returned SQLite3Result object to the instance property $this->results
            for use in the program.
    */

    public function __invoke($sqlstr, array $params=NULL)
    {
        //store in instance.  
        $this->sqlstr = $sqlstr;
        $this->params = $params;

        try {
            if (!$stmt = $this->gemsdb->prepare($sqlstr)) {
                throw new GemsExceptDbPrepare($sqlstr);
            }          
        }
        catch (GemsExceptDbPrepare $e) {
            echo $e;
            return FALSE;
        }
        //if parameters for the statement are passed, bind them.
        if ($params) {
            //pass through an inherited method to check if params in query string.
            $params = $this->validate_params($sqlstr, $params);

            foreach($params as $key=>&$value) {
                $stmt->bindParam($key,$value);
            }
        }
        //now try to execute the prepared statement, and assign result to $this->results
        try {
            if (!$this->results = $stmt->execute()) {
                   throw new GemsExceptDbExecute($sqlstr);
            }
        }
        catch (GemsExceptDbExecute $e) {
            echo $e;
            return FALSE;
        }
        //results assigned to instance attribute, and error handling above.
        // return this to allow method chaining for simple queries
        return $this;
    }

   
    public function simple_query($sqlstr) {
        //This is a simple query function intended for internal use and testing
        //it is not secure. TODO:: depreciate when applicable
        try {
            if (!$this->results = $this->gemsdb->querySingle($sqlstr,$RESULTS_FORMAT=self::ONE_ROW)) {
                throw new GemsException($sqlstr);
            }
        }
        catch ( GemsException $e) {
            echo $e;
            return FALSE;
        }   
        return TRUE;
    }

   
}

class GemsDbEditor extends GemsDbManager
{
    /*
        This class is intended to be instantiated when an UPDATE, INSERT, or DELETE action is required.
        It's __invoke method accepts:
            1. $sqlstr ::  a statement written in SQLITE3 syntax, which will be prepped and executed.
            2. $params ::  an array of parameters which will be bound to the statement.
        It also holds in instance attributes the statement and parameters for later use in the program.
    */
    public $results;
    public $sqlstr;
    public $params;

    function __construct() 
    {
        parent::__construct();
        $this->enable_foreign_keys($this->gemsdb);
        return $this;
    }

    public function __invoke($sqlstr, array $params)
    {
         //store in instance.  
         $this->sqlstr = $sqlstr;
         $this->params = $params;
 
         try {
             if (!$stmt = $this->gemsdb->prepare($sqlstr)) {
                 throw new GemsExceptDbPrepare($sqlstr);
             }          
         }
         catch (GemsExceptDbPrepare $e) {
             echo $e;
             return FALSE;
         }
         //if parameters for the statement are passed, bind them.
         if ($params) {
             //pass through an inherited method to check if params in query string.
             $params = $this->validate_params($sqlstr, $params);
             foreach($params as $key=>&$value) {
                 $stmt->bindParam($key,$value);
             }
         }
         //now try to execute the prepared statement, and assign result to $this->results
         try {
             if (!$this->results = $stmt->execute()) {
                    throw new GemsExceptDbExecute($sqlstr);
             }
         }
         catch (GemsExceptDbExecute $e) {
             echo $e;
             return FALSE;
         }
         return TRUE;
    }
}

/*
//Test code for GemsQuery
$_GET = array("IdD" => "86328","YIG"=>"BOW","ID"=>"54564");
$gemsqry = new GemsDbQuery();
$gemsqry(GemsDbQuery::GEMS_QUERY_USER,$_GET);
$result = $gemsqry->get_results($RESULTS_FORMAT=2);
var_dump($result);
*/

/*
//Test code for GemsDbEditor
$_POST = array("ID"=>"74102","fName"=>"Douglas","lName"=>"Post","fk_enteredByID"=>"1","fk_updatedByID"=>"1");
$gemsedit = new GemsDbEditor();
$qrystr = 'INSERT INTO tblUsers (ID, fName, lName,fk_enteredByID, fk_updatedByID) VALUES (:ID,:fName, :lName,:fk_enteredByID,:fk_updatedByID)';
$gemsedit($qrystr,$_POST);
*/
 ?>