// import React, { useState } from 'react';
// import PropTypes from 'prop-types';
import React from "react"
import axios from "axios"
import { withStyles, makeStyles } from "@material-ui/core/styles"

import InputLabel from "@material-ui/core/InputLabel"
import MenuItem from "@material-ui/core/MenuItem"
import FormHelperText from "@material-ui/core/FormHelperText"
import FormControl from "@material-ui/core/FormControl"
import Select from "@material-ui/core/Select"

import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import Paper from "@material-ui/core/Paper"
import TablePagination from "@material-ui/core/TablePagination"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp"
import Typography from "@material-ui/core/Typography"
import Box from "@material-ui/core/Box"
import Collapse from "@material-ui/core/Collapse" // import Input from '@material-ui/core/Input';
// import TableSortLabel from '@material-ui/core/TableSortLabel';
// import Toolbar from '@material-ui/core/Toolbar';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Switch from '@material-ui/core/Switch';

const styles = (theme) => ({
	root: {
		display: "flex",
		flexWrap: "wrap",
		width: "100%",
		"& > *": {
			margin: theme.spacing(1),
		},
	},
	formControl: {
		margin: theme.spacing(1),
		minWidth: 150,
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
	table: {
		margin: "5px",
		maxWidth: "96.35vw",
		// maxHeight: "inherit",
	},
	button: {
		margin: "30px",
	},
	tableContainerPaper: {
		margin: "20px 5px",
		maxWidth: "98vw",
		overflowX: "hidden",
		// maxHeight: 500,
	},
	tableHeader: {
		minWidth: "auto",
		maxWidth: 100,
		textAlign: "center",
		fontWeight: "medium",
		fontSize: "16px",
	},
})

const useRowStyles = makeStyles({
	root: {
		"& > *": {
			borderBottom: "unset",
		},
	},
	tableIdCell: {
		minWidth: 50,
		maxWidth: 100,
		textAlign: "center",
		fontWeight: "medium",
	},
	tableCell: {
		minWidth: "auto",
		maxWidth: 100,
		textAlign: "center",
		fontSize: 14,
	},
})

function createData(
	SatId,
	SatName,
	PositionX,
	PositionY,
	PositionZ,
	VelocityX,
	VelocityY,
	VelocityZ
) {
	return {
		SatId,
		SatName,
		PositionX,
		PositionY,
		PositionZ,
		VelocityX,
		VelocityY,
		VelocityZ,
	}
}

function Row(data) {
	const { row } = data
	const classesRow = useRowStyles()
	const [open, setOpen] = React.useState(false)
	const [userLong, setUserLong] = React.useState(0)
	const [userLat, setUserLat] = React.useState(0)
	// const [userAlt, setUserAlt] = React.useState(0);
	const [userAlt] = React.useState(0)
	const [orbitTime] = React.useState(10)
	const [orbitRowData, setOrbitRowData] = React.useState([])

	function rowCollapseClick() {
		setOpen(!open)

		if (!open) {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition((position) => {
					setUserLat(position.coords.latitude)
					setUserLong(position.coords.longitude)
				})
			} else {
				console.log("Geolocation is not supported by this browser.")
			}

			axios
				.get(
					"/satdata/pos?" +
						new URLSearchParams({
							noradId: row.SatId,
							userLat: userLat,
							userLong: userLong,
							userAlt: userAlt,
							orbitTime: orbitTime,
						})
				)
				.then((response) => {
					console.log(response)
					setOrbitRowData(response.data)
				})
		}
	}

	return (
		<React.Fragment>
			<TableRow hover key={row.SatId}>
				<TableCell className={classesRow.tableCell}>
					<IconButton
						aria-label="expand row"
						size="small"
						onClick={rowCollapseClick}
					>
						{open ? (
							<KeyboardArrowUpIcon />
						) : (
							<KeyboardArrowDownIcon />
						)}
					</IconButton>
				</TableCell>
				<TableCell
					component="th"
					scope="row"
					className={classesRow.tableIdCell}
				>
					{row.SatId}
				</TableCell>
				<TableCell className={classesRow.tableCell}>
					{row.SatName}
				</TableCell>
				<TableCell className={classesRow.tableCell}>
					{row.PositionX.toFixed(4)}
				</TableCell>
				<TableCell className={classesRow.tableCell}>
					{row.PositionY.toFixed(4)}
				</TableCell>
				<TableCell className={classesRow.tableCell}>
					{row.PositionZ.toFixed(4)}
				</TableCell>
				<TableCell className={classesRow.tableCell}>
					{row.VelocityX.toFixed(4)}
				</TableCell>
				<TableCell className={classesRow.tableCell}>
					{row.VelocityY.toFixed(4)}
				</TableCell>
				<TableCell className={classesRow.tableCell}>
					{row.VelocityZ.toFixed(4)}
				</TableCell>
			</TableRow>

			<TableRow hover>
				<TableCell
					style={{ paddingBottom: 0, paddingTop: 0 }}
					colSpan={9}
				>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box margin={1}>
							<Typography
								variant="h6"
								gutterBottom
								component="div"
							>
								Orbit Tracking
							</Typography>
							<Table size="small" aria-label="orbit-track-table">
								<TableHead>
									<TableRow>
										<TableCell
											className={classesRow.tableHeader}
										>
											Time Stamp
										</TableCell>
										<TableCell
											className={classesRow.tableHeader}
										>
											Latitude
										</TableCell>
										<TableCell
											className={classesRow.tableHeader}
										>
											Longitude
										</TableCell>
										<TableCell
											className={classesRow.tableHeader}
										>
											Altitude
										</TableCell>
										<TableCell
											className={classesRow.tableHeader}
										>
											Elevation
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{orbitRowData.map((orbitDataRow) => (
										<TableRow
											key={orbitDataRow.orbitTrackId}
										>
											<TableCell
												component="th"
												scope="row"
											>
												{orbitDataRow.timestamp}
											</TableCell>
											<TableCell>
												{orbitDataRow.satlatitude}
											</TableCell>
											<TableCell>
												{orbitDataRow.satlongitude}
											</TableCell>
											<TableCell>
												{orbitDataRow.sataltitude}
											</TableCell>
											<TableCell>
												{orbitDataRow.elevation}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</React.Fragment>
	)
}

class SatTableComponents extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			launchGroupList: [],
			launchSelectValue: "",
			satTrackingData: [],
			rowsPerPage: 5,
			page: 0,
			btnState: true,
		}

		this.handleChangeLaunchlist = this.handleChangeLaunchlist.bind(this)
		this.handleChangePage = this.handleChangePage.bind(this)
		this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this)
		this.handleVisualiseButtonPress = this.handleVisualiseButtonPress.bind(
			this
		)
	}

	componentDidMount() {
		axios
			.get("/frontend/launchlist")
			.then((response) => {
				// console.log(response.data);
				this.setState({
					launchGroupList: response.data,
				})
			})
			.catch(function (error) {
				console.log(error)
			})
	}

	handleChangeLaunchlist(event) {
		// console.log(this.state.launchGroupList[e.target.value])
		axios
			.get("/satdata/tle?", {
				params: {
					launchgroup: this.state.launchGroupList[event.target.value],
				},
			})
			.then((response) => {
				// console.log(response.data.sat); // Outputs satJson to browser console

				let rawData = response.data.sat
				let tableData = []

				rawData.forEach((satRawRow) => {
					let rowDataPosition = satRawRow.tableData["position"]
					let rowDataVelocity = satRawRow.tableData["velocity"]
					tableData.push(
						createData(
							satRawRow["id"],
							satRawRow["satName"],
							rowDataPosition["x"],
							rowDataPosition["y"],
							rowDataPosition["z"],
							rowDataVelocity["x"],
							rowDataVelocity["y"],
							rowDataVelocity["z"]
						)
					)
				})

				if (response.data.sat) {
					console.log(event.target.value)
					console.log(this.state.launchGroupList)
					this.setState({
						btnState: false,
						satTrackingData: tableData,
						launchSelectValue: this.state.launchGroupList[
							event.target.value
						].toString(),
					})
				}
				// console.log(this.state.launchSelectValue);
			})
			.catch(function (error) {
				console.log(error)
			})
	}

	handleChangePage(event, newPage) {
		this.setState({ page: newPage })
	}

	handleChangeRowsPerPage(event) {
		this.setState({
			page: 0,
			rowsPerPage: parseInt(event.target.value, 10),
		})
	}

	handleVisualiseButtonPress(event) {
		axios
			.get("/satdata/tle?", {
				params: {
					launchgroup: this.state.launchSelectValue,
				},
			})
			.then((response) => {
				let main = document.getElementById("main")
				if (document.getElementById("sideBarDiv")) {
					main.removeChild(document.getElementById("sideBarDiv"))
				}

				if (document.getElementById("root").style.display !== "none") {
					document.getElementById("root").style.display = "none"
				}

				let mainDiv = document.getElementById("mainDiv")
				while (mainDiv.childElementCount !== 0) {
					mainDiv.removeChild(mainDiv.lastChild)
				}

				let mapDiv = document.getElementById("mapDiv")
				while (mapDiv.childElementCount !== 0) {
					mapDiv.removeChild(mapDiv.lastChild)
				}

				// addSideBar();
				// toggleSideBar()

				let newFrame = document.createElement("iframe")
				newFrame.id = "iframeMap"
				newFrame.frameBorder = "0"
				newFrame.scrolling = "no"
				newFrame.marginheight = "0"
				newFrame.marginwidth = "0"
				newFrame.src = "maps.html"
				mapDiv.appendChild(newFrame)
			})
	}

	render() {
		const { classes } = this.props
		const {
			satTrackingData,
			page,
			rowsPerPage,
			btnState,
			launchSelectValue,
		} = this.state
		// const emptyRows = rowsPerPage - Math.min(rowsPerPage, satTrackingData.length - page * rowsPerPage);

		console.log(launchSelectValue)

		return (
			<div>
				<div>
					<FormControl required className={classes.formControl}>
						<InputLabel htmlFor="launch-group-dropdown">
							Launch Group
						</InputLabel>
						<Select
							id="launch-group-dropdown"
							name="launch-group-dropdown"
							value=""
							// value={launchSelectValue}
							onChange={this.handleChangeLaunchlist}
						>
							{/* <MenuItem key='1' value="1"></MenuItem>
                            <MenuItem key='2' value="2"></MenuItem>
                            <MenuItem key='3' value="3"></MenuItem> */}
							<MenuItem key="header" value=""></MenuItem>
							{this.state.launchGroupList.map((item, index) => (
								<MenuItem key={index} value={index}>
									{item}
								</MenuItem>
							))}
							;
						</Select>
						<FormHelperText>Required</FormHelperText>
					</FormControl>

					<Button
						disabled={btnState}
						variant="contained"
						id="visualiseButton"
						className={classes.button}
						color="default"
						onClick={this.handleVisualiseButtonPress}
					>
						Visualize Satellite Positions
					</Button>
				</div>

				<div>
					<TableContainer
						component={Paper}
						className={classes.tableContainerPaper}
					>
						{/* <div>{launchSelectValue}</div> */}
						<Table
							stickyHeader
							className={classes.table}
							size="small"
							aria-label="a dense table"
						>
							<TableHead>
								<TableRow>
									<TableCell
										className={classes.tableHeader}
									/>
									<TableCell className={classes.tableHeader}>
										Satellite&nbsp;ID
									</TableCell>
									<TableCell className={classes.tableHeader}>
										Sat&nbsp;Name
									</TableCell>
									<TableCell className={classes.tableHeader}>
										Position&nbsp;(X)
									</TableCell>
									<TableCell className={classes.tableHeader}>
										Position&nbsp;(X)
									</TableCell>
									<TableCell className={classes.tableHeader}>
										Position&nbsp;(X)
									</TableCell>
									<TableCell className={classes.tableHeader}>
										Velocity&nbsp;(X)
									</TableCell>
									<TableCell className={classes.tableHeader}>
										Velocity&nbsp;(X)
									</TableCell>
									<TableCell className={classes.tableHeader}>
										Velocity&nbsp;(X)
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{satTrackingData
									.slice(
										page * rowsPerPage,
										page * rowsPerPage + rowsPerPage
									)
									.map((row) => (
										<Row key={row.name} row={row} />
									))}
							</TableBody>
						</Table>
						<TablePagination
							rowsPerPageOptions={[5, 10, 25, 50]}
							component="div"
							count={satTrackingData.length}
							rowsPerPage={rowsPerPage}
							page={page}
							onChangePage={this.handleChangePage}
							onChangeRowsPerPage={this.handleChangeRowsPerPage}
						/>
					</TableContainer>
				</div>
			</div>
		)
	}
}

// SatTableComponents.propTypes = {
//     classes: PropTypes.object.isRequired,
//   };

export default withStyles(styles)(SatTableComponents)
