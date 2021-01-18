# Starlink Tracker

## Introduction

A project designed to collect and display data, such as the location (i.e. Latitude and Longitude), elevation, and speed, of individual satellites from the Starlink satellite constellation
The satellites are broken down into groups by their launch dates. Users have the option of visualizing this data in a detailed table format or on a globe map. In the map visualization, users
can select a single satellite to see it’s x,y,z coordinates as well as its corresponding x,y,z velocities. The map also includes a feature to track that satellite’s path.

## Screenshots

# Interface built using Material-UI to display data from the N2YO API.
![image](https://user-images.githubusercontent.com/28841450/104968290-6c8b0400-59b3-11eb-9191-e79871197780.png)

![image](https://user-images.githubusercontent.com/28841450/104968527-1a96ae00-59b4-11eb-942d-5a9fef7777f0.png)

# Visualization of a Starlink using ARCGIS 3D mapping tool. Data parsed through a NodeJS back-end
![image](https://user-images.githubusercontent.com/28841450/104968408-bc69cb00-59b3-11eb-99ad-d6760ec4a644.png)

![image](https://user-images.githubusercontent.com/28841450/104968456-e4592e80-59b3-11eb-9ce5-cda2d86a17bd.png)

## Installation

Clone repo into a local folder. 

### Install dependencies

```bash
In the working directory, run the following:
cd ./back-end && npm install && cd ../front-end && npm install
```

### Run the Tracker

```bash
In the working directory, run the following:
cd ./back-end && concurrently "npm run server" "npm run client"
```
