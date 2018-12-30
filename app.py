# Dependencies for data manipulation
import pandas as pd
import numpy as np
import simplejson

# Dependencies for SQL
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, inspect, distinct

from flask import Flask, request, jsonify, render_template,json

# Create an engine
engine = create_engine("sqlite:///db/bellybutton.sqlite", echo = False)

# Create a database model
Base = automap_base() # Reflect an existing database into a new model
Base.prepare(engine, reflect = True) # Prepare the database
Base.classes.keys() # Find all the tables (classes) that automap found

# Save references for each table
Metadata = Base.classes.sample_metadata
Samples = Base.classes.samples

# Create a session (link) between Python and the sqlite database
session = Session(engine)

# Create session query that will load the whole Samples table (all columns)
qrySamples = session.query(Samples)

# Convert Samples to a pandas dataframe
df_Samples = pd.read_sql(qrySamples.statement, qrySamples.session.bind)

# Drop rows with at least one element missing
df_Samples = df_Samples.dropna()
df_Samples.head() 

# Create a session query to get data for specific columns of the Metadata table
qryMeta = session.query(Metadata)

# Convert the query into a pandas dataframe
df_Meta = pd.read_sql(qryMeta.statement, qryMeta.session.bind)
df_Meta.head()

# Flask set-up
app = Flask(__name__)

@app.route("/samples")
def samples():

    # Calculate the abundance of each OTU_ID
    df_Samples["abundance"] = df_Samples.sum(axis = 1)
    df_Samples.head()

    df_sorted = df_Samples.sort_values(by = ["abundance"], ascending = False)

    x = df_sorted["otu_id"].values.tolist()
    y = df_sorted["abundance"].values.tolist()
    z = df_sorted["otu_label"].values.tolist()
    y2 = [x/1000 for x in df_sorted["abundance"].values]

    # Prepare data from Samples for graphs and for JSON
    trace_Samples = {
        "labels": z,
        "values": y,
        "labels2": x,
        "marker_size": y2
    }

    return jsonify(trace_Samples)

@app.route("/samples/<sample>")
def samples1(sample):

    # Retain only the column corresponding to the selected sample and information about it (top 10 for pie chart)

    df_sorted = df_Samples[["otu_id", "otu_label",str(sample)]].sort_values(by = [str(sample)], ascending = False)

    x = df_sorted["otu_id"].values.tolist()
    y = df_sorted[str(sample)].values.tolist()
    z = df_sorted["otu_label"].values.tolist()

    # Prepare data from Samples for graphs and for JSON
    trace_Samples = {
        "sample": sample,
        "labels": z,
        "values": y,
        "labels2": x,
        "marker_size": y
    }

    return jsonify(trace_Samples) 

    # Retain only the column corresponding to the selected sample and information about it (all otu_ids for bar chart)

    df_sorted1 = df_Samples[["otu_id", "otu_label",str(sample)]].sort_values(by = [str(sample)], ascending = False)

    # Prepare data from Samples for graphs and for JSON
    trace_Samples2 = {
        "sample": sample,
        "labels": df_sorted1["otu_id"].values.tolist(),
        "values": df_sorted1[str(sample)].values.tolist(),
        "type": "pie",
    }

    return jsonify(trace_Samples2)  

@app.route("/metadata")
def metadata():

    # Prepare the trace from Metadata for graphs and for JSON
    trace_Meta = {
        "sample": df_Meta["sample"].values.tolist(),
        "ethnicity": df_Meta["ETHNICITY"].values.tolist(),
        "age": df_Meta["AGE"].values.tolist(),
        "gender": df_Meta["GENDER"].values.tolist(),
        "bbtype": df_Meta["BBTYPE"].values.tolist(),
        "wfreq": df_Meta["WFREQ"].values.tolist(),
        "sampling_event": df_Meta["EVENT"].values.tolist(),
        "location": df_Meta["LOCATION"].values.tolist(),
    }

    # Convert dictionary to JSON string
    jsonStr = simplejson.dumps(trace_Meta, ignore_nan = True)

    # Parse JSON string to get JSON object
    jsonObj = json.loads(jsonStr)

    return jsonify(jsonObj)

@app.route("/metadata/<sample>")
def metadata1(sample):

    # Create a session query to get data for specific columns of the Metadata table
    sel = [Metadata.sample, Metadata.ETHNICITY, Metadata.AGE, Metadata.GENDER, Metadata.BBTYPE, Metadata.WFREQ, Metadata.EVENT, Metadata.LOCATION]

    results = session.query(*sel).filter(Metadata.sample == sample).all()

    # Prepare the trace from Metadata for graphs and for JSON
    trace_Meta = {
        "sample": results[0][0],
        "ethnicity": results[0][1],
        "age": results[0][2],
        "gender": results[0][3],
        "bbtype": results[0][4],
        "wfreq": results[0][5],
        "sampling_event": results[0][6],
        "location": results[0][7]
    }

    # Convert dictionary to JSON string
    jsonStr = simplejson.dumps(trace_Meta, ignore_nan = True)

    # Parse JSON string to get JSON object
    jsonObj = json.loads(jsonStr)

    return jsonify(jsonObj)


@app.route("/")
def home():
    message = "Belly Button Biodiversity"

    return render_template("index.html", message = message)

if __name__ == "__main__":
    app.run()
