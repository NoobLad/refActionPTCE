Parse.initialize("O8dECYavaIBZwi34qBZnIkvwAQEWVXjAiHwOGbKb", "2Vmb5IdO9TgrBA4FVh2eovsNmPy2JpqW72H8Rlzi");

$(document).ready(function () {

    // Elements du dom
    var $groupesForm = $('#groupes');
    var $nomGroupe = $('#nomGroupe');
    var $mail = $('#mail');

    // Accés base
    var Group = Parse.Object.extend("Group");

    // validateur de mail
    var emailMatcher = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    $groupesForm.submit(function (e) {
        e.preventDefault();
        if (!$nomGroupe.val()) { // Nom du groupe requis
            $("#form-issue")
                .html("Vous devez donner un nom à votre groupe.")
                .show();
            return false;
        }

        if (!emailMatcher.test($mail.val())) {// Email requis
            $("#form-issue")
                .html("Vous devez donner un email valide.")
                .show();
            return false;
        }

        $("#groupes").hide();
        $("#wait").show();// Petite animation sympa

        // Persistance du groupe
        var groupeSaisies = new Group();
        groupeSaisies.set('nomGroupe', $nomGroupe.val());
        groupeSaisies.set('description', $('#description').val());
        groupeSaisies.set('mail', $mail.val());
        groupeSaisies.save(null, {
            success: function (data) {
                $("#wait").hide();
                $(".alert-success").show();
                $("#goToGestion").click(function() {
                    document.location.href = "./gestion.html?groupId=" + data.id;
                });
            },
            error: function() {
                $("#wait").hide();
                $(".alert-warning").show();
            }
        });
    });
});

