const axios = require("axios")
const express = require("express")
const bodyParser = require("body-parser")
const satellite = require("satellite.js")
// const pg = require("pg");
// const path = require("path");

const env = require("./env.json")
const data = require("./front-end/public/data.json")

const port = process.env.PORT || 5000
const hostname = "localhost"
const apiKey = env["api_key"]
const baseUrl = env["base_api_url"]

let mapJson = { sat: [] }
let satJson = { sat: [] }
let satAttributeList = []
let satRecordList = []
let globalSatTrackCallCounter = 0

// import and initialise the id object for satellite ids from data.json
const launchList = data["groups"]
let noradIdList = {}
for (let i = 0; i < launchList.length; i++) {
	noradIdList[launchList[i]] = data[launchList[i]]
}

// initialise Express
const app = express()
app.use(bodyParser.json())

app.use(express.static("public_html"))

//production mode
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "front-end/build")))
}

app.listen(port, hostname, () => {
	console.log(`Back-end active at: http://${hostname}:${port}\n`)
})

//route handler for resetting globalSatTrackCallCounter
app.get("/serverRefresh", function (req, res) {
	globalSatTrackCallCounter = 0
	res.sendStatus(200)
})

// route handler for exporting sateliite positioning data to maps.js for SceneView mapping
app.get("/mapData", function (req, res) {
	if (globalSatTrackCallCounter == 0) {
		mapJson = { sat: [] }
		res.status(200)
		res.header("Content-Type: application/json")
		res.send(mapJson)
	} else {
		mapJson = satJson
		res.status(200)
		res.header("Content-Type: application/json")
		res.send(mapJson)
	}
})

// route handler for tle data processing
app.get("/satdata/tle", function (req, res) {
	// https://www.n2yo.com/api/#tle
	let launchGroup = req.query.launchgroup

	// console.log(`noradIdList[launchGroup].length: ` + noradIdList[launchGroup].length);

	satJson = { sat: [] }
	mapJson = { sat: [] }
	satAttributeList = []
	satRecordList = {}

	for (
		let mainCounter = 0;
		mainCounter < noradIdList[launchGroup].length;
		mainCounter++
	) {
		// loop for api call for each satellite's TLE data

		let satId = noradIdList[launchGroup][mainCounter]
		// console.log(satId);

		axios
			.get(`${baseUrl}tle/${satId}&apiKey=${apiKey}`)
			.then(function (response) {
				// console.log(`/satdata/tle [${mainCounter}] : GET request to n2yo.com/rest/v1/satellite/tle for ID: ${satId}`);
				globalSatTrackCallCounter += 1
				// console.log(`${baseUrl}tle/${satId}&apiKey=${apiKey}`);

				// console.log(response);
				let satName = response.data.info["satname"]
				let transactionCount = response.data.info["transactionscount"]
				let tleArray = response.data.tle.split("\r\n")
				let satRecord = satellite.twoline2satrec(
					tleArray[0],
					tleArray[1]
				)
				satRecordList[satName] = satRecord

				let julianSatEpoch = satRecord.jdsatepoch
				let julianSatEpochMilliSecond =
					(julianSatEpoch - 2440587.5) * 86400000
				let satEpochTime = new Date(julianSatEpochMilliSecond)

				let satAttributes = getSatelliteLocation(
					satEpochTime,
					satRecord
				)
				satRecord["time"] = julianSatEpochMilliSecond //satEpochTime;

				satAttributes["tableData"] = satellite.propagate(
					satRecord,
					satEpochTime
				)

				if (response.data.info["satid"] == satId) {
					satAttributes["id"] = satId
				} else {
					satAttributes["id"] = "error"
				}

				satAttributes["satName"] = satName
				satAttributes["transactionCount"] = transactionCount
				satAttributeList.push(satAttributes)

				// console.log(julianSatEpoch)
				// console.log(julianSatEpochMilliSecond)
				// console.log(new Date(julianSatEpochMilliSecond))
				// console.log(satAttributes);
				// console.log(satRecord);
				// console.log(satRecordList);
				// console.log(response.data.tle); console.log(tleArray); console.log(satRecord); console.log(positionAndVelocity); console.log("Done");

				if (
					satAttributeList.length == noradIdList[launchGroup].length
				) {
					// console.log(satAttributeList);
					// console.log(satJson);
					// mapJson = satJson;

					satAttributeList.sort(
						(a, b) => parseFloat(a.id) - parseFloat(b.id)
					)
					satJson.sat = satAttributeList

					// console.log(satJson);
					res.status(200)
					res.header("Content-Type: application/json")
					res.send(satJson)
				}
			})
			.catch(function (error) {
				res.status(400)
				res.send()
			})
	}
})

