import React, { useEffect, useState } from "react";
import cross_icon from "../../assets/cross_icon.png"
import './ListProduct.css'
const ListProduct = () => {
  const [allproducts,setAllProducts]= useState([])

  const fetchProducts= async()=>{
    await fetch("http://localhost:4000/getallproducts").then((res)=>{
      return res.json()

    }).then((data)=>{

      setAllProducts(data)
      console.log(data);
    }).catch((error)=>{

    })

  }
  const removeProduct = async(id)=>{
    await fetch("http://localhost:4000/deleteproduct",{
      method: "Post",
      headers:{
          Accept: 'application/json',
        'content-type': 'application/json',

      },
      body:JSON.stringify({id:id})
    })
    await  fetchProducts();
  }
  useEffect(()=>{
    fetchProducts();
  },[])
  return (
  <div className="list-product">
    <h1>All Products List</h1>
    <div className="listproduct-format-main">
      <p>Products</p>
      <p>Title</p>
      <p>Old Price</p>
      <p>New Price</p>
      <p>Category</p>
      <p>Remove</p>
    </div>
   <div className="listproduct-allproducts">
    <hr/>
    {
      allproducts.map((product,index)=>{
        return <>
        <div key={index} className="listproduct-format-main listproduct-format">
           <img src={product.image} alt="" className="listproduct-product-icon"></img>
           <p>{product.name}</p>
           <p>${product.old_price}</p>
           <p>&{product.new_price}</p>
           <p>{product.category}</p>
           <img className="listproduct-remove-icon" src={cross_icon} alt="" onClick={()=>removeProduct(product.id)}></img>

          </div>
          <hr/>
          </>
      })
    }

   </div>

  </div>)
};

export default ListProduct;
