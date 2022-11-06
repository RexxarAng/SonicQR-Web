# SonicQR-Web

## Table of contents
* [Project Description](#Project Decription)
* [Setup](#Setup)
* [Technologies](#Technologies)

# Project Description
A static react web application called SonicQR-Web and an android application called SonicQR-Mobile provides the conversion of files through a series of QR codes that will flash on the sender’s web browser and for recording the QR codes to receive the file on the receiver’s mobile device respectively. To ensure that the QR codes are received by the receiver while preventing multiple loops from occurring, the sender will wait for acknowledgement from the receiver via the transmission of sound when the receiver successfully receives the frame before changing to the next frame.

## Setup
To view the webpage, it is already hosted on github
- https://rexxarang.github.io/SonicQR-Web 

To compile and run the source code directly
- Install nodejs 
- Clone the project, or download the zip file to a location of your choice. 
- Unzip the project folder.
- Open folder -> SonicQR-Web
- Open a terminal in this folder
- Run "npm install"
- Run "npm start"

## Technologies
Project is created with:
* react: ^17.0.1
* arcode: ^1.5.1
* qrcode.react: ^3.1.0
* base45: ^2.0.1
