# node-red-contrib-rewinder
Node-Red plugin for rewinding and replaying recorded messages
Simple daily log is recorded and either entire log can be replayed, or specific intervals.
When the node isn't playing back, it is recording
## Start Message
Both/Either `startTime` and `stopTime` are options. With both, it will start and stop the playback from those intervals.
If start is omitted and stop is supplied, it will start from the beginning of the log, and stop at the stop time,
if stop it omitted and start is supplied, it will start from the specified start time, and stop at the end of the log
If neither are supplied, it will play throught the entire log file.
```json
    {
        "topic": "START"
        "payload" : {
            "startTime":1619535928800,
            "stopTime":1619536928800
        }
    }
```
## Stop Message
Will stop playback
```json
    {
        "topic": "STOP"
    }
```

## Status/state changes on messages
Initial:
- RECORDING

Start Message:
- RECORDING -> STARTED
- STARTED (no change)
- STOPPED -> RECORDING -> STARTED

Stop Message:
- RECORDING (no change)
- STARTED -> STOPPED -> RECORDING
- STOPPED (no change)

# example
```json
[
    {
        "id": "5383b174.2d1768",
        "type": "tab",
        "label": "Flow",
        "disabled": false,
        "info": ""
    },
    {
        "id": "4ca92775.00b738",
        "type": "inject",
        "z": "5383b174.2d1768",
        "name": "Start Playback",
        "props": [
            {
                "p": "topic",
                "vt": "str"
            },
            {
                "p": "payload"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "START",
        "payload": "{\"_startTime\":1619535928800,\"_stopTime\":1619536928800}",
        "payloadType": "json",
        "x": 210,
        "y": 440,
        "wires": [
            [
                "22dcae69.5f71ca"
            ]
        ]
    },
    {
        "id": "194524e4.291313",
        "type": "debug",
        "z": "5383b174.2d1768",
        "name": "",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": true,
        "complete": "true",
        "targetType": "full",
        "statusVal": "payload",
        "statusType": "auto",
        "x": 650,
        "y": 580,
        "wires": []
    },
    {
        "id": "22dcae69.5f71ca",
        "type": "rewinder",
        "z": "5383b174.2d1768",
        "name": "",
        "x": 460,
        "y": 580,
        "wires": [
            [
                "194524e4.291313"
            ]
        ]
    },
    {
        "id": "d9ef2603.76aea8",
        "type": "inject",
        "z": "5383b174.2d1768",
        "name": "Stop Playback",
        "props": [
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "STOP",
        "x": 210,
        "y": 480,
        "wires": [
            [
                "22dcae69.5f71ca"
            ]
        ]
    },
    {
        "id": "ad9fc5fc.e10268",
        "type": "inject",
        "z": "5383b174.2d1768",
        "name": "A",
        "props": [
            {
                "p": "topic",
                "vt": "str"
            },
            {
                "p": "payload"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": "1",
        "topic": "TEST_TOPIC_A",
        "payload": "A",
        "payloadType": "str",
        "x": 190,
        "y": 560,
        "wires": [
            [
                "22dcae69.5f71ca"
            ]
        ]
    },
    {
        "id": "8038e65d.78b89",
        "type": "inject",
        "z": "5383b174.2d1768",
        "name": "B",
        "props": [
            {
                "p": "topic",
                "vt": "str"
            },
            {
                "p": "payload"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": "1",
        "topic": "TEST_TOPIC_B",
        "payload": "B",
        "payloadType": "str",
        "x": 190,
        "y": 600,
        "wires": [
            [
                "22dcae69.5f71ca"
            ]
        ]
    },
    {
        "id": "a06b708d.ae3518",
        "type": "inject",
        "z": "5383b174.2d1768",
        "name": "C",
        "props": [
            {
                "p": "topic",
                "vt": "str"
            },
            {
                "p": "payload"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": "1",
        "topic": "TEST_TOPIC_C",
        "payload": "C",
        "payloadType": "str",
        "x": 190,
        "y": 640,
        "wires": [
            [
                "22dcae69.5f71ca"
            ]
        ]
    },
    {
        "id": "eae93c8a.b506f",
        "type": "inject",
        "z": "5383b174.2d1768",
        "name": "D",
        "props": [
            {
                "p": "topic",
                "vt": "str"
            },
            {
                "p": "payload"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": "1",
        "topic": "TEST_TOPIC_D",
        "payload": "D",
        "payloadType": "str",
        "x": 190,
        "y": 680,
        "wires": [
            [
                "22dcae69.5f71ca"
            ]
        ]
    }
]
```