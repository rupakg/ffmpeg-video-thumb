# Extracting Thumbnail from Video file

![Fargate + Lambda + Serverless Framework = Bliss](https://user-images.githubusercontent.com/8188/34815683-3c9ca24c-f680-11e7-9f23-d45bc78f3e37.png)

*AWS Fargate + Lambda + Serverless Framework = Bliss*

This is a companion project for the blog post [How to run long-running processes with Fargate and Lambda in a Serverless app](https://serverless.com/blog/serverless-application-for-long-running-process-fargate-lambda/).

This reference application shows you how to create an end-to-end serverless application that extracts thumbnails from video files. But, oh no, processing video files is a long-running process! AWS Fargate to the rescue.

Video is uploaded to a S3 bucket -> A Lambda function is triggered that runs an ECS Fargate task -> The task spins up a  Docker container to process the video -> The container extracts the thumbnail and uploads the image to an S3 bucket -> The container is managed by AWS Fargate. All functionality is triggered from AWS Lambda functions and contained within a serverless application written with the [Serverless Framework](https://serverless.com/framework/).

![Architecture diagram for processing video to generate thumbnail in AWS ECS using Fargate](https://user-images.githubusercontent.com/8188/34815433-4b277d74-f67f-11e7-83a0-9ac65d630eab.png)

*Architecture diagram for processing video to generate thumbnail in AWS ECS using Fargate*
