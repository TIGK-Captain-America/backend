import requests
import json
from datetime import datetime

URL = "https://us-central1-tigk-captain-america.cloudfunctions.net/Nodes"

def sendData(data):
    response = requests.post(URL, data)
    print(response.status_code)

data3 = {"stringFromRbp": "210,130,S"}

sendData(data3)