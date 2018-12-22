# Dependencies for data manipulation
import pandas as pd

# Dependencies for Flask
from flask import Flask, jsonify, render_template

# Dependencies for SQL
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, inspect, distinct

# Construct an instance of Flask
app = Flask(__name__)

# Create an engine
engine = create_engine("sqlite:///db/bellybutton.sqlite", echo = False)

# Create a database model
Base = automap_base() # Reflect an existing database into a new model
Base.prepare(engine, reflect = True) # Prepare the database
Base.classes.keys() # Find all the tables (classes) that automap found

# Save references for each table
Metadata = Base.classes.sample_metadata
Samples = Base.classes.samples



if __name__ == '__main__':
    app.run(debug = True)