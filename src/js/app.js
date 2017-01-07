var scrape = require('./scraping');
var UI = require('ui');
//var Vector2 = require('vector2');

var ensembleList = new UI.Menu({
    sections: [
        {
            title: 'Bands',
            items: [
                {title: 'Wind Symphony',dataee:"fun"},
                {title: 'Wind Orchestra'},
                {title: 'Hindsley'},
                {title: 'University Band'}
            ]
        },
        {
            title: 'Orchestras'
        }
    ]
});

ensembleList.on('select', function(e) {
    // Define the card used to show the schedule
    var daysInfo = new UI.Menu({
        sections: [{
            title: e.item.title,
            items: [{}]
        }]
    }),
        loadingItem = {
            title: 'Loading...',
        },
        url = "";
    
    switch(e.item.title) {
        case "Wind Symphony":
            url = 'http://bands.illinois.edu/content/wind-symphony-rehearsal-schedule';
            console.log(e.item.dataee);
            break;
        default:
            break;
    }
    daysInfo.items(0, [loadingItem]);
    scrape.requestSchedule(url, e.item.title, function(jsonData) {
        console.log('Got response: ' + JSON.stringify(jsonData));
        daysInfo.items(0, jsonData);
    });

    daysInfo.show();
    
    daysInfo.on('select', function(e) {
        var pieceInfo = new UI.Menu({
            sections: [{
                title: e.item.title + " - " + e.item.subtitle,
                items: e.item.pieceInfo
            }]
        });
        pieceInfo.show();
    });
    //console.log('SELECTED ITEM #' + e.itemIndex + ' of section #' + e.sectionIndex);
    //console.log('The item is titled "' + e.item.title + '"');
});

ensembleList.show();