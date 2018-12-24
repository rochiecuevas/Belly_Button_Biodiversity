var url = "/samples"
d3.json(url).then(function(trace){
    var data = [trace];
    console.log(data);

    var layout = {
        title: "Proportion of bacteria"
    }

    Plotly.newPlot("pie", data, layout)
})