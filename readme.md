# Starlink Tracker

## Introduction

A project designed to collect and display data, such as the location (i.e. Latitude and Longitude), elevation, and speed, of individual satellites from the Starlink satellite constellation
The satellites are broken down into groups by their launch dates. Users have the option of visualizing this data in a detailed table format or on a globe map. In the map visualization, users
can select a single satellite to see it’s x,y,z coordinates as well as its corresponding x,y,z velocities. The map also includes a feature to track that satellite’s path.

## Installation

Clone repo into a local folder. 

### Install dependencies

```bash
In the working directory, run the following:
cd ./back-end && npm install && cd ../front-end && npm install
```
### Database setup

```bash
Install PostgreSQL, put your password into the env.json, then do the following:
psql --username postgres

CREATE DATABASE starlinktrack;
\c starlinktracker;
CREATE TABLE accounts (
    name VARCHAR(15) UNIQUE NOT NULL,
    pass VARCHAR(15) NOT NULL
);
```

### Run the Tracker

```bash
In the working directory, run the following:
cd ./back-end && concurrently "npm run server" "npm run client"
```