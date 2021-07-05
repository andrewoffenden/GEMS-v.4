
<?php
//include "lib/gems_session_mgmt.php";
session_name("Education_Management_Site");
session_start();

/*
 * gems_request_mgmt.php
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

include_once dirname(__FILE__).'/gems_exception_mgmt.php';
include_once dirname(__FILE__).'/gems_db_api.php';
include_once dirname(__FILE__).'/gems_admin_api.php';

//TODO::consider a logging flag for administrative functions.  This would enable/disable admin logging.
class GemsRequestController 
{
    /*
        It's purpose is to delegate to a subclass of GemsRequest for the management of the request handling process.
        When instantiated it collects the information from the request variables and sets them to instance properties
        with the init_request() method. It then processes the request with the handle_request() method.  This will 
        create an instance of the appropriate GemsRequest sublcass. Finally finalize_request() completes processing logic
        and returns the formatted information to the client.
    */

    private $request_data, $request_class, $request_method;


    function __construct()
    {   
        //initialize the instance properties.
        $this->request_data = [];
        $this->request_class = "";
        $this->request_method = $_SERVER["REQUEST_METHOD"];
        $this->init_request();
        $this->handle_request();
        $this->finalize_request();
    }

    public function __get($property_name)
    {
        try 
        {
            if(!isset($this->$property_name)) {
                throw new GemsException("Invalid Property Name.");
            } 
            return $this->$property_name;
        }
        catch (GemsException $e) {
            echo $e;
            return false;
        }
    }

    public function __set($property_name, $new_value)
    {
        $this->$property_name = $new_value;
    }

    private function init_request()
    {
        /*
            this function parses the request into components usable by this class and classes that it implements.
        */
        $req_method = ($this->request_method == "GET") ? $request = $_GET["json"] : $request = $_POST["json"];
        //returns an array containing the parsed key=>value pairs from the recieved json string.
        $this->request_data = json_decode($request, $assoc=TRUE);
        $this->request_class = $this->request_data["request_class"];                   
    }

    private function handle_request()
    {
        $this->request = new $this->request_class($this->request_data,$this);
    }

    private function finalize_request()
    {
        /*
            This method will encode the results
        */      
        $reply = json_encode($this->request->processed_data);   
        echo $reply;
    }
}
abstract class GemsRequest
{
    /*
        Class composes the request process on the server side.  Instantiated by GemsRequestController.
        GemsRequestController maintains an associative array of all acceptable GemsRequest Subclasses
        which it uses to instantiate members/subclasses of this class which compose respective gems
        requests.
    */
    protected $request_data;
    public $processed_data;

    function __construct($request_data) 
    {
        $this->processed_data = [];
        $this->request_data = $request_data;
    }
    
    private function process_request()
    {
        /*
        *******************************************override me******************************************************
        set the request controller's processed_data property to the value of the above operations return as an array.
        the finalize_request method called by the request_controller above expects a simple array and will encode the 
        array to JSON and echo back to the client.
        */
    }
}
class GemsReqUserSearch extends GemsRequest
{
    function __construct($request_data)
    {
        parent::__construct($request_data);
        $this->qrystr = "SELECT ID,lName,fName,entryDate,housingUnit,institution FROM tblUsers WHERE ID LIKE :ID OR lName LIKE :lName";
        $this->process_request();
    }
    
