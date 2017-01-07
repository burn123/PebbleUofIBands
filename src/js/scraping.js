/* jshint unused: false */

var ajax = require('ajax');
var Settings = require('settings');
require('./html_parse');
var scrape = {};

/**
 * Requests the given url, returning the html data to the callback
 */
scrape.requestSchedule = function(bandURL, bandName, callback) {
    if(bandURL == "") callback([{title: "Not Yet Available"}]);
    ajax({url: bandURL}, function(responseText) {
        var jsonData;
        try{
            jsonData = htmlToJson(responseText, bandName);
        }
        catch(e) {
            if(e.name == "SyntaxError") {
                console.error(e);
                jsonData = [{
                    title: "Invalid Url",
                    subtitle: "Contact Developer"
                }];
            }
        }
        
        callback(jsonData);
    });
};

function htmlToJson(htmlData, bandName) {
    var jsonData = HTMLtoJSON(htmlData).html.body, returnData = [{},{}];
    if(bandName == "Wind Symphony") {
        // Go to the element containing the important data
        jsonData = jsonData["div#layout-type-1"]["div#wrapper"]["div#content"]["div#content-middle"]["div#node-6#node#node-page#clearfix"]
                           ["div#content#clearfix"]["div#field#field-name-body#field-type-text-with-summary#field-label-hidden"]["div#field-items"]
                           ["div#field-item#even"]["div#content#clearfix"]["div#field#field-name-body#field-type-text-with-summary#field-label-hidden"]
                           ["div#field-items"]["div#field-item#even"];
        
        // The name of the day
        returnData[0].title     = jsonData.p.strong.text.split(",")[0];
        // What date it is
        returnData[0].subtitle  = jsonData.p.strong.text.split(",")[1].split("|")[0];
        // Holds the info for the pieces being played that day
        returnData[0].pieceInfo = [];
        returnData[1].title     = jsonData["p.1"].strong.text.split(",")[0];
        returnData[1].subtitle  = jsonData["p.1"].strong.text.split(",")[1].split("|")[0];
        returnData[1].pieceInfo = [];
        
        var dayIndex = 0;
        // Loop over the whole structure to look for the pieceInfo
        Object.keys(jsonData).forEach(function(outerKey, outerIndex) {
            // Only loop over elements containing what pieces are being played
            if(outerKey.split(".")[0] != "ul") return;
            Object.keys(jsonData[outerKey]).forEach(function(key, index) {
                if(key.split(".")[0] == "li") {
                    var pieceText = jsonData[outerKey][key].text || jsonData[outerKey][key].span.text;
                    // Split based on PM
                    pieceText = pieceText.split(/\s?[pP].?[mM].?\s?/);
                    returnData[dayIndex].pieceInfo.push({
                        title: pieceText[1],
                        subtitle: pieceText[0] + " PM"
                    });
                }
            });
            dayIndex++;
        });
    }
    return returnData;
}

module.exports = scrape;