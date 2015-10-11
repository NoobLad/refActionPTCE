Parse.initialize("O8dECYavaIBZwi34qBZnIkvwAQEWVXjAiHwOGbKb", "2Vmb5IdO9TgrBA4FVh2eovsNmPy2JpqW72H8Rlzi");

$(document).ready(function () {
    var Indicateur = Parse.Object.extend("Indicateur");
    var NoteSaisie = Parse.Object.extend("NoteSaisie");

    var $indicatorsForm = $('#indicators');
    var $indicatorsContainer = $indicatorsForm.find('.indicators-container');

    var allIndicators = new Parse.Query(Indicateur);
    allIndicators.include("objectifPrincipal");
    allIndicators.include("objectifPrincipal.objectifGeneral");
    allIndicators.find({
        success: function (results) {
            for (var i = 0; i < results.length; i++) {
                var indicateur = results[i];
                var objectifPrincipal = indicateur.get('objectifPrincipal');
                var objectifGeneral = objectifPrincipal.get('objectifGeneral');
                var idObjP = "objP-" + objectifPrincipal.id;
                var idObjG = "objG-" + objectifGeneral.id;
                var idInd = "ind-" + indicateur.id;
                if ($('#' + idObjG).length == 0) {
                    $indicatorsContainer.append("<div id='" + idObjG + "'><h1>" + objectifGeneral.get('label') + "</h1></div>");
                }
                if ($('#' + idObjP).length == 0) {
                    $indicatorsContainer.find('#' + idObjG).append("<div id='" + idObjP + "'><h2>" + objectifPrincipal.get('label') + "</h2></div>");
                }
                $indicatorsContainer.find('#' + idObjP).append(
                    "<p id='" + idInd + "'>" + indicateur.get('label') + "</p>" +
                    "<select class='form-control' name='" + idInd + "'>" +
                    "<option>1</option>" +
                    "<option>2</option>" +
                    "<option>3</option>" +
                    "<option>4</option>" +
                    "<option>5</option>" +
                    "<option>6</option>" +
                    "</select>"
                );
            }
        },
        error: function (error) {
            console.log(error);
        }
    });

    $indicatorsForm.submit(function (e) {
        e.preventDefault();

        var notes = $.map($("select"), function (select) {
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