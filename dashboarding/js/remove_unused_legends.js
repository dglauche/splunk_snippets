// TODO: if you originally got a buch of legends the script does not take care
//       about altering the legend pagination.

require([
    'jquery',
    'splunkjs/mvc',
    'splunkjs/mvc/simplexml/ready!'
], function($, mvc) {

    search_jobs = [];
    // To apply the remove_unused_legends function to a finished search we look
    // for every search containing 'remove_unused_legends' within it's ID
    splunkjs.mvc.Components.getInstances().forEach(function(ini){
        if(String(ini.name).includes('remove_unused_legends')){
            search_jobs.push(ini);
        }
    });

    search_jobs.forEach(function(search_job, idx){
        search_job.on("search:done", function(props){
            setTimeout(remove_unused_legends, 1000);
        });
    });
});

function remove_unused_legends(){
    // Loop through all chard legends we can find
    $('g.highcharts-legend').each(function(idx, legend){
        used_color_map = new Map();

        // Within each legend we create a map of all series colors having a bbox > 0 (showing up in the chart)
        $(legend).parent().find('g.highcharts-series path.highcharts-graph').each(function(idx, graph){
            if (graph.getBBox().height > 0) {
                used_color_map.set(graph.getAttribute('fill'), 1);
            }
        });

        // As we now know which colors are used, we can delete all unused colors/series/legends
        $(legend).find('g.highcharts-legend-item > rect').each(function(idx, rect){
            // As the rect in the legend uses rgba instead of rgb as used within the chart, we have to strip some stuff
            // to find it in our map.
            
            if (!(used_color_map.has(rect.getAttribute('fill')))){
                $(rect).parent().remove();
            }

        });
    });
}

