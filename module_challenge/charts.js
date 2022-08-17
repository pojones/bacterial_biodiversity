// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("sampleData.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultsArray = samples.filter(sampleObject => sampleObject.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = resultsArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    console.log(otu_ids);

    var otu_labels = result.otu_labels;
    console.log(otu_labels);

    var sample_values = result.sample_values;
    console.log(sample_values);
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    // 8. Create the trace for the bar chart. 
    var barData = [{
      y: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),  
      x: sample_values.slice(0, 10).reverse(),  
      text: otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h",
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Bar Chart",
      autosize: false,
      width: 500,
      height: 500,
      //xaxis: {titles: "Values"},
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout);

    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
        marker: {
          color: otu_ids,
          size: sample_values,
        }
    }]
    var bubbleLayout = {
      margin: {t: 0},
      xaxis: {title: "OTU ID"},
      hovermode: "closest",
    }
    Plotly.newPlot('bubble', bubbleData, bubbleLayout)
  });
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("sampleData.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var filterMeta = metadata.filter(sampleObject => sampleObject.id == sample);
    var firstMeta = filterMeta[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(firstMeta).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("sampleData.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample); 
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
} 

// Initialize the dashboard
init();