Parse.initialize("O8dECYavaIBZwi34qBZnIkvwAQEWVXjAiHwOGbKb", "2Vmb5IdO9TgrBA4FVh2eovsNmPy2JpqW72H8Rlzi");

$(document).ready(function () {
    
    //bouton ajouter
    var $bAjouter = $("#ajouter");
    var $fadresses = $("#adresses");
    
    
    
    //ajout des nouveaux champs
    $bAjouter.click(function(){
        $fadresses.append(
        "<label for='mail'>Adresse mail</label>"+
          "<input type='email' class='form-control' placeholder='Email'>"
        );
    });
    
    $indicatorsForm.submit(function (e) {
        e.preventDefault();

        var mails = $.map($("input"), function (select) {
            var id = select.name.substr(4);
            var note = select.value;
            return {
                indicateur: new Indicateur({id: id}),
                note: note
            };
        });
        var noteSaisies = new NoteSaisie();
        noteSaisies.set('notes', notes);
        noteSaisies.save(null, {
            success: function () {
                console.log("C'est sauvegardé avec succès !");
            }
        });
    });
    
   

});

