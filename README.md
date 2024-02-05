# Github Action MQTT Publish
Publish a MQTT message.

## Usage
```
uses: r2b1d1/github-action-mqtt-publish@1.0.0
with:
  protocol: mqtts
  host: broker.hivemq.com
  port: 8883
  topic: test/test
  message: github actions mqtt publish
```
