let axios = require('axios');
let btoa = require('btoa');
let FluentPromises = require('fluent-promises').default;

let printResponse = function (response) {
  console.log("RESPONSE:", response.data);
};

class JiraAPI extends FluentPromises {
  constructor (baseUrl) {
    super();

    this.axios_instance = axios.create({
      baseURL: baseUrl,
      timeout: 5000,
      headers: {
        'Authorization': 'Basic ' + btoa('admin:admin')
      }
    });
  }

  postWithDelay ({totalThingsToCreate = 1, batchSize = 1, payload, endPoint, totalProcessed = 1}) {

    return this.makeFluent(() => {

      console.log('totalProcessed', totalProcessed);
      console.log('maxNumber', totalThingsToCreate);

      if( totalProcessed > totalThingsToCreate) return Promise.resolve();

      return this.postToJira({count: batchSize, payload, endPoint}).then(() => {
        setTimeout(() => this.postWithDelay({totalThingsToCreate, totalProcessed: totalProcessed + batchSize, batchSize, payload, endPoint}) , 250)
      });
    });
  }

  postToJira ({count, payload, endPoint}) {
    var promises = [];

    for (var i = 0; i < count; i++) {
      promises.push(this.axios_instance.post(endPoint, payload())
        .then(printResponse, function(error) {
          console.log(error);
        }));
    }
    return Promise.all(promises);
  };
}

module.exports = JiraAPI;