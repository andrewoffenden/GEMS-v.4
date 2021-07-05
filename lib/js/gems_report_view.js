/*
    *gems_report_view.js
      
  
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

class GemsReport
{
  /*
        Superclass contains static methods and properties that GemsPromptModal
        will use in it's construction.
    */
   constructor() 
   {    
       
   }
   display() 
   {
       //use this method to write to the dom
      
        document.getElementById("gems_main_div").insertAdjacentHTML("afterbegin",this.html);
   }
   destroy()
   {
        //$("#gems_main_div").empty();
        document.getElementById("gems_report").firstChild.remove();
   }
}
class GemsReportUserSearch extends GemsReport
{
    constructor()
    {
        super();
        //extend me
    }
    display()
    {
        //overrides the display method in GemsReport to target the div for search results.
        document.getElementById("gems_prompt_search_results").insertAdjacentHTML("afterbegin",this.html);
    }
}
class GemsReportEditUserSearch extends GemsReportUserSearch
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
                                "prompt_message":"Please click on  the user you would like to edit.",
                                "modal_on_submit":"gems_controller.initGemsRequest(GemsReqAdminEditUser,event)"
                            };
        this.html = ` 
                    <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">
                        ${this.modal_params["prompt_message"]} 
                    </div>
                    <table class="w3-table-all w3-hoverable w3-margin-top w3-margin-bottom">
                        <tr class="w3-theme-d1">
                            <th onclick="w3.sortHTML('#gems_student_table','.item','td:nth-child(1)')">IDOC</th>
                            <th onclick="w3.sortHTML('#gems_student_table','.item','td:nth-child(2)')">Last Name</th>
                            <th>First Name</th><th>Job Title</th><th>Date Hired</th>
                        </tr>
                        ${this.prompt_data.map(row => `<tr class="gems_result_row"  onclick="${this.modal_params['modal_on_submit']}" >
                        <td data-key="ID">${row['ID']}</td><td data-key="lName">${row['lName']}</td><td data-key="fName">${row['fName']}</td>
                        <td data-key="jobTitle">${row['jobTitle']}</td><td data-key="dateHired">${row['dateHired']}</td><td data-key="payRate" style="display:none;">${row['payRate']}</td></tr>`).join('')}
                    </table>
                    `;
    }
}
class GemsReportResetPasswordSearch extends GemsReportUserSearch
{   
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
                                "prompt_message":"Please click on  the user whose password you would like to reset.",
                                "modal_on_submit":"gems_controller.initGemsRequest(GemsReqAdminResetPassword,event)"
                            };
        this.html = ` 
                    <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">
                        ${this.modal_params["prompt_message"]} 
                    </div>
                    <table class="w3-table-all w3-hoverable w3-margin-top w3-margin-bottom">
                        <tr class="w3-theme-d1">
                            <th onclick="w3.sortHTML('#gems_student_table','.item','td:nth-child(1)')">IDOC</th>
                            <th onclick="w3.sortHTML('#gems_student_table','.item','td:nth-child(2)')">Last Name</th>
                            <th>First Name</th><th>Unit</th><th>Institution</th><th>Date Entered</th>
                            </tr>
                            ${this.prompt_data.map(row => `<tr class="gems_result_row"  onclick="${this.modal_params['modal_on_submit']}"><td data-key="ID">${row['ID']}</td><td data-key="lName">${row['lName']}</td>
                            <td data-key="fName">${row['fName']}</td><td data-key="housingUnit">${row['housingUnit']}</td><td data-key="inistitution">${row['institution']}</td><td data-key="entryDate">${row['entryDate']}</td></tr>`).join('')}
                    </table>
                    `;
    }
}
class GemsReportModUserSGSearch extends GemsReportUserSearch
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
                                "prompt_message":"Please click on  the user whose security group you would like to modify",
                                "modal_on_submit":"gems_controller.initGemsRequest(GemsReqAdminModUserSG,event)"
                            };
        this.html = ` 
                    <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">
                        ${this.modal_params["prompt_message"]} 
                    </div>
                    <table class="w3-table-all w3-hoverable w3-margin-top w3-margin-bottom">
                        <tr class="w3-theme-d1">
                            <th onclick="w3.sortHTML('#gems_student_table','.item','td:nth-child(1)')">IDOC</th>
                            <th onclick="w3.sortHTML('#gems_student_table','.item','td:nth-child(2)')">Last Name</th>
                            <th>First Name</th><th>Job Title</th><th>Date Hired</th>
                            </tr>
                            ${this.prompt_data.map(row => `<tr class="gems_result_row"  onclick="${this.modal_params['modal_on_submit']}"><td data-key="ID">${row['ID']}</td><td data-key="lName">${row['lName']}</td>
                            <td data-key="fName">${row['fName']}</td><td data-key="jobTitle">${row['jobTitle']}</td><td data-key="dateHired">${row['dateHired']}</td><td data-key="secGroupName" style="display:none">${row['secGroupName']}</td></tr>`).join('')}
                    </table>
                    `;
    }
}
class GemsReportDelUserSearch extends GemsReportUserSearch
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
                                "prompt_message":"Please click on  the user whose security group you would like to modify",
                                "modal_on_submit":"gems_controller.initGemsRequest(GemsReqAdminDelUser,event)"
                            };
        this.html = ` 
                    <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">
                        ${this.modal_params["prompt_message"]} 
                    </div>
                    <table class="w3-table-all w3-hoverable w3-margin-top w3-margin-bottom">
                        <tr class="w3-theme-d1">
                            <th onclick="w3.sortHTML('#gems_student_table','.item','td:nth-child(1)')">IDOC</th>
                            <th onclick="w3.sortHTML('#gems_student_table','.item','td:nth-child(2)')">Last Name</th>
                            <th>First Name</th><th>Job Title</th><th>Date Hired</th>
                            </tr>
                            ${this.prompt_data.map(row => `<tr class="gems_result_row"  onclick="${this.modal_params['modal_on_submit']}"><td data-key="ID">${row['ID']}</td><td data-key="lName">${row['lName']}</td>
                            <td data-key="fName">${row['fName']}</td><td data-key="jobTitle">${row['jobTitle']}</td><td data-key="dateHired">${row['dateHired']}</td></tr>`).join('')}
                    </table>
                    `;
    }
}
class GemsReportDisplayUser extends GemsReport 
{
    /*
        this is the Student Information page.
    */
    constructor(prompt_data)
    {
        super()
        this.prompt_data = prompt_data;
        this.modalParams={
                            "report_id":"gems_report"
                        };
        this.html   =  `
                        <div id=${this.modalParams["report_id"]}>
                            <div class="w3-container w3-card-2 w3-theme-l5 w3-round w3-margin-left w3-margin-bottom">
                                <h5 class="w3-center w3-theme-d3" >Student Information Page</h5>
                                <table id="gems_student_table" class="w3-table-all w3-hoverable w3-margin-top">
                                    <tr class="w3-theme-l1">
                                        <th onclick="w3.sortHTML('#gems_student_table','.item','td:nth-child(1)')">IDOC</th>
                                        <th onclick="w3.sortHTML('#gems_student_table','.item','td:nth-child(2)')">Last Name</th>
                                        <th>First Name</th><th>Unit</th><th>Institution</th><th>Date Entered</th>
                                    </tr>
                                    ${this.prompt_data.map(row => `<tr class="item"  onclick=""><td>${row['ID']}</td><td>${row['lName']}</td>
                                    <td>${row['fName']}</td><td>${row['housingUnit']}</td><td>${row['institution']}</td><td>${row['entryDate']}</td></tr>`).join('')}
                                </table>
                            <br></div>  
                            
                            
                            <div id="gems_class_info_toggle" class="w3-card-2 w3-round w3-margin-left w3-margin-bottom w3-theme-d1" style="padding:8px 16px;cursor:pointer;" onclick="$('#gems_class_info').slideToggle('slow');$('#gems_class_info_caret').toggleClass('fa-caret-right');">Class Information
                                <i id="gems_class_info_caret" class="fa fa-caret-down w3-right"></i></div>
                            <div id="gems_class_info" class="w3-container w3-card-2 w3-theme-l5 w3-round w3-margin-left w3-margin-bottom" style="display:none">
                                <p><button onclick="" class="w3-button w3-theme-d3">Add Student to Class</button></p> </div>    
                            
                          
                            <div id="gems_test_history_toggle" class="w3-card-2 w3-round w3-margin-left w3-margin-bottom w3-theme-d1" style="padding:8px 16px;cursor:pointer;" onclick="$('#gems_test_history').slideToggle('slow');$('#gems_test_history_caret').toggleClass('fa-caret-right');">Test History
                                <i id="gems_test_history_caret" class="fa fa-caret-down w3-right"></i></div>
                            <div id="gems_test_history" class="w3-container w3-card-2 w3-theme-l5 w3-round w3-margin-left w3-margin-bottom"  style="display:none">
                                <p><button onclick="" class="w3-button w3-theme-d3">Add Test Score</button></p></div>
                                              
                            
                            <div id="gems_item_checkout_toggle" class="w3-card-2 w3-round w3-margin-left w3-margin-bottom w3-theme-d1" style="padding:8px 16px;cursor:pointer;" onclick="$('#gems_item_checkout').slideToggle('slow');$('#gems_item_checkout_caret').toggleClass('fa-caret-right');">Items Checked Out
                                <i id="gems_item_checkout_caret" class="fa fa-caret-down w3-right"></i></div>
                            <div id="gems_item_checkout" class="w3-container w3-card-2 w3-theme-l5 w3-round w3-margin-left w3-margin-bottom"  style="display:none">
                                <p><button onclick="" class="w3-button w3-theme-d3">Check-out Item</button></p> </div>
                                
                                    
                            <div id="gems_moodle_information_toggle" class="w3-card-2 w3-round w3-margin-left w3-margin-bottom w3-theme-d1" style="padding:8px 16px;cursor:pointer;" onclick="$('#gems_moodle_information').slideToggle('slow');$('#gems_moodle_information_caret').toggleClass('fa-caret-right');">Moodle Test Information<i id="gems_moodle_information_caret" class="fa fa-caret-down w3-right"></i></div>
                            <div id="gems_moodle_information" class="w3-container w3-card-2 w3-theme-l5 w3-round w3-margin-left w3-margin-bottom"  style="display:none"> 
                                   <br><input class="w3-input" style="width:50%;float:left;" oninput="w3.filterHTML('#gems_moodle_info', '.itemmoodle', this.value)" placeholder="Filter for Test Name, Final Grade, or Date Taken here..">
                                    &nbsp;<button class="w3-button w3-theme" class="float:left;" onclick="">Refresh Tests</button><br><br>
                                    <div class="w3-responsive"><table id="gems_moodle_info2" class="w3-table-all w3-hoverable"><tr class="w3-theme-l3"><th>Test Name</th><th>Final Grade</th><th>Passing Grade</th><th>Date Taken</th></tr>
                                    </table></div><hr>
                            </div>
                                 
                        </div>
                    `;          
    }   
}
class GemsReportMyTimesheet extends GemsReport
{
    constructor(prompt_data,current_entry)
    {
        super();
        this.request_month = "";
        this.current_date = new Date();
        this.modal_params =  {};
        this.processPromptData(prompt_data);
        this.processModalParams(current_entry);
        this.html = ` 
        <div class="w3-container w3-card-2 w3-theme-l5 w3-round w3-margin-left w3-margin-bottom">    

            <h5 class="w3-center w3-theme-d3">Time Card Information</h5>
            <div class="w3-center">
                This is your time card information.<br>Select a date and accompanying times below to add an entry to your time card.<br>If you want to edit or delete a date do so by viewing the month.<br>
                <table class="w3-table-all w3-margin-bottom " sytle="" onkeyup="">
                    <tr class="w3-theme-d1"><th>Date to Add</th><th>Time In AM</th><th>Time Out AM</th><th>Time In PM</th><th>Time Out PM</th><th></th></tr>
                    <tr><td><input id="gems_timesheet_add_date" class="w3-input" type="date" value="${this.modal_params["dateValue"]}" pattern="([2])([0])([\d])([\d])([-])([0-1])([\d])-([0-3])([\d])" title="Please enter date in YYYY-MM-DD format."></td>
                    <td><input id="gems_timesheet_timeInAM" class="w3-input gems_timesheet_add_time" type="time" pattern="([\d])([\d])([:])([\d])([\d])" title="Please enter time in 24-hour time format(ie. 13:00)" value="${this.modal_params["timeInAM"]}"></td>
                    <td><input id="gems_timesheet_timeOutAM" class="w3-input gems_timesheet_add_time" type="time" pattern="([\d])([\d])([:])([\d])([\d])" title="Please enter time in 24-hour time format(ie. 13:00)" value="${this.modal_params["timeOutAM"]}"></td>
                    <td><input id="gems_timesheet_timeInPM" class="w3-input gems_timesheet_add_time" type="time" pattern="([\d])([\d])([:])([\d])([\d])" title=a"Please enter time in 24-hour time format(ie. 13:00)" value="${this.modal_params["timeInPM"]}"></td>
                    <td><input id="gems_timesheet_timeOutPM" class="w3-input gems_timesheet_add_time" type="time" pattern="([\d])([\d])([:])([\d])([\d])" title="Please enter time in 24-hour time format(ie. 13:00)" value="${this.modal_params["timeOutPM"]}"></td>
                    <td><button class="w3-button w3-theme-d3" style="width:75px" onclick="gems_controller.initGemsRequest(GemsReqMyTimesheetAddEntry,this.current_entry);">Add</button></td></tr>
                </table>
            </div>
        </div>
        <div class="w3-container w3-card-2 w3-theme-l5 w3-round w3-margin-left w3-margin-bottom">
                <div class="w3-content w3-margin">
                    <div class="w3-theme-l1 w3-padding  w3-center" style="display:inline">Select month to view that months time card information.</div>
                    <select id="gems_timesheet_select_month" class="w3-select w3-margin-left" style="width:150px;" name="date"><option value="${this.modal_params["current_month"]}">Current Month</option>
                        <option value="01">January</option><option value="02">February</option><option value="03">March</option><option value="04">April</option>
                        <option value="05">May</option><option value="06">June</option><option value="07">July</option><option value="08">August</option>
                        <option value="09">September</option><option value="10">October</option><option value="11">November</option><option value="12">December</option>
                    </select>
                    <button class="w3-button w3-theme-d3" onclick="gems_controller.initGemsRequest(GemsReqMyTimesheet)">View Month</button>
                </div>
                <table class="w3-table-all w3-margin-bottom w3-margin-top"> 
                    <tr class="w3-theme-d1">
                        <th>IDOC</th><th>Date</th><th>Time In AM</th><th>Time Out AM</th><th>Time In PM</th><th>Time Out PM</th><th></th><th></th>
                    </tr>
                    <tr>
                        ${this.prompt_data.map(row=>`<tr class="gems_timesheet_row"><td class="gems_timesheet_entry">${row["ID"]}</td><td class="gems_timesheet_entry">${row["dateValue"]}</td>
                        <td class="gems_timesheet_entry">${row["timeInAM"]}</td><td class="gems_timesheet_entry">${row["timeOutAM"]}</td>
                        <td class="gems_timesheet_entry">${row["timeInPM"]}</td><td class="gems_timesheet_entry">${row["timeOutPM"]}</td>
                        <td><button class="w3-button w3-theme-d3" style="width:75px" onclick="gems_controller.initGemsRequest(GemsReqMyTimesheetEditEntry,event);">Edit</button></td>
                        <td><button class="w3-button w3-theme-d3" style="width:75px" onclick="gems_controller.initGemsRequest(GemsReqMyTimesheetDelEntry,event);">Delete</button></td>`).join('')}
                    </tr>
                </table>
             </div>   
        </div>
                    `;
    }
    //a method that removes the month requested from the prompt_data object and adds it to this.modalParams
    processPromptData(prompt_data)
    {
        for (var o of prompt_data) {
            if (o.reqMonth) {
               var r = prompt_data.pop(o);
            }
        }
        (r.reqMonth == "0") ? this.request_month = new Date().toISOString().slice(5,7) :this.request_month = r.reqMonth;
        this.prompt_data = prompt_data;

    }
    processModalParams(current_entry)
    {
        let current_date = new Date();
        this.modal_params["current_month"] = current_date.toISOString().slice(5,7);
        current_entry ?  this.modal_params["timeInAM"] = current_entry["timeInAM"] : this.modal_params["timeInAM"] = "08:00";
        current_entry ?  this.modal_params["timeOutAM"] = current_entry["timeOutAM"] : this.modal_params["timeOutAM"] = "11:00";
        current_entry ?  this.modal_params["timeInPM"] = current_entry["timeInPM"] :  this.modal_params["timeInPM"] = "12:00";
        current_entry ?  this.modal_params["timeOutPM"] = current_entry["timeOutPM"] :   this.modal_params["timeOutPM"] = "15:30";
        current_entry ?  this.modal_params["dateValue"] = current_entry["dateValue"] :  this.modal_params["dateValue"] = current_date.toISOString().slice(0,10);   
    }
}
class GemsReportAddEditTest extends GemsReport
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_header":"Test Administration",
            "prompt_message":"Here is where you may add, edit, and delete tests in the database.<br> These are the tests that are available for students to take and score.",
            "prompt_warning": " <p> Note: It is not advisable to delete a test in the database.  <br> Doing so will delete all student scores related to that test.  Instead simply edit the test and select \"No\" in the  \"Active\" input.</p> ",
            "prompt_id":"gems_prompt",
            "modal_on_submit": "gems_controller.requests.get('GemsReqAdminDelSG').submitRequest();",
            "modal_on_cancel": "document.getElementById('gems_prompt').remove();"
        };
        this.html = `
                <div id=${this.modal_params["prompt_id"]} class="w3-container w3-card-2 w3-theme-l5 w3-round w3-margin-left w3-margin-bottom">
                    <h5 class="w3-center w3-theme-d3">${this.modal_params["prompt_header"]}</h5>
                    <div class=" w3-margin-bottom w3-margin-top w3-center w3-padding" >
                            ${this.modal_params["prompt_message"]} 
                    </div>
                    <div class="w3-content w3-center"><button class=" w3-theme-d3 w3-button" onclick="gems_controller.initGemsRequest(GemsReqAdminAddTest)">Add a Test</button></div>
                    <div class="w3-margin-bottom w3-margin-top w3-center w3-padding" style="font-weight:bold;color:red">
                        ${this.modal_params["prompt_warning"]} 
                    </div>
                    <table class="w3-table-all w3-margin-bottom w3-margin-top"> 
                        <tr class="w3-theme-d1">
                            <th>Test ID</th><th>Test Name</th><th>Passing Score</th><th>Active</th><th>Certificate</th><th></th><th></th>
                        </tr>
                        <tr>
                            ${this.prompt_data.map(row=>`<tr class="gems_test_row"><td class="gems_test_entry" data-key="autoID">${row["autoID"]}</td><td class="gems_test_entry" data-key="testName">${row["testName"]}</td>
                            <td class="gems_test_entry" data-key="passingScore">${row["passingScore"]}</td><td class="gems_test_entry" data-key="testActive">${row["testActive"]}</td>
                            <td class="gems_test_entry" data-key="certAvailable">${row["certAvailable"]}</td>
                            <td><button class="w3-button w3-theme-d3" style="width:75px" onclick="gems_controller.initGemsRequest(GemsReqAdminEditTest,event)">Edit</button></td>
                            <td><button class="w3-button w3-theme-d3" style="width:75px" onclick="gems_controller.initGemsRequest(GemsReqAdminDelTest,event)">Delete</button></td>`).join('')}
                        </tr>
                </table>
                </div>
        `;
    }
}
