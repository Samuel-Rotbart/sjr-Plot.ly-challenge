var json_path = './samples.json'
// plotData for the highest number subject 940
plotData('940');
//create and optionChanged function that will run the new functions when the ID in the dropdown is changed
function optionChanged(){
    var dropdownMenu = d3.select('#selDataset');
    var subjectID = dropdownMenu.property('value');
// run the plot data function (which includes the dropdownValue function)
    plotData(subjectID);
};
// Create a function to build the dropdown list and populate the Demographic Info
function dropdownValue(subjectID){
    d3.json(json_path).then(function(data) {
        var samples = data.samples;
        var idList=[];
// Create a list of IDs to put into the dropdown box
        for (var i=0; i<samples.length; i++){
            idList.push(samples[i].id);
        };
        var data = data
        idList.forEach(function(d){
            d3.select('#selDataset')
            .append('option')
            .attr('value',d)
            .text(`BB_${d}`);
        });
// Loop through the data data.metadata and data.samples to grab necessary data for the demographic info table
        subject_id = subjectID;
        for (var i=0;i<data.samples.length;i++){
            if (subject_id == data.samples[i].id) {            
                id = data.metadata[i].id;
                ethnicity = data.metadata[i].ethnicity;
                gender = data.metadata[i].gender;
                age = data.metadata[i].age;
                subLocation = data.metadata[i].location;
                bbtype = data.metadata[i].bbtype;
                wfreq = data.metadata[i].wfreq;
// Grab the sample-metadata ID from the html file and append all of the demographic data
            d3.select('#sample-metadata').html('');
// Populate the demographic info table
            d3.select('#sample-metadata')
                .data(data.metadata)
                .append('p')
                .text(`ID: ${id}`)
                .append('p')
                .text(`Ethnicity: ${ethnicity}`)
                .append('p')
                .text(`Gender: ${gender}`)
                .append('p')
                .text(`Age: ${age}`)
                .append('p')
                .text(`Location: ${subLocation}`)
                .append('p')
                .text(`bbType: ${bbtype}`)
                .append('p')
                .text(`wFreq: ${wfreq}`);
            };
        };
    });
};
function plotData(subjectID){
// run dropdownValue function to populate the dropdown list and the Demographic info table
    dropdownValue(subjectID);
// using d3.json, pull the data needed to plot the bar, bubble and gauge plotly plots
    d3.json(json_path).then(function(data) {
        var samples = data.samples;
        subject_id = subjectID;
        for (var i=0;i<data.samples.length;i++){
            if (subject_id == data.samples[i].id) {
                otu_ids = data.samples[i].otu_ids;
                sample_values = data.samples[i].sample_values;
                otu_labels = data.samples[i].otu_labels;
                wfreq = data.metadata[i].wfreq;
            };
        };
// loop through the otu_ids to create a "Text" version of the ID. Without the text version, my chart kept looking messed up
        var otu_id_list = [];
        for (var i=0;i<otu_ids.length;i++){
            otu_id_list[i] = `OTU ${otu_ids[i]}`
        }
// create variables to use in the bar chart
        var tenSampleValues = sample_values.slice(0,10);
        var tenIDs = otu_id_list.slice(0,10);
        var tenLables = otu_labels.slice(0,10);

// Create Bar chart for top 10 OTUs
        var trace1 = {
            type: 'bar',
            name: subject_id,
            x: tenSampleValues,
            y: tenIDs,
            text: tenLables,
            orientation: 'h'
        }
        var dataPlot = [trace1]
        var layout = {
            title: `Top 10 OTUs for Subject ID ${subject_id}`,
            yaxis: {autorange: 'reversed'}
        };
        Plotly.newPlot('bar',dataPlot,layout);
// Create gauge using Wash frequency data
        var gaugeData = [
            {
              domain: { x: [0, 1], y: [0, 1] },
              value: wfreq,
              title: { text: "Wash Frequency" },
              type: "indicator",
              mode: "gauge+number+bar",
              gauge: {
                axis: { range: [null, 9] }                
              }
            }
          ];
          
          var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
          Plotly.newPlot('gauge', gaugeData, layout);
// Create Bubble cart using sample data and otu ids/labels
        var bubbleTrace = [{
            text: otu_labels,
            mode: 'markers',
            x: otu_ids,
            y: sample_values,
            marker: {
                size: sample_values,
                color: otu_ids,
            }
        }];
        var bubbleLayout = {
            showlegend: false,
            };
        Plotly.newPlot('bubble',bubbleTrace,bubbleLayout);
    });
};
