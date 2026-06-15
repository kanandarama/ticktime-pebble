import Message from "pebble/message";

export const COMMAND = {
  AUTH_START: 1,
  AUTH_LOGOUT: 2,
  AUTH_SUBMIT_CODE: 3,
  GET_TOKEN: 4
};

export const AUTH_STATUS = {
  DISCONNECTED: 0,
  CONNECTED: 1,
  ERROR: 2,
  PENDING: 3
};

let messageInstance = null;
let listeners = [];

export function initAuth(onEvent) {
  listeners.push(onEvent);
  if (messageInstance) {
    return messageInstance;
  }

  messageInstance = new Message({
    keys: ["COMMAND", "AUTH_CODE", "AUTH_STATUS", "AUTH_TOKEN", "ERROR_MSG"],
    onReadable() {
      const msg = this.read();
      const event = {};
      msg.forEach((value, key) => {
        event[key] = value;
      });
      listeners.forEach((fn) => fn(event));
    },
    onWritable() {},
    onSuspend() {}
  });

  return messageInstance;
}

export function sendCommand(command, extra) {
  if (!messageInstance) {
    return;
  }
  const map = new Map();
  map.set("COMMAND", command);
  if (extra) {
    Object.keys(extra).forEach((key) => {
      map.set(key, extra[key]);
    });
  }
  messageInstance.write(map);
}

export function requestToken() {
  sendCommand(COMMAND.GET_TOKEN);
}

export function startAuth() {
  sendCommand(COMMAND.AUTH_START);
}

export function logout() {
  sendCommand(COMMAND.AUTH_LOGOUT);
}

export function submitAuthCode(code) {
  sendCommand(COMMAND.AUTH_SUBMIT_CODE, { AUTH_CODE: code });
}
