Parse.initialize("O8dECYavaIBZwi34qBZnIkvwAQEWVXjAiHwOGbKb", "2Vmb5IdO9TgrBA4FVh2eovsNmPy2JpqW72H8Rlzi");
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
    
$(document).ready(function () {
    
    //bouton ajouter
    var $bAjouter = $("#ajouter");
    var $fadresses = $("#adresses");
    var $Inscriptions = $("#inscriptions"); 
    //base de données
    var Participant = Parse.Object.extend("Participant");
    var Group = Parse.Object.extend("Group");
    
    
    //ajout des nouveaux champs
    $bAjouter.click(function(){
        var unParticipant = new Participant();
        
        unParticipant.set('group', new Group({id :getParameterByName("groupId")}));
        unParticipant.set('mail', $('#mail').val());
        unParticipant.save(null, {
            success: function () {
               console.log("C'est sauvegardé avec succès !");
          }
        });
        
        $Inscriptions.append("<p><strong>"+$('#mail').val()+"</strong></p>");
    });
    

    
   

});

