import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
/** styles */
import './Admin.styles.css';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { DATETIME } from 'mysql2/lib/constants/types';

const useStyles = makeStyles({
    table: {
      minWidth: 360,
    },
});
  
  

const AdminComponent = () => {
    const classes = useStyles();

    const [adminDashboard, setAdminDashboard] = useState([{
        employee_id: null,
        employee_name:null,
        hour_rate: null,
        clock_in_time:null, 
        clock_out_time:null,
        work_hours:null,
        date: null,
    }]);

    const [newAdminDashboard, setNewAdminDashboard] = useState([{
        employee_id: null,
        employee_name:null,
        hour_rate: null,
        clock_in_time:null, 
        clock_out_time:null,
        work_hours:null,
        date: null,
    }]);
    const [inputTrue, setInputTrue] = useState(false)



    const [payRollList, setPayRollList] = useState([{
        clock_in_time: null,
        clock_out_time: null,
        work_hours:null,
        date: null,
        dayilyPay: null,
    }]);

    const [totalWeeklyPay, setTotalWeeklyPay] = useState(0);

    const [totalWeeklyWorkingHours, setTotalWeeklyWorkingHours] = useState(0);

    const [selectedData, setSelectedData] = useState({
        employee_id:'',
        name: '',
        hour_rate: '',
        totalWeeklyPay: ''
    });

    const  onSearchInput = (e)  => {
        let _adminDashboardFilter = adminDashboard.filter(adminDashboardFil =>  adminDashboardFil.employee_name == e.target.value);
        console.log('_dashboard ' + _adminDashboardFilter.map(x => x.employee_id))
        let _NewDashboard = []; 
        _adminDashboardFilter.forEach(data => {
            _NewDashboard.push({
                employee_id: data.employee_id,
                employee_name: data.employee_name,
                hour_rate: data.hour_rate,
                clock_in_time: data.clock_in_time,
                clock_out_time: data.clock_out_time,
                work_hours: data.work_hours,
                date: data.date
            })

        })       
           
        setNewAdminDashboard( _NewDashboard )
        if (e.target.value && e.target.value.length) {
            setInputTrue(true);
        } else {
            setInputTrue(false);

        }
           
    }

    useEffect(() => {
        axios.get('http://localhost:5000/api/admin')
            .then(res => {
                //console.log(res.data)
                let _ResData = res.data;
                let _NewDashboard = [];
                 _ResData.forEach(data => {
                    let dataWorkeHour = data.work_hours;
                    if (dataWorkeHour == 0) return null; 
                    let hoursMinutes = dataWorkeHour.split(/[.:]/);
                    let hours = parseInt(hoursMinutes[0], 10);
                    let minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
                    let DecTimes = (hours + minutes / 60).toFixed(1);
                    _NewDashboard.push({
                        employee_id: data.employee_id,
                        employee_name: data.employee_name,
                        hour_rate: data.hour_rate,
                        clock_in_time: data.clock_in_time,
                        clock_out_time: data.clock_out_time,
                        work_hours: parseFloat(Number(DecTimes)),
                        date: data.date
                    })


                    //console.log('data cover' + _NewDashboard)
                   
                })


                setAdminDashboard(_NewDashboard)

         // eslint-disable-next-line
    }, []);



            
})


    const onPayRollClicked = (index_id) => {
         // SET Click ITEM DATA 
        console.log(adminDashboard[index_id])

         setSelectedData({
            employee_id: adminDashboard[index_id].employee_id,
            name: adminDashboard[index_id].employee_name,
            hour_rate: adminDashboard[index_id].hour_rate,
         })
         let DayilyPay =  adminDashboard[index_id].hour_rate * adminDashboard[index_id].work_hours;
  
         
         let _payroll_list;
         let _savePaidLogs;

         _payroll_list = {
            clock_in_time: adminDashboard[index_id].clock_in_time,
            clock_out_time: adminDashboard[index_id].clock_out_time,
            work_hours: adminDashboard[index_id].work_hours,
            data: adminDashboard[index_id].date,
            dayilyPay: DayilyPay
         }

         _savePaidLogs = {
            employee_id: adminDashboard[index_id].employee_id,
            employee_name: adminDashboard[index_id].employee_name,
            working_date: moment(adminDashboard[index_id].date).format("MMM Do YY"),
            clock_in_time: adminDashboard[index_id].clock_in_time,
            clock_out_time: adminDashboard[index_id].clock_out_time,
            daily_paid: DayilyPay,
            ref_payrolls_pay_on_date: moment(Date()).format("MMM Do YY"),
         }
         // save to database is_paid_logs
         axios.post('http://localhost:5000/api/ispaidlogs', _savePaidLogs)
              .then(res => console.log(res))


        
        let day_total = [];
        let working_hour_total = [];

        let weeklyTotalPay = _payroll_list.dayilyPay;
        let weeklyWorkingHour = Number(_payroll_list.work_hours);

        payRollList.map(x => {
             day_total.push(x.dayilyPay);
             working_hour_total.push(Number(x.work_hours))
             //console.log(Number(x.work_hours))
            
        })
        for(let i=1; i<day_total.length; i++) {
            weeklyTotalPay += day_total[i];
        }  
        for(let i=1; i<working_hour_total.length; i++) {
            weeklyWorkingHour += working_hour_total[i];
        }  
       // console.log(weeklyWorkingHour)

       
         setPayRollList([...payRollList, _payroll_list]);

         // sum up dayliy pay
         //console.log(getTotal())
         setTotalWeeklyPay(weeklyTotalPay);
        //  setTotalWeeklyWorkingHours(weeklyTotalWorkHour);
         setTotalWeeklyWorkingHours(weeklyWorkingHour);
         

    }

   const  SavePayRollData = (selectedData) => {
        console.log(selectedData)
       let  PayRollTotal = {
            employee_id: selectedData.employee_id,
            employee_name: selectedData.name,
            hour_rate: selectedData.hour_rate,
            total_hours_worked:totalWeeklyWorkingHours,
            total_weekly_paid: totalWeeklyPay,
            paid_on_date: moment(Date()).format("MMM Do YY")

        }

        axios.post('http://localhost:5000/api/payrolls', PayRollTotal)
            .then((res)=>{})
            .catch((err) => console.log(err))


    //    console.log('save payroll clicked ' +  PayRollTotal.employee_id )
    //    console.log('save payroll clicked ' +  PayRollTotal.employee_name )
    //    console.log('save payroll clicked ' +  PayRollTotal.total_hours_worked )
    //    console.log('save payroll clicked ' +  PayRollTotal.total_weekly_pay )
    //    console.log('save payroll clicked ' +  PayRollTotal.is_paid_done )
    //    console.log('save payroll clicked ' +  PayRollTotal.date_of_paid )
   }


    
    return (
     <>
            <div className="">
                <TextField 
                    id="filled-search" label="Search field" type="search"
                    onChange={(e) =>  onSearchInput(e) }
                />
            </div>
            
            <Button variant="outlined" color="">Reload Data</Button>
            {/* <Button variant="outlined" color="primary">Create PayRole</Button> */}

            <TableContainer component={Paper} style={{overflow:'scroll', height:"400px"}}>
            <Table   className={classes.table} aria-label="simple table" >
                <TableHead>
                <TableRow>
                    <TableCell>EmpoyleeID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">ClockIn Time</TableCell>
                    <TableCell align="right">ClockOut Time</TableCell>
                    <TableCell align="right">Work Hours</TableCell>
                    <TableCell align="right">Date</TableCell>

                </TableRow>
                </TableHead>
                { !inputTrue ? ( 
                         <TableBody>
           
                         {adminDashboard.map((row, index) =>  {
             
                         return (
                          
                             <TableRow key={row.name}>
                             <TableCell component="th" scope="row">
                                 {row.employee_id}
                             </TableCell>
                             <TableCell align="right">{row.employee_name}</TableCell>
                             <TableCell align="right">{row.clock_in_time}</TableCell>
                             <TableCell align="right">{row.clock_out_time}</TableCell>
                             <TableCell align="right">{row.work_hours}</TableCell>
                             <TableCell align="right">{moment(row.date).format("MMM Do YY")}</TableCell>
                             <TableCell align="right"><button onClick={() => onPayRollClicked(index)}>+PayRoll</button></TableCell>
         
                             </TableRow>
                         )}
                         )}
                         </TableBody>
                ) : (
                    <TableBody>
           
                    {newAdminDashboard.map((row, index) =>  {
        
                    return (
                     
                        <TableRow key={row.name}>
                        <TableCell component="th" scope="row">
                            {row.employee_id}
                        </TableCell>
                        <TableCell align="right">{row.employee_name}</TableCell>
                        <TableCell align="right">{row.clock_in_time}</TableCell>
                        <TableCell align="right">{row.clock_out_time}</TableCell>
                        <TableCell align="right">{row.work_hours}</TableCell>
                        <TableCell align="right">{moment(row.date).format("MMM Do YY")}</TableCell>
                        <TableCell align="right"><button onClick={() => onPayRollClicked(index)}>+PayRoll</button></TableCell>
    
                        </TableRow>
                    )}
                    )}
                    </TableBody>
                )
                    
                }
               
               
            </Table>
            </TableContainer>
            <div className="payroll_warper">
                <p>Name: {selectedData.name} </p>
                <p>Hour Rate: ${selectedData.hour_rate}</p>
                <p>Total Hours Worked: {totalWeeklyWorkingHours} h</p>
                <p>Total Weekly Pay: ${totalWeeklyPay}</p>
                
            <TableContainer component={Paper} style={{overflow:'scroll', height:"400px", width:"100%"}}>
                <Table   className={classes.table} aria-label="simple table" >
                    <TableHead>
                    <TableRow>
                        <TableCell align="right">Date</TableCell>
                        <TableCell align="right">ClockIn Time</TableCell>
                        <TableCell align="right">ClockOut Time</TableCell>
                        <TableCell align="right">Working Hours</TableCell>
                        <TableCell align="right">Dayily Pay</TableCell>
                        

                    </TableRow>
                    </TableHead>
                    <TableBody>
                    { payRollList.map(payroll => {
                        return (
                            <TableRow key={payroll.id}>
                                <TableCell align="right">{moment(payroll.date).format("MMM Do YY")}</TableCell>
                                <TableCell align="right">{payroll.clock_in_time}</TableCell>
                                <TableCell align="right">{payroll.clock_out_time}</TableCell>
                                <TableCell align="right">{payroll.work_hours} h</TableCell>
                                <TableCell align="right">${payroll.dayilyPay}</TableCell>
                             </TableRow>
                        )
                    })

                    }
                    </TableBody>
                </Table>
                </TableContainer>
                <div > 
                    
                  <Button variant="contained" onClick={() => SavePayRollData(selectedData)}>Save PayRoll</Button>

                </div>
            </div>
           
        </>   
    );
};

export default AdminComponent;

