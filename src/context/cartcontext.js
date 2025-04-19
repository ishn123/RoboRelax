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
                                    tags

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
            estimatedCost {
                totalAmount {
                    amount
                    currencyCode
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
                                tags

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
                  tags
                  
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
                        tags
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
      cart{
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
                                  tags

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
}
`;

const CART_BUYER_IDENTITY_UPDATE = gql`
    mutation cartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
    cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
        cart {
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
                                    tags

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
        userErrors {
            field
            message
        }
    }
}
`;

export const CartProvider = ({ children }) => {
    const [cartId, setCartId] = useState(null);
    const [cart, setCart] = useState(null);
    const [totalItems, setTotalItems] = useState(0);
    const {user,isGuest} = useAuth();

    const fetchCartBasedOnUserId = async(userId)=>{

        const data = await getUserCart(userId);
        console.log("user cart data",data)
        if(data == null){
            if(cartId==null){
                await createCart();
            }
            const {data} = await shopifyClient.mutate({
                    mutation:CART_BUYER_IDENTITY_UPDATE,
                    variables:{
                        cartId:localStorage.getItem("cart_id"),
                        buyerIdentity:{
                            customerAccessToken:localStorage.getItem('auth_token')
                        }


                    }
            });
            console.log(data)
                setCartId(data?.cartBuyerIdentityUpdate.cart.id);
                setCart(data?.cartBuyerIdentityUpdate.cart);
        }else{
            if(cartId == null) {

                await createCart();
                await mergeCartsOnLogin(cartId,data)

            }else{

                await mergeCartsOnLogin(cartId,data)
            }

        }


    }
    async function attachBuyerIdentity(cartId, customerCartId) {
        const mutation = gql`
    mutation cartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
      cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: { customerAccessToken: $customerAccessToken }) {
          cart {
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
    }
  `;

        const res = await shopifyClient.query({
            query: mutation,
            variables: { cartId,
                buyerIdentity: {
                    customerAccessToken: localStorage.getItem('auth_token')
                }
            },
        });


        setCartId(res.data.cartBuyerIdentityUpdate.cart.id);
        setCartId(res.data.cartBuyerIdentityUpdate.cart);
        setTotalItems(res.data.cartBuyerIdentityUpdate.cart.lines.edges.length);
    }

    async function addItemsToCart(cartId, items) {
        setTotalItems(prev=>prev+items.length);
        const {data} = await shopifyClient.mutate({
            mutation:CART_LINES_ADD,
            variables:{cartId,lines:items}
        })
        console.log(data)
        return data.cartLinesAdd;
    }

    async function getCustomerCart(customerCartId) {
        const {data} = await shopifyClient.query({
            query: GET_CART,
            variables:{cartId:customerCartId}
        });

        return data;
    }

    async function mergeCartsOnLogin(guestCartId, customerCartId) {
        const userCart = await getCustomerCart(customerCartId);
        const guestItems = await getGuestCartItems(guestCartId);

         console.log(userCart,guestItems)
        if (userCart?.cart.id) {
            if(guestItems.length > 0) {
                const data = await addItemsToCart(userCart.cart.id, guestItems);

                setCartId(data.cart.id); // Update global context or localStorage
                setCart(data.cart)
                setTotalItems(data.cart.lines.edges.length);
            }else {
                setCartId(userCart.cart.id); // Update global context or localStorage
                setCart(userCart.cart)
                setTotalItems(userCart.cart.lines.edges.length);
            }
        } else {
            await attachBuyerIdentity(guestCartId, customerCartId);
            setCartId(guestCartId);


        }



    }
    async function getGuestCartItems(cartId) {
        if(!cartId){
            cartId = localStorage.getItem('cart_id');
        }
        const query = gql`
    query($cartId: ID!) {
      cart(id: $cartId) {
        lines(first: 100) {
          edges {
            node {
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                }
              }
            }
          }
        }
      }
    }
  `;
        const res = await shopifyClient.query({
            query,
            variables: { cartId },
        });

        return res?.data?.cart?.lines?.edges?.map(({ node }) => ({
            quantity: node.quantity,
            merchandiseId: node.merchandise.id,
        }));
    }


    const saveUserCartIfExists = async ()=>{

        const userEmail = localStorage.getItem('userEmail');

        console.log("fmorfmrofmfomr", userEmail);

        if(userEmail && cart?.lines?.edges?.length > 0){
            const response = await saveUserCart(userEmail,cartId);
        }
        if(userEmail)
        localStorage.removeItem('userEmail');
        if(isGuest)createGuestCartIfUserNotExists();
    }

    // Initialize or load cart


    // let's check if user exits or not


    // Case 1: Lets say user is logged In



    // Case 2: Lets say user is not logged in, we still create a cart and later we will merge his cart if exist
    // with the guest cart created for him

    const createGuestCartIfUserNotExists = async ()=>{
        await createCart();
    }

    const saveCartBeforeUserLogoutIfExists = async ()=>{
        if(cart?.lines?.edges?.length > 0){
            console.log(cart);
            const {data} = await shopifyClient.mutate({
                mutation: CART_BUYER_IDENTITY_UPDATE,
                variables: {
                    cartId,
                    buyerIdentity:{
                        customerAccessToken:localStorage.getItem('auth_token')
                    }
                }
            })
            await saveUserCart(user.email,data.cartBuyerIdentityUpdate.cart.id);
        }else{

        }
        await refreshEntireCart();
    }

    const refreshEntireCart = async()=>{
        await createCart();
    }

    // When the component mount initially
    useEffect(() => {
        if(!user){
            if(localStorage.getItem('cart_id')){
                fetchCart(localStorage.getItem('cart_id'),false);
            }else{
                createCart();
                }
        }else{
            fetchCartBasedOnUserId(user.email);
        }

    }, [user]);


    // Cart related actions start here
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
        setCart(data.data.cartCreate.cart);
        setCartId(newCartId);
        setTotalItems(data.data.cartCreate.cart.lines.edges.length);
        localStorage.setItem('cart_id',newCartId);

    };

    const fetchCart = async (id,flagAddToCart=false) => {
        if (!id) return;


        const {data} = await shopifyClient.query({
            query: GET_CART,
            variables: {cartId: id},
        })

        setCart(data?.cart);
        setCartId(data?.cart.id);
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

        setCart(data.cartLinesAdd.cart);
        setCartId(data.cartLinesAdd.cart.id);
        //fetchCart(data.cartLinesAdd.cart.id,true);
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
            },
        })

        console.log(data);
        setCartId(data.cartLinesUpdate.cart.id);
        setCart(data.cartLinesUpdate.cart);
        setTotalItems(data.cartLinesUpdate.cart.lines.edges.length);

        //await fetchCart(data.cartLinesUpdate.cart.id,false);



    }

    const deleteCartItem = async (lineId) => {

        const isAppointment = cart.lines.edges.find((line)=>{
            return lineId === line.node.id  && line.node.merchandise.product.tags.includes("featured");
        })
        const {data} = await shopifyClient.mutate({
            mutation:DELETE_CART_ITEM,
            variables:{cartId,lineIds: [lineId]}
        })

        setCartId(data.cartLinesRemove.cart.id);
        setCart(data.cartLinesRemove.cart);
        setTotalItems(data.cartLinesRemove.cart.lines.edges.length);

        if(isAppointment){
            return true;
        }
        return false;

    }

    // Cart related actions end here

    return (
        <CartContext.Provider value={{ cart, addToCart,totalItems,fetchCart,updateCart,deleteCartItem,saveCartBeforeUserLogoutIfExists }}>
            {children}
        </CartContext.Provider>
    );
};
