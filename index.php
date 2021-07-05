<?php
    include "lib/gems_session_mgmt.php";
    $_SESSION["count"] = 1;
    //$_SESSION["ID"] = 86328;
    //$_SESSION["passwd"] = "Password1";
    //$_SESSION["secGroupName"] = "gems_user";                                          //TRACE and TEST/
?>

<?php include "lib/gems_db_api.php"?>
<!DOCTYPE html>
<html lang="en">

<HEAD>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php
        $gemsqry = new GemsDbQuery();
        $gemsqry("SELECT settingValue FROM tblSiteSettings WHERE settingName = :settingName", array("settingName"=>"sitename"));
        $sitename = $gemsqry->get_results($RESULTS_FORMAT=0);
    ?>
    <title><?php echo $sitename; ?></title>
    <link rel="icon" href="favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="lib/css/w3pro.css">
    <link rel="stylesheet" type="text/css" href="lib/css/gems4.css">
    <?php if(!array_key_exists("userTheme",$_SESSION)) { ?>
        <link id="gems_theme_setting" rel="stylesheet" href="lib/css/themes/w3-theme-grey.css">
    <?php } else {
        echo '<link id="gems_theme_setting" rel="stylesheet" href="lib/css/themes/'.$_SESSION["userTheme"].'">';}
    ?>
    <link rel="stylesheet" href="lib/font-awesome-4.7.0/css/font-awesome.min.css">
    <script src="lib/jquery/jquery-3.2.1.min.js"></script>
    <script src="lib/js/w3.js"></script>
    <script src="lib/js/gems_request_controller.js"></script>
    <script src="lib/js/gems_modal_view.js"></script>
    <script src="lib/js/gems_report_view.js"></script>
    <script src="lib/js/gems_XHR_controller.js"></script>
    <script src="lib/js/gems_SSE_controller.js"></script>
    <script src="lib/js/gems_SSE_reports.js"></script>
    <script src="lib/js/gems_lib.js"></script>
</HEAD>

