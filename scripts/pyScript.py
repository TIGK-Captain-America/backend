import requests
import json
from datetime import datetime


URL = "https://us-central1-tigk-captain-america.cloudfunctions.net/Nodes"

req = requests.get(URL)

req_dictionary = req.json()

def sendData(data):
    response = requests.post(URL, data)
    print(response.status_code)

nodes = dict(collision = True, position = dict(y = 10, x = 10, w = 17), time = {"_seconds":1618524000,"_nanoseconds":0})

data = {"createdAt": datetime.now(), "Nodes":[{"collision": 100,"position":{"y":10,"x":10,"w":10},"time":{"_seconds":1618524000,"_nanoseconds":0}}]}
data2 ={"createdAt": datetime.now(), "Nodes": [nodes]}

data3 = {"stringFromRbp": ["0,0,False", "75,10,True"]}

sendData(data3)