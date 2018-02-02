({
	loadData: function(component, helper){
		var action = component.get("c.getEvents");
        action.setParams({"OwnerId": component.get("v.leadRecord.OwnerId")});

        action.setCallback(this, function(response) {
            var state = response.getState();
            if(component.isValid() && state === "SUCCESS"){
                debugger;
              	var result = response.getReturnValue();
                component.set("v.events",result);
                var calendar = component.find('fullCalendar');
                if (calendar)
                calendar.init();
            } else {
                //TODO handle alert;
            }
        });

        $A.enqueueAction(action); 
	}
})