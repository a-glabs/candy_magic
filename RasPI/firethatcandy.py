#!/usr/bin/python
import websocket
import RPi.GPIO as GPIO ## Import GPIO library
import time ## Import 'time' library. Allows us to use 'sleep'

def Blink(numTimes,speed):
    GPIO.setmode(GPIO.BOARD)
    GPIO.setup(7, GPIO.OUT)
    for i in range(0,numTimes):## Run loop numTimes
        GPIO.output(7,True)## Switch on pin 7
        time.sleep(speed)## Wait
        GPIO.output(7,False)## Switch off pin 7
        time.sleep(speed)## Wait
    GPIO.cleanup()
                  

def on_message(ws, message):
    print message
    if message != "ping":
        print("fire that candy")
        Blink(int(1),float(0.4))
     
def on_error(ws, error):
    print error

def on_close(ws):
    print "closed"

def on_open(ws):
    print "connection opened"

if __name__ == "__main__":
 
    # websocket setup
    websocket.enableTrace(True)
    ws = websocket.WebSocketApp("put your server url here",
                                on_message = on_message,
                                on_error = on_error,
                                on_close = on_close)
    ws.on_open = on_open
    ws.run_forever()
