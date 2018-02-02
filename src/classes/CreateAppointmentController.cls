public class CreateAppointmentController {
    
  	@AuraEnabled
    public static List<Event> getEvents(String OwnerId){
        return [ SELECT Id, AccountId, EndDateTime, StartDateTime, Subject, WhoId, WhatId 
                	FROM Event 
                	WHERE OwnerId= :ownerId];
    }
    
    @AuraEnabled
     public static String  CreateAppointment(String eventToCreate, String leadRecord){
         system.debug(eventToCreate);
         system.debug(leadRecord);
         Event eventToInsert = (Event) JSON.deserialize(eventToCreate, Event.class);         
         Lead  LeadToconvert = (Lead) JSON.deserialize(leadRecord, Lead.class);
         //TO DO -- handle errors :)
         LIST<Lead> leads = [Select Id, Street,OwnerId, isConverted FROM Lead WHERE Id= :LeadToconvert.Id ];
         if (!leads.isEmpty()){
             LeadToconvert = leads[0];
             if (LeadToconvert != null &&  !LeadToconvert.isConverted ){
                 //set fields on Event from Lead 
                 setEvent(eventToInsert,LeadToconvert);
                 //convert lead and get opportunityId back 
                 LeadToconvert = convertLead(LeadToconvert);
                 
                 if( LeadToconvert!= null ){
                     eventToInsert.WhatId  	= LeadToconvert.ConvertedOpportunityId;
                     eventToInsert.WhoId  	= LeadToconvert.ConvertedContactId;
                     eventToInsert.ShowAs = 'Busy';
                     insert eventToInsert;
             
                    return LeadToconvert.ConvertedOpportunityId;
                 }  
           	}
         }
        
         return null;
    }
    
    private static Lead convertLead(Lead leadRecord){
        System.debug('convert lead leadRecord');
        
        Database.LeadConvert lc = new Database.LeadConvert();
        lc.setLeadId(leadRecord.Id);
        LeadStatus convertStatus = [SELECT Id, MasterLabel FROM LeadStatus WHERE IsConverted=true LIMIT 1];
        lc.setConvertedStatus(convertStatus.MasterLabel);   
        Database.LeadConvertResult lcr = Database.convertLead(lc);
        System.assert(lcr.isSuccess());
        System.debug('converted');
        leadRecord = [SELECT Id, ConvertedOpportunityId, ConvertedContactId FROM Lead WHERE Id= :leadRecord.Id];
        if (leadRecord != null)
            return leadRecord;
        
        return null;
    }
    
    private static void setEvent(Event eventToCreate, Lead leadRecord){
        eventToCreate.Location  	= leadRecord.Street;
        eventToCreate.OwnerId  		= leadRecord.OwnerId;
        //Phone does not exist on Event
        //Phone does not exist on Event
    }
}