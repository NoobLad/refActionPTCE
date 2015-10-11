Parse.initialize("O8dECYavaIBZwi34qBZnIkvwAQEWVXjAiHwOGbKb", "2Vmb5IdO9TgrBA4FVh2eovsNmPy2JpqW72H8Rlzi");
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

$(document).ready(function () {

    //Validateur pour les emails
    var emailMatcher = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    // Elements du dom
    var $bAjouter = $("#ajouter");
    var $Inscriptions = $("#inscriptions");
    var $mail = $('#mail');

    //base de données
    var Participant = Parse.Object.extend("Participant");
    var Group = Parse.Object.extend("Group");
    var groupId = getParameterByName("groupId");

    // Insertion d'un email dans le dom
    function insertMail(mail) {
        $Inscriptions.append("<p><strong>" + mail + "</strong></p>");
    }

    // Récupération des emails déjà sasies
    var query = new Parse.Query(Participant);
    query.equalTo("group", new Group({id: groupId}));
    query.find({
        success: function (participants) {
            participants.forEach(function (participant) {
                insertMail(participant.get('mail'));
            });
        }
    });

    //ajout des nouveaux champs
    $bAjouter.click(function () {
        if (emailMatcher.test($mail.val())) {

            var unParticipant = new Participant();
            unParticipant.set('group', new Group({id: groupId}));
            unParticipant.set('mail', $mail.val());
            unParticipant.save(null, {
                success: function () {
                    console.log("C'est sauvegardé avec succès !");
                }
            });

            var mail = $mail.val();
            insertMail(mail);
            $mail.val("");

            $("#invalid-email").hide();

        } else {
            $("#invalid-email").show();
        }
    });
});
   
