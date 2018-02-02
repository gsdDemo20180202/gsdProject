@isTest
public class CreateAppointmentControllerTest {
    
    //TO DO -Negative tests 
 
    @isTest static void getEventTest() {
        // Create test Account
       	Account acc = new Account(Name = 'TestAcct');
        insert acc;
        // Create Contact
        Contact cont = new Contact(FirstName='test', LastName='tester', Account=acc);
        insert cont;
        // Create test Events
        List<Event> testEvents = new List<Event>();		
        DateTime myDateTime = DateTime.newInstance(2018, 2, 16, 12, 6, 13);
        for(Integer i=0;i<2;i++) {
            Event eventToInsert = new Event();
                eventToInsert.Subject = 'New Event';
                eventToInsert.WhoId= cont.Id;
            	eventToInsert.OwnerId= UserInfo.getUserId();
           		eventToInsert.DurationInMinutes = 60;
            	eventToInsert.ActivityDateTime = myDateTime;
            testEvents.add(eventToInsert);      
        }
        insert testEvents;   
        // Get the first test account by using a SOQL query
        List<Event> events = [SELECT Id FROM Event WHERE OwnerId=:UserInfo.getUserId()];

		List<Event> resultEvents = CreateAppointmentController.getEvents(UserInfo.getUserId());
        
        //assert  same siye list
        system.assertEquals(events.size(), resultEvents.size());
    }
    
    @isTest static void createEventTest() {
        List<Event> events = [SELECT Id FROM Event WHERE OwnerId=:UserInfo.getUserId()];
        //assert no event before
        system.assertEquals(0,events.size());
        
        // Get the first test account by using a SOQL query
        Lead newLead = new Lead ( Street='411 test st',LastName='Doe',FirstName='John',Company='Test',Status='Inquiry' );
        insert newLead;
        
        newLead = [Select Id, Street, LastName, FirstName, Company, Status, OwnerId FROM Lead Where Id = :newLead.Id];
		DateTime myDateTime = DateTime.newInstance(2018, 2, 16, 12, 6, 13);
		String oppId = CreateAppointmentController.CreateAppointment(JSON.serialize(new Event(StartDateTime=myDateTime ,Subject='Appointment', showAs='Busy', DurationInMinutes=60)), JSON.serialize(newLead));
        
        Lead previsouslyLead = [SELECT Id, ConvertedOpportunityId, ConvertedContactId, isConverted FROM Lead WHERE Id= :newLead.Id];
        system.assertNotEquals(null,oppId);
        system.assertEquals(newLead.Id,previsouslyLead.Id);
        system.assertEquals(true,previsouslyLead.isConverted);
        system.assertNotEquals(null,previsouslyLead.ConvertedOpportunityId);
    }
}