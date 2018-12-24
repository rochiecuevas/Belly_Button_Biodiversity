// Set the url for the metadata and for the samples
var urlSamples = "/samples";
var urlMeta = "/metadata";

d3.json(urlSamples).then(function(trace){
    var data = [trace];
    console.log(data);

    var layout = {
        title: "Proportion of each OTU"
    }

    Plotly.newPlot("pie", data, layout)
});

d3.json(urlMeta).then(function(trace){
    var data = [trace];
    console.log(data);

    var sampleID = d3.select("#sample");
    var options = data[0]["sample"]; 
    console.log(options);
})