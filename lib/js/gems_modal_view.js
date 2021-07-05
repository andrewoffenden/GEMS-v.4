

/*
    *gems_modal_view.js
      
  
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

    Class used in dynamic construction of gems modal prompt.
        1. Composed by GemsRequestController

*/

//TODO::consider moving search prompt modals to another file, for organization.
class GemsPrompt
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
        document.getElementById("gems_prompt").remove();
    }
}
class GemsPromptEditUserSearch extends GemsPrompt
{
    constructor()
    {
        super();
        this.modal_params = {
                                "prompt_header":"User Search",
                                "prompt_message":"Please search for the user you would like to edit.",
                                "prompt_id":"gems_prompt",
                                "results_id":"gems_prompt_search_results",
                                "modal_on_submit":"gems_controller.requests.get('GemsReqEditUserSearch').submitRequest();",
                                "modal_on_cancel":"document.getElementById('gems_prompt').remove()"
                                 
                            };
                            this.html = `
                            <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                                <div class="w3-modal-content w3-theme-l5 w3-card">
                                        <header class="w3-theme-d3 w3-content ">
                                            <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                                        </header>
                                        <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                            <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">
                                                ${this.modal_params["prompt_message"]} 
                                            </div>
                                            <div class="w3-row-padding w3-margin-bottom">
                                            <div class="w3-half"><input class="w3-input" id = "gems_input_search_user" onkeyup="if(event.keyCode === 13) {${this.modal_params['modal_on_submit']}}" placeholder="Search..." ></input></div>
                                            <div class="w3-half"><button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-center w3-theme-d3">Go</button>
                                                  <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button></div>
                                            </div>
                                            <div id=${this.modal_params["results_id"]}>
            
                                            </div>
                                        </div>
                                </div>
                            </div>
                                `;
        return this;
    }
}
class GemsPromptResetPasswordSearch extends GemsPrompt
{
    constructor()
    {
        super();
        this.modal_params = {
            "prompt_header":"User Search",
            "prompt_message":"Please select a user whose password you would like to reset.",
            "prompt_id":"gems_prompt",
            "results_id":"gems_prompt_search_results",
            "modal_on_submit":"gems_controller.requests.get('GemsReqResetPasswordSearch').submitRequest();",
            "modal_on_cancel":"document.getElementById('gems_prompt').remove()"
             
        };
        this.html = `
            <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                <div class="w3-modal-content w3-theme-l5 w3-card">
                        <header class="w3-theme-d3 w3-content ">
                            <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                        </header>
                        <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                            <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">
                                ${this.modal_params["prompt_message"]} 
                            </div>
                            <div class="w3-row-padding w3-margin-bottom">
                            <div class="w3-half"><input class="w3-input" id = "gems_input_search_user" onkeyup="if(event.keyCode === 13) {${this.modal_params['modal_on_submit']}}"  placeholder="Search..." ></input></div>
                            <div class="w3-half"><button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-center w3-theme-d3">Go</button>
                                <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button></div>
                            </div>
                            <div id=${this.modal_params["results_id"]}>

                            </div>
                        </div>
                </div>
            </div>
            `;
    return this;
    }
}
class GemsPromptModUserSGSearch extends GemsPrompt
{
    constructor()
    {
        super();
        this.modal_params = {
            "prompt_header":"User Search",
            "prompt_message":"Please select a user whose security group you would like to change.",
            "prompt_id":"gems_prompt",
            "results_id":"gems_prompt_search_results",
            "modal_on_submit":"gems_controller.requests.get('GemsReqModUserSGSearch').submitRequest();",
            "modal_on_cancel":"document.getElementById('gems_prompt').remove()"
             
        };
        this.html = `
            <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                <div class="w3-modal-content w3-theme-l5 w3-card">
                        <header class="w3-theme-d3 w3-content ">
                            <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                        </header>
                        <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                            <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">
                                ${this.modal_params["prompt_message"]} 
                            </div>
                            <div class="w3-row-padding w3-margin-bottom">
                            <div class="w3-half"><input class="w3-input" id = "gems_input_search_user" onkeyup="if(event.keyCode === 13) {${this.modal_params['modal_on_submit']}}"  placeholder="Search..." ></input></div>
                            <div class="w3-half"><button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-center w3-theme-d3">Go</button>
                                <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button></div>
                            </div>
                            <div id=${this.modal_params["results_id"]}>

                            </div>
                        </div>
                </div>
            </div>
            `;
    return this;
    }
}
class GemsPromptDelUserSearch extends GemsPrompt
{
    constructor()
    {
        super();
        this.modal_params = {
            "prompt_header":"User Search",
            "prompt_message":"Please select a user whose entry you would like to delete.",
            "prompt_id":"gems_prompt",
            "results_id":"gems_prompt_search_results",
            "modal_on_submit":"gems_controller.requests.get('GemsReqDelUserSearch').submitRequest();",
            "modal_on_cancel":"document.getElementById('gems_prompt').remove()"
             
        };
        this.html = `
            <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                <div class="w3-modal-content w3-theme-l5 w3-card">
                        <header class="w3-theme-d3 w3-content ">
                            <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                        </header>
                        <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                            <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">
                                ${this.modal_params["prompt_message"]} 
                            </div>
                            <div class="w3-row-padding w3-margin-bottom">
                            <div class="w3-half"><input class="w3-input" id = "gems_input_search_user" onkeyup="if(event.keyCode === 13) {${this.modal_params['modal_on_submit']}}"  placeholder="Search..." ></input></div>
                            <div class="w3-half"><button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-center w3-theme-d3">Go</button>
                                <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button></div>
                            </div>
                            <div id=${this.modal_params["results_id"]}>

                            </div>
                        </div>
                </div>
            </div>
            `;
    return this;
    }
}
class GemsPromptEditSGSelect extends GemsPrompt 
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
                    "prompt_header":"Security Group Select",
                    "prompt_message":" Please select a security group that you would like to edit. <br> Note:  The core security groups are not editable.",
                    "prompt_id":"gems_prompt",
                    "modal_on_submit": "gems_controller.requests.get('GemsReqEditSGSelect').submitRequest();",
                    "modal_on_cancel": "document.getElementById('gems_prompt').remove();"
                };
        this.html = `
                    <div id = ${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card-4">
                        <header class="w3-container w3-theme-d3">
                        <h3 id="gems_prompt_header" class="w3-center">${this.modal_params["prompt_header"]}</h3>
                        </header>
                    <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                        <div class=" w3-margin-bottom w3-margin-top w3-center w3-padding" >
                            ${this.modal_params["prompt_message"]} 
                        </div>
                        <div class=" w3-margin-top w3-margin-bottom w3-center" > 
                            <label class="w3-center w3-theme-l1 w3-padding">Security Groups</label>
                            <select class="w3-select w3-margin-left gems_user_input" data-key="secGroupName" style="width:150px;" required value="${this.prompt_data['secGroupName']}">
                                ${this.prompt_data["gems_select"].map(row=>`<option>${row["secGroupName"]}</option>`)}
                            </select>
                        </div>
                        <footer class="w3-content w3-center w3-margin-bottom">
                            <button class="w3-button w3-theme-d2" onclick="${this.modal_params["modal_on_submit"]}">Select Group</button>
                            <button id="gems_prompt_cancel" class="w3-button w3-theme-d2" onclick="${this.modal_params["modal_on_cancel"]}">Cancel</button>
                        </footer>
                    </div>
                    </div>
                    </div>
                    `;
    return this;
    }
}
class GemsPromptDelSGSelect extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
                    "prompt_header":"Security Group Select",
                    "prompt_message":" Please select a security group that you would like to delete.",
                    "prompt_id":"gems_prompt",
                    "modal_on_submit": "gems_controller.requests.get('GemsReqDelSGSelect').submitRequest();",
                    "modal_on_cancel": "document.getElementById('gems_prompt').remove();"
                };
        this.html = `
                    <div id = ${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card-4">
                        <header class="w3-container w3-theme-d3">
                        <h3 id="gems_prompt_header" class="w3-center">${this.modal_params["prompt_header"]}</h3>
                        </header>
                    <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                        <div class=" w3-margin-bottom w3-margin-top w3-center w3-padding" >
                            ${this.modal_params["prompt_message"]} 
                        </div>
                        <div class=" w3-margin-top w3-margin-bottom w3-center" > 
                            <label class="w3-center w3-theme-l1 w3-padding">Security Groups</label>
                            <select class="w3-select w3-margin-left gems_user_input" data-key="secGroupName" style="width:150px;" required value="${this.prompt_data['secGroupName']}">
                                ${this.prompt_data["gems_select"].map(row=>`<option>${row["secGroupName"]}</option>`)}
                            </select>
                        </div>
                        <footer class="w3-content w3-center w3-margin-bottom">
                            <button class="w3-button w3-theme-d2" onclick="${this.modal_params["modal_on_submit"]}">Select Group</button>
                            <button id="gems_prompt_cancel" class="w3-button w3-theme-d2" onclick="${this.modal_params["modal_on_cancel"]}">Cancel</button>
                        </footer>
                    </div>
                    </div>
                    </div>
                    `;
    return this;
    }
}
//TODO:: make this extensible somehow, in order to not have to copy the modal html.
class GemsPromptInformation extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_header":"Information",
            "prompt_id":"gems_prompt",
            "modal_on_submit":"",
            "modal_on_cancel":"document.getElementById('gems_prompt').remove()"
             
        };
        this.html = `
                <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                <div class="w3-modal-content w3-theme-l5 w3-card-4">
                    <header class="w3-container w3-theme-d3">
                        <h3 id="gems_prompt_header" class="w3-center">${this.modal_params["prompt_header"]}</h3>
                    </header>
                    <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                        <p>${this.prompt_data["message"]}</p>
                    </div>
                    <footer class='w3-container w3-center'>
                    <p><button id="gems_prompt_cancel" class="w3-button  w3-theme-d2" onclick="${this.modal_params["modal_on_cancel"]}">OK</button></p>
                    </footer>
                </div>
                </div>
            `;
    return this;
    }
}
class GemsPromptDisplayUser extends GemsPrompt
{
    //generic test prompt
    constructor(prompt_data)
    {
        super();
        //this.request_class = request_class;
        this.prompt_data = prompt_data;
        this.modal_params={  "header":"Searching for Student...",
                            "prompt_id":"gems_prompt",
                            "fields":this.prompt_data,
                            "modal_on_submit":"",
                            "modal_on_cancel":"document.getElementById('gems_prompt').remove();"};
        this.html   =   ` 
                            <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                            <div class="w3-modal-content w3-theme-l5 w3-card-4">
                            <header class="w3-container w3-theme-d3">
                                <h3 id="gems_prompt_header" class="w3-center">${this.modal_params["header"]}</h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                            <table id="gems_student_table" class="w3-table-all w3-hoverable w3-margin-top">
                                <tr class="w3-theme-d1">
                                    <th onclick="w3.sortHTML('#gems_student_table','.item','td:nth-child(1)')">IDOC</th>
                                    <th onclick="w3.sortHTML('#gems_student_table','.item','td:nth-child(2)')">Last Name</th>
                                    <th>First Name</th><th>Unit</th><th>Institution</th><th>Date Entered</th>
                                </tr>
                                ${this.prompt_data.map(row => `<tr class="item"  onclick="gems_controller.initGemsRequest(GemsReqDisplayUser,${row['ID']})"><td>${row['ID']}</td><td>${row['lName']}</td>
                                <td>${row['fName']}</td><td>${row['housingUnit']}</td><td>${row['institution']}</td><td>${row['entryDate']}</td></tr>`).join('')}
                            </table>
                            <footer class='w3-container w3-center'>
                                <p><button id="gems_prompt_cancel" class="w3-button  w3-theme-d2" onclick="${this.modal_params["modal_on_cancel"]}">Cancel</button></p>
                            </footer>
                            </div>
                            </div>
                            </div>
                        `;
    }
}
class GemsPromptEditTimesheet extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
                                "prompt_header":"Edit this Date",
                                "prompt_id":"gems_prompt",
                                "modal_on_submit": "gems_controller.requests.get('GemsReqMyTimesheetEditEntry').submitRequest()",
                                "modal_on_cancel":"document.getElementById('gems_prompt').remove();"
                            };
        this.html = `
                    <div id = ${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card-4">
                    <header class="w3-container w3-theme-d3">
                        <h3 id="gems_prompt_header" class="w3-center">${this.modal_params["prompt_header"]}</h3>
                    </header>
                    <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                            <div class="w3-theme-l1 w3-margin-top w3-padding w3-center" style="font-size: 16px;font-weight:bold;">Edit the following date in your timecard:  ${this.prompt_data["dateValue"]}</div>
                            <table class="w3-table-all w3-hoverable w3-margin-top w3-maargin-bottom">
                                <tr class="w3-theme-d1"><th>Time In AM</th><th>Time Out AM</th><th>Time In PM</th><th>Time Out PM</th></tr>
                                <td><input  class="w3-input gems_timesheet_time" data-key="timeInAM"  type="time" pattern="([\d])([\d])([:])([\d])([\d])" title="Please enter time in 24-hour time format(ie. 13:00)" value="${this.prompt_data["timeInAM"]}"></td>
                                <td><input  class="w3-input gems_timesheet_time" data-key="timeOutAM" type="time" pattern="([\d])([\d])([:])([\d])([\d])" title="Please enter time in 24-hour time format(ie. 13:00)" value="${this.prompt_data["timeOutAM"]}"></td>
                                <td><input  class="w3-input gems_timesheet_time" data-key="timeInPM" type="time" pattern="([\d])([\d])([:])([\d])([\d])" title=a"Please enter time in 24-hour time format(ie. 13:00)" value="${this.prompt_data["timeInPM"]}"></td>
                                <td><input  class="w3-input gems_timesheet_time" data-key="timeOutPM" type="time" pattern="([\d])([\d])([:])([\d])([\d])" title="Please enter time in 24-hour time format(ie. 13:00)" value="${this.prompt_data["timeOutPM"]}"></td>
                            </table>
                            <footer class='w3-container w3-center w3-margin'>
                                <button class="w3-button w3-theme-d2" onclick="${this.modal_params["modal_on_submit"]}">Update</button>
                                <button id="gems_prompt_cancel" class="w3-button w3-theme-d2" onclick="${this.modal_params["modal_on_cancel"]}">Cancel</button>
                            </footer>
                    </div>
                    </div>
                    </div>

        `;
    }
}
class GemsPromptDelTimesheetEntry extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
                                "prompt_header":"Delete this Date",
                                "prompt_id":"gems_prompt",
                                "modal_on_submit": "gems_controller.requests.get('GemsReqMyTimesheetDelEntry').submitRequest();",
                                "modal_on_cancel": "document.getElementById('gems_prompt').remove();"
                            };
        this.html = `
                <div id = ${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                <div class="w3-modal-content w3-theme-l5 w3-card-4">
                <header class="w3-container w3-theme-d3">
                    <h3 id="gems_prompt_header" class="w3-center">${this.modal_params["prompt_header"]}</h3>
                </header>
                <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                        <p>Delete the following date in your timecard:</p>
                        <div class="w3-theme-l1 w3-margin-top w3-padding w3-center" style="font-size: 16px;font-weight:bold;"> ${this.prompt_data["dateValue"]}</div>
                       
                        <footer class='w3-container w3-center w3-margin'>
                            <button class="w3-button w3-theme-d2" onclick="${this.modal_params["modal_on_submit"]}">Delete</button>
                            <button id="gems_prompt_cancel" class="w3-button w3-theme-d2" onclick="${this.modal_params["modal_on_cancel"]}">Cancel</button>
                        </footer>
                </div>
                </div>
                </div>
                    `;
    }
}
class GemsPromptAdminAddUser extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
                                "prompt_header":"Add New Database User",
                                "prompt_message":" This is where you add a new T.A. or Teacher to GEMS. They are now a GEMS user and are able to log on to GEMS. <br>In order to fill in their information see the 'Manage a Student' entry on the title bar.",
                                "prompt_id":"gems_prompt",
                                "modal_on_submit":"gems_controller.requests.get('GemsReqAdminAddUser').submitRequest();",
                                "modal_on_cancel":"document.getElementById('gems_prompt').remove()",
                                "modal_default_date": new Date().toISOString().slice(0,10)
                            };
        this.html = `
                <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">${this.modal_params["prompt_message"]} </div>
                                <label class="w3-left">User IDOC Number</label>
                                <input class="w3-input gems_add_user_input" data-key="ID" type="input" maxLength="6" autocomplete="off" required=""></input>
                                <label class="w3-left">Password</label>
                                <input class="w3-input gems_add_user_input" data-key="passwd" type="password" autocomplete="off" required=""></input>
                                <label class="w3-left">First Name</label>
                                <input class="w3-input gems_add_user_input" data-key="fName" type="input" autocomplete="off" required=""></input>
                                <label class="w3-left">Last Name</label>
                                <input class="w3-input gems_add_user_input" data-key="lName" type="input" autocomplete="off" required=""></input>
                                <div class="w3-content" style="margin:5px;">
                                    <label class="w3-center w3-theme-l1 w3-padding">Select a Job Title</label>
                                    <select class="w3-select w3-margin-left gems_add_user_input" data-key="jobTitle" style="width:150px;">
                                        ${this.prompt_data.map(row=>`<option>${row["jobTitle"]}</option>`)}
                                    </select></div>
                                <label class="w3-left">Date Hired</label>
                                <input class="w3-input gems_add_user_input " data-key="dateHired" type="date" pattern="([1-2])([\d])([\d])([\d])([-])([0-1])([\d])([-])([0-3])([\d])" title="Please enter a date in the format of yyyy-mm-dd" autocomplete="off" value="${this.modal_params['modal_default_date']}" required>
                                <label class="w3-left">Pay Rate</label>
                                <input class="w3-input gems_add_user_input" data-key="payRate" maxLength="4" value="0.00" autocomplete="off" pattern="[0-9][\.][0-9][0-9]" title="Please match the required format." required>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Add User</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                </div>
                    `;
    }
}
class GemsPromptAdminEditUser extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
                    "prompt_header":"Edit Database User",
                    "prompt_message":" Here is where you edit a T.A. or Teacher who is currently in GEMS. <br> Note:  Please edit students and other school related information in the \"Manage a Student\" input on the title bar.",
                    "prompt_id":"gems_prompt",
                    "modal_on_submit":"gems_controller.requests.get('GemsReqAdminEditUser').submitRequest();",
                    "modal_on_cancel":"document.getElementById('gems_prompt').remove()"
                    
                };
        this.html = `
                    <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">${this.modal_params["prompt_message"]} </div>
                                <label class="w3-left">User IDOC Number</label>
                                <input class="w3-input gems_edit_user_input" data-key="ID" type="input" maxLength="6" autocomplete="off" required value="${this.prompt_data['ID']}"></input>
                                <label class="w3-left">First Name</label>
                                <input class="w3-input gems_edit_user_input" data-key="fName" type="input" autocomplete="off" required value="${this.prompt_data['fName']}"></input>
                                <label class="w3-left">Last Name</label>
                                <input class="w3-input gems_edit_user_input" data-key="lName" type="input" autocomplete="off" required value="${this.prompt_data['lName']}"></input>
                                <div class="w3-content" style="margin:5px;">
                                    <label class="w3-center w3-theme-l1 w3-padding">Select a Job Title</label>
                                    <select class="w3-select w3-margin-left gems_edit_user_input" data-key="jobTitle" style="width:150px;" required value="${this.prompt_data['jobTitle']}">
                                        ${this.prompt_data['job_select'].map(row=>`<option>${row["jobTitle"]}</option>`)}
                                    </select></div>
                                <label class="w3-left">Date Hired</label>
                                <input class="w3-input gems_edit_user_input " data-key="dateHired" type="date" pattern="([1-2])([\d])([\d])([\d])([-])([0-1])([\d])([-])([0-3])([\d])" title="Please enter a date in the format of yyyy-mm-dd" autocomplete="off" value="${this.prompt_data['dateHired']}" required=>
                                <label class="w3-left">Pay Rate</label>
                                <input class="w3-input gems_edit_user_input" data-key="payRate" maxLength="4" autocomplete="off" pattern="[0-9][\.][0-9][0-9]?" title="Please match the required format." required value="${this.prompt_data['payRate']}">
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Edit User</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                    </div>
                    `;
    }
}
class GemsPromptAdminDelUser extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
                    "prompt_header":"Delete User Entry",
                    "prompt_message":" Delete this user's entry from GEMS? ",
                    "prompt_id":"gems_prompt",
                    "modal_on_submit": "gems_controller.requests.get('GemsReqAdminDelUser').submitRequest();",
                    "modal_on_cancel": "document.getElementById('gems_prompt').remove();"
                };
        this.html = `
                    <div id = ${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card-4">
                    <header class="w3-container w3-theme-d3">
                    <h3 id="gems_prompt_header" class="w3-center">${this.modal_params["prompt_header"]}</h3>
                    </header>
                    <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                        <div class=" w3-margin-bottom w3-margin-top w3-center w3-padding" style="font-weight:bold;color:red;">
                            ${this.modal_params["prompt_message"]} 
                        </div>
                        <div class="w3-theme-l1 w3-margin-top w3-margin-bottom w3-padding w3-center" style="font-size: 16px;font-weight:bold;"> 
                            User: #${this.prompt_data["ID"]}  ${this.prompt_data["lName"]}  ${this.prompt_data["fName"]} a ${this.prompt_data["jobTitle"]}
                        </div>
                        <footer class='w3-container w3-center w3-margin'>
                            <button class="w3-button w3-theme-d2" onclick="${this.modal_params["modal_on_submit"]}">Delete</button>
                            <button id="gems_prompt_cancel" class="w3-button w3-theme-d2" onclick="${this.modal_params["modal_on_cancel"]}">Cancel</button>
                        </footer>
                    </div>
                    </div>
                    </div>
                    `;
    }
}
class GemsPromptAdminResetPassword extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_header":"Reset User's Password",
            "prompt_message":" Please type the new password for ",
            "prompt_id":"gems_prompt",
            "modal_on_submit":"gems_controller.requests.get('GemsReqAdminResetPassword').submitRequest();",
            "modal_on_cancel":"document.getElementById('gems_prompt').remove()"
        };
        this.html = `
                    <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">
                                    ${this.modal_params["prompt_message"]} ${this.prompt_data['fName']} ${this.prompt_data['lName']} #${this.prompt_data['ID']}
                                </div>
                                <label class="w3-left">Type New Password</label>
                                <input class="w3-input gems_user_input" data-key = "passwd" type="password" autocomplete="off" required=""></input>
                                <label class="w3-left">Re-Type New Password</label>
                                <input class="w3-input gems_user_input" data-key="confirm" type="password" autocomplete="off" required=""></input>
                                <input class="w3-input gems_user_input" data-key="ID"  value="${this.prompt_data['ID']}" style="display:none;"></input>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Reset Pasword</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                    </div>

        `;
    }
}
class GemsPromptAdminModUserSG extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
            "prompt_header":"Change User's Security Group",
            "prompt_message":" Please select a new security group for user ",
            "prompt_id":"gems_prompt",
            "modal_on_submit":"gems_controller.requests.get('GemsReqAdminModUserSG').submitRequest();",
            "modal_on_cancel":"document.getElementById('gems_prompt').remove()"
        };
        this.html = `
                    <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">
                                    ${this.modal_params["prompt_message"]} ${this.prompt_data['fName']} ${this.prompt_data['lName']} #${this.prompt_data['ID']}
                                </div>
                                <div class="w3-center w3-margin-bottom w3-responsive" style="color:red;">
                                    Warning:  Modifying a user's security group can have wide ranging consequences.<br>
                                     Please ensure that the security group that you will be granting them has the permissions you intend.<br>
                                     You can view them in the Admin Panel's "Security Group Administration" section.
                                </div>
                                <div class="w3-theme-l1 w3-padding w3-margin-bottom  w3-center w3-responsive" style="font-weight:bold;">
                                    This user is currently a: ${this.prompt_data['secGroupName']}. 
                                </div>
                                <div>
                                    <label class="w3-center w3-theme-l1 w3-padding">Select a Security Group</label>
                                    <select class="w3-select w3-margin-left gems_user_input" data-key="secGroupName" style="width:150px;" required value="${this.prompt_data['secGroupName']}">
                                            ${this.prompt_data['sec_group_select'].map(row=>`<option>${row["secGroupName"]}</option>`)}
                                    </select>
                                    <input class="w3-input gems_user_input" data-key="ID" style="display:none" value="${this.prompt_data['ID']}"></input>
                                </div>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Update</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                    </div>

        `;
    }
}
class GemsPromptAdminAddSG extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.processPromptData(prompt_data);
        this.modal_params = {
            "prompt_header":"Add a Security Group",
            "prompt_message":" Please type the name of the new security group, then select its permission flags. ",
            "prompt_id":"gems_prompt",
            "modal_on_submit":"gems_controller.requests.get('GemsReqAdminAddSG').submitRequest();",
            "modal_on_cancel":"document.getElementById('gems_prompt').remove()"
        };
        this.html = `
                    <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">
                                    ${this.modal_params["prompt_message"]} 
                                </div>
                                <div class="w3-container">
                                    <label class="w3-left ">Security Group Name</label>
                                    <input class="w3-input w3-left gems_user_input w3-margin-bottom" type="text" data-key="secGroupName" required></input>
                                </div>
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">Check the permission flags you would like to enable for the group.</div>
                                <div class="w3-container " style="margin:auto">
                                    ${this.prompt_data.map(row=>`<div class="w3-theme-l3 w3-left gems-checkbox-container">${row["name"]}<i class="w3-hover-opacity w3-margin w3-right gems-checkbox-off fa fa-circle gems_user_input_check" data-status="0" data-key="${row['name']}" onclick="gemsToggleCheckbox(this)" ></i></div>`).join('')}
                                </div>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Add Group</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                    </div>

        `;
    }
    processPromptData(prompt_data)
    {
        var flags = prompt_data["sec_group_flags"];
        //remove autoID and secGroupName
        var flags = flags.filter(row=>row.name!="autoID").filter(row=>row.name!="secGroupName");
        this.prompt_data = flags;
    }
}
class GemsPromptAdminEditSG extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = {};
        this.processPromptData(prompt_data);
        this.modal_params = {
            "prompt_header":"Edit Security Group",
            "prompt_message":" Please check the security flags that you would like to enable, or uncheck those you would like to disable for this security group. ",
            "prompt_id":"gems_prompt",
            "modal_on_submit":"gems_controller.requests.get('GemsReqAdminEditSG').submitRequest();",
            "modal_on_cancel":"document.getElementById('gems_prompt').remove()"
        };
        this.html = `
                    <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" >
                                    ${this.modal_params["prompt_message"]} 
                                </div>
                                <p style="color:red">Please read the security groups documentation before editing a security group.  <br>Modifying security flags can have wide reaching consequences.</p>
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;" >Editing security flags for the "${this.prompt_data["secGroupName"]}" security group.</div>
                                <div class="w3-container " style="margin:auto">
                                    ${this.prompt_data["sec_group_flags"].map(row=>`<div class="w3-theme-l3 w3-left gems-checkbox-container">${row[0]}<i class="w3-hover-opacity w3-margin w3-right gems-checkbox-off fa fa-circle gems_user_input_check" data-status="${row[1]}" data-key="${row[0]}"  onclick="gemsToggleCheckbox(this)" ></i></div>`).join('')}
                                </div>
                                <input class="gems_user_input" style="display:none" data-key="secGroupName" value="${this.prompt_data['secGroupName']}"></input>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Edit Group</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                    </div>

        `;
    }
    processPromptData(prompt_data)
    {
        //format data returned in server response for a simple modal
        var prompt_data = prompt_data[0];
        this.prompt_data["secGroupName"] = prompt_data["secGroupName"];

        delete prompt_data.autoID;
        delete prompt_data.secGroupName;

        this.prompt_data["sec_group_flags"] = Object.entries(prompt_data);
    }
}
class GemsPromptAdminDelSG extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
                    "prompt_header":"Delete Security Group",
                    "prompt_message":" Warning: Deleting a security group can have wide reaching consequences.<br> It is encouraged that you change all of the users that formerly belonged to this group to a new group before this group is removed. ",
                    "prompt_id":"gems_prompt",
                    "modal_on_submit": "gems_controller.requests.get('GemsReqAdminDelSG').submitRequest();",
                    "modal_on_cancel": "document.getElementById('gems_prompt').remove();"
                };
        this.html = `
                    <div id = ${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card-4">
                    <header class="w3-container w3-theme-d3">
                    <h3 id="gems_prompt_header" class="w3-center">${this.modal_params["prompt_header"]}</h3>
                    </header>
                    <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                        <div class=" w3-margin-bottom w3-margin-top w3-center w3-padding" style="font-weight:bold;color:red;">
                            ${this.modal_params["prompt_message"]} 
                        </div>
                        <div class="w3-theme-l1 w3-margin-top w3-margin-bottom w3-padding w3-center" style="font-size: 16px;font-weight:bold;"> 
                           Delete security group: ${this.prompt_data["secGroupName"]}
                        </div>
                        <footer class='w3-container w3-center w3-margin'>
                            <button class="w3-button w3-theme-d2" onclick="${this.modal_params["modal_on_submit"]}">Delete</button>
                            <button id="gems_prompt_cancel" class="w3-button w3-theme-d2" onclick="${this.modal_params["modal_on_cancel"]}">Cancel</button>
                        </footer>
                    </div>
                    </div>
                    </div>
                    `;
    }
}
class GemsPromptAdminAddTest extends GemsPrompt
{
    constructor()
    {
        super();
        this.modal_params = {
            "prompt_header":"Add a Test",
            "prompt_message":" Add a test to the database ",
            "prompt_id":"gems_prompt",
            "modal_on_submit":"gems_controller.requests.get('GemsReqAdminAddTest').submitRequest();",
            "modal_on_cancel":"document.getElementById('gems_prompt').remove()"
        };
        this.html = `
                    <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card">
                            <header class="w3-theme-d3 w3-content ">
                                <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                            </header>
                            <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">
                                    ${this.modal_params["prompt_message"]} 
                                </div>
                                <label class="w3-left">Test Name</label>
                                <input class="w3-input gems_user_input" data-key="testName" type="input"  autocomplete="off" required=""></input>
                                <label class="w3-left">Passing Score</label>
                                <input class="w3-input gems_user_input" data-key="passingScore" type="number"  autocomplete="off" value="0" required=""></input>
                                <label class="w3-left">Test is Active?</label>
                                <select class="w3-select gems_user_input" data-key="testActive">
                                    <option value="Yes" selected="">Yes</option>
                                    <option value="No">No</option>
                                </select>
                                <label class="w3-left">Certificate Available?</label>
                                <select class="w3-select gems_user_input" data-key="certAvailable">
                                    <option value="Yes">Yes</option>
                                    <option value="No" selected="">No</option>
                                </select>
                                <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                    <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Add Test</button>
                                    <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                </footer>
                            </div>
                    </div>
                    </div>

        `;
    }
}
class GemsPromptAdminEditTest extends GemsPrompt
{
        constructor(prompt_data)
        {
            super();
            this.prompt_data = prompt_data;
            this.modal_params = {
                "prompt_header":"Edit a Test",
                "prompt_message":"Edit a test in the database.",
                "prompt_id":"gems_prompt",
                "modal_on_submit":"gems_controller.requests.get('GemsReqAdminEditTest').submitRequest();",
                "modal_on_cancel":"document.getElementById('gems_prompt').remove()"
            };
            this.html = `
                        <div id=${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                        <div class="w3-modal-content w3-theme-l5 w3-card">
                                <header class="w3-theme-d3 w3-content ">
                                    <h3 class="w3-center">${this.modal_params["prompt_header"]}</h3>
                                </header>
                                <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                                    <div class="w3-theme-l1 w3-margin-bottom w3-center w3-padding" style="font-weight:bold;">
                                        ${this.modal_params["prompt_message"]} 
                                    </div>
                                    <label class="w3-left">Test Name</label>
                                    <input class="w3-input gems_user_input" data-key="testName" type="input"  autocomplete="off" required="" value="${this.prompt_data["testName"]}"></input>
                                    <label class="w3-left">Passing Score</label>
                                    <input class="w3-input gems_user_input" data-key="passingScore" type="number"  autocomplete="off" required="" value="${this.prompt_data["passingScore"]}"></input>
                                    <label class="w3-left">Test is Active?</label>
                                    <select id="gems_test_active" class="w3-select gems_user_input" data-key="testActive" value="${this.prompt_data["testActive"]}">
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                    <label class="w3-left">Certificate Available?</label>
                                    <select id="gems_cert_avail" class="w3-select gems_user_input" data-key="certAvailable" value="${this.prompt_data["certAvailable"]}">
                                        <option value="Yes">Yes</option>
                                        <option value="No" >No</option>
                                    </select>
                                    <input class="gems_user_input" data-key="autoID" style="display:none" value="${this.prompt_data["autoID"]}"></input>
                                    <footer class="w3-content w3-center w3-margin-bottom w3-margin-top">
                                        <button onclick="${this.modal_params["modal_on_submit"]}" class="w3-button w3-theme-d3">Edit Test</button>
                                        <button onclick="${this.modal_params["modal_on_cancel"]}" class="w3-button w3-theme-d3">Cancel</button>
                                    </footer>
                                </div>
                        </div>
                        </div>
    
            `;
    }
}
class GemsPromptAdminDelTest extends GemsPrompt
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data;
        this.modal_params = {
                    "prompt_header":"Delete a Test",
                    "prompt_message":"Warning: Deleting this test will remove all associated test scores. ",
                    "prompt_id":"gems_prompt",
                    "modal_on_submit": "gems_controller.requests.get('GemsReqAdminDelTest').submitRequest();",
                    "modal_on_cancel": "document.getElementById('gems_prompt').remove();"
                };
        this.html = `
                    <div id = ${this.modal_params["prompt_id"]} class="w3-modal" style="display:block;">
                    <div class="w3-modal-content w3-theme-l5 w3-card-4">
                    <header class="w3-container w3-theme-d3">
                    <h3 id="gems_prompt_header" class="w3-center">${this.modal_params["prompt_header"]}</h3>
                    </header>
                    <div id="gems_prompt_body" class="w3-container w3-center w3-responsive">
                        <div class=" w3-margin-bottom w3-margin-top w3-center w3-padding" style="font-weight:bold;color:red;">
                            ${this.modal_params["prompt_message"]} 
                        </div>
                        <div class="w3-theme-l1 w3-margin-top w3-margin-bottom w3-padding w3-center" style="font-size: 16px;font-weight:bold;"> 
                            Delete the following test: ${this.prompt_data["testName"]} 
                        </div>
                        <footer class='w3-container w3-center w3-margin'>
                            <button class="w3-button w3-theme-d2" onclick="${this.modal_params["modal_on_submit"]}">Delete</button>
                            <button id="gems_prompt_cancel" class="w3-button w3-theme-d2" onclick="${this.modal_params["modal_on_cancel"]}">Cancel</button>
                        </footer>
                    </div>
                    </div>
                    </div>
                    `;
    }
}