    public function process_request()
    {
        $params["ID"] = "%".$this->request_data["search_str"]."%";
        $params["lName"] = "%".$this->request_data["search_str"]."%";
  
        $gemsqry = new GemsDbQuery();

        try {
            if(!$gemsqry($this->qrystr, $params)) {
                throw new GemsException("Invalid parameter");
            }
        }
        catch (GemsException $e) {
            $this->processed_data = $e->message;
        }
        $this->processed_data = $gemsqry->get_results($RESULTS_FORMAT=2);  
    }
}
class GemsReqEditUserSearch extends GemsReqUserSearch
{
    function __construct($request_data)
    {
        parent::__construct($request_data);
        $this->qrystr = "SELECT tblUsers.ID, tblUsers.lName, tblUsers.fName, tblJobTitles.jobTitle, tblEmployees.dateHired, tblEmployees.payRate FROM tblEmployees INNER JOIN tblUsers ON tblUsers.autoID = tblEmployees.fk_userID	INNER JOIN tblJobTitles ON tblJobTitles.autoID = tblEmployees.fk_jobTitle WHERE ID LIKE :ID OR lName LIKE :lName";
        $this->process_request();
    }
}
class GemsReqResetPasswordSearch extends GemsReqUserSearch
{
    function __construct($request_data)
    {
        parent::__construct($request_data);
        $this->qrystr = "SELECT ID,lName,fName,entryDate,housingUnit,institution FROM tblUsers WHERE ID LIKE :ID OR lName LIKE :lName";
        $this->process_request();
    }
}
class GemsReqModUserSGSearch extends GemsReqUserSearch
{
    function __construct($request_data)
    {
        parent::__construct($request_data);
        $this->qrystr = "SELECT vwEmployees.ID,vwEmployees.lName,vwEmployees.fName,vwEmployees.jobTitle,vwEmployees.dateHired,vwUserAuth.secGroupName FROM vwEmployees INNER JOIN vwUserAuth ON vwUserAuth.ID = vwEmployees.ID WHERE vwEmployees.ID LIKE :ID OR vwEmployees.lName LIKE :lName";
        $this->process_request();
    }
}
class GemsReqDelUserSearch extends GemsReqUserSearch
{
    function __construct($request_data)
    {
        parent::__construct($request_data);
        $this->qrystr = "SELECT vwEmployees.ID,vwEmployees.lName,vwEmployees.fName,vwEmployees.jobTitle,vwEmployees.dateHired FROM vwEmployees WHERE vwEmployees.ID LIKE :ID OR vwEmployees.lName LIKE :lName";
        $this->process_request();
    }
}
class GemsReqDisplayUser extends GemsRequest
{
    function __construct($request_data)
    {
        parent::__construct($request_data);
        $this->process_request();
    }
    private function process_request()
    {
        $params = [];
        $params["ID"] = $this->request_data["ID"];
     
        $qrystr = "SELECT ID,lName,fName,entryDate,housingUnit,institution FROM tblUsers WHERE ID LIKE :ID OR lName LIKE :lName";
        $gemsqry = new GemsDbQuery();

        try {
            if(!$gemsqry($qrystr, $params)) {
                throw new GemsException("Invalid parameter");
            }
        }
        catch (GemsException $e) {
            $this->processed_data = $e->message;
        }
        $this->processed_data = $gemsqry->get_results($RESULTS_FORMAT=2);   
    }
}
class GemsReqMyTimesheet extends GemsRequest
{
    function __construct($request_data)
    {
        parent::__construct($request_data);
        $this->process_request();
    }
    private function process_request()
    {
        $params= [];
        $params["ID"] = $_SESSION["ID"];
        
        //build date string. Default month is current month.  Default year is current year.
        if ($this->request_data["reqMonth"] == "0") {
            $month = (new DateTime("m"))->format("m");
        } else {
            $month =  $this->request_data["reqMonth"];
            
        }
        $year = (new DateTime("Y"))->format("Y");
        $date_str =  $year."-".$month."-01";

        //create start_date and end_date
        $start_date = (new DateTime($date_str))
                        ->format("Y-m-d");
        $end_date = (new DateTime($start_date))
                        ->modify(" +1month -1 day")
                        ->format("Y-m-d");
        $params["start_date"] = $start_date;
        $params["end_date"] = $end_date;

        //build the query and execute.
        
        $gemsqry = new GemsDbQuery();
        $qrystr = $gemsqry::GEMS_QUERY_USER_TIMESHEET;
        try {
            if(!$gemsqry($qrystr, $params)) {
                throw new GemsException("Invalid parameter");
            }
        }
        catch (GemsException $e) {
            $this->processed_data = $e->message;
        }
        $this->processed_data =$gemsqry->get_results($RESULTS_FORMAT=2);
        array_push($this->processed_data, array("reqMonth"=>$this->request_data["reqMonth"]));
    }
}
class GemsReqMyTimesheetAddEntry extends GemsRequest
{
    function __construct($request_data)
    {
        parent::__construct($request_data);
        $this->process_request();
    }
    private function process_request()
    {
        //construct the parameters array for the INSERT operation.
        $params = $this->request_data;
 
        $params["ID"] = $_SESSION["ID"];

        $gemsedit = new GemsDbEditor();
        $qrystr = $gemsedit::GEMS_ADD_USER_TIMESHEET;
       
        try {
            if(!$gemsedit($qrystr,$params)) {
                throw new GemsException("Invalid Parameter");
            }
        }
        catch (GemsException $e) {
            $this->processed_data = $e->message;
        }
        $this->processed_data = array("results"=>"Updated Sucessfully!");
    }
}
class GemsReqMyTimesheetEditEntry extends GemsRequest
{
    function __construct($request_data)
    {
        parent::__construct($request_data);
        $this->process_request();
    }
    private function process_request()
    {
        $params = $this->request_data;

        $gemsedit = (new GemsDbEditor())->__invoke(GemsDBEditor::GEMS_EDIT_USER_TIMESHEET,$params);
      
        $this->processed_data = array("results"=>1);
    }
}
class GemsReqMyTimesheetDelEntry extends GemsRequest
{
    function __construct($request_data)
        {
            parent::__construct($request_data);
            $this->process_request();
        }
    function process_request()
    {
        $params = $this->request_data;

        $gemsedit = new GemsDbEditor();
        $qrystr = $gemsedit::GEMS_DEL_USER_TIMESHEET;

        try {
            if(!$gemsedit($qrystr,$params)) {
                throw new GemsException(0);
            }
        }
        catch (GemsException $e) {
            $this->processed_data = $e->message;
        }
        $this->processed_data = array("results"=>1);
    }
}
class GemsReqAdminAddUser extends GemsRequest
{
    function __construct($request_data)
    {
        parent::__construct($request_data);
        $this->process_request();
    }
    function process_request()
    {
        if($this->request_data["subrequest"]=="job_title_select") {
            //code for subrequest for job title select box. to populate entries dynamically.
            $qrystr = "SELECT jobTitle FROM tblJobTitles";
            $gemsqry = (new GemsDbQuery())->__invoke($qrystr)->get_results($RESULTS_FORMAT=2);
            
            if (!GemsAdministrator::check_auth('mod_teacher',$_SESSION['secGroupName'])) {
                //only those with certain permission should be able to set a teacher or administrator, other dont see.
                $results = array();
                foreach($gemsqry as $row) {
                    if(!($row["jobTitle"] == "Administrator" || $row["jobTitle"] == "Teacher")) {
                        array_push($this->processed_data,$row);
                    }
                }
            }
            else {
                //administrator sees entire job title list.
                $this->processed_data = $gemsqry;
            }
        } 
        else {
            /*
                Adding a new TA here, so it is necessary to check whether the TA was a student.  If they were then
                Their information will be updated.  Change secGroup to gems_user, update the logs, add a password, and
                insert records in the tblEmployees table to indicate job title, pay, and date hired.
                If they are not then all of the necessary records must be inserted
            */
            $params = $this->request_data;
            $params["adminID"] = $_SESSION["ID"];
            $params["secGroupID"] = 3;              //this is to set the secGroup to "User", any other will be through admin panel.

            //check if the user is already in the database as a student.
            $sec_group = (new GemsDbQuery())->__invoke(GemsDBQuery::GEMS_CHECK_SEC_GROUP,$params)->get_results($RESULTS_FORMAT=0);
            if ($sec_group == "student") {
                //code here is if the user is already in the database as  a student, and is going to become a TA
                $this->processed_data["updateSecGroup"] = (new GemsDBEditor())->__invoke(GemsDBEditor::GEMS_UPDATE_SEC_GROUP,$params);
                $this->processed_data["logUserUpdate"] = (new GemsDBEditor())->__invoke(GemsDBEditor::GEMS_LOG_USER_UPDATE,$params);

                $pass_hash = password_hash($params["passwd"],PASSWORD_DEFAULT);
                $qrystr = "UPDATE tblUserAuth SET passwd = '{$pass_hash}', lastUpdate = CURRENT_DATE, fk_updatedByID= (SELECT autoID FROM tblUsers WHERE tblUsers.ID = {$_SESSION['ID']}) WHERE fk_userID = (SELECT autoID FROM tblUsers WHERE tblUsers.ID = :ID)";
                $this->processed_data["updateUserAuthTable"] = (new GemsDBEditor())->__invoke($qrystr,$params);

                $this->processed_data["insertEmplFromStud"] = (new GemsDBEditor())->__invoke(GemsDbEditor::GEMS_INSERT_EMPLOYEE_FROM_STUDENT,$params);
                $this->processed_data["insertDefaultSetting"] = (new GemsDBEditor())->__invoke(GemsDBEditor::GEMS_INSERT_DEFAULT_SETTINGS,$params);
            }
            else {
                //code here is if the user is not in the database at this time but will now be an Employee and User.
                $gemsedit = (new GemsDBEditor())->__invoke(GemsDBEditor::GEMS_INSERT_USER_EMPLOYEE,$params);
            
                $pass_hash = password_hash($params["passwd"],PASSWORD_DEFAULT);
                $qrystr =" INSERT INTO tblUserAuth(fk_userID,passwd,fk_secGroupID,fk_updatedByID,lastUpdate) VALUES ((SELECT autoID FROM tblUsers WHERE ID = :ID),'{$pass_hash}',3,(SELECT autoID FROM tblUsers WHERE ID = {$_SESSION['ID']}),CURRENT_DATE)";
                $this->processed_data["insertUserAuthTable"] = (new GemsDBEditor())->__invoke($qrystr,$params);

                $this->processed_data["insertEmployeeTable"] = (new GemsDBEditor())->__invoke(GemsDBEditor::GEMS_INSERT_EMPLOYEE,$params);

                $this->processed_data["insertDefaultSettings"] = (new GemsDBEditor())->__invoke(GemsDBEditor::GEMS_INSERT_DEFAULT_SETTINGS,$params);
            }
        }   

    }
}
class GemsReqAdminEditUser extends GemsRequest
{
    function __construct($request_data)
    {
        parent::__construct($request_data);
        $this->process_request();
    }
    function process_request()
    {
        $params = $this->request_data;
        $qrystr = "UPDATE tblUsers SET fName = :fName, lName = :lName,lastUpdate = :dateHired,fk_updatedByID = (SELECT autoID FROM tblUsers WHERE tblUsers.ID = '{$_SESSION["ID"]}') WHERE tblUsers.autoID = (SELECT autoID FROM tblUsers WHERE tblUsers.ID = :ID)";
        
        $this->processed_data["updateUserTable"] =  (new GemsDBEditor())->__invoke($qrystr,$params);
        $this->processed_data["updateEmployeeTable"] = (new GemsDBEditor())->__invoke(GemsDBEditor::GEMS_UPDATE_EMPLOYEE,$params);
    }
}
class GemsReqAdminDelUser extends GemsRequest
{
    function __construct($request_data)
    {
        parent::__construct($request_data);
        $this->process_request();
    }
    function process_request()
    {
        $params = $this->request_data;
        $qrystr = "DELETE FROM tblUsers WHERE tblUsers.autoID = (SELECT autoID FROM tblUsers WHERE tblUsers.ID = :ID);";
        //check auth
        if(GemsAdministrator::check_auth("u_del",$_SESSION["secGroupName"])==TRUE) {
            $this->process_data["logUser"] = (new GemsDBManager())->log_event($_SESSION["ID"],$_SESSION["lName"],$_SESSION["fName"],$qrystr);
            $this->processed_data["adminDelUser"] = (new GemsDBEditor())->__invoke($qrystr,$params);
        }
        else {
            $message = "Unauthorized Update";
            $this->processed_data["secGroupUpdate"] = (new GemsDbManager())->log_event($_SESSION["ID"],$_SESSION["lName"],$_SESSION["fName"],$message);
        }
    }
}
class GemsReqAdminResetPassword extends GemsRequest
{
    function __construct($request_data)
    {
        parent::__construct($request_data);
        $this->process_request();
    }
    function process_request()
    {
        $params = $this->request_data;
        $params["passwd"] = password_hash($this->request_data["passwd"],PASSWORD_DEFAULT);
        $qrystr = "UPDATE tblUserAuth SET passwd = :passwd , fk_updatedByID = (SELECT autoID FROM tblUsers WHERE tblUsers.ID = '{$_SESSION["ID"]}') , lastUpdate = CURRENT_DATE WHERE fk_userID = (SELECT autoID FROM tblUsers WHERE tblUsers.ID = :ID)";

        $this->processed_data["updatePassword"] = (new GemsDBEditor())->__invoke($qrystr,$params);
    }
}
class GemsReqAdminModUserSG extends GemsRequest
{
    function __construct($request_data)
    {
        parent::__construct($request_data);
        $this->process_request();
    }
    function process_request()
    {
        if($this->request_data["subrequest"]=="sec_group_select") {
            //code for subrequest for security group select in admin modal.
            $qrystr = "SELECT secGroupName FROM tblSecGroups";
            $gemsqry = (new GemsDbQuery())->__invoke($qrystr)->get_results($RESULTS_FORMAT=2);

            $this->processed_data = $gemsqry;
        } 
        else {
            //code for main request goes here.
            $params = $this->request_data;
            $qrystr = " UPDATE tblUserAuth SET fk_secGroupID = (SELECT autoID FROM tblSecGroups WHERE secGroupName = :secGroupName), fk_updatedByID = (SELECT autoID FROM tblUsers WHERE ID = {$_SESSION['ID']}), lastUpdate = CURRENT_DATE WHERE fk_userID = (SELECT autoID FROM tblUsers WHERE ID = :ID) ";

            if (GemsAdministrator::check_auth("mod_sec_group",$_SESSION["secGroupName"])==TRUE) {
                $this->processed_data["secGroupUpdate"] = (new GemsDBEditor())->__invoke($qrystr,$params);
            } 
            else {
                $message = "Unauthorized update.";
                $this->processed_data["secGroupUpdate"] = (new GemsDbManager())->log_event($_SESSION["ID"],$_SESSION["lName"],$_SESSION["fName"],$message);
            }
        }
    }
}
class GemsReqAdminAddSG extends GemsRequest
{
    function __construct($request_data)
    {
        parent::__construct($request_data);
        $this->process_request();
    }
    function process_request()
    {
        if($this->request_data["subrequest"]=="sec_group_flags") {
            //code to dynamically fill the request flags on the admin add sec group panel
            $qrystr = "SELECT name FROM pragma_table_info('tblSecGroups')";

            $gemsqry = (new GemsDbQuery())->__invoke($qrystr)->get_results($RESULTS_FORMAT=2);

            $this->processed_data = $gemsqry;
        }
        else {
            $params = $this->request_data;
            
            $flags = $this->request_data;
            unset($flags["request_class"]);
            unset($flags["secGroupName"]);
           
            //now build the security flags section of the query string dynamically then concatenate to build the query
            $flags = array_keys($flags);
            $targets = $flags;
            foreach($targets as &$value) {
                $value = ":".$value;
            }
            $flagstr = implode(", ",$flags);
            $targetstr = implode(", ",$targets);

            $qrystr = "INSERT INTO tblSecGroups(secGroupName,".$flagstr.") VALUES(:secGroupName,".$targetstr.");";
            if(GemsAdministrator::check_auth("mod_sec_group",$_SESSION["secGroupName"])==TRUE) {
                $this->processed_data["logged"] = (new GemsDbManager())->log_event($_SESSION["ID"],$_SESSION["lName"],$_SESSION["fName"],$qrystr);
                $this->processed_data["addSecGroup"] = (new GemsDBEditor())->__invoke($qrystr,$params);
            }
            else {
                $message = "Unauthorized update.";
                $this->processed_data["secGroupUpdate"] = (new GemsDbManager())->log_event($_SESSION["ID"],$_SESSION["lName"],$_SESSION["fName"],$message);
            }
        }
    }
}
//TODO::write documentation concerning admin layout and sec_flags when you separate the admin functions out into their own js file, and possibly php file.
class GemsReqEditSGSelect extends GemsRequest
{
    function __construct($request_data)
    {
        parent::__construct($request_data);
        $this->process_request();
    }
    function process_request()
    {
        if($this->request_data["subrequest"]=="sec_group_select") {
            //populate sec group select
            $qrystr = "SELECT secGroupName FROM tblSecGroups WHERE secGroupName != 'gems_admin' AND secGroupName != 'gems_manager' AND secGroupName != 'gems_user' AND secGroupName != 'gems_guest' AND secGroupName != 'student'";

            $this->processed_data = (new GemsDBQuery())->__invoke($qrystr)->get_results($RESULTS_FORMAT=2);
        }
        else {
            //get sec group flags and submit for next modal
            $params = $this->request_data;
            $qrystr = "SELECT * FROM tblSecGroups WHERE tblSecGroups.secGroupName = :secGroupName";

            $this->processed_data = (new GemsDBQuery())->__invoke($qrystr,$params)->get_results($RESULTS_FORMAT=2);
        }
    }
}
class GemsReqAdminEditSG extends GemsRequest
{
    function __construct($request_data)
    {
        parent::__construct($request_data);
        $this->process_request();
    }
    function process_request()
    {
        $params = $this->request_data;
        
        $flags = $this->request_data;
        unset($flags["request_class"]);
        unset($flags["secGroupName"]);

        //buid security flags / targets substrings of qrystr
        $flags = array_keys($flags);
        $targets = $flags;
        foreach($targets as &$value) {
            $value = ":".$value;
        }
        function merge_array($f,$t) {
            return $f."=".$t;
        }
        $substrings = array_map('merge_array',$flags,$targets);
        $substring = implode(", ",$substrings);

        $qrystr = "UPDATE tblSecGroups SET ".$substring." WHERE tblSecGroups.secGroupName = :secGroupName";
        if(GemsAdministrator::check_auth("mod_sec_group",$_SESSION["secGroupName"])==TRUE) {
            $this->processed_data["logged"] = (new GemsDbManager())->log_event($_SESSION["ID"],$_SESSION["lName"],$_SESSION["fName"],$qrystr);
            $this->processed_data["editSecGroup"] = (new GemsDBEditor())->__invoke($qrystr,$params);
        }
        else {
            $message = "Unauthorized update.";
            $this->processed_data["secGroupUpdate"] = (new GemsDbManager())->log_event($_SESSION["ID"],$_SESSION["lName"],$_SESSION["fName"],$message);
        }
    }
}
class GemsReqDelSGSelect extends GemsRequest
{
    function __construct($request_data)
    {
        parent::__construct($request_data);
        $this->process_request();
    }
    function process_request()
    {
        if($this->request_data["subrequest"]=="sec_group_select") {
            //populate sec group select
            $qrystr = "SELECT secGroupName FROM tblSecGroups WHERE secGroupName != 'gems_admin' AND  secGroupName != 'gems_manager' AND  secGroupName != 'gems_user' AND  secGroupName != 'student' AND secGroupName != 'gems_guest'";

            $this->processed_data = (new GemsDBQuery())->__invoke($qrystr)->get_results($RESULTS_FORMAT=2);
        }
        else {
            //exchange on client side.  Just a  name needed here.
        }
    }
}
class GemsReqAdminDelSG extends GemsRequest
{
    function __construct($request_data)
    {
        parent::__construct($request_data);
        $this->process_request();
    }
    function process_request()
    {
        //delete security group.  Log results.
        $params = $this->request_data;
        $qrystr = "DELETE FROM tblSecGroups WHERE tblSecGroups.secGroupName = :secGroupName";
         //check auth
         if(GemsAdministrator::check_auth("mod_sec_group",$_SESSION["secGroupName"])==TRUE) {
            $this->process_data["logUser"] = (new GemsDBManager())->log_event($_SESSION["ID"],$_SESSION["lName"],$_SESSION["fName"],$qrystr);
            $this->processed_data["adminDelSecGroup"] = (new GemsDBEditor())->__invoke($qrystr,$params);
        }
        else {
            $message = "Unauthorized Update";
            $this->processed_data["secGroupDelete"] = (new GemsDbManager())->log_event($_SESSION["ID"],$_SESSION["lName"],$_SESSION["fName"],$message);
        }
    }
}
class GemsReqAdminAddEditTest extends GemsRequest
{
    function __construct($request_data)
    {
        parent::__construct($request_data);
        $this->process_request();
    }   
    function process_request()
    {
        $qrystr = "SELECT * FROM tblTests";

        $this->processed_data = (new GemsDBQuery())->__invoke($qrystr)->get_results($RESULTS_FORMAT=2);
    }
}
class GemsReqAdminAddTest extends GemsRequest
{
    function __construct($request_data)
    {
        parent::__construct($request_data);
        $this->process_request();
    }
    function process_request()
    {
        $params = $this->request_data;
        $qrystr = "INSERT INTO tblTests(testName,passingScore,testActive,certAvailable) VALUES (:testName,:passingScore,:testActive,:certAvailable)";

        $this->processed_data["adminAddTest"] = (new GemsDBEditor())->__invoke($qrystr,$params);
    }
}
class GemsReqAdminEditTest extends GemsRequest
{
    function __construct($request_data)
    {
        parent::__construct($request_data);
        $this->process_request();
    }
    function process_request()
    {
        $params = $this->request_data;
        $qrystr = "UPDATE tblTests SET testName=:testName, passingScore=:passingScore, testActive=:testActive, certAvailable=:certAvailable WHERE autoID=:autoID";

        $this->processed_data["adminEditReq"] = (new GemsDBEditor())->__invoke($qrystr,$params);
    }
}
class GemsReqAdminDelTest extends GemsRequest
{
    function __construct($request_data)
    {
        parent::__construct($request_data);
        $this->process_request();
    }
    function process_request()
    {
        $params = $this->request_data;
        $qrystr = "DELETE FROM tblTests WHERE tblTests.autoID = :autoID";
         //check auth
         if(GemsAdministrator::check_auth("t_del",$_SESSION["secGroupName"])==TRUE) {
            $this->process_data["logUser"] = (new GemsDBManager())->log_event($_SESSION["ID"],$_SESSION["lName"],$_SESSION["fName"],$qrystr);
            $this->processed_data["adminDelTest"] = (new GemsDBEditor())->__invoke($qrystr,$params);
        }
        else {
            $message = "Unauthorized Update";
            $this->processed_data["testDelete"] = (new GemsDbManager())->log_event($_SESSION["ID"],$_SESSION["lName"],$_SESSION["fName"],$message);
        }
    }
}
// $_POST["json"] = '{"request_class":"GemsReqAdminEditSG","secGroupName":"gems_guest","auth_login":1,"view_admin_options":1,"mod_sec_group":0,"mod_teacher":0,"u_add":0,"u_edit":0,"u_del":0,"student_del":0} ';
// $_SERVER["REQUEST_METHOD"] = "POST"; 
// $_SESSION["secGroupName"] = "gems_admin";
// $_SESSION["ID"] = 54564;

$request_controller = new GemsRequestController();



?>
