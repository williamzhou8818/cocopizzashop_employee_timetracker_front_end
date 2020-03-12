import React, {useState, useEffect} from 'react';


const Orders = () => {
 
    const [order, setOrder] = useState([{

    }])
    return (
    <div>
      <div>
            <p>This is order component</p>
            <button>Sent Email</button>
            <button>Print</button> 
      </div>
      <div><a>view all orders</a></div>
        
    </div>
    )
  
}


export default Orders;