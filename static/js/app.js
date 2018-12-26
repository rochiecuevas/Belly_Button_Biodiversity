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
    optionsList.unshift("All");
    console.log(optionsList);

    // Populate the select field with each option from the option list
    var options = sampleID
        .selectAll("#id")
        .data(optionsList).enter()
        .append("option")
        .text(function(sample){
            return sample;
        })
        
    // Fill in the table with selected values
    // (1) Selection of a sample
    function handleChange(){
        var selection = sampleID.property("value"); // numbers
        console.log(selection); // number has been converted to string

        // (2) Change the url for the metadata (include sample)
        var urlMeta1 = `/metadata/${selection}`;
        console.log(urlMeta1)

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

    };
    sampleID.on("change", handleChange);

});