# Dependencies for data manipulation
import pandas as pd

# Dependencies for SQL
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, inspect, distinct

# Dependencies for Flask
from flask import Flask, jsonify, render_template

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

# Construct an instance of Flask
app = Flask(__name__)

# Create the database tables
@app.before_first_request
def setup():
    # Recreate the database each time 
    Base.create_all()

@app.route("/")
def home():
    """Render graphs in index.html"""

    return render_template("index.html")   

@app.route("/metadata/")
def meta():
    """Returns participant metadata as a JSON object."""

    # Create a session query to get data for specific columns of the Metadata table
    qryMeta = session.query(Metadata.sample, Metadata.ETHNICITY, Metadata.AGE, Metadata.GENDER, Metadata.BBTYPE, Metadata.WFREQ, Metadata.EVENT, Metadata.LOCATION)

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

    return jsonify(trace_Meta)    

@app.route("/samples")
def sample():
    """Returns OTU data as a JSON object."""

    # Create session query that will load the whole Samples table (all columns)
    qrySamples = session.query(Samples)

    # Convert Samples to a pandas dataframe
    df_Samples = pd.read_sql(qrySamples.statement, qrySamples.session.bind)
    df_Samples.head() 

    # Calculate the abundance of each OTU_ID
    df_Samples["abundance"] = df_Samples.sum(axis = 1)
    df_Samples.head()

    # Sort data based on the abundance and show the 10 most abundant OTU_IDs
    df_Samples_sorted = df_Samples.sort_values(by = ["abundance"], ascending = False)
    df_Samples_sorted.head(10)

    # Prepare data from Samples for graphs and for JSON
    trace_Samples = {
        labels: df_Samples_sorted.head(10)["otu_id"].values.tolist(),
        values: df_Samples_sorted.head(10)["abundance"].values.tolist(),
        type: "pie",
        hoverinfo: df_Samples_sorted.head(10)["otu_label"].values.tolist(),
    }

    return jsonify(trace_Samples)

if __name__ == '__main__':
    app.run(debug = True)