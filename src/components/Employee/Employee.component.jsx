import React, {useState, useEffect} from 'react';
import axios from 'axios';
import moment from 'moment'

import './Employee.styles.css';
/**Third party components */
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Clock from 'react-clock';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import TextField from '@material-ui/core/TextField';

// const useStyles = makeStyles(theme => ({
//     root: {
//       '& > *': {
//         margin: theme.spacing(1),
//         width: 200,
//       },
//     },
//   }));

export default () => {
    // const classes = useStyles();

    const [employees, setEmployees] = useState([{
        id: null,
        name:'', 
        hour_rate: '',
        password:'',
        email: '',
        roles: null,
        is_clock_in: false,
        is_clock_out: false,
    }]);

    const [employee, setEmployee] = useState({
        id:null,
        name: '',
        hour_rate: '',
        password:'',
        is_clock_in: false,
        is_clock_out: false,

    })

    //Define Header Clock
    const [date, setDate] = useState(null);
 
    const [passwordInput, setPasswordInput] = useState('');

    //condion render button 
    // const [isClockIn, setIsClockIn] = useState(false);
    // const [isClockOut, setIsClockOut] = useState(false);

    useEffect(() => {
       setInterval(
            () => setDate(new Date()), 1000
       );
        // eslint-disable-next-line
    },[]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/employee')
            .then(res => {
                // console.log(res.data);
                setEmployees(res.data);
            })
        // eslint-disable-next-line
    },[]);

    /**Dialgo  */
    const [open, setOpen] = React.useState(false);

    const handleSaveClockIn = (employee) => {
      setOpen(true);
      setEmployee(employee);      
    }; 


    const [openClockOut, setOpenClockOut] = React.useState(false);

    const handleSaveClockOut = (employee) => {
        setOpenClockOut(true);
        setEmployee(employee);      
       // console.log(employee);
    }

    const onClickSubmit = (employee) => {
        if (employee.password === passwordInput && passwordInput !== '') {
       
            let dateTime = new Date();
            dateTime = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
               

            alert('ClockIn Success at: ' + dateTime)
            setPasswordInput('');
            let saveTimeTrackingLogs = {
                employee_id: employee.id,
                employee_name: employee.name,
                hour_rate: employee.hour_rate,
                clock_in_time: dateTime,
                is_clock_in: true
            }

            axios.post('http://localhost:5000/api/clock_in_tracking_log', saveTimeTrackingLogs)
                .then((res)=>{
                    axios.put(`http://localhost:5000/api/employee/${res.data.employee_id}`)
                        .then(()=> {window.location.replace("http://localhost:3000/");
                    })
                
            });
           
            setOpen(false);
        }  else {
            alert('Please check your password')
        }
    }

    const onClickClockOutSubmit  = (employee) => {
        if (employee.password === passwordInput && passwordInput !== '') {

            let dateTime = new Date();
            dateTime = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");

            alert('See You Tomorrow')
            setPasswordInput('');
            let saveClockOutTimeTrackingLogs = {
                employee_id: employee.id,
                clock_out_time: dateTime,
                is_clock_out: true
            }
            axios.post('http://localhost:5000/api/clock_out_tracking_log', saveClockOutTimeTrackingLogs)
                .then((res)=>{
                    axios.put(`http://localhost:5000/api/employee/clockout/${res.data.employee_id}`)
                        .then(()=> {
                            setTimeout(() => {
                                axios.put(`http://localhost:5000/api/employee/clockinfalse/${res.data.employee_id}`)
                                     .then(()=> {
                                        axios.put(`http://localhost:5000/api/employee/clockoutfalse/${res.data.employee_id}`)
                                                 .then(()=> {window.location.replace("http://localhost:3000/");
                                         }); 
                                     }); 
        
                            }, 10000);

                        }); 
                  

                });
            setOpenClockOut(false);
            
        }  else {
            alert('Please check your password')
        }
    }
  
    const handleClose = () => {
      setOpen(false);
    };

    const handleClockOutClose = () => {
        setOpenClockOut(false);
    };
    
  

    return (
        <div>
            <div className="Employee_Clock">
              <Clock value={date} />
            </div>
            <div className="Employee_List_Warper">
                { employees.map( employee => {

                    return (
                        <div key={employee.id} className="Employee_Card">
                            <div><strong>{employee.name}</strong></div>
                   
                        <div className="Employee_Button">
                                <Button 
                                    disabled={employee.is_clock_in}
                                    variant="contained" 
                                    color="primary"
                                    onClick={() => handleSaveClockIn(employee)}
                                >
                                    Clock In
                                </Button>
                        </div>
                        
                        <div className="Employee_Button">
                                <Button 
                                    disabled={employee.is_clock_out}
                                    variant="contained" 
                                    color="secondary"
                                    onClick={() => handleSaveClockOut(employee)}
                                >
                                    Clock Out
                                </Button>
                        </div>

                        
                            

                        </div>
                    )

                  })

                }
            </div>
             
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{`Hello ${employee.name}, ${`It's Time to work now !`}  `}</DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">

                    <TextField id="outlined-basic" 
                               label="Employee ID" 
                               variant="outlined" 
                               value={passwordInput} 
                               type="password" 
                               onChange={(e) => setPasswordInput(e.target.value)}/>

                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        CLOSE
                    </Button>
                    <Button 
                        onClick={handleClose} 
                        color="primary" 
                        autoFocus 
                        onClick={() => onClickSubmit(employee)}
                    >
                        SUBMIT
                    </Button>
                    </DialogActions>
                </Dialog>

                {/* Clock-Out Model */}
                <Dialog
                    open={openClockOut}
                    onClose={handleClockOutClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{`Hello ${employee.name}, ${`It's Time to work now !`}  `}</DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">

                    <TextField id="outlined-basic" 
                               label="Employee ID" 
                               variant="outlined" 
                               type="password"
                               value={passwordInput}  
                               onChange={(e) => setPasswordInput(e.target.value)}/>

                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleClockOutClose} color="primary">
                        CLOSE
                    </Button>
                    <Button 
                        onClick={handleClose} 
                        color="primary" 
                        autoFocus 
                        onClick={() => onClickClockOutSubmit(employee)}
                    >
                        SUBMIT
                    </Button>
                    </DialogActions>
                </Dialog>
        </div>
    )
}