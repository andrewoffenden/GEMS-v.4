<?php
/*
 * gems_exception_mgmt.php
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

include dirname(__FILE__)."/../config.php";


class GemsException extends Exception
{   

    /*
        GemsException class extends the base exception class.  It is a superclass of 
        ExceptDbPrepare and ExceptDbExecute.  It will provide a connection to the 
        EventManager database, where it will write to an error log. Each subclass will
        have methods and constants particular to its intended purpose.
    */

     public $eventdb, $lasterror, $message;

    public function __construct($message, $code = 0, Exception $previous = null)  {
        //instance stored in eventdb represents a SQLite3 connection to the event database.
        $this->lasterror = error_get_last();
        $this->message = $message;
        $this->eventdb = new EventConnection();   
        parent::__construct($message, $code, $previous);
    }

    function __destruct()  {
        //TODO: closing actions
        //print "Destroying".__CLASS__."\n";        //TRACE
     }  

     public function __toString() {
        return __CLASS__.": [{$this->code}]: [{$this->lasterror["message"]}] Statement: [{$this->message}]  File: [{$this->file}] , Line: [{$this->line}]\n";
     }

     public function log_exception($ID,$lname,$fname,$event) {
         //invoke this method in your exception handling code.  It receives the event, and logs it under the 
         //parameters passed.
        $stmt = $this->eventdb->prepare(' INSERT INTO tblEvents (eventby_id,eventby_lname,eventby_fname,event)
                                 VALUES(:ID, :lname, :fname, :event)');
        
        $stmt->bindParam(":ID", $ID, SQLITE3_TEXT);
        $stmt->bindParam(":lname", $lname, SQLITE3_TEXT);
        $stmt->bindParam(":fname", $fname, SQLITE3_TEXT);
        $stmt->bindParam(":event", $event, SQLITE3_TEXT);
        
        try {
            $stmt->execute();
        }
        catch (Exception $e) {
            echo "Execution of statement failed!", $e;
        }
    }
}

class GemsExceptDbPrepare extends GemsException
{
    /*
        Contains some string constants for useful debug information when troubleshooting
        Gems Exceptions while attempting to prepare a SQL statement.
    */

    public function __construct($message, $code = 0, Exception $previous = null) {
        parent::__construct($message, $code, $previous);
    }
    
    public function __toString() {
        $msg = "<br>\n Failed to prepare the statement: -<br>\n";
        return __CLASS__.": {$msg} Error Message: [{$this->lasterror['message']}] <br>\n Statement: [{$this->message}] File: [{$this->file}], Line: [{$this->line}]<br>\n";
    }
}

class GemsExceptDbExecute extends GemsException
{
    /*
        Contains some string constants for useful debug information when troubleshooting
        Gems Exceptions while attempting to prepare a SQL statement.
    */

    public function __construct($message, $code = 0, Exception $previous = null) {
        parent::__construct($message, $code, $previous);
    }
    
    public function __toString() {
        $msg = "<br>\n Failed to execute the prepared statement: -<br>\n";
        return __CLASS__.": {$msg} Error Message: [{$this->lasterror['message']}] <br>\n Statement: [{$this->message}] File: [{$this->file}], Line: [{$this->line}]<br>\n";
    }
}
 ?>