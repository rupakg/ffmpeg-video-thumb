# Extracting Thumbnail from Video file

This is a companion project for the blog post [How to run long-running processes with Fargate and Lambda in a Serverless app]().



This reference applications shows you how to create an end-to-end serverless application that extracts thumbnails from video files. But, oh no, processing video files is a long-running process! AWS Fargate to the rescue.

**TL;DR** A Docker container does the processing -> The container extracts the thumbnail and uploads the image to an S3 bucket -> The container is managed by AWS Fargate. All functionality is triggered from AWS Lambda functions and contained within a serverless application written with the [Serverless Framework](https://serverless.com/framework/).
