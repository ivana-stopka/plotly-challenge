// Used D3 fetch to read the JSON file and check structure of data by printing to the console.
d3.json("data/samples.json").then((importedData) => {
  console.log(importedData);
});

// To build the dashboard, need data for the Demographics Table and data for the Plots which will change based on id.
// So will create a function for the Demographics data and a function for the Plots data.

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
      panel.append("h6").text(`${key}:${value}`);
    });
  });
}

// Plots function

// Initialisation function
function init() {
  var menu = d3.select("#selDataset");

  d3.json("data/samples.json").then((data) => {
    var sampleNumber = data.names;
    sampleNumber.forEach((id) => {
      menu
        .append("option")
        .text(id)
        .property("value",id);
    });

    const firstSampleNumber = sampleNumber[0];
    buildDemographics(firstSampleNumber);
  });
}

// Menu Change function
function menuChange(newSampleNumber) {
  buildDemographics(newSampleNumber);
}

// Initialise dashboard
init();