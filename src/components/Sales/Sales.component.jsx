import React, {useEffect, useState}  from 'react';
import axios from 'axios';

import './Sales.style.css';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { makeStyles } from '@material-ui/core/styles';

import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';



const useStyles = makeStyles(theme => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
   
  }));
const Sales = () => { 

    const classes = useStyles();

    const [open, setOpen] = React.useState(false);
    const [openChargeModle, setOpenChargeModle] = useState(false);
    const [scroll, setScroll] = React.useState('paper');

   

      const descriptionElementRef = React.useRef(null);
      React.useEffect(() => {
        if (open) {
          const { current: descriptionElement } = descriptionElementRef;
          if (descriptionElement !== null) {
            descriptionElement.focus();
          }
        }
                
        if (cartItems){ 
            let to = 0;
            let array = totalCharges;
            for(let i=0; i<array.length; i++) {
                to += array[i]
            }
            setTotalCharge(to)
        }

      }, [open]);


    const [products, setProducts] = useState([{
        ref_pizzas_categories_id: '',
        tittle:'',
        image:'',
        selections:[{}],
        toppings:[{}],

    }]);

    const [product, setProduct] = useState({
        ref_pizzas_categories_id: '',
        tittle:'',
        image:'',
        qty: 1,
        selection:{},
        toppings:[]
    })

    const [cartItems, setCartItems] = useState([
        // {
        //     product_title:'',
        //     product_price: '',
        //     product_size:'',
        //     extra_toppings: null,
        //     take_out_topping: null,
        //     total_extra_toppping_price: null,
        //     total_pizza_unit_price: 0,
        //     qty: 0
        // }
    ]);
    const [totalCharges, setTotalCharges] = useState([]);
    const [totalCharge, setTotalCharge] = useState(0);
    const [inputCash, setInputCash] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/api/products').then(res => {
            // console.log(res.data);
            setProducts(res.data)
        })
        


     // eslint-disable-next-line
    },[]);




    /** functions */
    const openToppingsModel = (scrollType, index, selection, product_title, qty) => {
        setOpen(true);
        setScroll(scrollType);

        const  cartItem = {
            product_title: product_title,
            selection: selection,
            toppings: products[index].toppings,
            qty: qty,
            extra_top: null,
            no_top:null,
            total_price: null,
            qty: 1
        }
        setProduct(cartItem);



        //console.log('save to cart', cartItem );
    }

    const handleClickOpen = (scrollType, index )=> () => {
        setOpen(true);
        setScroll(scrollType);
        // console.log('handle open index' + index)

        setProduct(products[index])

      };
    
      const handleClose = () => {
        setOpen(false);
      };

    
    const subtracProductQty = () => {
            setProduct({
                ...product, 
                qty: product.qty - 1 })
    }
    const addProductQty = () => {
        setProduct({
            ...product, 
            qty: product.qty + 1 })
}



    const subtracTopQty = (topping, size, index) => {

            // console.log(size)
            let _selectedToping = {
                title: topping.title,
                price: topping.price - 0.5,
                qty: topping.qty - 1
            }

            if (size === 'S' && topping.qty > 0) {
                
                let _selectedToping = {
                    title: topping.title,
                    price: topping.price - 0.5,
                    qty: topping.qty - 1
                }
                let ToppingArrary = product.toppings;
                ToppingArrary[index].qty = _selectedToping.qty;
                ToppingArrary[index].price = _selectedToping.price;
                if (topping.qty == 0) {
                    ToppingArrary[index].price = 0;
                }
                
                setProduct({
                    ...product,
                    toppings:ToppingArrary
                })
            } else if (size === 'L' && topping.qty > 0) {
                let _selectedToping = {
                    title: topping.title,
                    price: topping.price - 1,
                    qty: topping.qty - 1
                }
                let ToppingArrary = product.toppings;
                ToppingArrary[index].qty = _selectedToping.qty;
                ToppingArrary[index].price = _selectedToping.price;
                if (topping.qty == 0) {
                    ToppingArrary[index].price = 0;
                }
                
                setProduct({
                    ...product,
                    toppings:ToppingArrary
                })
            } else if (size === 'F' && topping.qty > 0) {
                let _selectedToping = {
                    title: topping.title,
                    price: topping.price - 1.5,
                    qty: topping.qty - 1
                }
                let ToppingArrary = product.toppings;
                ToppingArrary[index].qty = _selectedToping.qty;
                ToppingArrary[index].price = _selectedToping.price;
                if (topping.qty == 0) {
                    ToppingArrary[index].price = 0;
                }
                setProduct({
                    ...product,
                    toppings:ToppingArrary
                })
            }

      
        
            
            //console.log(_selToping)
        
      } 

      const plusTopQty = (topping, size, index) => {
        //console.log(size)
        let _selectedToping = {
            title: topping.title,
            price: topping.price + 0.5,
            qty: topping.qty + 1
        }
       
        if (size === 'S') {
            let _selectedToping = {
                title: topping.title,
                price: topping.price + 0.5,
                qty: topping.qty + 1
            }
            let ToppingArrary = product.toppings;
            ToppingArrary[index].qty = _selectedToping.qty;
            ToppingArrary[index].price = _selectedToping.price;
    
            if (topping.qty == 1) {
                ToppingArrary[index].price = 0;
            }
            setProduct({
                ...product,
                toppings:ToppingArrary
            })
        } else if (size === 'L' ) {
            let _selectedToping = {
                title: topping.title,
                price: topping.price + 1,
                qty: topping.qty + 1
            }
            let ToppingArrary = product.toppings;
            ToppingArrary[index].qty = _selectedToping.qty;
            ToppingArrary[index].price = _selectedToping.price;
            if (topping.qty == 1) {
                ToppingArrary[index].price = 0;
            }
            
            setProduct({
                ...product,
                toppings:ToppingArrary
            })
        } else if (size === 'F' ) {
            let _selectedToping = {
                title: topping.title,
                price: topping.price + 1.5,
                qty: topping.qty + 1
            }
            let ToppingArrary = product.toppings;
            ToppingArrary[index].qty = _selectedToping.qty;
            ToppingArrary[index].price = _selectedToping.price;
            if (topping.qty == 1) {
                ToppingArrary[index].price = 0;
            }
            setProduct({
                ...product,
                toppings:ToppingArrary
            })
        }

      }

    const handleSaveToCart = () => {

        let newCartItems = [];
        let extra_toppings = []; // loop and filter extra topping item
        let take_out_toppings = [];  // loop and filter 
        let total_extra_toppping_price = 0;
        let total_pizza_unit_price = 0;

        let total_charges = [];
        
       
        product.toppings.map((topping) => {
            if (topping.qty >= 2) {
                let extra_detail_obj = {
                    extra_title: topping.title,
                    extra_qty: topping.qty - 1,
                    extra_price: topping.price
                }
                extra_toppings.push(extra_detail_obj)
            } else if (topping.qty < 1) {
                let takeout_detail_obj = {
                    takeout_title: topping.title,
                    takeout_qty: topping.qty
                }
                take_out_toppings.push(takeout_detail_obj)
            }
            

             
        })
        
        extra_toppings.forEach(extraTops => {
            total_extra_toppping_price += extraTops.extra_price;
            total_pizza_unit_price = total_extra_toppping_price + (product.selection.price * product.qty);

           
             
        })

        
        // console.log(total_extra_toppping_price);

         let _TotalCharges = total_extra_toppping_price + product.selection.price * product.qty;
        
        

        setTotalCharges([...totalCharges, _TotalCharges]);


        total_charges.push(_TotalCharges);


        // console.log(product.product_title)
        // console.log(product.selection.price)
        // console.log(product.selection.size)
        // console.log(extra_toppings)
        // console.log(take_out_toppings)

        let _newCartItem = {
             product_title: product.product_title,
             product_price: product.selection.price,
             product_size: product.selection.size,
             extra_toppings: extra_toppings,
             take_out_topping: take_out_toppings,
             total_extra_toppping_price:total_extra_toppping_price,
             total_pizza_unit_price: total_pizza_unit_price,
             qty: product.qty,
             charges: 0

        }

        newCartItems.push(_newCartItem);


        setCartItems([...cartItems, _newCartItem])

        setOpen(false);

        
    }
    


      /** Open models */
    const onHandelCharges = () => {
        setOpenChargeModle(true);
    }
    const handleClickCloseCharge = () => {
        setOpenChargeModle(false);
    }   

    //Start PAY BUTTON
    const handleClickPays = (cartItems, totalCharges, recived_money, ChangeMoney) => {
        let _Orders = {
            cartItems: cartItems,
            totalCharges: totalCharges,
            recived_money: recived_money,
            ChangeMoney: ChangeMoney,
            isPaid: true
        }
        console.log(_Orders);
       // setOpenChargeModle(false);
       //OPEN CASH DRAW and Clear cart and clear input price 
       setCartItems([]);
       setTotalCharge(0.00)
       //setInputCash(null)

    } //END

   /**open model */
   


    return (
        <>

        <div className="pos_view_wraper">
              <div className="product_card">
                    { products.map((product,index) => {
                        return (
                            
                                <div key={index}  className="product_card_wraper">
                                    <div className="product_img">
                                        <img src={product.image} alt={product.tittle} width="100%" height="100%" />
                                    </div>
                                    <div className="product_title">
                                       <p>{product.tittle}</p>
                                    </div>
                                    <div className="extra_button"> 
                                        {product.selections.map(selection => {
                                            return (
                                                    <div className="product_selections" onClick={() => openToppingsModel('paper',index, selection, product.tittle, product.qty)}>
                                                        ${selection.price} {`(${selection.size})`}
                                                    </div>
                                                )
                                        })}
                                    
                                        {/* <div>
                                            <button onClick={handleClickOpen('paper', index)}>Extras</button> 
                                            <button>Details</button> 
                                        </div>
                                            */}
                                    

                                    </div>
                                </div>
                        
                        )
                    })

                    }
                </div>
                <div className="cart_item_list">
                    <p>Items ( {cartItems.length} )</p>
                    <p></p>
                    { cartItems.map((cartItem, i) => {
                  
                        return (
                            <> 
                                 <div className="cart_item_list_title">  {i+1}) 
                                        {cartItem.product_title} x 
                                        {cartItem.qty} ... 
                                       <>
                                        {cartItem.total_pizza_unit_price ? (
                                            <div> ${cartItem.total_pizza_unit_price.toFixed(2)} </div>
                                        ) : (  
                                            <div> ${(cartItem.product_price * cartItem.qty).toFixed(2)} </div>
                                            )}
                                       </> 
                                        / {cartItem.product_size}
                                </div>
                                <div> {cartItem.extra_toppings.map(extra_top => {
                                    
                                            return (
                                                <>
                                                {extra_top.extra_title && (
                                                       <div className="cart_item_sub_title"> + {extra_top.extra_title} x {extra_top.extra_qty} ${extra_top.extra_price}, 

                                                    
                                                       </div>
                                                )                             
                                                 
                                                }
                            
                                               
                                                </>
                                            )
                                      })} 
                                </div>
                                <div> {cartItem.take_out_topping.map(takout_top => {
                                    
                                    return (
                                        <>
                                        {takout_top.takeout_title && (
                                               <> - {takout_top.takeout_title},  </>
                                        )                             
                                         
                                        }
                    
                                       
                                        </>
                                    )
                              })} 
                                
                        </div>
                        <hr/>
                      
                            
                            </>
                        )
                    
                      })

                    }

                        {/* <p>Your cart is Empty</p> */}
                    <div className="show_charge" type="button" onClick={onHandelCharges}>
                       
                         <p>Total: ${totalCharge.toFixed(2)}</p>
                    </div>
                       
                </div>
                
        </div>


