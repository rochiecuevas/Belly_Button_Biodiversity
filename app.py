# Dependencies for data manipulation
import pandas as pd
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

# Flask set-up
app = Flask(__name__)

@app.route("/samples")
def samples():
    # Create session query that will load the whole Samples table (all columns)
    qrySamples = session.query(Samples)

    # Convert Samples to a pandas dataframe
    df_Samples = pd.read_sql(qrySamples.statement, qrySamples.session.bind)
    df_Samples.head() 

    # Calculate the abundance of each OTU_ID
    df_Samples["abundance"] = df_Samples.sum(axis = 1)
    df_Samples.head()

    df_sorted = df_Samples.sort_values(by = ["abundance"], ascending = False).head(10)

    # Prepare data from Samples for graphs and for JSON
    trace_Samples = {
        "labels": df_sorted["otu_id"].values.tolist(),
        "values": df_sorted["abundance"].values.tolist(),
        "type": "pie",
        "hoverinfo": df_sorted["otu_label"].values.tolist()
    }

    return jsonify(trace_Samples)

@app.route("/metadata")
def metadata():

    # Create a session query to get data for specific columns of the Metadata table
    qryMeta = session.query(Metadata)

    # Convert the query into a pandas dataframe
    df_Meta = pd.read_sql(qryMeta.statement, qryMeta.session.bind)
    df_Meta.head()

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

@app.route("/")
def home():
    message = "Belly Button Biodiversity"

    return render_template("index.html", message = message)

if __name__ == "__main__":
    app.run()