// route handler for future orbital positions
app.get("/satdata/pos", function (req, res) {
	// https://www.n2yo.com/api/#positions
	let noradId = req.query.noradId
	let userLat = req.query.userLat
	let userLong = req.query.userLong
	let userAlt = req.query.userAlt
	let orbitTime = req.query.orbitTime

	// console.log(`${baseUrl}positions/${noradId}/${userLat}/${userLong}/${userAlt}/${orbitTime}&apiKey=${apiKey}`)

	axios
		.get(
			`${baseUrl}positions/${noradId}/${userLat}/${userLong}/${userAlt}/${orbitTime}&apiKey=${apiKey}`
		)
		.then(function (response) {
			// console.log(`/satdata/pos : GET request to n2yo.com/rest/v1/satellite/positions for ID: ${noradId}`);
			globalSatTrackCallCounter += 1
			// console.log(response.data);

			let orbitTrackId = response.data.info["satid"]
			let satName = response.data.info["satname"]
			let transactionCount = response.data.info["transactionscount"]

			let orbitTrackArray = []
			let rawOrbitTrackList = response.data["positions"]

			for (
				let orbitTimeCounter = 0;
				orbitTimeCounter < orbitTime;
				orbitTimeCounter++
			) {
				let orbitTrackAttributes = {}

				let satlatitude =
					rawOrbitTrackList[orbitTimeCounter]["satlatitude"]
				let satlongitude =
					rawOrbitTrackList[orbitTimeCounter]["satlongitude"]
				let sataltitude =
					rawOrbitTrackList[orbitTimeCounter]["sataltitude"]
				let azimuth = rawOrbitTrackList[orbitTimeCounter]["azimuth"]
				let elevation = rawOrbitTrackList[orbitTimeCounter]["elevation"]
				let ra = rawOrbitTrackList[orbitTimeCounter]["ra"]
				let dec = rawOrbitTrackList[orbitTimeCounter]["dec"]
				let timestamp = rawOrbitTrackList[orbitTimeCounter]["timestamp"]

				orbitTrackAttributes["orbitTrackId"] = orbitTrackId
				orbitTrackAttributes["satName"] = satName
				orbitTrackAttributes["timestamp"] = timestamp
				orbitTrackAttributes["satlatitude"] = satlatitude
				orbitTrackAttributes["satlongitude"] = satlongitude
				orbitTrackAttributes["sataltitude"] = sataltitude
				orbitTrackAttributes["azimuth"] = azimuth
				orbitTrackAttributes["elevation"] = elevation
				orbitTrackAttributes["ra"] = ra
				orbitTrackAttributes["dec"] = dec

				// console.log(orbitTrackAttributes);
				orbitTrackArray.push(orbitTrackAttributes)
			}

			// console.log(orbitTrackJson)

			if (rawOrbitTrackList.length == orbitTrackArray.length) {
				// sort by timestamp
				orbitTrackArray.sort(
					(a, b) => parseFloat(a.timestamp) - parseFloat(b.timestamp)
				)

				// console.log(orbitTrackArray)
				res.status(200)
				res.header("Content-Type: application/json")
				res.send(orbitTrackArray)
			}

			// }
		})
		.catch(function (error) {
			res.status(400)
			res.send()
		})
})

// Responds with all satellites' path data
app.get("/mapData/satrec", function (req, res) {
	let trackResponse = {}

	for (let i = 0; i < satAttributeList.length; i++) {
		let satName = satAttributeList[i].satName
		let tleTime = satRecordList[satName].time
		let satRec = satRecordList[satName]
		trackResponse[satName] = []

		for (let j = 0; j < 24 * 60; j++) {
			let newDate = new Date(tleTime + j * 1000 * 60)
			let satLocation = getSatelliteLocation(newDate, satRec)
			trackResponse[satName].push(satLocation)
		}
	}

	res.status(200)
	res.header("Content-Type: application/json")
	res.send(trackResponse)
})

// Function taken from ArcGis website (for now) (testing)
function getSatelliteLocation(date, satRecord) {
	// var satRecord = satellite.twoline2satrec(line1, line2);

	var position_and_velocity = satellite.propagate(
		satRecord,
		date.getUTCFullYear(),
		date.getUTCMonth() + 1,
		date.getUTCDate(),
		date.getUTCHours(),
		date.getUTCMinutes(),
		date.getUTCSeconds()
	)
	var position_eci = position_and_velocity.position

	var gmst = satellite.gstime(
		date.getUTCFullYear(),
		date.getUTCMonth() + 1,
		date.getUTCDate(),
		date.getUTCHours(),
		date.getUTCMinutes(),
		date.getUTCSeconds()
	)

	var position_gd = satellite.eciToGeodetic(position_eci, gmst)

	var longitude = position_gd.longitude
	var latitude = position_gd.latitude
	var height = position_gd.height
	if (isNaN(longitude) || isNaN(latitude) || isNaN(height)) {
		return null
	}
	var rad2deg = 180 / Math.PI
	while (longitude < -Math.PI) {
		longitude += 2 * Math.PI
	}
	while (longitude > Math.PI) {
		longitude -= 2 * Math.PI
	}
	return {
		type: "point", // Autocasts as new Point()
		x: rad2deg * longitude,
		y: rad2deg * latitude,
		z: height * 1000,
	}
}

//route handler to send launchList to react dropdown
app.get("/frontend/launchlist", function (req, res) {
	res.send(launchList).status(200)
})
