
/*
    *gems_lib.js
      
  
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
function gemsToggleCheckbox(check_box)
{
    //my own checkbox!
    let class_list = check_box.classList;

    if(class_list.contains("gems-checkbox-off")) {
        class_list.remove("gems-checkbox-off",  "fa-circle");
        class_list.add("gems-checkbox-on","fa-check-circle");
        check_box.dataset.status = 1;
    }
    else {
        class_list.remove("gems-checkbox-on","fa-checkbox-circle");
        class_list.add("gems-checkbox-off","fa-circle");
        check_box.dataset.status = 0;
    }
}