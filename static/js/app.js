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
     
    // Fill in the table with selected values
    // (1) Selection of a sample
    function handleChange(){
        var selection = sampleID.property("value");
        console.log(selection);

        // (2) Filtering the table based on the values from the selection
        // Since the JSON object is a dictionary of lists, the index of the selected value must be determined

        var selIndex = optionsList.indexOf(selection)

        // (3) Get the values that match the index of the selected item in the array
        var tdAge = d3.select("#age");
        var tdGender = d3.select("#gender");
        var tdEvent = d3.select("#sampling-event");
        var tdBBType = d3.select("#bbtype");

        var catList = ["age", "gender", "sampling_event", "bbtype"]; // List of categories in the JSON object
        var tdList = [tdAge, tdGender, tdEvent, tdBBType]; // List of cells to be filled in

        for (var i = 0; i < tdList.length; i ++):
            console.log(tdList[i]);
            tdList[i].text = data[catList[i][selIndex]] // The value of td is the value in data that matches the selIndex


        };
        sampleID.on("change", handleChange);

    

});