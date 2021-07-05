/*
    *gems_request_controller.js
      
  
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

    Each class object titled GemsReq... is a composition class instantiated when there is a request from the gems main page.
        1.GemsViewerInterface initiates request on user click.
            a. instantiates subclass of GemsRequest which composes the request process.
        2.GemsRequest subclass usually creates a prompt with it's initRequest method.
            a. In a typical case the button will call the instantiated sublass's submitRequest method with params.
            b. Usually the modal prompt class will be recorded in the modalDialog attribute of that subclass.  
               These are found in gems_modal_view.js.
        3.GemsRequest.submitRequest initiates an XHR using gemsXHRController.js.
            a. formats object passed as serialized JSON.
            b. on return passes control back to GemsRequest
                    1. passes information back as a java script object.
        4. GemsRequest subclass now instantiates a ModalReport class to construct the report.
            a. uses GemsRequest instance method finalizeRequest to compose the process.
            b. will create the modal specified in the subclass attribute modalReport.
               These are found in gems_report_view.js
        
    Therefore in order to add a new Gems functionality one has to create a GemsRequestSubclass which will compose 
    that process, with accompanying identically named GemsRequest subclass in the gems_request_mgmt.php file 
    for the server side.  Additional subclasses are required for prompts and reports in the files:
    gems_modal_view.js, and gems_report_view.js (as mentioned above) which are assigned to the respective GemsRequest subclass
    attributes for those modals/reports.

*/
class GemsRequestController
{
    /*
        This class maintains a map of the names and instances of initiated requests.
        When instantiated in Gems it registers a timed event that cleans up any gemsrequests
        that have their reclaim_request flag set to true.
    */
    constructor(reclaim_requests=false)
    {   
        this.reclaim_requests = reclaim_requests;
        this.requests = new Map();
        if  (this.reclaim_requests === true) {
            this.reclaimRequests();
        }     
    }
    initGemsRequest(request_class,prompt_data)
    {
        let request_instance = new request_class(prompt_data);
        let request_name = request_instance.toString();
        
        //TODO::Check this later, to see if this functions, if so remove commented lines.
        //if(!this.requests.has(request_name)) {
            this.requests.set(request_name,request_instance)
        //}
        this.requests.get(request_name).initRequest();
    }
    reclaimGemsRequests()
    {
        for (const [key,value] of this.requests) {
            if (value.reclaim_request === true || undefined) {
                this.requests.delete(key);
            }
        }
    }
    reclaimGemsRequest(request)
    {
        try {
            if (this.requests.has(request)) {
                this.requests.delete(request);
            }
            else {
                throw "Request doesn't exist";
            }
        }
        catch(err) {
            console.log("Can't remove request; "+err);
        }   
    }
    reclaimRequests() 
    {
        //if reclaim_requests flag is true reclaim requests every two seconds.
        let context = this.reclaimRequests.bind(this);
        this.reclaimGemsRequests();
        setTimeout(context,1000*60*5);
    }
    reclaimSSE(request)
    {
        //cleanup of sse's  must occur here as request classes may need cleanup on main page switch.
        try {
            if (this.requests.has(request)) {
                //close all server-sent events associated with the request.
                this.requests.get(request).gemsSSE.closeEvents();
            }
            else {
                throw "Request doesn't exist";
            }
        }
        catch(err) {
            console.log("Can't close Server-Sent Events; "+err);
        }   
    }
}
class GemsRequest
{
   
    constructor()
    {
        this.prompt_data = {};
        this.request_data = {};
        this.response_data = {}
        this.finalize_request = true;
        this.reclaim_request = false;
        this.modalDialog = {};
        this.modalReport = {};
    }
    
    toString()
    {
        return this.constructor.name;
    }

    /*
    this method is inherited by all gems request instances, its parameter is an html collection of input elements
    each element in the array must have a checkValidity() method.  Retruns true if all elements are valid, otherwise false.
    */
    isValid(collection)
    {
        try {
            if (collection.toString() == "[object HTMLCollection]") {
                for (let e of collection) {
                    if (e.checkValidity() == false) {
                            return false;
                    } else {
                        continue;
                    }
                }return true;
            } 
            else {
                throw "Not an HTMLCollection";
            }
        }
        catch(err) {
            console.log("Check your input fields:"+err);
        }
    }

