// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
/*
 Parse.Cloud.define("hello", function(request, response) {
 response.success("Hello world!");
 });
 */
var Mailgun = require('mailgun');
Mailgun.initialize('sandbox8a0435ed88e645658ccd1379df1355cb.mailgun.org', 'key-4b6839419c49a3aca93ae5192f2f685e');

Parse.Cloud.afterSave("Group", function (request) {
    var group = request.object;
    Mailgun.sendEmail({
        to: group.get('mail'),
        from: "no-reply@cresol.fr",
        subject: "Accès au groupe créé, pour le référentiel d'action PTCE",
        text: "Voici les accés : "+
                "http://dev-cresol-ref.parseapp.com/gestion.html?groupId="+ group.id
    }, {
        success: function (httpResponse) {
            console.log(httpResponse);
        },
        error: function (httpResponse) {
            console.error(httpResponse);
        }
    });
});
Parse.Cloud.afterSave("Particpant", function (request) {
    var participant = request.object;
    Mailgun.sendEmail({
        to: participant.get('mail'),
        from: "no-reply@cresol.fr",
        subject: "Accès au questionnaire du référentiel d'action PTCE",
        text: "Voici les accés : "+
                "http://dev-cresol-ref.parseapp.com/notes.html?groupId="+ participant.group.id
    }, {
        success: function (httpResponse) {
            console.log(httpResponse);
        },
        error: function (httpResponse) {
            console.error(httpResponse);
        }
    });
});