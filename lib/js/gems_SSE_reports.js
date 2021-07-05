/*
    *gems_SSE_reports.js
      
  
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

class GemsReport_class_info
{
    construct(response_data)
    {
        this.response_data = response_data;
    }
    display()
    {
       console.log(this.response_data);
    }
}

class GemsReport_test_history
{
    construct(response_data)
    {
        this.response_data = response_data;
    }
    display()
    {
       console.log(this.response_data);
    }
}

class GemsReport_item_checkout
{
    construct(response_data)
    {
        this.response_data = response_data;
    }
    display()
    {
       console.log(this.response_data);
    }
}