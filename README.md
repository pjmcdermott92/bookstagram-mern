# Bookstagram App

Bookstagram is a full-stack application built on the MERN Stack (MongoDB, ExpressJS, React, and NodeJS) that allows users to register and upload photos of their latest books.

View a live demo of the application: [Bookstagram Demo Application](https://bookstagram-app.herokuapp.com/)

### Technologies Used:

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

## Installation

To install Bookstagram, open up the root folder and run the following command: 

```
npm run installAll
```

This will install all dependencies for the client and the server.


## Run the Application

In a ```development``` environment, run the server and the client application both by using the following command:

```
npm run devStart
```

This command will use the concurrently NPM library to spin up the API server and the client React application on localhost.

### Image Uploads

This application uses the Amazon AWS S3 SDK on the client side to handle the upload of images. First, the client makes a request to the server API to get a secure, one-time upload URL. The upload URL is a temporary URL that will only allow an asset to be uploaded for one minute, before expiring.

As soon as the client receives this URL and the permanent imageUrl, it will make a PUT request to the Upload URL and send the asset to the S3 bucket. Once the asset is uploaded to the S3 bucket, the client will make another POST request to the server to save the image URL and the user-provided title to the database.

By handling the upload of the file directly to AWS from the client, we are avoiding the need to upload the image to our server, which increases performance and reduces bandwidth consumption on the server.

## License

[MIT](https://choosealicense.com/licenses/mit/)
