({   
    doInit: function(component, event, helper){
        //helper.toggleModal(component, true, "modalCreateEvent", "backdropCreateEvent");
        //helper.initCalendar(component);
        ////init new event
         //var sEvent = {};
		 //sEvent.sobjectType = 'Event';
		 //sEvent.Subject = 'Appointment';
		 //sEvent.ShowAs = 'Busy';
		 //component.set("v.newEvent", sEvent);       
        
        let dateToday = new Date();
        let monthDigit = dateToday.getMonth() + 1;
        if (monthDigit <= 9) {
            monthDigit = '0' + monthDigit;
        }
        let dayDigit = dateToday.getDate();
        if(dayDigit <= 9){
            dayDigit = '0' + dayDigit;
        }
        let stringDate= dateToday.getFullYear() + "-" + monthDigit + "-" + dayDigit;
        component.set("v.today", stringDate);
        var timeZone = $A.get("$Locale.timezone");
        console.log(timeZone);
        //timezone: timeZone
        var calendar = component.find('calendar').getElement();
        $(document).ready(function(){
            $(calendar).fullCalendar({
                events: [],
                defaultTimedEventDuration: '01:00:00',
                slotDuration: '01:00:00',
                defaultView: 'agendaWeek',
                minTime: '06:00:00',
                maxTime: '20:00:00',
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'agendaWeek'
                },
                defaultDate: dateToday,
                editable: false,
                selectable: true,
                selectHelper: true,
                eventLimit: true,
                businessHours: [{
                    dow: [1, 2, 3, 4, 5], // Monday - Friday
                    start: '08:00',
                    end: '12:00',
                }, {
                    dow: [1, 2, 3, 4, 5], // Monday - Friday (if adding lunch hours)
                    start: '13:00',
                    end: '18:00',
                }],
                selectConstraint: "businessHours",
                //callbacks
                select: function(start, end,jsEvent, view) {
                    console.log('select function');
                    if (start.isAfter(moment())) {  
                        var eventData = {};
                        //building record with initial data from calendar
                        eventData.sobjectType = 'Event';
                        eventData.Subject = 'Appointment';
                        eventData.ShowAs = 'Busy';
                        eventData.StartDateTime = start;
                        eventData.EndDateTime = end;
                        eventData.DurationInMinutes = 60;
                        
                        console.log(eventData);
                        console.log('end of event');
                        helper.setInitialEvent(component, eventData);
                        helper.toggleModal(component, false, "modalCreateEvent", "backdropCreateEvent");
                        
                    } else {
                        alert('Cannot book an appointment in the past');
                    }
                },
                eventClick: function(calEvent, jsEvent, view) {
                    alert('Cannot book an appointment in the past');
                    //helper.toggleModal(component, false, "modalCreateEvent", "backdropCreateEvent");
                }
            });
            $(calendar).fullCalendar('addEventSource',component.get('v.calEvents'));
        });
        helper.loadDataToCalendar(component, event, helper);
    },
    loadEvents : function(component, event, helper) {
        helper.loadDataToCalendar(component, event, helper);
    },
    cancel : function(component, event, helper) {
        helper.toggleModal(component, true, "modalCreateEvent", "backdropCreateEvent");
    },
    saveEvent : function(component, event, helper) {
        helper.createTheEvent(component, event, helper);
        helper.toggleModal(component, true, "modalCreateEvent", "backdropCreateEvent");
    },    
})