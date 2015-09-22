var mandrill = require('mandrill-api/mandrill');
var config = require('./config');


var mandrill_client = new mandrill.Mandrill(config.mandrill.key);

/**
demo to send email
var to=[{
            "email": "abhishekm@globussoft.com",
            "name": "Recipient Name",
            "type": "to"
        }];
var mergers= [{
        "name": "name",
        "content": "merge1 content"
    }]  
var template_name="test";
var subject="test";
var from="hello@gmail.com";
var from_name="hello";

mandrill(template_name,subject,to,from,from_name,mergers);*/

/**
 * [api to send emails]
 * @param  {[string]} template_name [name of the template]
 * @param  {[string]} subject       [subject of email]
 * @param  {[array]} to            [send to]
 * @param  {[string]} from          [email of the sender]
 * @param  {[string]} from_name     [name of the sender]
 * @param  {[array]} mergers       [mergers]
 * @return {[string]}               [result]
 */
var mandril = function(template_name, subject, to, from, from_name, mergers) {     
    var template_content = [{
        "name": "name",
        "content": "hello"
    }];
    var message = {
        "subject": subject,
        "from_email": from,
        "from_name": from_name,
        "to": to,
        "headers": {
            "Reply-To": "admin@admin.com"
        },
        "important": false,
        "track_opens": null,
        "track_clicks": null,
        "auto_text": null,
        "auto_html": null,
        "inline_css": null,
        "url_strip_qs": null,
        "preserve_recipients": null,
        "view_content_link": null,
        // "bcc_address": "abhishekm@globussoft.com",
        "tracking_domain": null,
        "signing_domain": null,
        "return_path_domain": null,
        "merge": true,
        "merge_language": "mailchimp",
        "global_merge_vars": mergers
    };
    var async = false;
    var ip_pool = "Main Pool";
    mandrill_client.messages.sendTemplate({
        "template_name": template_name,
        "template_content": template_content,
        "message": message,
        "async": async,
        "ip_pool": ip_pool
    }, function(result) {
        console.log(result);
    }, function(e) {
        // Mandrill returns the error as an object with name and message keys
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
    });

};

module.exports = mandril;


