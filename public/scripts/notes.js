Parse.initialize("O8dECYavaIBZwi34qBZnIkvwAQEWVXjAiHwOGbKb", "2Vmb5IdO9TgrBA4FVh2eovsNmPy2JpqW72H8Rlzi");
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

$(document).ready(function () {
    var Indicateur = Parse.Object.extend("Indicateur");
    var NoteSaisie = Parse.Object.extend("NoteSaisie");
    var Group = Parse.Object.extend("Group");

    var links = "<ul>";

    for (var i = 1; i <= 6; i++) {
        links += "<li class='badge text-right'>" + i + "</li>";
    }
    links += "</ul>";

    var $indicatorsForm = $('#indicators');
    var $formContainer = $indicatorsForm.find('.indicators-container');
    var footer = $('footer'),
        previousButton = footer.find('#previous'),
        nextButton = footer.find('#next'),
        finishButton = footer.find("#finish"),
        width = $indicatorsForm.width();
    footer.find('button').hide();

    var currentPage = 0;

    function actualizeButtons() {
        if (currentPage <= 0) {
            previousButton.hide();
        } else {
            previousButton.show();
        }
        if (currentPage < ($formContainer.find('section').length - 1)) {
            nextButton.show();
        } else {
            nextButton.hide();
            finishButton.show();
        }
    }

    function next() {
        if (currentPage + 1 >= $formContainer.find('section').length) return;
        currentPage++;
        actualizeButtons();
        $formContainer.animate({
            "left": "-=" + width + "px"
        });
    }

    function previous() {
        if (currentPage <= 0) return;
        currentPage--;
        actualizeButtons();
        $formContainer.animate({
            "left": "+=" + width + "px"
        });
    }

    nextButton.click(next);
    previousButton.click(previous);

    var notes = {};

    function noteSelect(id) {
        return function () {
            var element = $(this);
            notes[id].note = element.text() | 0;
            element.parent().find('.badge').removeClass('selected');
            element.addClass('selected');
            next();
        }
    }

    var allIndicators = new Parse.Query(Indicateur);
    allIndicators.include("objectifPrincipal");
    allIndicators.include("objectifPrincipal.objectifGeneral");
    allIndicators.find({
        success: function (results) {
            $formContainer.width(width * (results.length + 1));
            for (var i = 0; i < results.length; i++) {
                var indicateur = results[i];
                var objectifPrincipal = indicateur.get('objectifPrincipal');
                var objectifGeneral = objectifPrincipal.get('objectifGeneral');
                var html = "<section style='padding: 16px;'>" +
                    "<header>" + objectifGeneral.get('label') + "</header>" +
                    "<div class='content'>" +
                    "<h2>" + objectifPrincipal.get('label') + "</h2>" +
                    "<p>" + indicateur.get('label') + "</p>" +
                    links +
                    "</div>" +
                    "</section>";
                var domElement = $(html);
                notes[indicateur.id] = {
                    indicateur: new Indicateur({id: indicateur.id}),
                    note: 1
                };
                domElement.find('.badge').click(noteSelect(indicateur.id));
                $formContainer.append(domElement);
            }
            $formContainer.find('section').width(width - 32);
            footer.show();
            actualizeButtons();
        },
        error: function (error) {
            $('#form-issue').show();
        }
    });

    $indicatorsForm.submit(function (e) {
        e.preventDefault();
        // Récupération des notes
        var notesList = Object.keys(notes).map(function (id) {
            return notes[id];
        });
        var noteSaisies = new NoteSaisie();
        noteSaisies.set('notes', notesList);
        var groupId = getParameterByName('groupId');
        noteSaisies.set('group', new Group({id: groupId}));
        noteSaisies.save(null, {
            success: function () {
                // Redirection vers les statistiques
                window.location = "./stats.html?groupId=" + groupId;
            },
            error: function () {
                $('#form-issue').show();
            }
        });
    });
});