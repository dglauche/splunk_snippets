// I know there is a way to set the result count after a search finishes. Someone could try to calculate the panel
// sized based on that. Unfortunately that's getting quite hard if you're dealing with trellis charts.
// And to be honest I got no clue how to figure out which search is filling which panel...

resultCount = null
require([
    'jquery',
    'splunkjs/mvc',
    'splunkjs/mvc/simplexml/ready!'
], function($, mvc) {

    search_jobs = [];
    // To apply the resizePanel function to a finished search we look
    // for every search containing 'resize' within it's ID
    splunkjs.mvc.Components.getInstances().forEach(function(ini){
        if(String(ini.name).includes('resize')){
            search_jobs.push(ini);
        }
    });

    search_jobs.forEach(function(search_job, idx){
        search_job.on("search:done", function(props){
            resultCount = props.content.resultCount
            setTimeout(resizePanel, 1000);
        });
    });
});

function resizePanel(){

    // Stuff I don't want to explain cause I figured it out mainly by fiddling
    // around with the DOM
    $(".dashboard-panel .splunk-view").each(function(idx, view){

        // If we find a centered splunk message we assume that it's the "No data found message"
        // I found no better way to keep it language independant
        view = $(view);
        splunk_messages = view.find('div.splunk-message-container').not('.compact')
        if (splunk_messages.length == 1 && splunk_messages.css('justify-content') == 'center'){
            console.log('resizing to empty panel!');
            view.height("200px");
            view.children('div.splunk-viz-msg').height('100%');
            return;
        }

        // Now we are pretty sure that there are actually some charts
        console.log('resizing to full size!');
        view.height("auto");
        facets_container = view.find(".facets-container")
        facets_container.height('auto');
        facets_container.height(facets_container.height()+50);

    });
   

    $(".splunk-view div.shared-reportvisualizer").each(function(idx, ele){
        ele = $(ele);
        ele.animate({
            height: ele.find(".facets-container").height()
        }, 1000, null);
    });
}
