// Create a function to read the json file 
function getData(sample) {

  d3.json("samples.json").then((data) => {
        
    var metadata = data.metadata;

    // Helper function to select data
        // index 0 - id
        // index 1 - idethnicity
        // index 2 - gender
        // index 3 - age
        // index 4 - location
        // index 5 - bbtype
        // index 6 - wfreq
        
        // Only return the value of the selected bacteria sample 
    var metadataArray = metadata.filter(bacteria => bacteria.id == sample);
    var TestSubjectId = metadataArray[0];

        // Use d3 to select the panel 
    PanelInformation = d3.select("#sample-metadata");

        // To clear any existing values
    PanelInformation.html("");

        // To add each key and value pair to the panel 
    Object.entries(TestSubjectId).forEach(([key, value]) => {
      
      //  To append the h5 element to the panel and demonstrate the text property
      PanelInformation.append("h5").text(`${key} : ${value}`);
    });

    });
}

// Create a function to produce the bubble and bar graphs
function buildPlot(sample) {

  // Again, using the data from the 'samples.json' file
  d3.json("samples.json").then((data) => {
 
    var samples = data.samples;
    var samplesArray = samples.filter(bacteria => bacteria.id == sample);
    var bacteriaSampleId = samplesArray[0];

 
    var otu_ids = bacteriaSampleId.otu_ids; 
    var otu_labels = bacteriaSampleId.otu_labels; 
    var sample_values = bacteriaSampleId.sample_values;


    // Use slice() to get the top 10 OTUs values
    var Top10OTUs = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
        
    var barData = [{ 
      x: sample_values.slice(0,10).reverse(),
      y: Top10OTUs,
      text: otu_labels.slice(0,10).reverse(),
      type: "bar",
      marker: {
          color: otu_ids,
          colorscale: "Portland"
      },
      orientation : "h"}];
    
    var barLayout = {
      
      title: "Top 10 OTUs Found In A Certain Individual",
    };
    
    Plotly.newPlot("bar", barData, barLayout);

  // Create a bubble chart that displays each sample

  var bubbleData = [{ 
                   
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
              size: sample_values,
              color: otu_ids,
              colorscale: "Portland",
              showscale: true,
              colorbar: {
                  thickness: 5,
                  y: 0.5,
                  ypad: 0,
                  titleside: 'bottom',
                  outlinewidth: 1,
                  outlinecolor: 'black',
                  tickfont: {
                    family: 'Lato',
                    size: 14,
                    color: 'black'}
                }
            }
  }];
  
  var bubbleLayout = {

    title: "Belly Button Biodiversity Bubble Chart",
    hovermode: "closest",
    xaxis: {title: "OTU ID"}
  };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  });
}

// To execute program
function init() {
  
  var selectSample = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
      
    var bacteriaName = data.names;

    // creating options for the drop down list by appending options
    // with the text element and value as 'sample'
    bacteriaName.forEach((sample) => {
      selectSample
        .append("option")
        .text(sample)
        .property("value", sample)
    });

    // To use the first sample to show the plots that people will see
    var defaultSelection = bacteriaName[0];
    buildPlot(defaultSelection)
    getData(defaultSelection);
  });
};


function optionChanged(newSample) {
  buildPlot(newSample);
  getData(newSample);
}


init();