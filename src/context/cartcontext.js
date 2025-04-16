// src/context/CartContext.js
"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import {shopifyClient} from "@/lib/shopify";
import {gql} from "@apollo/client";
import {useAuth} from "@/context/authcontext";
import {getUserCart,saveUserCart} from "@/lib/cart";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const DELETE_CART_ITEM = gql`mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
            id
            lines(first: 100) {
                edges {
                    node {
                        id
                        quantity
                        merchandise {
                        ... on ProductVariant {
                                title
                                product {
                                    title
                                }
                            }
                        }
                    }
                }
            }
            checkoutUrl
            buyerIdentity{
                customer{
                    email
                }
            }
        }
        userErrors {
            field
            message
        }
    }
}
`;

const CART_CREATE = gql`
mutation cartCreate($input: CartInput) {
  cartCreate(input: $input) {
    cart {
      id
      checkoutUrl
        buyerIdentity{
            customer{
                email
            }
        }
    }
  }
}`;

const GET_CART = gql`
query getCart($cartId: ID!) {
  cart(id: $cartId) {
    id
    lines(first: 10) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
                price{
                    amount
                    currencyCode
                }
              product {
                title
                featuredImage {
                  url
                }
                  
              }
            }
          }
        }
      }
    }
    estimatedCost {
      totalAmount {
        amount
        currencyCode
      }
    }
      buyerIdentity{
          customer{
              email
          }
      }
      checkoutUrl
  }
}
`;

const UPDATE_CART_MUTATION = gql`
    mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          lines(first: 20) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      title
                      featuredImage {
                        url
                      }
                    }
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
          estimatedCost {
            totalAmount {
              amount
              currencyCode
            }
          }
            buyerIdentity{
                customer{
                    email
                }
            }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

const CART_LINES_ADD = gql`
mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart {
      id
    }
  }
}
`;

export const CartProvider = ({ children }) => {
    const [cartId, setCartId] = useState(null);
    const [cart, setCart] = useState(null);
    const [totalItems, setTotalItems] = useState(0);
    const {user} = useAuth();

    const fetchCartBasedOnUserId = async(userId)=>{
        const data = await getUserCart(userId);
        await fetchCart(data);
        if(!data){
            await createCart();
        }
    }

    const saveUserCartIfExists = async ()=>{

        const userEmail = localStorage.getItem('userEmail');
        console.log(userEmail);
        if(cart?.lines?.edges?.length > 0){
            const response = await saveUserCart(userEmail,cartId);
            console.log(response);
        }

    }

    // Initialize or load cart
    useEffect(() => {
        if(!user){
            saveUserCartIfExists();
            return;
        }
        const storedCartId = localStorage.getItem('cart_id');
        if (storedCartId) {
            setCartId(storedCartId);
            fetchCart(storedCartId);
        } else {
            fetchCartBasedOnUserId(user.email);
        }
    }, [user]);



    const createCart = async () => {
        const input = {}

        if(user){
            const token = localStorage.getItem('auth_token');
            input.buyerIdentity = {
                customerAccessToken:token,
            }
        }
        console.log('input',input);
        const data = await shopifyClient.mutate({
            mutation:CART_CREATE,
            variables:{input}
        })

        console.log("cart created",data);
        const newCartId = data.data.cartCreate.cart.id;
        setCart(data.data.cartCreate);
        setCartId(newCartId);
        localStorage.setItem('cart_id', newCartId);
    };

    const fetchCart = async (id,flagAddToCart=false) => {
        if (!id) return;

        setCartId(id);
        const {data} = await shopifyClient.query({
            query: GET_CART,
            variables: {cartId: id},
        })

        console.log("cart fetched",data)
        setCart(data?.cart);
        if(!flagAddToCart)
        setTotalItems(data?.cart.lines.edges.length);
    };

    const addToCart = async (variantId, quantity = 1) => {

        setTotalItems(prev=>prev+1);
        const {data} = await shopifyClient.mutate({
            mutation:CART_LINES_ADD,
            variables:{cartId,lines:[{
                merchandiseId: variantId,
                    quantity:quantity
                }]}
        });

        console.log(data)
        await fetchCart(data.cartLinesAdd.cart.id,true);
    };

    const updateCart = async(lineId,quantity)=>{
        const {data} = await shopifyClient.mutate({
            mutation:UPDATE_CART_MUTATION,
            variables:{
                cartId,
                lines:[
                    {
                        id:lineId,
                        quantity:quantity
                    }
                ]
            }
        })

        console.log(data);

        await fetchCart(data.cartLinesUpdate.cart.id,false);



    }

    const deleteCartItem = async (lineId) => {

        const {data} = await shopifyClient.mutate({
            mutation:DELETE_CART_ITEM,
            variables:{cartId,lineIds: [lineId]}
        })

        console.log(data)
        await fetchCart(data.cartLinesRemove.cart.id,false);

    }

    return (
        <CartContext.Provider value={{ cart, addToCart,totalItems,fetchCart,updateCart,deleteCartItem }}>
            {children}
        </CartContext.Provider>
    );
};
