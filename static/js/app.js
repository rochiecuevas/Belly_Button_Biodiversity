// Set the urls for the metadata and for the samples (all)
var urlSamples = "/samples";
var urlMeta = "/metadata";

// Create a pie chart
d3.json(urlSamples).then(function(trace){
    var data = [trace];
    data[0]["type"] = "pie";
    data[0]["labels"] = data[0]["labels"].slice(0,10);
    data[0]["values"] = data[0]["values"].slice(0,10);
    data[0]["hoverinfo"] = "label";
    console.log(data);

    var layout = {
        title: `Proportions of the top 10 OTU in all samples`,
        showlegend: false
    }

    Plotly.newPlot("pie", data, layout)
});

// Create a bubble chart
d3.json(urlSamples).then(function(trace){
    var data = [trace];
    data[0]["type"] = "scatter";
    data[0]["mode"] = "markers";
    data[0]["x"] = data[0]["labels2"];
    data[0]["y"] = data[0]["values"];
    data[0]["text"] = data[0]["labels"];
    data[0]["marker"] ={
        "size": data[0]["marker_size"].slice(0,20),
        "color":data[0]["labels2"].slice(0,20)
        };
    data[0]["x"] = data[0]["x"].slice(0,20); // Retain only the top 20 OTUs
    data[0]["y"] = data[0]["y"].slice(0,20); // Retain only the top 20 OTUs
    data[0]["text"] = data[0]["labels"].slice(0,20); // Retain only the top 20 OTUs
    delete data[0]["labels"];    // Remove the variables for pie chart
    delete data[0]["values"];    // Remove the variables for pie chart
    console.log(data);

    var layout = {
        title: "Frequencies of the top 20 OTUs",
        xaxis: {title: "OTU_ID"},
        yaxis: {
            title: "Frequencies of each OTU_ID",
            range: [0, 20000]
        }
    }

    Plotly.newPlot("bubble", data, layout)
});

