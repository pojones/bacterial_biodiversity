function buildMetadata(sample) {
  d3.json("sampleData.json").then((data) => {
    var metadata = data.metadata;
    var filterMeta = metadata.filter(sampleObject => sampleObject.id == sample);
    var firstMeta = filterMeta[0];
    var PANEL = d3.select("#sample-metadata");
    PANEL.html("");

    Object.entries(firstMeta).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

function init() {
  var selector = d3.select("#selDataset");

  d3.json("sampleData.json").then((data) => {
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample); 
    });

  var firstSample = sampleNames[0];
  buildCharts(firstSample);
  buildMetadata(firstSample);
  });
}

init();

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
} 

function buildCharts(sample) {
  d3.json("sampleData.json").then((data) => { 
    var samples = data.samples;
    var resultsArray = samples.filter(sampleObject => sampleObject.id == sample);
    var result = resultsArray[0];

    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;
    
    var barData = [{
      y: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),  
      x: sample_values.slice(0, 10).reverse(),  
      text: otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h",
    }]; 
    var barLayout = [{
      title: "Top 10 Bacteria Cultures Found",
      autosize: false,
      width: 500,
      height: 500,
    }]; 

    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
        marker: {
          color: otu_ids,
          size: sample_values,
        }
      }];
    var bubbleLayout = [{
      title: "Bacteria Cultures Per Sample",
      automargin: true,
      xaxis: {title: "OTU ID"},
      hovermode: "closest",
    }];

    Plotly.newPlot('bar', barData, barLayout);
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    var metadata = data.metadata;
    var filterMeta = metadata.filter(sampleObject => sampleObject.id == sample);
    var Meta = filterMeta[0];
    var wFreq = parseFloat(Meta.wfreq);

    var gaugeData = [{
      type: "indicator",
      mode: "gauge+number",
      value: wFreq,
      gauge: {
        axis:{'range': [0, 10], 'tickwidth': 2, 'tickcolor': "black"},
        bar: {'color': "black"},
        steps: [
          {'range': [0, 2], 'color': "red"},
          {'range': [2, 4], 'color': "orange"},
          {'range': [4, 6], 'color': "yellow"},
          {'range': [6, 8], 'color': "lightgreen"},
          {'range': [8, 10], 'color': "green"},
        ]
      }
    }];
    var gaugeLayout = [{
      title: "Wash Frequency"
    }];
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}