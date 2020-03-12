import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom'; 
import axios from 'axios';
import moment from 'moment';

import './Receipt.styles.css';

const Receipt = () => {
 
    const [order, setOrder] = useState({
        cart_items:[]
    })

    useEffect(() => {
        axios.get('http://localhost:5000/api/orders').then(res => {
          //  console.log(res.data)
            res.data.map((order, i) => {
                setOrder(res.data[res.data.length - 1]);
            })
            
        })
    }, [])
    return (
<div className="receipt_main_wraper">
<Link to="/sales"><button className="receipt_back_button">Back</button></Link>

    <div className="receipt_wraper">
      <div>
            <h4>__ COCO PIZZA SHOP __</h4>
            <div className="receipt_header">
               <p>Phone: (03)98769588</p>
               <p>3A/434, Maroondah Hwy <br/> Croydon, VIC, 3136</p> 
               <p>Date: {moment(order.datetime_paid).format('MMM Do YYYY, h:mm a')} </p>
               <p>Receipt No: #00{order.id}</p>
            </div>
            <hr/>
            <div className="receipt_order_desc">
             <h5>ORDER ITEMS </h5>

               {order.cart_items.map((cartItem)=> {
                   return (
                       <>
                       <div className="receipt_item_title">
                        <p>{cartItem.product_title} ({cartItem.product_size}) x {cartItem.qty}</p>
                        <p>${(cartItem.product_price * cartItem.qty).toFixed(2)}</p>
                       </div>
                     
                            {cartItem.extra_toppings ? (
                                <p>
                                    {cartItem.extra_toppings.map((extraTopping) => {
                                        return (
                                        
                                        <span>Extras: +{extraTopping.extra_title} x {extraTopping.extra_qty} ${extraTopping.extra_qty}</span>
                                        )
                                    })}
                                </p>
                              
                            ) : (
                                null
                            )
                        }
                         {cartItem.take_out_topping ? (
                                <p>
                                    {cartItem.take_out_topping.map((takeoutTopping) => {
                                        return (
                                        <span>Withouts: -{takeoutTopping.takeout_title} </span>
                                        )
                                    })}
                                </p>
                              
                            ) : (
                                null
                            )
                        }
                       </>
                    
                    )
               })

               }

            </div>

       
        
      </div>
      <hr/>
      <div className="receipt_total_warper">
          <h5 className="reccipt_total">TOTAL ({ order.total_cart_item } ) ITEMS: <p>${(+order.total_charges).toFixed(2)}</p> </h5>
          <h5 className="reccipt_total">CASH:  <p>${(+order.recived_money).toFixed(2)} </p></h5>
          <h5 className="reccipt_total">CHANGE: <p>${(+order.change_money).toFixed(2)} </p> </h5>
      </div>
       
          
      <footer><a>Thank you for orders at coco pizza shop</a></footer>
          
    </div>
            <div>
                <button className="receipt_back_button">Email</button>
                <button className="receipt_back_button">Print</button> 
             </div>
</div>

    )
  
}


export default Receipt;