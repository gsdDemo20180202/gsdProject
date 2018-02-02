({
    initCalendar: function(component, event, helper){
        //
    },
    loadDataToCalendar: function(component,event,helper){ 
        helper.fetchDataToCalendar(component, helper);
    },
    
    tranformToFullCalendarFormat: function(component, data){
        var eventArr = [];
        for(var i = 0;i < data.length;i++){
            eventArr.push({  
                'id':data[i].Id,
                'start':data[i].StartDateTime,
                'end':data[i].EndDateTime,
                'title':data[i].Subject,
                'editable' : false,
                'url' : '/' +data[i].Id
            });
        }
        return eventArr;
    },
    setInitialEvent: function(component, data){
        var data = component.set('v.newEvent', data);
    },
    fetchDataToCalendar: function(component, helper){
        var data = component.get('v.events');
        if (data){
            console.log('loadDataToCalendar data',data);
            var eventArr = helper.tranformToFullCalendarFormat(component,data);
            if (eventArr){
                component.set("v.calEvents",eventArr);
                $('#calendar').fullCalendar('addEventSource',eventArr);
            }
        }
    },
    
    toggleModal : function(component, hide, modalId, backdropId){
        component.set('v.showModal', !hide);
    },  
    
    goToOpportunity : function(component,event, helper, oppId){
        debugger;
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "isredirect": true,
            "recordId": oppId,
            "slideDevName": "detail"
        });
        navEvt.fire();
    },   
    
    createTheEvent: function(component,event, helper){
        
            var action = component.get("c.CreateAppointment");
            var eventToCreate = component.get("v.newEvent");
            var existingLead =  component.get("v.leadRecord");
        	console.log('existingLead',existingLead);
        		//existingLead.sobjectType = 'Lead';
        	var leadWithoutAll = {};
        	leadWithoutAll.sobjectType = 'Lead';
            leadWithoutAll.Street  	= existingLead.Street;
            leadWithoutAll.OwnerId  = existingLead.OwnerId;
        	leadWithoutAll.Id = existingLead.Id;
        
            action.setParams({"eventToCreate": JSON.stringify(eventToCreate),
                              "leadRecord":  JSON.stringify(leadWithoutAll)
            });
            
            action.setCallback(this, function(response) {
        debugger;
                var state = response.getState();
                if(component.isValid() && state === "SUCCESS"){
                    var result = response.getReturnValue();
                    if ( result ){
                    	console.log('SUCCESS');
                        alert('SUCCESS');
                        helper.goToOpportunity(component,event, helper,result);
                    } else {
                    	console.log(result);
                        alert('NO OPP RETURNED');
                    }
                } else {
                   console.log(state);
                   alert('ERROR');
                }
            });
            
            $A.enqueueAction(action); 
 	
    },
})