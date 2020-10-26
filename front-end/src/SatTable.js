import React from "react"
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';

// import TemporaryDrawer from "./Components/Drawer"
import SatTableComponents from './Components/DataTable';

const theme = createMuiTheme({
    palette: {
        type: "dark",
    },
});

function Table() {
    return (
        <ThemeProvider theme={theme}>
            <React.Fragment>
                <CssBaseline />
                {/* <TemporaryDrawer /> */}
                <SatTableComponents />
            </React.Fragment>
        </ThemeProvider>
    )
}

export default Table