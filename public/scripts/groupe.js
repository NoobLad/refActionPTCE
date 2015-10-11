Parse.initialize("O8dECYavaIBZwi34qBZnIkvwAQEWVXjAiHwOGbKb", "2Vmb5IdO9TgrBA4FVh2eovsNmPy2JpqW72H8Rlzi");

$(document).ready(function () {
    
    var $groupesForm = $('#groupes');
    var Group = Parse.Object.extend("Group");

    var emailMatcher = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    var groupId = undefined;

    $groupesForm.submit(function (e) {
        e.preventDefault();
        if (!$('#nomGroupe').val()) {
            $("#form-issue")
                .html("Vous devez donner un nom à votre groupe.")
                .show();
            return false;
        }

        if (!emailMatcher.test($('#mail').val())) {
            $("#form-issue")
                .html("Vous devez donner un email valide.")
                .show();
            return false;
        }

        $("#groupes").hide();
        $("#wait").show();
        var groupeSaisies = new Group();
        groupeSaisies.set('nomGroupe', $('#nomGroupe').val());
        groupeSaisies.set('description', $('#description').val());
        groupeSaisies.set('mail', $('#mail').val());
        groupeSaisies.save(null, {
            success: function (data) {
                $("#wait").hide();
                $(".alert-success").show();
                console.log("data", arguments);
                groupId = data.id;
            },
            error: function() {
                $("#wait").hide();
                $(".alert-warning").show();
            }
        });
    });

    $("#goToGestion").click(function() {
        document.location.href = "./gestion.html?groupId=" + groupId;
    });

});