<BODY class="w3-theme-l4">
    <!--Page to load if not logged on-->
    <?php include "lib/gems_admin_api.php";?>
    <?php if (GemsAdministrator::check_auth("auth_login",$_SESSION["secGroupName"])==FALSE) { ?>
        <!--Login page content here.-->
        <div id="gemsLogin" class="w3-modal">
            <div class="w3-modal-content w3-card-4 w3-animate-zoom w3-theme-l5" style=" max-width:300px;">
                <div id="gemsLoginMessage" class="w3-center">
                    <div class="w3-content">
                        <p  style="font-size:16px; color:#444;padding-top:20px;"><b>Global Education Management System</b></p>
                    </div>
                    <img src="img/rjslogo.png" alt="avatar" style="box-shadow: 1px 1px  5px #444; opacity: .55; width:125px; height:100px;" class="w3-circle ">
                </div>
                <form class="w3-container" method="post" action="lib/auth.php">
					<div class="w3-section">
						<label style="color:#444;"><b>Username</b></label>
						<input class="w3-input  w3-margin-bottom" type="text" placeholder="Enter Username" name="ID" autocomplete="off" required autofocus>
						<label style="color:#444;"><b>Password</b></label>
						<input class="w3-input " type="password" placeholder="Enter Password" name="passwd" required>
						<input type="hidden" name="func" value="auth">
						<button class="w3-btn w3-block w3-theme-l1 w3-section w3-padding " style="box-shadow: 1px 1px  5px #444;" type="submit">Login</button>
					</div>
				</form>			
            </div>
        </div>
    <?php } ?>
    <!--Page to load if you are logged on-->
    <?php if(GemsAdministrator::check_auth("auth_login",$_SESSION["secGroupName"])==TRUE) { ?> 
    <!--Nav bar-->
    <div class="w3-top">
        <div id="gems_nav_bar" class="w3-bar w3-theme-d5 w3-left-align " >
            <a class="w3-bar-item w3-button" href="index.php"><i class="fa fa-home"></i></a>
            <!--div class="w3-bar-item w3-button w3-theme-d3" style=" margin-left:35%"><i class="fa fa-search"></i></div-->
            <input type="text" id="gems_search_user" class="w3-bar-item w3-input w3-left" style="margin-left:38%;" onkeyup="if(event.keyCode === 13) {gems_controller.initGemsRequest(GemsReqUserSearch)}"  placeholder="Manage a Student...">
            <a href="#" class="w3-bar-item w3-theme-d3 w3-button w3-left "  onclick="gems_controller.initGemsRequest(GemsReqUserSearch)" >Go</a>
            <div class="w3-bar-item w3-hide-small w3-hide-medium w3-right">Global Education Management System</div>
    
        </div>
    </div>
    <!--Page Container-->
    <div class="w3-container w3-content" style="max-width:1400px;margin-top:65px">
        <div class="w3-row">
            <!--Left Column-->
            <div class="w3-col m2">
                <!--User information card-->
                <div class="w3-card-2 w3-round w3-theme-l5" >
                        <div class="w3-container" id="gems_profile_div">
                            <h4 class="w3-center"><?php echo $_SESSION["fName"].' '.$_SESSION["lName"]; ?></h4>
                            <p id="gems_avatar_profile" class="w3-center" ></p>
                            
                            <p class="w3-center">IDOC: <?php echo $_SESSION["ID"]; ?></p>
                        </div>
                        <button onclick="location.replace('lib/auth.php?func=logout');" class="w3-button w3-block w3-theme-d3 w3-center"><i class="fa fa-sign-out w3-margin-right"></i>Logout</button>
                </div><br>
                <!--div class="w3-card-2 w3-round w3-margin-bottom">      
					<button class="w3-button w3-block w3-theme-d3 w3-center" onclick="">Gems Tools</button>
				</div--> 
                <div class="w3-card-2 w3-round">
					<div id="gems_my_information_flip" onclick="">
                        <button class="w3-button w3-block w3-theme-d3 w3-left-align" onclick="$('#gems_my_information_panel').slideToggle();"><i class="fa fa-user-circle-o w3-margin-right"></i>My Information</button>
                    </div>
                    <div id="gems_my_information_panel" class="panel" style="display:none;">
                        <button class="w3-button w3-block w3-left-align" onclick="gems_controller.initGemsRequest(GemsReqMyTimesheet)">My Time Card</button>
						<button class="w3-button w3-block w3-left-align" onclick="">Print My Time Card</button>
						<button class="w3-button w3-block w3-left-align" onclick="">Change My Password</button>
                        <button class="w3-button w3-block w3-left-align" onclick="">Change My Theme</button>
                        <button class="w3-button w3-block w3-left-align" onclick="">Change My Picture</button>
                    </div>
				</div> 
                <div class="w3-card-2 w3-round">
					<div id="gems_student_management_flip" onclick="">
                        <button class="w3-button w3-block w3-theme-d3 w3-left-align" onclick="$('#gems_student_management_panel').slideToggle();"><i class="fa fa-book w3-margin-right"></i>Student Management</button>
                    </div>
                    <div id="gems_student_management_panel" class="panel" style="display:none;">
                        <button class="w3-button w3-block w3-left-align " onclick="">Add Student</button>
                        <button class="w3-button w3-block w3-left-align "onclick="">Edit Student</button>
                        <?php if(GemsAdministrator::check_auth("u_del",$_SESSION["secGroupName"])==TRUE) { ?>
                        <button class="w3-button w3-block w3-left-align " onclick="">Delete Student</button>
                        <?php } ?>
						<button class="w3-button w3-block w3-left-align" onclick="">Print Student Barcode</button>
                    </div>
				</div>
                <div class="w3-card-2 w3-round">
					<div id="gems_attendance_flip" onclick="">
                        <button class="w3-button w3-block w3-theme-d3 w3-left-align" onclick="$('#gems_attendance_panel').slideToggle();"><i class="fa fa-clock-o w3-margin-right"></i>Attendance</button>
                    </div>
                    <div id="gems_attendance_panel" class="panel" style="display:none;">
                        <button class="w3-button w3-block w3-left-align " onclick="">Daily Attendance</button>
						<button class="w3-button w3-block w3-left-align" onclick="">Manually Add</button>
						<button class="w3-button w3-block w3-left-align" onclick="">Display Daily</button>
                        <button class="w3-button w3-block w3-left-align" onclick="">Student History</button>
                    </div>
				</div> 
                <div class="w3-card-2 w3-round">
                    <div id="gems_items_flip" onclick=";$('#gems_items_panel').slideToggle();">
                        <button class="w3-button w3-block w3-theme-d3 w3-left-align" onclick=""><i class="fa fa-edit w3-margin-right"></i>Items and Books</button>
                    </div>
                    <div id="gems_items_panel" class="panel" style="display:none;">
                        <button class="w3-button w3-block w3-left-align " onclick="">Daily Attendance</button>
						<button class="w3-button w3-block w3-left-align" onclick="">Manually Add</button>
						<button class="w3-button w3-block w3-left-align" onclick="">Display Daily</button>
                        <button class="w3-button w3-block w3-left-align" onclick="">Student History</button>
                    </div>
				</div> 
                <div class="w3-card-2 w3-round">
					<div id="gems_reports_flip" onclick="$('#gems_reports_panel').slideToggle();">
                        <button class="w3-button w3-block w3-theme-d3 w3-left-align" onclick=""><i class="fa fa-bars w3-margin-right"></i>Reports</button>
                    </div>
                    <div id="gems_reports_panel" class="panel" style="display:none;">
                        <!--add content as needed-->
                    </div>
				</div>
                <?php if(GemsAdministrator::check_auth("view_admin_options",$_SESSION["secGroupName"])==TRUE) { ?>
                    <div class="w3-card-2 w3-round">
                        <div id="gems_administration_flip" onclick="$('#gems_administration_panel').slideToggle();">
                            <button class="w3-button w3-block w3-theme-d3 w3-left-align" onclick=""><i class="fa fa-expeditedssl w3-margin-right"></i>Administration</button>
                        </div>
                        <div id="gems_administration_panel" class="panel" style="display:none;">
                            <div id="gems_user_admin_flip" onclick="$('#gems_user_admin_panel').slideToggle();">
                                <button class="w3-button w3-block w3-left-align w3-theme-d1" onclick="">User Administration</button> 
                            </div>
                            <div id="gems_user_admin_panel" class="panel" style="display:none;">
                                <button class="w3-button w3-block w3-left-align " onclick="gems_controller.initGemsRequest(GemsReqAdminAddUser)">Add User</button>
                                <button class="w3-button w3-block w3-left-align" onclick="gems_controller.initGemsRequest(GemsReqEditUserSearch)">Edit User</button>
                                <?php if(GemsAdministrator::check_auth("u_del",$_SESSION["secGroupName"])==TRUE) { ?>
                                    <button class="w3-button w3-block w3-left-align" onclick="gems_controller.initGemsRequest(GemsReqDelUserSearch)">Delete User</button>
                                <?php } ?>
                                <button class="w3-button w3-block w3-left-align" onclick="gems_controller.initGemsRequest(GemsReqResetPasswordSearch)">Reset Password</button>
                                <?php if(GemsAdministrator::check_auth("mod_sec_group",$_SESSION["secGroupName"])==TRUE) { ?>
                                    <button class="w3-button w3-block w3-left-align" onclick="gems_controller.initGemsRequest(GemsReqModUserSGSearch)">Change Security Group</button>   
                                <?php } ?>
                            </div>
                            <div id="gems_test_admin_flip" onclick="$('#gems_test_admin_panel').slideToggle();">
                                <button class="w3-button w3-block w3-left-align w3-theme-d1 " onclick="">Test Administration</button> 
                            </div>
                            <div id="gems_test_admin_panel" class="panel" style="display:none;">
                                <button class="w3-button w3-block w3-left-align " onclick="gems_controller.initGemsRequest(GemsReqAdminAddEditTest)">Add/Edit Tests</button>
                                <button class="w3-button w3-block w3-left-align" onclick="">Manage Certificates</button>
                            </div>  
                            <div id="gems_class_admin_flip" onclick="$('#gems_class_admin_panel').slideToggle();">
                                <button class="w3-button w3-block w3-left-align w3-theme-d1 " onclick="">Class Administration</button> 
                            </div>
                            <div id="gems_class_admin_panel" class="panel" style="display:none;">
                                <button class="w3-button w3-block w3-left-align " onclick="">Add/Edit Class</button>
                                <button class="w3-button w3-block w3-left-align" onclick="">Add/Edit Classroom</button>
                            </div>
                            <?php if(GemsAdministrator::check_auth("mod_sec_group",$_SESSION["secGroupName"])==TRUE) { ?>
                            <div id="gems_secgroup_admin_flip" onclick="$('#gems_secgroup_admin_panel').slideToggle();">
                                <button class="w3-button w3-block w3-left-align w3-theme-d1 " onclick="">Security Group Administration</button> 
                            </div>
                            <div id="gems_secgroup_admin_panel" class="panel" style="display:none;">
                                <button class="w3-button w3-block w3-left-align" onclick="gems_controller.initGemsRequest(GemsReqAdminAddSG)">Add Security Group</button>
                                <button class="w3-button w3-block w3-left-align" onclick="gems_controller.initGemsRequest(GemsReqEditSGSelect)">Edit Security Group</button>
                                <button class="w3-button w3-block w3-left-align" onclick="gems_controller.initGemsRequest(GemsReqDelSGSelect)">Delete Security Group</button>
                            </div>
                            <?php }?>
                        </div>
                    </div> 
                <?php } ?> 
            </div>
            <!--Right Column-->
            <div class="w3-col m9">
                <div id="gems_main_div" class="w3-margin-left">

                </div>        
            </div>
        </div>
    </div>
     <?php } ?>
</BODY>
        <!-- TODO :: Populate avatar from database -->
        <script>    
            /*
                this initiates the gems_controller which manages callbacks by instantiating members of the required class,
                collecting them in a map, and removing them when their reclaim flag is set to true.  Which is when the
                process has closed.
            */
            gems_controller = new GemsRequestController(reclaim_requests=true);
      
            function checkAvatar() {
                                    var avatar = '<?php echo $_SESSION["userAvatar"]; ?>';//ssoc_getCookie('Avatar');
                                    if(avatar == 'custom') {
                                        document.getElementById('gems_avatar_profile').innerHTML = '<img src="data:'+localStorage.getItem("avatarpicmime")+';base64,'+localStorage.getItem("avatarpic")+'" class="w3-circle" style="height:85px;width:85px;" alt="Avatar">';
                                    } else {
                                        document.getElementById('gems_avatar_profile').innerHTML = '<img src="img/avatar/'+avatar+'" class="w3-circle" style="height:85px;width:85px;" alt="Avatar">';
                                    }
                                    //var t = setTimeout(checkAvatar, 2000);
                                }
                                checkAvatar();                                    //TODO::look at check avatar script.               
        </script>
</HTML>

