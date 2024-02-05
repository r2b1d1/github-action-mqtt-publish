const core = require('@actions/core');
const mqtt = require('mqtt');

const protocol = core.getInput('protocol');
const host = core.getInput('host');
const port = core.getInput('port');
const topic = core.getInput('topic');
const message = core.getInput('message');
const qos = core.getInput('qos') || 0;
const retain = core.getInput('retain') || false;
const id = core.getInput('id') || `gha_${Math.random().toString(16).slice(3)}`;
const user = core.getInput('username');
const passwd = core.getInput('password');
const timeout = core.getInput('timeout') || 4000;
const version = core.getInput('version') || 5;
const maxRetries = core.getInput('maxRetries') || 5;

let count = 0;

const url = `${protocol}://${host}:${port}`;
const options = {
  clientId: id,
  clean: true,
  username: user,
  password: passwd,
  connectTimeout: timeout,
  protocolVersion: version,
};

core.info(`🔗 Connecting to ${url}`);
core.info(`🆔 id: ${id}`);
core.info(`⏱️ timeout: ${timeout}`);
core.info(`🌐 protocol version: ${version}`);
core.info(`🔄 maxRetries: ${maxRetries}`);

const client = mqtt.connect(url, options);

try {
  client.on('connect', () => {
    core.info(`🚀 Publising ${message} to ${topic} with qos: ${qos} and retain: ${retain}`);
    client.publish(topic, message, { qos, retain }, (error) => {
      if (error) {
        throw new Error(error.message);
      }
    });
    client.end();
  });

  client.on('error', (error) => {
    throw new Error(error.message);
  });

  client.on('reconnect', () => {
    if (count === maxRetries) {
      throw new Error(`Failed after ${maxRetries}`);
    }
    count += 1;
  });
} catch (error) {
  client.end();
  core.setFailed(error.message);
}
