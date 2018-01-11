'use strict';

const ECS_CLUSTER_NAME = process.env.ECS_CLUSTER_NAME;
const ECS_TASK_DEFINITION = process.env.ECS_TASK_DEFINITION;
const ECS_TASK_VPC_SUBNET_1 = process.env.ECS_TASK_VPC_SUBNET_1;
const ECS_TASK_VPC_SUBNET_2 = process.env.ECS_TASK_VPC_SUBNET_2;
const OUTPUT_S3_PATH = process.env.OUTPUT_S3_PATH;
const OUTPUT_S3_AWS_REGION = process.env.OUTPUT_S3_AWS_REGION;

const ecsApi = require('./ecs');

module.exports.triggerOnUploadVideo = (event, context, callback) => {

  const bucket = event.Records[0].s3.bucket.name;
  const key = event.Records[0].s3.object.key;

  console.log(JSON.stringify(event));
  console.log(`A new video file '${key}' was uploaded to '${bucket}' for processing.`);

  // parse the file processing details
  // video file: test_00-08.mp4
  const s3_video_url = `https://s3.amazonaws.com/${bucket}/${key}`;
  const thumbnail_file = key.substring(0, key.indexOf('_')) + '.png';
  const frame_pos = key.substring(key.indexOf('_')+1, key.indexOf('.')).replace('-',':');
  console.log(`Processing file '${s3_video_url}' to extract frame from position '${frame_pos}' to generate thumbnail '${thumbnail_file}'.`);

  runThumbnailGenerateTask(s3_video_url, thumbnail_file, frame_pos);

  callback(null);
};

module.exports.triggerOnThumbnailCreation = (event, context, callback) => {

  const bucket = event.Records[0].s3.bucket.name;
  const key = event.Records[0].s3.object.key;

  console.log(JSON.stringify(event));
  console.log(`A new thumbnail file was generated at 'https://s3.amazonaws.com/${bucket}/${key}'.`);

  callback(null);
}

var runThumbnailGenerateTask = (s3_video_url, thumbnail_file, frame_pos) => {

  // run an ECS Fargate task
  const params = {
    cluster: `${ECS_CLUSTER_NAME}`,
    launchType: 'FARGATE',
    taskDefinition: `${ECS_TASK_DEFINITION}`,
    count: 1,
    platformVersion:'LATEST',
    networkConfiguration: {
      awsvpcConfiguration: {
          subnets: [
              `${ECS_TASK_VPC_SUBNET_1}`,
              `${ECS_TASK_VPC_SUBNET_2}`
          ],
          assignPublicIp: 'ENABLED'
      }
    },
    overrides: {
      containerOverrides: [
        {
          name: 'ffmpeg-thumb',
          environment: [
            {
              name: 'INPUT_VIDEO_FILE_URL',
              value: `${s3_video_url}`
            },
            {
              name: 'OUTPUT_THUMBS_FILE_NAME',
              value: `${thumbnail_file}`
            },
            {
              name: 'POSITION_TIME_DURATION',
              value: `${frame_pos}`
            },
            {
              name: 'OUTPUT_S3_PATH',
              value: `${OUTPUT_S3_PATH}`
            },
            {
              name: 'AWS_REGION',
              value: `${OUTPUT_S3_AWS_REGION}`
            }
          ]
        }
      ]
    }
  };

  ecsApi.runECSTask(params);

}
