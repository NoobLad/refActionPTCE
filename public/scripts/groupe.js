Parse.initialize("O8dECYavaIBZwi34qBZnIkvwAQEWVXjAiHwOGbKb", "2Vmb5IdO9TgrBA4FVh2eovsNmPy2JpqW72H8Rlzi");

$(document).ready(function () {
    
    var $groupesForm = $('#groupes');
    var Group = Parse.Object.extend("Group");

    $groupesForm.submit(function (e) {
        e.preventDefault();

        var groupeSaisies = new Group();
        groupeSaisies.set('nomGroupe', $('#nomGroupe').val());
        groupeSaisies.set('description', $('#description').val());
        groupeSaisies.set('mail', $('#mail').val());
        groupeSaisies.save(null, {
            success: function () {
                console.log("C'est sauvegardé avec succès !");
            }
        });
    });    



});

