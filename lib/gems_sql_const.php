<?php
/*
 * sql_const.php
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


/*                              
                            ****NOTE****
         
            always enclose the sql statement in single quotes.
            internal functions in dbmanager.php and others expect 
            single quoted statement blocks
*/
interface GemsSQLConstants 
{
        const GEMS_QUERY_USER_ALL = "SELECT * FROM tblUsers";
        const GEMS_QUERY_USER = "SELECT * FROM tblUsers WHERE ID = :ID";
        const GEMS_QUERY_USER_SETTINGS = "SELECT  tblUsers.fName,tblUsers.lName,tblSecGroups.secGroupName,tblUserSettings.userTheme,tblUserSettings.userAvatar,tblUserSettings.avatarPic FROM tblUserAuth INNER JOIN tblUsers ON tblUserAuth.fk_userID = tblUsers.autoID  INNER JOIN tblSecGroups ON tblUserAuth.fk_secGroupID = tblSecGroups.autoID    INNER JOIN tblUserSettings ON tblUsers.autoID = tblUserSettings.fk_userID    WHERE tblUsers.ID=:ID";
        const GEMS_QUERY_USER_TIMESHEET = "SELECT ID,dateValue,timeInAM,timeOutAM,timeInPM,timeOutPM FROM tblUserTimesheet INNER JOIN tblUsers ON tblUsers.autoID = tblUserTimesheet.fk_userID WHERE ID = :ID AND dateValue BETWEEN date(:start_date) AND  date(:end_date) ORDER BY dateValue";
        const GEMS_ADD_USER_TIMESHEET = 'INSERT INTO tblUserTimesheet(fk_userID,timeInAM,timeOutAM,timeInPM,timeOutPM,dateValue) VALUES  ((SELECT autoID FROM tblUsers WHERE ID = :ID), :timeInAM, :timeOutAM, :timeInPM, :timeOutPM, :dateValue)';
        const GEMS_EDIT_USER_TIMESHEET = 'UPDATE tblUserTimesheet SET (timeInAM,timeOutAM,timeInPM,timeOutPM) = (:timeInAM, :timeOutAM, :timeInPM, :timeOutPM) WHERE tblUserTimesheet.fk_userID = (SELECT tblUsers.autoID FROM tblUsers WHERE tblUsers.ID = :ID)  AND tblUserTimesheet.dateValue = :dateValue';
        const GEMS_DEL_USER_TIMESHEET = 'DELETE FROM tblUserTimesheet WHERE fk_userID=(SELECT autoID FROM tblUsers WHERE tblUsers.ID=:ID) AND dateValue=:dateValue';
        const GEMS_CHECK_SEC_GROUP = 'SELECT secGroupName FROM tblUserAuth INNER JOIN tblSecGroups ON tblSecGroups.autoID = tblUserAuth.fk_secGroupID WHERE tblUserAuth.fk_userID = (SELECT autoID FROM tblUsers WHERE tblUsers.ID=:ID) ';
        const GEMS_UPDATE_SEC_GROUP  = ' UPDATE tblUserAuth SET fk_secGroupID = :secGroupID  WHERE tblUserAuth.fk_userID = (SELECT tblUsers.autoID FROM tblUserAuth INNER JOIN tblUsers on tblUsers.autoID=tblUserAuth.fk_userID WHERE tblUsers.ID = :ID)';
        const GEMS_INSERT_EMPLOYEE_FROM_STUDENT= ' INSERT INTO tblEmployees (fk_userID,fk_jobTitle,payRate,dateHired )VALUES ((SELECT autoID FROM tblUsers WHERE ID = :ID), (SELECT autoID FROM tblJobTitles WHERE jobTitle=:jobTitle),:payRate,:dateHired); ';
        const GEMS_LOG_USER_UPDATE =  ' UPDATE tblUsers SET lastUpdate = CURRENT_DATE, fk_updatedByID= (SELECT autoID FROM tblUsers WHERE tblUsers.ID = :adminID) WHERE tblUsers.ID = :ID';
        const GEMS_INSERT_DEFAULT_SETTINGS = "INSERT INTO tblUserSettings(fk_userID) VALUES ((SELECT autoID FROM tblUsers WHERE ID = :ID))";
        const GEMS_INSERT_USER_EMPLOYEE = 'INSERT INTO tblUsers(ID,fName,lName,entryDate,fk_enteredByID) VALUES (:ID,:fName,:lName,CURRENT_DATE,(SELECT autoID FROM tblUsers WHERE ID=:adminID ))';
        const GEMS_INSERT_EMPLOYEE = '  INSERT INTO tblEmployees(fk_userID,fk_jobTitle,payRate,dateHired) VALUES((SELECT autoID FROM tblUsers WHERE ID = :ID),(SELECT autoID FROM tblJobTitles WHERE jobTitle = :jobTitle),:payRate,:dateHired) ';
        const GEMS_UPDATE_EMPLOYEE = 'UPDATE tblEmployees SET fk_jobTitle = (SELECT autoID FROM tblJobTitles WHERE jobTitle = :jobTitle),dateHired = :dateHired, payRate = :payRate WHERE fk_userID = (SELECT autoID FROM tblUsers WHERE tblUsers.ID = :ID); ';
}


?>