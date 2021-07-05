<?php
/*
 * database_setup.php
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

//Table creation constant used in troubleshooting initial model, and to
//setup the database should there be an unrecoverable loss of information
//or damage to the schema
interface GemsSchema
{
        const GEMS_TABLE_SCHEMA =
        'CREATE TABLE IF NOT EXISTS "tblUsers" (
                "autoID"        INTEGER PRIMARY KEY ASC,
                "ID"        TEXT NOT NULL UNIQUE,
                "fName" TEXT,
                "lName" TEXT,
                "entryDate" NUMERIC DEFAULT CURRENT_DATE,
                        "fk_enteredByID" INTEGER DEFAULT "0",
                        "lastUpdate" TEXT,
                        "fk_updatedByID" INTEGER DEFAULT "0",
                           FOREIGN KEY ("fk_enteredByID") REFERENCES "tblUsers"("autoID") ON UPDATE CASCADE ON DELETE SET NULL,
                        FOREIGN KEY ("fk_updatedByID") REFERENCES "tblUsers"("autoID") ON UPDATE CASCADE ON DELETE SET NULL
                )
                        
        CREATE TABLE IF NOT EXISTS "tblStudentNotes" (
                                        "autoID" INTEGER PRIMARY KEY ASC,
                                        "fk_studentID" INTEGER,
                                        "noteText" TEXT,
                                        "fk_enteredByID" INTEGER,
                                        "entryDate" NUMERIC DEFAULT CURRENT_DATE,
                                        "fk_updatedByID" INTEGER,
                                        "lastUpdate" TEXT,
                                        FOREIGN KEY ("fk_studentID") REFERENCES "tblUsers"("autoID") ON UPDATE CASCADE ON DELETE SET NULL,
                                        FOREIGN KEY ("fk_enteredByID") REFERENCES "tblUsers"("autoID") ON UPDATE CASCADE ON DELETE SET NULL,
                                        FOREIGN KEY ("fk_updatedByID") REFERENCES "TblUsers"("autoID") ON UPDATE CASCADE ON DELETE SET NULL
                                        )
                                        
        CREATE TABLE IF NOT EXISTS "tblUserAuth" (
                        "autoID"        INTEGER PRIMARY KEY ASC,
                        "fk_userID"        TEXT,
                        "passwd"        TEXT,
                        "fk_secGroupID"      INTEGER,
                                        "fk_updatedByID"	INTEGER,
                                        "lastUpdate" TEXT,
                        FOREIGN KEY("fk_secGroupID") REFERENCES "tblSecGroups"("autoID") ON UPDATE CASCADE ON DELETE SET DEFAULT,
                        FOREIGN KEY("fk_userID")   REFERENCES "tblUsers"("autoID") ON UPDATE CASCADE ON DELETE CASCADE,
                                        FOREIGN KEY("fk_updatedByID") REFERENCES "tblUsers"("autoID") ON UPDATE CASCADE ON DELETE SET NULL
                )
                        
        CREATE TABLE IF NOT EXISTS "tblSecGroups" (
                        "autoID" INTEGER , 
                        "secGroupName" TEXT UNIQUE NOT NULL DEFAULT "undefined",
                        "perm_login" INTEGER DEFAULT 0,
                                        PRIMARY KEY ("autoID")
                        )
                        
        CREATE TABLE IF NOT EXISTS "tblEnrollment" (
                                        autoID INTEGER,
                                        "fk_userID" INTEGER,
                                        "fk_activeClassID" INTEGER,
                                        "entryDate" NUMERIC DEFAULT CURRENT_DATE,
                                        "fk_enrolledByID" INTEGER,
                                        lastUpdate TEXT,
                                        fk_updatedByID INTEGER,
                                        PRIMARY KEY ("autoId"),
                                        FOREIGN KEY("fk_userID") REFERENCES "tblUsers"("autoID") ON UPDATE CASCADE ON DELETE CASCADE,
                                        FOREIGN KEY("fk_activeClassID") REFERENCES "tblActiveClasses"("autoID") ON UPDATE CASCADE ON DELETE SET NULL,
                                        FOREIGN KEY("fk_enrolledByID") REFERENCES "tblUsers"("autoID") ON UPDATE CASCADE ON DELETE SET  NULL ,
                                        FOREIGN KEY("fk_updatedByID") REFERENCES "tblUsers"("autoID") ON UPDATE CASCADE ON DELETE SET  NULL 
                                        )
                                        
        CREATE TABLE IF NOT EXISTS "tblClassDayTime" (
                                        autoID INTEGER PRIMARY KEY ASC,
                                        fk_classID TEXT,
                                        fk_dayID TEXT,
                                        fk_timeID TEXT,
                                        FOREIGN KEY("fk_classID") REFERENCES "tblClasses"("autoID") ON UPDATE CASCADE ON DELETE CASCADE,
                                        FOREIGN KEY("fk_dayID") REFERENCES "tblDays"("autoID") ON UPDATE CASCADE ON DELETE SET NULL,
                                        FOREIGN KEY("fk_timeID") REFERENCES "tblTimes"("autoID") ON UPDATE CASCADE ON DELETE SET NULL
                                        )
                                        
        CREATE TABLE IF NOT EXISTS "tblClasses" ( 
                                        autoID INTEGER PRIMARY KEY ASC,
                                        fk_subjectID TEXT,
                                        fk_classroomID TEXT,
                                        fk_teacherID TEXT,
                                        FOREIGN KEY("fk_subjectID") REFERENCES "tblSubjects"("autoID") ON UPDATE CASCADE ON DELETE SET NULL,
                                        FOREIGN KEY("fk_classroomID") REFERENCES "tblClassrooms"("autoID") ON UPDATE CASCADE ON DELETE SET NULL,
                                        FOREIGN KEY("fk_teacherID") REFERENCES "tblTeachers"("autoID") ON UPDATE CASCADE ON DELETE SET NULL
                                        )
        CREATE TABLE IF NOT EXISTS "tblDays" (
                                        autoID INTEGER PRIMARY KEY ASC,
                                        day TEXT UNIQUE NOT NULL
                                        )
                                        
        CREATE TABLE IF NOT EXISTS "tblTimes" (
                                        autoID INTEGER PRIMARY KEY ASC,
                                        time TEXT UNIQUE NOT NULL
                                        )
        CREATE TABLE IF NOT EXISTS "tblSubjects" (
                                        autoID INTEGER PRIMARY KEY ASC,
                                        subject TEXT
                                        )
                                        
        CREATE TABLE IF NOT EXISTS "tblClassrooms" (
                                        autoID INTEGER PRIMARY KEY ASC,
                                        roomNumber TEXT,
                                        roomName TEXT
                                        )
                                        
        CREATE TABLE IF NOT EXISTS "tblInstructors" (
                                        autoID INTEGER PRIMARY KEY ASC,
                                        instructorName TEXT
                                        )
            
                                        CREATE TABLE IF NOT EXISTS "tblSiteSettings" (
				autoID INTEGER PRIMARY KEY ASC,
				settingName TEXT UNIQUE,
				settingValue TEXT
				)

        CREATE TABLE IF NOT EXISTS "tblUserSettings" (
				autoID INTEGER PRIMARY KEY ASC,
				fk_userID INTEGER,
				userTheme TEXT,
				userAvatar TEXT,
				avatarPic BLOB,
				FOREIGN KEY ("fk_userID") REFERENCES "tblUsers" ("autoID") ON UPDATE CASCADE ON DELETE CASCADE
				)

        //Create the views used by the database and management tools
        CREATE VIEW vwUserAuth AS  SELECT tblUsers.ID, tblUsers.fName,tblUsers.lName,tblSecGroups.secGroupName
                FROM tblUserAuth
                INNER JOIN tblUsers ON tblUserAuth.fk_userID = tblUsers.autoID
                INNER JOIN tblSecGroups ON tblUserAuth.fk_secGroupID = tblSecGroups.autoID

        CREATE VIEW vwEnrollment AS SELECT tblUsers.fName, tblUsers.lName,  tblUsers.ID, tblSubjects.subject, tblClassrooms.roomNumber, tblTeachers.teacherName, tblDays.day, tblTimes.time
                FROM tblEnrollment, tblClassDayTime, tblClasses
                INNER JOIN tblUsers ON tblEnrollment.fk_userID = tblUsers.autoID
                INNER JOIN tblSubjects ON tblClasses.fk_subjectID = tblSubjects.autoID
                INNER JOIN tblClassrooms ON tblClasses.fk_classroomID = tblClassrooms.autoID
                INNER JOIN tblTeachers  ON tblClasses.fk_teacherID = tblTeachers.autoID 
                INNER JOIN tblDays ON tblClassDayTime.fk_dayID = tblDays.autoID
                INNER JOIN tblTimes ON tblClassDayTime.fk_timeID = tblTimes.autoID
        ';        
					
        
}

?>