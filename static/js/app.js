// Set the url for the metadata and for the samples
var urlSamples = "/samples";
var urlMeta = "/metadata";

d3.json(urlSamples).then(function(trace){
    var data = [trace];
    console.log(data);

    var layout = {
        title: "Proportion of the top 10 OTU in Sample xxx"
    }

    Plotly.newPlot("pie", data, layout)
});

d3.json(urlMeta).then(function(trace){
    var data = [trace];
    console.log(data);

    var sampleID = d3.select("#sample");

    // Create a list of sample IDs that the reader can choose from in the select field
    var optionsList = data[0]["sample"]; 
    console.log(optionsList);

    // Populate the select field with each option from the option list
    var options = sampleID
        .selectAll("#id")
        .data(optionsList).enter()
        .append("option")
        .text(function(sample){
            return sample;
        })
     
    // Fill in the table
    
});