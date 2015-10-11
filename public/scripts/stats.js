
Parse.initialize("O8dECYavaIBZwi34qBZnIkvwAQEWVXjAiHwOGbKb", "2Vmb5IdO9TgrBA4FVh2eovsNmPy2JpqW72H8Rlzi");
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
function add(a, b) {
    return a+b;
}

function getCanvas(id) {
    return document.getElementById(id).getContext('2d');
}

$(document).ready(function () {
    var Indicateur = Parse.Object.extend('Indicateur');


    var allIndicators = new Parse.Query(Indicateur);
    allIndicators.include("objectifPrincipal");
    allIndicators.include("objectifPrincipal.objectifGeneral");
    allIndicators.find({
        success: function( indicators) {
            var indById = {};
            indicators.forEach(function (ind) {
                indById[ind.id] = ind;
            });
            indicatorsLoaded(indById);
        }
    });

    var chartOptions = {
        scaleOverride: true,
        scaleSteps: 10,
        scaleStepWidth: 5/10,
        scaleStartValue: 1
    };

    function indicatorsLoaded(indicatorsById) {

        var groupId = getParameterByName("groupId");
        console.log(groupId);
        var NoteSaisies = Parse.Object.extend("NoteSaisie");
        var Group = Parse.Object.extend("Group");
        var query = new Parse.Query(NoteSaisies);
        query.include('notes');
        var group = new Group();
        group.id = groupId;
        query.equalTo("group", group);
        query.find({
            success: function(results) {
                console.log(results);
                var main = {};
                var indicators = {};
                results.forEach(function (noteSasie) {
                    noteSasie.get('notes').forEach(function (note) {
                        var indicateur = indicatorsById[note.indicateur.id];
                        var objectifPrincipal = indicateur.get('objectifPrincipal');
                        var idPrincipal = objectifPrincipal.id;
                        var indicatorId = indicateur.id;
                        var eval = note.note;
                        var label = objectifPrincipal.get('label').split(' ').splice(0, 5).join(' ');
                        main[idPrincipal] = main[idPrincipal] || { label: label, values:[]};
                        main[idPrincipal].values.push(eval);
                        indicators[indicatorId] = indicators[indicatorId] || { label: indicateur.get('key'), values:[]};
                        indicators[indicatorId].values.push(eval);
                    });
                });
                var mainLabel = [];
                var mainStats = [];
                Object.keys(main).forEach(function(key) {
                    var objValues = main[key];
                    mainLabel.push(objValues.label);
                    mainStats.push(objValues.values.reduce(add ,0) / objValues.values.length);
                });

                var indicatorsLabel = [];
                var indicatorsAverage = [];
                var indicatorsEcartType = [];

                Object.keys(indicators).forEach(function(key) {
                    var objValues = indicators[key];
                    indicatorsLabel.push(objValues.label);
                    var average = objValues.values.reduce(add, 0) / objValues.values.length;
                    indicatorsAverage.push(average);
                    var ecart = objValues.values.reduce(function(acc, value, i) {
                        var val = (value - average) * (value - average);
                        return acc + val;
                    });
                    indicatorsEcartType.push(Math.sqrt(ecart / objValues.values.length));

                });
                new Chart(getCanvas('mainRadar')).Radar({
                    labels: mainLabel,
                    datasets: [
                        {
                            label: "Objectifs Principaux",
                            fillColor: "rgba(220,220,220,0.2)",
                            strokeColor: "rgba(220,220,220,1)",
                            pointColor: "rgba(220,220,220,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(220,220,220,1)",
                            data: mainStats
                        }
                    ]
                }, chartOptions);

                new Chart(getCanvas('indicatorsBar')).Bar({
                    labels: indicatorsLabel,
                    datasets: [
                        {
                            label: "Moyenne",
                            fillColor: "rgba(220,220,220,0.5)",
                            strokeColor: "rgba(220,220,220,0.8)",
                            highlightFill: "rgba(220,220,220,0.75)",
                            highlightStroke: "rgba(220,220,220,1)",
                            data: indicatorsAverage
                        },
                        {
                            label: "Ecart Type",
                            fillColor: "rgba(151,187,205,0.5)",
                            strokeColor: "rgba(151,187,205,0.8)",
                            highlightFill: "rgba(151,187,205,0.75)",
                            highlightStroke: "rgba(151,187,205,1)",
                            data: indicatorsEcartType
                        }
                    ]
                }, chartOptions);

            }
        });
    }
});