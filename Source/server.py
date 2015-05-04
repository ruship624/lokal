import os
from flask import Flask
from flask import request
import base64
import subprocess
import logging
import sys
from pprint import pprint
import time
import pymongo
from pymongo import MongoClient
from flask import jsonify
from bson.json_util import dumps
from flask import render_template
from behance_python.api import API
import json
import urllib
from werkzeug.routing import FloatConverter as BaseFloatConverter
from flask_negotiate import consumes, produces



app = Flask(__name__)
app.logger.addHandler(logging.StreamHandler(sys.stdout))
app.logger.setLevel(logging.DEBUG)
client = MongoClient('mongodb://localhost:27017/').lokal

# before routes are registered


# behance API key
behance = API('UTeBYCTpcKP4ReuiVAg7iZhPmNUhAy5V')
googleKey = 'AIzaSyAqiO_0STzsCzFIROBVBHbwxv6iPKKOvGs'

@app.route('/')
def index():
    #render_template('/static/index.html')
    return '<a href="/call">Click for tweets</a>'

@app.route('/call/<data>', methods=['GET', 'POST'])
@consumes('application/json', 'text/html')
def fetchTweets(data):
    coords = data
    print coords
    print "yeah!"
    p = subprocess.Popen("python ./stream.py "+str(data), shell = True)
    return "{response: 'success'}"
    #return '<a href="/static/index.html"> <p>Tweets being collected! </a>'

@app.route('/getTweets')
def getTweets():
    y = [x for x in client.tweets.find({})]
    return dumps(y)

@app.route('/analyzeText')
def analyzeText(data):
    print data['data']

# display gallery images based on location
# images from Behance
@app.route('/gallery')
def getGallery():

    location = request.args.get("location")

    url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + location + "&key=" + googleKey

    response = urllib.urlopen(url)
    data = json.loads(response.read())

    city = data["results"][0]["address_components"][4]["long_name"]

    print "City is " + city

    galleries = []

    projects = behance.project_search(city)

    '''

        "galleries": [
            {
                "name": "Gallery Name",
                "covers": {
                    "image_url",
                    "image_url"
                },
                "images": [
                    "owner_name": {
                        "image_url",
                        "image_url"
                    }
                ]
            }
        ]
    '''

    for project in projects:
        gallery = {
            "name": project.name,
            "covers": project.covers.values(),
            "images": []   # each image is an object containing the owner/author and the image URL
        }

        for owner in project.owners:
            gallery["images"].append({
                owner.first_name.replace(".", "") + " " + owner.last_name.replace(".", ""): owner.images.values()
            })

        galleries.append(gallery)

        # print json.dumps(galleries)
        # print "\n"

    galleries_obj = {
        "galleries": galleries
    }

    # load into MongoDB
    client.location.insert_one(galleries_obj)

    print client.location.find_one()

    return json.dumps(galleries)

port = os.getenv('VCAP_APP_PORT', '9000')
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=int(port))