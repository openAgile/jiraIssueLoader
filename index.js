let axios = require('axios');
let btoa = require('btoa');
let shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_');

const baseUrl = '';

const project1 = '';
const project2 = '';

let axios_instance = axios.create({
  baseURL: baseUrl,
  timeout: 5000,
  headers: {
    'Authorization': 'Basic ' + btoa('admin:admin')
  }
});

let restIssueEndPoint = '/rest/api/2/issue/';

let printResponse = function (response) {
  console.log("RESPONSE:", response.data);
};

const postToJira = function ({count, payload, endPoint}) {
  var promises = [];

  for (var i = 0; i < count; i++) {
    promises.push(axios_instance.post(endPoint, payload())
      .then(printResponse, function(error) {
        console.log(error);
      }));
  }

  return Promise.all(promises);
};

const postToJiraWithDelay = function({totalThingsToCreate = 1, batchSize = 1, payload, endPoint, totalProcessed = 1}) {
  console.log('totalProcessed', totalProcessed);
  console.log('maxNumber', totalThingsToCreate);

  if( totalProcessed > totalThingsToCreate) return Promise.resolve();

  return postToJira({count: batchSize, payload, endPoint}).then(function() {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        postToJiraWithDelay({totalThingsToCreate, totalProcessed: totalProcessed + batchSize, batchSize, payload, endPoint})
          .then(resolve, reject)
      }, 250)
    });
  });
}

const payload = function (summaryKey, projectKey) {
  return {
    "fields": {
      "project":
        {
          "key": projectKey
        },
      "summary": summaryKey + " " + shortid.generate(),
      "description": "Creating of an issue using project keys and issue type names using the REST API",
      "issuetype": {
        "name": "Bug"
      }
    }
  }
};

postToJiraWithDelay({
  totalThingsToCreate: 1000,
  batchSize: 25,
  endPoint: restIssueEndPoint,
  payload: function() { return payload('Nerds', project1) }
}).then(function() {
  postToJiraWithDelay({
    totalThingsToCreate: 1000,
    batchSize: 25,
    endPoint: restIssueEndPoint,
    payload: function() { return payload('Nerds', project2) }
  });
});