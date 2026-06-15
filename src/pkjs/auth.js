const COMMAND = {
  AUTH_START: 1,
  AUTH_LOGOUT: 2,
  AUTH_SUBMIT_CODE: 3,
  GET_TOKEN: 4
};

const AUTH_STATUS = {
  DISCONNECTED: 0,
  CONNECTED: 1,
  ERROR: 2,
  PENDING: 3
};

const TOKEN_KEY = "ticktime_access_token";

let config;
try {
  config = require("./config");
} catch (e) {
  config = null;
}

function send(payload) {
  Pebble.sendAppMessage(payload, function () {}, function (e) {
    console.log("sendAppMessage failed: " + e.error.message);
  });
}

function sendStatus(status, extra) {
  const payload = { AUTH_STATUS: status };
  if (extra && extra.token) {
    payload.AUTH_TOKEN = extra.token;
  }
  if (extra && extra.error) {
    payload.ERROR_MSG = extra.error;
  }
  send(payload);
}

function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function storeToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function buildAuthUrl() {
  if (!config || !config.CLIENT_ID || !config.REDIRECT_URI) {
    throw new Error("Missing config.js — copy config.example.js");
  }
  const params = new URLSearchParams({
    client_id: config.CLIENT_ID,
    scope: "tasks:read tasks:write",
    redirect_uri: config.REDIRECT_URI,
    response_type: "code",
    state: "ticktime"
  });
  return "https://ticktick.com/oauth/authorize?" + params.toString();
}

function exchangeCode(code) {
  if (!config || !config.CLIENT_ID || !config.CLIENT_SECRET || !config.REDIRECT_URI) {
    return Promise.reject(new Error("Missing config.js credentials"));
  }

  const credentials = btoa(config.CLIENT_ID + ":" + config.CLIENT_SECRET);
  const body = new URLSearchParams({
    code: code,
    grant_type: "authorization_code",
    scope: "tasks:read tasks:write",
    redirect_uri: config.REDIRECT_URI
  });

  return fetch("https://ticktick.com/oauth/token", {
    method: "POST",
    headers: {
      Authorization: "Basic " + credentials,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: body.toString()
  }).then(function (response) {
    if (!response.ok) {
      return response.text().then(function (text) {
        throw new Error("Token exchange failed: " + text);
      });
    }
    return response.json();
  });
}

function onReady() {
  const token = getStoredToken();
  if (token) {
    sendStatus(AUTH_STATUS.CONNECTED, { token: token });
  } else {
    sendStatus(AUTH_STATUS.DISCONNECTED);
  }
}

function handleMessage(payload) {
  const command = payload.COMMAND;

  if (command === COMMAND.AUTH_START) {
    try {
      sendStatus(AUTH_STATUS.PENDING);
      Pebble.openURL(buildAuthUrl());
    } catch (e) {
      sendStatus(AUTH_STATUS.ERROR, { error: String(e.message || e) });
    }
    return;
  }

  if (command === COMMAND.AUTH_LOGOUT) {
    clearToken();
    sendStatus(AUTH_STATUS.DISCONNECTED);
    return;
  }

  if (command === COMMAND.GET_TOKEN) {
    const token = getStoredToken();
    if (token) {
      sendStatus(AUTH_STATUS.CONNECTED, { token: token });
    } else {
      sendStatus(AUTH_STATUS.DISCONNECTED);
    }
    return;
  }

  if (command === COMMAND.AUTH_SUBMIT_CODE) {
    const code = payload.AUTH_CODE;
    if (!code) {
      sendStatus(AUTH_STATUS.ERROR, { error: "No auth code provided" });
      return;
    }
    exchangeCode(code)
      .then(function (data) {
        if (!data.access_token) {
          throw new Error("No access_token in response");
        }
        storeToken(data.access_token);
        sendStatus(AUTH_STATUS.CONNECTED, { token: data.access_token });
      })
      .catch(function (e) {
        sendStatus(AUTH_STATUS.ERROR, { error: String(e.message || e) });
      });
  }
}

module.exports = {
  COMMAND: COMMAND,
  AUTH_STATUS: AUTH_STATUS,
  onReady: onReady,
  handleMessage: handleMessage
};
