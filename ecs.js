'use strict';

const AWS = require('aws-sdk');
const ECS = new AWS.ECS();

module.exports.runECSTask = params => {
  // Start the ECS task
  ECS.runTask(params, function (err, data) {
      if (err) {
        console.log(`Error processing ECS Task ${params.taskDefinition}: ${err}`);
      } else {
        console.log(`ECS Task ${params.taskDefinition} started: ${JSON.stringify(data.tasks)}`);
      }
      return;
  });
}
