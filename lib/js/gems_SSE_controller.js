
/*
    *gems_SSE_controller.js
      
  
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
class GemsSSEController 
{

    constructor()
    {
        this.events = new Map();
        this.response_classes = new Map();
        this.registerEvent("gems_class_info","lib/gems_sse_class_info.php");
        this.registerEvent("gems_test_history", "lib/gems_sse_test_history.php");
        this.registerEvent("gems_item_checkout", "lib/gems_sse_item_checkout.php");
    }
    registerEvent(target_id,script_path)
    {        
        let source = new EventSource(script_path);
        source.parent = this;
        
        source.onmessage = function(event) {
            
            let response_data = JSON.parse(event.data);
            let response_class = this.parent.response_classes.get(target_id);
            
            //assign to constructor class response_data attribute.
            response_class.response_data = response_data;
            response_class.display();
            
        }
     
        this.response_classes.set(target_id, eval("new "+"GemsReport"+target_id.slice(4)));
        this.events.set(target_id,source);
    }
    closeEvents()
    {
        for (const [key,value] of this.events) {
            this.events.get(key).close();
            this.events.delete(key);          
        }
        for (const [key,value] of this.response_classes) {
            this.response_classes.delete(key);          
        }
    }

}


//gems_sse = new GemsSSEController();