    initRequest()
    {  
         /*
            initiates the gemsrequest by instantiating modal and setting the modal "ok" to submitRequest
            this method may be overruled in subcalsses below. with special parameters for certain types
            of gemsrequest.
        */
        this.modalDialog = new this.modalDialog();
        this.modalDialog.display();
    }

    submitRequest()
    {  
         /*
            composes the XHR process  and sets the callback as finalizeRequest
            parameters are instance attributes of subclass of GemsRequest
        */
       const xhr = new GemsXHRController();
       xhr.gemsXHR(this.method, this.url, this.request_data, this.finalize_request,this.toString());
    }

    finalizeRequest()
    {
        /*
            The response has now been recieved and the xhr handler has been assigned
            to this method.  It will operate on the GemsRequest instance property
            this.response_data. May be overriden in subclasses for custom behavior.
        */
            this.modalReport = new this.modalReport();
            this.modalReport.display();
    }
}
class GemsReqUserSearch extends GemsRequest                 
{
    /*
        This is the top menubar student search.  It is particular so the implementation in 
        this subclass is atypical. The properties below are particular to this request process.
    */
    
    constructor()
    {   
        super();
        this.method = "GET";
        this.url = "lib/gems_request_mgmt.php";
        this.request_data = {'search_str':$('#gems_search_user').val(),'request_class':this.toString()};
        this.response_data = {};
        this.finalize_request = true;
        this.modalDialog =  {};
        this.modalReport = GemsPromptDisplayUser;                                             
    }
    initRequest()
    {  
        //    for this method the parameters object is passed in as there is no initial modal.it simply passes to the submitRequest method for XHR.
        if(this.request_data["search_str"]=="") {
            return;
        } else {
        this.submitRequest();
        }
    }
    submitRequest()
    {  
       if(document.getElementById("gems_report")==null) {
            const xhr = new GemsXHRController();
            xhr.gemsXHR(this.method, this.url, this.request_data, this.finalize_request,this.toString());
       } else {
            const xhr = new GemsXHRController();
            xhr.gemsXHR(this.method, this.url, this.request_data, this.finalize_request,this.toString());
       }
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
        this.modalReport = new this.modalReport(this.response_data);
        this.modalReport.display();
        $('#gems_search_user').val('');  
    }
}
class GemsSearch extends GemsRequest
{
    constructor()
    {
        super();
        this.method = "GET";
        this.url = "lib/gems_request_mgmt.php";
        this.response_data = {};
        this.finalize_request = true;
    }
    initRequest()
    {
        this.modalDialog = new this.modalDialog();
        this.modalDialog.display();
    }
    submitRequest()
    {
        let search_str = document.getElementById('gems_input_search_user').value;
        if (search_str != "") {
            Object.assign(this.request_data,{"search_str":search_str});
            const xhr = new GemsXHRController().gemsXHR(this.method,this.url,this.request_data,this.finalize_request,this.toString());
        }
    }
    finalizeRequest()
    {
        $("#gems_prompt_search_results").empty();
        let results = new this.modalReport(this.response_data).display();
    }
}
class GemsReqEditUserSearch extends GemsSearch
{
    constructor()
    {
        super();
        this.request_data = {'request_class':this.toString()};
        this.modalDialog = GemsPromptEditUserSearch;
        this.modalReport = GemsReportEditUserSearch;
    }
}
class GemsReqResetPasswordSearch extends GemsSearch
{
    constructor()
    {
        super();
        this.request_data = {"request_class":this.toString()};
        this.modalDialog = GemsPromptResetPasswordSearch;
        this.modalReport = GemsReportResetPasswordSearch;
    }
}
class GemsReqModUserSGSearch extends GemsSearch
{
    constructor()
    {
        super();
        this.request_data = {"request_class":this.toString()};
        this.modalDialog = GemsPromptModUserSGSearch;
        this.modalReport = GemsReportModUserSGSearch;
    }
}
class GemsReqDelUserSearch extends GemsSearch
{
    constructor()
    {
        super();
        this.request_data = {"request_class":this.toString()};
        this.modalDialog = GemsPromptDelUserSearch;
        this.modalReport = GemsReportDelUserSearch;
    }
}
class GemsSelect extends GemsRequest
{
    /*
        special form of gems request, designed to be extended by gems select modals.
        only works with select modals that have one input that will transition to a full 
        modal for editing ( in most cases).
    */
    constructor()
    {
        super();
        this.method = "GET";
        this.url = "lib/gems_request_mgmt.php";
        this.subreq_url = /*override*/"";
        this.request_data = {"request_class":this.toString()};
        this.response_data = {};
        this.modalDialog = {/*override*/};
        this.modalReport = {/*override*/};
    }
    initRequest()
    {
        //populate select and draw modal
        fetch(this.subreq_url).then(resp=>resp.json())
                    .then(json=>{let prompt_data = this.prompt_data; return Object.assign(prompt_data,{"gems_select":json})})
                    .then(prompt_data=>{this.modalDialog = new this.modalDialog(prompt_data);this.modalDialog.display()})
    }
    submitRequest()
    {
        //submit user selection to the server, and get associated sec group flags.
        let entry = document.getElementsByClassName("gems_user_input")[0];
        this.request_data[entry.dataset.key] = entry.value;

        const xhr = new GemsXHRController().gemsXHR(this.method,this.url,this.request_data,this.finalize_request,this.toString());
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
        this.modalDialog.destroy();
        gems_controller.initGemsRequest(this.modalReport,this.response_data);
    }
}
class GemsReqEditSGSelect extends GemsSelect
{
    constructor()
    {
        super();
        this.subreq_url = this.url+"?="+Math.random()+"&"+"json="+JSON.stringify({"subrequest":"sec_group_select","request_class":this.toString()});
        this.modalDialog = GemsPromptEditSGSelect;
        this.modalReport = GemsReqAdminEditSG;
    }
}
class GemsReqDelSGSelect extends GemsSelect
{
    constructor()
    {
        super();
        this.subreq_url = this.url+"?="+Math.random()+"&"+"json="+JSON.stringify({"subrequest":"sec_group_select","request_class":this.toString()});
        this.modalDialog = GemsPromptDelSGSelect;
        this.modalReport = GemsReqAdminDelSG;
    }
    submitRequest()
    {
        let entry = document.getElementsByClassName("gems_user_input")[0];
        this.response_data[entry.dataset.key] = entry.value;

        this.finalizeRequest();
    }
}
class GemsReqDisplayUser extends GemsRequest
{
    constructor(prompt_data)
    {
        super();
        //A special property used if the requesting class must pass information to the prompt.
        this.prompt_data = prompt_data;
        this.method = "POST";
        this.url = "lib/gems_request_mgmt.php";
        this.request_data =  {'request_class':this.toString()};
        this.response_data = {};
        this.modalDialog = {};
        this.modalReport =  GemsReportDisplayUser;
        //This is a special property to the student inof page involving SSE functionality.
        this.gemsSSE = {};
        
    }
    initRequest()
    {  
        //   modal dialog already exists so click needs to submit request.
        this.submitRequest(); 
    }
    submitRequest()
    {  
        //prompt_data here is the passed in response from the previously displayed and submitted GemsRequest.       
        this.request_data["ID"] = this.prompt_data;
        const xhr = new GemsXHRController().gemsXHR(this.method, this.url, this.request_data, this.finalize_request,this.toString());
    }
    finalizeRequest()
    {
        //response from server is passed to the modal report constructor class.
        //this is the Student Information Page
        $("#gems_main_div").empty();
        this.modalReport = new this.modalReport(this.response_data);
        this.modalReport.display();
        
        //initiate server-sent events.
        this.gemsSSE = new GemsSSEController();
    }  
}
class GemsReqMyTimesheet extends GemsRequest
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data || null;
        this.method = "GET";
        this.url = "gems";
        this.request_data = {'request_class':this.toString(),"reqMonth": document.getElementById("gems_timesheet_select_month") ? document.getElementById("gems_timesheet_select_month").value : "0"};
        this.response_data = {};
        this.modalDialog =  {};
        this.modalReport = GemsReportMyTimesheet;                
    }
    initRequest()
    {
        //click here submits request, no modal required.
        $("#gems_main_div").empty();
        this.submitRequest()
    }
    submitRequest()
    {
        const xhr = new GemsXHRController().gemsXHR(this.method, this.url, this.request_data, this.finalize_request, this.toString());
    }
    finalizeRequest()
    { 
        this.reclaim_request = true;
        this.modalReport = new this.modalReport(this.response_data,this.prompt_data);
        this.modalReport.display();
        document.getElementById("gems_timesheet_select_month").value = this.modalReport.request_month;       
    }
}
class GemsReqMyTimesheetAddEntry extends GemsRequest
{
    constructor()
    {
        super();
        this.method = "POST";
        this.url = "lib/gems_request_mgmt.php";
        this.request_data = {"request_class":this.toString()};
        this.response_data = {};
        this.modalDialog = {};
        this.modalReport = {};
    }
    initRequest()
    {
        //collect the times and date. Add to this.request_data.
        let times = document.getElementsByClassName("gems_timesheet_add_time");
        for (var time of times) {
            let time_field = time.id.slice(15);
            this.request_data[time_field] = time.value;
        }
        this.request_data["dateValue"] = document.getElementById("gems_timesheet_add_date").value;
        this.submitRequest();
    }
    submitRequest()
    {
        const xhr = new GemsXHRController().gemsXHR(this.method, this.url, this.request_data, this.finalize_request, this.toString());
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
        gems_controller.initGemsRequest(GemsReqMyTimesheet,this.request_data);                    
    }
}
class GemsReqMyTimesheetEditEntry extends GemsRequest
{
    constructor(event_data)
    {
        super();
        this.method = "POST";
        this.url = "lib/gems_request_mgmt.php";
        this.event_data = event_data;                                                                   //the click event, stored to locate the corrosponding row
        this.prompt_data = {};                                                                          //intended for data to be sent to modalDialog
        this.request_data = {"request_class":this.toString()};
        this.response_data = {};
        this.modalDialog = GemsPromptEditTimesheet;
        this.modalReport = {};
    }
    initRequest()
    {
        //takes the closest row to the click event and selects the timesheet entries.
        let row = $(this.event_data.target).closest('.gems_timesheet_row').contents();
        let timesheet_entries = [...row].filter(val=>val.className=="gems_timesheet_entry");
   
        //collect time sheet entries from row, and place in this.request_data with key_names.
        let value_names = [...timesheet_entries].map(entry=>entry=entry.innerText);
        let key_names = ["ID","dateValue","timeInAM","timeOutAM","timeInPM","timeOutPM"];
        [...key_names].map((k,i=0)=>{this.prompt_data[k]=value_names[i];i++;});

        //set request_data for future use.
        this.request_data["ID"] = this.prompt_data["ID"];
        this.request_data["dateValue"] = this.prompt_data["dateValue"];

        this.modalDialog = new  this.modalDialog(this.prompt_data);
        this.modalDialog.display()
    } 
    submitRequest()
    {
        //collect the modalDialog new entries to add to this.request_data for submission to server.
        let times = document.getElementsByClassName("gems_timesheet_time");     
        [...times].map(entry=>{this.request_data[entry.dataset.key]=entry.value;});

        const xhr = new GemsXHRController().gemsXHR(this.method, this.url, this.request_data, this.finalize_request, this.toString());

        this.modalDialog.destroy();
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
        if (this.response_data["results"]==1) {
            //update only that row on the timesheet. 
            let row = $(this.event_data.target).closest('.gems_timesheet_row').contents().splice(2);
            let current_entries = [...row].filter(val=>val.className=="gems_timesheet_entry");
            let updated_entries = Object.keys(this.request_data).map(key=>this.request_data[key]).splice(3);
            [...current_entries].map((e,i=0)=>{e.innerText=updated_entries[i];i++;});
        }
    }
}
class GemsReqMyTimesheetDelEntry extends GemsRequest 
{
    constructor(event_data)
    {
        super();
        this.method = "GET";
        this.url = "lib/gems_request_mgmt.php";
        this.event_data = event_data;
        this.prompt_data = {};
        this.request_data = {"request_class":this.toString()};
        this.response_data = {};
        this.modalDialog = GemsPromptDelTimesheetEntry;
        this.modalReport = {};
    }
    initRequest()
    {
        //takes the closest row to the click event and selects the timesheet entries.
        let row = $(this.event_data.target).closest('.gems_timesheet_row').contents();
        let timesheet_entries = [...row].filter(val=>val.className=="gems_timesheet_entry");
   
        //collect time sheet entries from row, and place in this.request_data with key_names.
        let value_names = [...timesheet_entries].map(entry=>entry=entry.innerText).splice(0,2);
        let key_names = ["ID","dateValue"];
        [...key_names].map((k,i=0)=>{this.prompt_data[k]=value_names[i];i++;});

        Object.assign(this.request_data, this.prompt_data);
 
        this.modalDialog = new this.modalDialog(this.prompt_data);
        this.modalDialog.display();
    }
    submitRequest()
    {
        const xhr = new GemsXHRController().gemsXHR(this.method, this.url, this.request_data, this.finalize_request, this.toString());
        this.modalDialog.destroy();
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
        let row = $(this.event_data.target).closest('.gems_timesheet_row');
        row.empty();
    }
}
class GemsReqAdminAddUser extends GemsRequest
{
    constructor()
    {
        super();
        this.method = "POST";
        this.url = "lib/gems_request_mgmt.php";
        this.prompt_data = {};
        this.request_data = {"request_class":this.toString()};
        this.response_data = {};
        this.modalDialog = GemsPromptAdminAddUser;
        this.modalReport = GemsPromptInformation;
    }

