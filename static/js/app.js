// Step 1
// Used D3 fetch to read the JSON file and check structure of data by printing to the console.
d3.json("data/samples.json").then((importedData) => {
  console.log(importedData);
});

// Step 2
// To build the dashboard, need data for the Demographics Table and data for the Plots which will change based on id.
// So will create one function for the Demographics data (Step 2a) and one function for the Plots data (Step 2b).

// Step 2a
// Demographics function
function buildDemographics(id) {
  d3.json("data/samples.json").then((data) => {
    var metadata = data.metadata
    var arr = metadata.filter(object =>
      object.id == id);
    var result = arr[0]
    var panel = d3.select("#sample-metadata");
    panel.html("");
    Object.entries(result).forEach(([key,value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });
  });
};

// Step 2b
// Plots function
function buildPlots(id) {
  d3.json("data/samples.json").then((data) => {
    var samples = data.samples;
    var arr = samples.filter(object => object.id == id);
    var result = arr[0]
    var ids = result.otu_ids;
    var values = result.sample_values;
    var labels = result.otu_labels;

    // Build the Bar Chart
    var barData = [
      {
        y: ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
        x: values.slice(0,10).reverse(),
        text: labels.slice(0,10).reverse(),
        type: "bar",
        orientation: "h"
      }
    ];

    var barLayout = {
      title: "Top 10 Bacterial Species Present",
      xaxis: {title: "Relative Bacterial Count"}
    };

    Plotly.newPlot("bar",barData,barLayout);

    // Build the Bubble Chart
    var bubbleData = [
      {
        x: ids,
        y: values,
        text: labels,
        mode: "markers",
        marker: {
          color: ids,
          size: values
        }
      }
    ];

    var bubbleLayout = {
      title: "Bubble Chart of Bacterial Species Present",
      yaxis: { title: "Relative Bacterial Count"},
      xaxis: { title: "OTU ID" },
      hovermode: "closest",
    };

    Plotly.newPlot("bubble",bubbleData,bubbleLayout);

  });
};


// Step 3
// Create an initialisation function that will create the idNumber list in the drop down menu and 
// grab the first id (index=0) to populate the web page Demographics and Plots on start-up.

// Initialisation function
function init() {
  var option = d3.select("#selDataset");

  d3.json("data/samples.json").then((data) => {
    var idNumber = data.names;
    idNumber.forEach((id) => {
      option
        .append("option")
        .text(id)
        .property("value",id);
    });

    const firstIdNumber = idNumber[0];
    buildDemographics(firstIdNumber);
    buildPlots(firstIdNumber);
  });
};

// Step 4
// Create the Option Change function that will trigger the Demographics funtion and Plots function when 
// a change occurs in the id drop down menu.

// Dropdown Option Change function
function optionChanged(newIdNumber) {
  buildDemographics(newIdNumber);
  buildPlots(newIdNumber);
};

// Step 5
// Initialise the dashboard
init();