// Use the metadata
d3.json(urlMeta).then(function(trace){
    var data = [trace];
    console.log(data);

    // STATIC CHARTS
    // (1) histogram for age distribution
    var trace_age = {
        x: data[0]["age"],
        type: "histogram",
        marker: {
            color: "green"
        }
    };

    var data_age = [trace_age];

    var layout_age = {
        xaxis: {title: "Age"},
        yaxis: {title: "Frequency"}
    };

    Plotly.newPlot("hist_age", data_age, layout_age);

    // (2) histogram for wash frequency distribution
    var trace_wash = {
        x: data[0]["wfreq"],
        type: "histogram",
        marker: {
            color: "orange"
        }
    };

    var data_wash = [trace_wash];

    var layout_wash = {
        xaxis: {title: "Washing Frequency"},
        yaxis: {
            title: "Frequency"
        }
    };

    Plotly.newPlot("hist_wash", data_wash, layout_wash);

    // (3) bar graph for number of male and female participants
    var male = [];
    var female = [];
    var gender = data[0]["gender"];

    for (var i = 0; i < gender.length; i ++){
        if ((gender[i] == "F")|| (gender[i] == "f")){
            female.push(gender[i])
        } else if ((gender[i] == "M")|| (gender[i] == "m")){
            male.push(gender[i])
        };   
    };
    console.log(male);
    console.log(female); 

    var trace_gender = {
        x: ["male", "female"],
        y: [male.length, female.length],
        type: "bar",
        marker: {
            color: "indigo"
        }
    };
    console.log(trace_gender);

    var data_gender = [trace_gender];

    var layout_gender = {
        xaxis: {title: "Gender"},
        yaxis: {title: "Frequency"}
    };

    Plotly.newPlot("bar_gender", data_gender, layout_gender);    

    // (4) bar graph for number of participants in the events
    var event = data[0]["sampling_event"];
    console.log(event);

    // (4a) Create a function that counts events
    event_count = {};
    
    for (var j = 0; j < event.length; j ++){
        if (event_count[event[j]]){
            event_count[event[j]] += 1;
        } else {
            event_count[event[j]] = 1;
        }
    };
        
    console.log(event_count);
    
    // (4b) Create lists of events and counts for the bar graph of events
    var events = [];
    var counts = [];
   
    Object.entries(event_count).forEach(function([key,value]){
        events.push(key);
        counts.push(value);
    });

    var events2 = [];
    for (var k = 0; k < events.length; k ++){
        events2.push(events[k].replace("BellyButtons", ""));
    }

    console.log(events);
    console.log(counts);
    console.log(events2);

    // (4c) Create bar graphs
    var trace_events = {
        x: events2,
        y: counts,
        type: "bar",
        marker: {
            color: "cyan"
        }
    };

    var data_events = [trace_events];
    console.log(data_events);

    var layout_events = {
        xaxis: {
            title: "Event",
            automargin: true
        },
        yaxis: {title: "Number of volunteers"}
    };

    Plotly.newPlot("bar_event", data_events, layout_events);

    // (5) bar graph for ethnicities
    var ethnicities = data[0]["ethnicity"];
    console.log(ethnicities);

    // (5a) Create a function that counts events
    ethnicity_count = {};

    for (var j = 0; j < ethnicities.length; j ++){
        if (ethnicity_count[ethnicities[j]]){
            ethnicity_count[ethnicities[j]] += 1;
        } else {
            ethnicity_count[ethnicities[j]] = 1;
        }
    };
        
    console.log(ethnicity_count);

    // (5b) Create lists of events and counts for the bar graph of events
    var races = [];
    var raceCounts = [];

    Object.entries(ethnicity_count).forEach(function([key,value]){
        races.push(key);
        raceCounts.push(value);
    });

    console.log(races);
    console.log(raceCounts);

    // (5c) Create bar graphs
    var trace_ethnicities = {
        x: races,
        y: raceCounts,
        type: "bar",
        marker: {
            color: "grey"
        }
    };

    var data_ethnicities = [trace_ethnicities];
    console.log(data_ethnicities);

    var layout_ethnicities = {
        xaxis: {
            title: "Ethnicity",
            automargin: true
        },
        yaxis: {title: "Number of volunteers"}
    };

    Plotly.newPlot("bar_ethnicity", data_ethnicities, layout_ethnicities);

    // (6) scatter plot for age vs wash frequency
    var trace_corr = {
        x: data[0]["age"],
        y: data[0]["wfreq"],
        type: "scatter",
        mode: "markers"
    }

    var data_corr = [trace_corr];

    var layout_corr = {
        xaxis: {title: "Age"},
        yaxis: {title: "Wash frequency"}
    }

    Plotly.newPlot("corr", data_corr, layout_corr);

    // When a selection has been made
    // Define a variable for sample/participant ID
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
                title: `Proportions of the top 10 OTU in Sample ${selection}`,
                showlegend: false
            };
        
            Plotly.newPlot("pie", data, layout)
        });

        // (6) Use the new URL to create a bubble chart
        d3.json(urlSamples1).then(function(trace){
            var data = [trace];
            data[0]["type"] = "scatter";
            data[0]["mode"] = "markers";
            data[0]["x"] = data[0]["labels2"];
            data[0]["y"] = data[0]["values"];
            data[0]["text"] = data[0]["labels"];
            data[0]["marker"] ={
                "size": data[0]["marker_size"].slice(0,20),
                "color": data[0]["labels2"].slice(0,20)
                };
            data[0]["x"] = data[0]["x"].slice(0,20); // Retain only the top 20 OTUs
            data[0]["y"] = data[0]["y"].slice(0,20); // Retain only the top 20 OTUs
            data[0]["text"] = data[0]["labels"].slice(0,20); // Retain only the top 20 OTUs
            delete data[0]["labels"];    // Remove the variables for pie chart
            delete data[0]["values"];    // Remove the variables for pie chart
            console.log(data);

            var layout = {
                title: `Frequencies of the top 20 OTUs in Sample ${selection}`,
                xaxis: {title: "OTU_ID"},
                yaxis: {
                    title: "Frequencies of each OTU_ID"
                }
            };
        
            Plotly.newPlot("bubble", data, layout)
        });

    };
    sampleID.on("change", handleChange);

});