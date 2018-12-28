// Set the urls for the metadata and for the samples (all)
var urlSamples = "/samples";
var urlMeta = "/metadata";

d3.json(urlSamples).then(function(trace){
    var data = [trace];
    data[0]["type"] = "pie";
    data[0]["labels"] = data[0]["labels"].slice(0,10);
    data[0]["values"] = data[0]["values"].slice(0,10);
    data[0]["hoverinfo"] = "label";
    console.log(data);

    var layout = {
        title: `Proportion of the top 10 OTU in all samples`,
        showlegend: false
    }

    Plotly.newPlot("pie", data, layout)
});

d3.json(urlSamples).then(function(trace){
    var data = [trace];
    data[0]["type"] = "scatter";
    data[0]["mode"] = "markers";
    data[0]["x"] = data[0]["labels2"];
    data[0]["y"] = data[0]["values"];
    data[0]["marker"] ={"size": data[0]["marker_size"].slice(0,20)};
    data[0]["x"] = data[0]["x"].slice(0,20);
    data[0]["y"] = data[0]["y"].slice(0,20);
    delete data[0]["labels"];    // Remove the variables for pie chart
    delete data[0]["values"];    // Remove the variables for pie chart
    console.log(data);

    var layout = {
        title: "Frequencies of the top 20 OTUs",
        xaxis: {title: "OTU_ID"},
        yaxis: {title: "Frequencies of each OTU_ID"}
    }

    Plotly.newPlot("bar", data, layout)
});

// When a selection has been made
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
        .attr("id", "options")

    // Disable the "All" option
    document.getElementById("All").disabled = true;    

    // Fill in the table with selected values
    // (1) Selection of a sample
    function handleChange(){
        var selection = sampleID.property("value"); // numbers
        console.log(selection); // number has been converted to string

        // (2) Change the url for the metadata (include sample)
        var urlMeta1 = `/metadata/${selection}`;
        console.log(urlMeta1);

        // (3) Use the new url to populate the HTML table
        d3.json(urlMeta1).then(function(trace){
            var data = [trace];

            // Get the values that match the index of the selected item in the array
            var tdAge = d3.select("#age");
            var tdGender = d3.select("#gender");
            var tdEvent = d3.select("#sampling-event");
            var tdBBType = d3.select("#bbtype");
            var tdLocation = d3.select("#location");
            var tdID = d3.select("#id");

            var tdList = [tdAge, tdBBType, tdEvent, tdGender, tdID, tdLocation];
            var catList = ["age", "bbtype", "sampling_event", "gender", "sample", "location"];

            // Populate the HTML table with the values from the data array
            for (var i = 0; i < tdList.length; i ++){
                tdList[i].text(data[0][catList[i]])
            };
            });

        // (4) Change the url for the sample data
        var urlSamples1 = `/samples/${selection}`;
        console.log(urlSamples1);

        // (5) Use the new URL to create the pie chart
        d3.json(urlSamples1).then(function(trace){
            var data = [trace];
            data[0]["type"] = "pie";
            data[0]["labels"] = data[0]["labels"].slice(0,10);
            data[0]["values"] = data[0]["values"].slice(0,10);
            data[0]["hoverinfo"] = "label";
            console.log(data);
        
            var layout = {
                title: `Proportion of the top 10 OTU in Sample ${selection}`,
                showlegend: false
            };
        
            Plotly.newPlot("pie", data, layout)
        });

        // (6) Us the new URL to create a bar chart
        d3.json(urlSamples1).then(function(trace){
            var data = [trace];
            data[0]["type"] = "scatter";
            data[0]["mode"] = "markers";
            data[0]["x"] = data[0]["labels2"];
            data[0]["y"] = data[0]["values"];
            data[0]["marker"] ={"size": data[0]["marker_size"].slice(0,20)};
            data[0]["x"] = data[0]["x"].slice(0,20);
            data[0]["y"] = data[0]["y"].slice(0,20);
            delete data[0]["labels"];    // Remove the variables for pie chart
            delete data[0]["values"];    // Remove the variables for pie chart
            console.log(data);

            var layout = {
                title: `Frequencies of the top 20 OTUs in Sample ${selection}`,
                xaxis: {title: "OTU_ID"},
                yaxis: {title: "Frequencies of each OTU_ID"}
            };
        
            Plotly.newPlot("bar", data, layout)
        });
        
    };
    sampleID.on("change", handleChange);

});