{/* Start for harges Dialog Two */}

                

{/* End of Dialog Two */}

           

{/* Dialog One  */}
     <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
         <DialogTitle id="scroll-dialog-title">{product.product_title} ${product.selection.price} _ {product.selection.size} <br/>
                <div className="toppings_button">
                 <button type="button" onClick={() => subtracProductQty()} > - </button>
                            <input value={product.qty} />
                 <button type="button" onClick={() => addProductQty() }> + </button>
                 </div>
         </DialogTitle>
        <DialogContent dividers={scroll === 'paper'}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            { product.toppings.map((topping, index) => {
                  return (
                      <div className="toppings_button">
                        <p>{`${index+1}`}) {topping.title} / ${topping.price} </p>
                        <button onClick={() => subtracTopQty(topping, product.selection.size, index)}> - </button>
                            <input value={topping.qty} />
                        <button onClick={() => plusTopQty(topping, product.selection.size, index)}> + </button>
                       
                      </div>
                  )
              })
            
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleSaveToCart() } color="primary">
             ADD
          </Button>
        </DialogActions>
      </Dialog>

      <>
     <Dialog onClose={handleClickCloseCharge} aria-labelledby="simple-dialog-title" open={openChargeModle}>
      <DialogTitle id="simple-dialog-title">Cash Payments</DialogTitle>
      <DialogActions>
          <Button onClick={handleClickCloseCharge} color="primary">
            Back
          </Button>
          <Button onClick={() => handleClickPays(cartItems, totalCharge.toFixed(2), inputCash, (inputCash - totalCharge).toFixed(2) ) } color="primary">
             $Pay
          </Button>
        </DialogActions>
        <DialogContent dividers={scroll === 'paper'}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <h1>Total: ${totalCharge.toFixed(2)}</h1>
            <h1>
                Cash:  <FormControl fullWidth className={classes.margin} variant="filled">
                        <InputLabel htmlFor="filled-adornment-amount"></InputLabel>
                        <FilledInput
                            id="filled-adornment-amount"
                            value={inputCash}
                            onChange={(e) => setInputCash(e.target.value)}
                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                        />
                        </FormControl>
            </h1>
            <h1>Changes: ${(inputCash - totalCharge).toFixed(2) }</h1>
          </DialogContentText>
        </DialogContent>
    </Dialog>
      </>

      </>
     
    )

}

export default Sales;