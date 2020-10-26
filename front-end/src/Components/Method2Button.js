// import React from 'react';
// import { withStyles } from '@material-ui/core/styles';
// import Button from '@material-ui/core/Button';

// const styles = theme => ({
//     root: {
//         '& > *': {
//             margin: theme.spacing(1),
//         },
//     },
// });

// class Method2Button extends React.Component {

//     constructor(props) {
//         super(props);
//         this.handleChange = this.handleChange.bind(this);  
//     }

//     handleClick = () => {
//         alert("Hi there");
//     };

//     render () {
//         const { classes } = this.props;
//         return (
//             <div className={classes.root}>
//                 <Button 
//                     id="method2"
//                     variant="contained" 
//                     color="secondary"  
//                     onClick={this.handleClick}
//                 >
//                     Satellite tracking data
//                 </Button>
//             </div>
//         );
//     }
// }

// export default withStyles(styles)(Method2Button)