    initRequest()
    {
        let subrequest_url = this.url+"?="+Math.random()+"&"+"json="+JSON.stringify({"subrequest":"job_title_select","request_class":this.toString()});
        fetch(subrequest_url).then(resp=>resp.json()).then(json=>{this.modalDialog = new this.modalDialog(json);this.modalDialog.display()})
    } 
    submitRequest()
    {
        let entries = document.getElementsByClassName("gems_add_user_input");
        if (!this.isValid(entries)) {
            alert("Please ensure that the form is filled out completely, and that all fields are correct.");
        }
        else {
            [...entries].map(entry=>{this.request_data[entry.dataset.key] = entry.value;});
            console.log(this.request_data);
            const xhr = new GemsXHRController().gemsXHR(this.method,this.url,this.request_data,this.finalize_request,this.toString());
            this.modalDialog.destroy();
        }
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
        this.modalReport= new this.modalReport({"message":"Successfully added a new User!"}).display();
    }
}
class GemsReqAdminEditUser extends GemsRequest 
{
    constructor(event)
    {
        super();
        this.method = "POST";
        this.url = "lib/gems_request_mgmt.php";
        this.event_data = event;
        this.prompt_data = {};
        this.request_data = {"request_class":this.toString()};
        this.response_data = {};
        this.modalDialog = GemsPromptAdminEditUser;
        this.modalReport = GemsPromptInformation;
    }
    initRequest()
    {
        //pulls prompt data from prior search modal from GemsReqEditUserSearch
        let row = $(this.event_data.target).closest(".gems_result_row").contents();
        [...row].map(e=>{if(e.dataset){this.prompt_data[e.dataset.key]=e.innerText}});

        //fetch the jobTitle input's rows dynamically, using prior code server side.
        let subrequest_url = this.url+"?="+Math.random()+"&"+"json="+JSON.stringify({"subrequest":"job_title_select","request_class":"GemsReqAdminAddUser"});
        fetch(subrequest_url).then(resp=>resp.json())
                .then(json=>{let prompt_data = this.prompt_data;return Object.assign(prompt_data,{"job_select":json})})
                .then(prompt_data=>{this.modalDialog = new this.modalDialog(prompt_data);this.modalDialog.display()})
        
        document.getElementById("gems_prompt").remove();
    }
    submitRequest()
    {
        let entries = document.getElementsByClassName("gems_edit_user_input");
        if (!this.isValid(entries)) {
            alert("Please ensure that the form is filled out completely, and that all fields are correct.");
        }
        else {
            [...entries].map(entry=>{this.request_data[entry.dataset.key] = entry.value;});
            const xhr = new GemsXHRController().gemsXHR(this.method,this.url,this.request_data,this.finalize_request,this.toString());
            this.modalDialog.destroy();
        }
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
        this.modalReport = new this.modalReport({"message":"Successfully updated user!"}).display();
    }
}
class GemsReqAdminDelUser extends GemsRequest
{
    constructor(event_data)
    {
        super();
        this.method = "POST";
        this.url = "lib/gems_request_mgmt.php";
        this.event_data = event_data;
        this.prompt_data = {};
        this.request_data = {"request_class":this.toString()};
        this.response_data = {};
        this.modalDialog = GemsPromptAdminDelUser;
        this.modalReport = GemsPromptInformation;
    }
    initRequest()
    {
        let row = $(this.event_data.target).closest(".gems_result_row").contents();
        [...row].map(e=>{if(e.dataset){this.prompt_data[e.dataset.key]=e.innerText}});
        
        Object.assign(this.request_data, this.prompt_data);

        document.getElementById("gems_prompt").remove();
        this.modalDialog = new this.modalDialog(this.prompt_data);
        this.modalDialog.display();
    }
    submitRequest()
    {
        const xhr = new GemsXHRController().gemsXHR(this.method,this.url,this.request_data,this.finalize_request,this.toString());
        this.modalDialog.destroy(); 
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
        this.modalReport = new this.modalReport({"message":"User entry successfully deleted!"}).display();
    }
}
class GemsReqAdminResetPassword extends GemsRequest
{
    constructor(event_data)
    {
        super();
        this.method = "POST";
        this.url ="lib/gems_request_mgmt.php";
        this.event_data = event_data;
        this.prompt_data = {};
        this.request_data = {"request_class":this.toString()};
        this.response_data = {};
        this.modalDialog = GemsPromptAdminResetPassword;
        this.modalReport = GemsPromptInformation;
    }
    initRequest()
    {
        //need the idoc number of the user for the update on the server side,
        let row = $(this.event_data.target).closest(".gems_result_row").contents();
        [...row].map(e=>{if(e.dataset){this.prompt_data[e.dataset.key]=e.innerText}});

        document.getElementById("gems_prompt").remove();
        this.modalDialog = new this.modalDialog(this.prompt_data);
        this.modalDialog.display();
    }
    submitRequest()
    {
        //check here to see before submitting if two password fields are the same.
        let entries = document.getElementsByClassName("gems_user_input");
        if (!this.isValid(entries)) {
            alert("Please ensure that the form is filled out completely, and that all fields are correct.");
        }
        else {
            [...entries].map(entry=>{this.request_data[entry.dataset.key] = entry.value;});
            if (this.request_data["passwd"] == this.request_data["confirm"]) {
                const xhr = new GemsXHRController().gemsXHR(this.method,this.url,this.request_data,this.finalize_request,this.toString());
                this.modalDialog.destroy();
            } else {
                alert("Please ensure that both passwords match exactly.");
            }
        }

    }
    finalizeRequest()
    {
        //clean up and display information modal.
        this.reclaim_request = true;
        this.modalReport = new this.modalReport({"message":"Password updated successfully "}).display();
    }
}
class GemsReqAdminModUserSG extends GemsRequest
{
    constructor(event_data)
    {
        super();
        this.method = "POST";
        this.url ="lib/gems_request_mgmt.php";
        this.event_data = event_data;
        this.prompt_data = {};
        this.request_data = {"request_class":this.toString()};
        this.response_data = {};
        this.modalDialog = GemsPromptAdminModUserSG;
        this.modalReport = GemsPromptInformation;
    }
    initRequest()
    {
        //need the idoc number of the user for the update on the server side,
        let row = $(this.event_data.target).closest(".gems_result_row").contents();
        [...row].map(e=>{if(e.dataset){this.prompt_data[e.dataset.key]=e.innerText}});
        //populate the sec group select with options from the db.
        let subrequest_url = this.url+"?="+Math.random()+"&"+"json="+JSON.stringify({"subrequest":"sec_group_select","request_class":"GemsReqAdminModUserSG"});
        fetch(subrequest_url).then(resp=>resp.json())
                .then(json=>{let prompt_data = this.prompt_data;return Object.assign(prompt_data,{"sec_group_select":json})})
                .then(prompt_data=>{this.modalDialog = new this.modalDialog(prompt_data);this.modalDialog.display()})
        
        document.getElementById("gems_prompt").remove();
    }
    submitRequest()
    {
        let entries = document.getElementsByClassName("gems_user_input");
        if (!this.isValid(entries)) {
            alert("Please ensure that the form is filled out completely, and that all fields are correct.");
        }
        else {
            [...entries].map(entry=>{this.request_data[entry.dataset.key] = entry.value;});
            const xhr = new GemsXHRController().gemsXHR(this.method,this.url,this.request_data,this.finalize_request,this.toString());
            this.modalDialog.destroy();
        } 
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
        this.modalReport = new this.modalReport({"message":"User's security group modified successfully! "}).display();
    }
}
class GemsReqAdminAddSG extends GemsRequest
{
    constructor()
    {
        super();
        this.method = "POST";
        this.url = "lib/gems_request_mgmt.php";
        this.prompt_data = {};
        this.request_data = {"request_class":this.toString()};
        this.response_data = {};
        this.modalDialog = GemsPromptAdminAddSG;
        this.modalReport = GemsPromptInformation;
    }
    initRequest()
    {
        //subrequest to poulate the check boxes for the modal
        let subrequest_url = this.url+"?="+Math.random()+"&"+"json="+JSON.stringify({"subrequest":"sec_group_flags","request_class":"GemsReqAdminAddSG"});
        fetch(subrequest_url).then(resp=>resp.json())
                .then(json=>{let prompt_data = this.prompt_data;return Object.assign(prompt_data,{"sec_group_flags":json})})
                .then(prompt_data=>{this.modalDialog = new this.modalDialog(prompt_data);this.modalDialog.display()})
    }
    submitRequest()
    {
        //getting gems_user_input_check and gems_user_input (different attributes contain their data)
        let sec_group = document.getElementsByClassName("gems_user_input")[0];
        let sec_flags = document.getElementsByClassName("gems_user_input_check");
        this.request_data[sec_group.dataset.key] = sec_group.value;
        [...sec_flags].map(flag=>this.request_data[flag.dataset.key]=flag.dataset.status);

        const xhr = new GemsXHRController().gemsXHR(this.method,this.url,this.request_data,this.finalize_request,this.toString());
        this.modalDialog.destroy();
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
        this.modalReport = new this.modalReport({"message":"Security group successfully created!"}).display();
    }
}
class GemsReqAdminEditSG extends GemsRequest
{
    constructor(prompt_data)
    {
        super();
        this.method = "POST";
        this.url = "lib/gems_request_mgmt.php";
        this.prompt_data = prompt_data;
        this.request_data = {"request_class":this.toString()};
        this.response_data = {};
        this.modalDialog = GemsPromptAdminEditSG;
        this.modalReport = GemsPromptInformation;
    }
    initRequest()
    {
        this.modalDialog = new this.modalDialog(this.prompt_data);
        this.modalDialog.display();
        //get sec flags and set the homemade checkboxes correctly
        let flags = document.getElementsByClassName("gems_user_input_check");
        for(let f of flags) {
            if (f.dataset.status == 1) {
                f.classList.remove("gems-checkbox-off",  "fa-circle");
                f.classList.add("gems-checkbox-on","fa-check-circle");}
          }
    }
    submitRequest()
    {
        let sec_group = document.getElementsByClassName("gems_user_input");
        this.request_data["secGroupName"] = sec_group.item(0).value;

        let sec_flags = document.getElementsByClassName("gems_user_input_check");
        [...sec_flags].map(flag=>this.request_data[flag.dataset.key]=flag.dataset.status);

        const xhr = new GemsXHRController().gemsXHR(this.method, this.url, this.request_data, this.finalize_request, this.toString());
        this.modalDialog.destroy();
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
        this.modalReport = new GemsPromptInformation({"message":"Security group updated sucessfully!"});
        this.modalReport.display();
    }
}
//TODO:: create an admin report, in reports section of sec group members.
class GemsReqAdminDelSG extends GemsRequest
    {
        constructor(prompt_data)
    {
        super();
        this.method = "POST";
        this.url = "lib/gems_request_mgmt.php";
        this.prompt_data = prompt_data;
        this.request_data = {"request_class":this.toString()};
        this.response_data = {};
        this.modalDialog = GemsPromptAdminDelSG;
        this.modalReport = GemsPromptInformation;
    }
    initRequest()
    {
        this.modalDialog = new this.modalDialog(this.prompt_data);
        this.modalDialog.display();
    }
    submitRequest()
    {
        Object.assign(this.request_data,this.prompt_data);
        console.log(this.request_data);
        const xhr = new GemsXHRController().gemsXHR(this.method, this.url, this.request_data, this.finalize_request, this.toString());
        this.modalDialog.destroy();
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
        this.modalReport = new GemsPromptInformation({"message":"Security group deleted sucessfully!"});
        this.modalReport.display();
    }
}
class GemsReqAdminAddEditTest extends GemsRequest
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data || null;
        this.method = "GET";
        this.url = "lib/gems_request_mgmt.php";
        this.request_data = {'request_class':this.toString()};
        this.response_data = {};
        this.modalDialog =  {};
        this.modalReport = GemsReportAddEditTest;                
    }
    initRequest()
    {
        //click here submits request, no modal required.
        $("#gems_main_div").empty();
        this.submitRequest()
    }
    submitRequest()
    {
        const xhr = new GemsXHRController().gemsXHR(this.method, this.url, this.request_data, this.finalize_request, this.toString());
    }
    finalizeRequest()
    { 
        this.reclaim_request = true;
        this.modalReport = new this.modalReport(this.response_data);
        this.modalReport.display();
    }
}
class GemsReqAdminAddTest extends GemsRequest
{
    constructor()
    {
        super();
        this.method = "POST";
        this.url = "lib/gems_request_mgmt.php";
        this.request_data = {"request_class":this.toString()};
        this.response_data = {};
        this.modalDialog = GemsPromptAdminAddTest;
        this.modalReport = {};
    }
    initRequest()
    {
        this.modalDialog = new this.modalDialog();
        this.modalDialog.display();
    }
    submitRequest()
    {
        let entries = document.getElementsByClassName("gems_user_input");
        [...entries].map(entry=>this.request_data[entry.dataset.key]=entry.value);
        if (!this.isValid(entries)) {
            alert("Please ensure that the form is filled out completely, and that all fields are correct.");
        }
        else {
            [...entries].map(entry=>{this.request_data[entry.dataset.key] = entry.value;});
          
            const xhr = new GemsXHRController().gemsXHR(this.method,this.url,this.request_data,this.finalize_request,this.toString());
            this.modalDialog.destroy();
        }
    }
    finalizeRequest()
    {
        this.reclaim_request=true;
        gems_controller.initGemsRequest(GemsReqAdminAddEditTest);
    }
}
class GemsReqAdminEditTest extends GemsRequest
{
    constructor(event_data)
    {
        super();
        this.method = "POST";
        this.url = "lib/gems_request_mgmt.php";
        this.event_data = event_data;
        this.prompt_data = {};
        this.request_data = {"request_class":this.toString()};
        this.response_data = {};
        this.modalDialog = GemsPromptAdminEditTest;
        this.modalReport = {};
    }
    initRequest()
    {
        let row = $(this.event_data.target).closest('.gems_test_row').contents();
        let entries = [...row].filter(val=>val.className=='gems_test_entry');

        [...entries].map(entry=>this.prompt_data[entry.dataset.key]=entry.innerText);

        this.modalDialog = new this.modalDialog(this.prompt_data);
        this.modalDialog.display();

        //set select boxes to correct values
        document.getElementById("gems_test_active").value = this.prompt_data["testActive"];
        document.getElementById("gems_cert_avail").value = this.prompt_data["certAvailable"];
    }
    submitRequest()
    {
        let entries = document.getElementsByClassName("gems_user_input");
        [...entries].map(entry=>this.request_data[entry.dataset.key]=entry.value);
        if (!this.isValid(entries)) {
            alert("Please ensure that the form is filled out completely, and that all fields are correct.");
        }
        else {
            [...entries].map(entry=>{this.request_data[entry.dataset.key] = entry.value;});

            const xhr = new GemsXHRController().gemsXHR(this.method,this.url,this.request_data,this.finalize_request,this.toString());
            this.modalDialog.destroy();
        }
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
        gems_controller.initGemsRequest(GemsReqAdminAddEditTest);
    }
}
class GemsReqAdminDelTest extends GemsRequest
{
    constructor(event_data)
    {
        super();
        this.method = "POST";
        this.url = "lib/gems_request_mgmt.php";
        this.event_data = event_data;
        this.prompt_data = {};
        this.request_data = {"request_class":this.toString()};
        this.response_data = {};
        this.modalDialog = GemsPromptAdminDelTest;
        this.modalReport = {};
    }
    initRequest()
    {
        let row = $(this.event_data.target).closest('.gems_test_row').contents();
        let entries = [...row].filter(val=>val.className=='gems_test_entry');

        [...entries].map(entry=>this.prompt_data[entry.dataset.key]=entry.innerText);

        this.modalDialog = new this.modalDialog(this.prompt_data);
        this.modalDialog.display();
    }
    submitRequest()
    {
        this.request_data["autoID"] = this.prompt_data["autoID"];
        
        const xhr = new GemsXHRController().gemsXHR(this.method,this.url,this.request_data,this.finalize_request,this.toString());
        this.modalDialog.destroy();
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
        gems_controller.initGemsRequest(GemsReqAdminAddEditTest);
    }
}