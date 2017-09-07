let shortid = require('shortid');
let JiraAPI = require('./jira-api');

shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_');

const project1 = 'MON';
const project2 = 'FUN';

let jiraApi = new JiraAPI('http://jira-6.cloudapp.net:8080');

let restIssueEndPoint = '/rest/api/2/issue/';

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

jiraApi.postWithDelay({
  totalThingsToCreate: 1,
  batchSize: 1,
  endPoint: restIssueEndPoint,
  payload: function() { return payload('Nerds', project1) }
}).postWithDelay({
  totalThingsToCreate: 1,
  batchSize: 1,
  endPoint: restIssueEndPoint,
  payload: function() { return payload('Nerds', project2) }
})