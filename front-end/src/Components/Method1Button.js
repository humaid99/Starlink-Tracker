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

// class Method1Button extends React.Component {

//     constructor(props) {
//         super(props);
//         this.handleChange = this.handleChange.bind(this);  
//     }

//     handleClick = () => {
//         method1func();
//     };

//     render () {
//         const { classes } = this.props;
//         return (
//             <div className={classes.root}>
//                 <Button 
//                     id="method1"
//                     variant="contained" 
//                     color="primary"  
//                     onClick={this.handleClick}
//                 >
//                     Track satellties in Space                
//                 </Button>
//             </div>
//         );
//     }
// }

// export default withStyles(styles)(Method1Button)