// import Stripe from "@stripe/stripe-js";
import { NextRequest, NextResponse } from "next/server";

import Stripe from 'stripe';
const gatway = new Stripe(process.env.STRIPE_SCREATE_KEY as string);
interface product{
    name:string;
    price:number;
}

export const POST = async(request:NextRequest)=>{
    try {
      const data: product = await request.json();
      console.log({ data });

    //   const consumer = await gatway.customers.create({
    //     description: data.name,
    //   });
      // console.log({consumer});

      // const invoiceItem = await gatway.invoiceItems.create({
      //     customer:consumer.id,
      //     amount:data.price*100,
      //     currency:'INR',
      //     description:data.name
      // })
      // console.log({ invoiceItem });

      // // @ts-ignore
      // const invoice  = await gatway.invoices.create({
      //     collection_method:'send_invoice',
      //     customer:invoiceItem.customer
      // })

        const consumer = await gatway.customers.create({
          //   description: data.name,
          name: "Jenny Rosen",
          address: {
            line1: "510 Townsend St",
            postal_code: "98140",
            city: "San Francisco",
            state: "CA",
            country: "US",
          },
        });
      const checkoutSession = await gatway.checkout.sessions.create({
        payment_method_types: ["card"],
        customer: consumer.id,
        line_items: [
          {
            price_data: {
              currency: "inr",
              unit_amount:data.price*100,
              product_data:{
                name:data.name
              }
            },
            // price: data.price as unknown as string, // Replace with the actual price ID from your Stripe Dashboard
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: "https://your-app.com/success",
        cancel_url: "https://your-app.com/cancel",
      });
      // console.log({invoice});

      if(checkoutSession.url){
          return NextResponse.json({msg:"done",url:checkoutSession.url});
      }
      console.log({ checkoutSession });
      
      return NextResponse.json({msg:"error"});

      // const params: Stripe.Checkout.SessionCreateParams = {
      //   submit_type: "donate",
      //   payment_method_types: ["card"],
      //   line_items: [
      //     {
      //       //   name: data.name,
      //       price: `${(data.price  * 100)}`,
      //      quantity:1,

      //     },
      //   ],
      //   success_url: `${request.headers["origin"]}/result?session_id={CHECKOUT_SESSION_ID}`,
      //   cancel_url: `${request.headers.origin}/result?session_id={CHECKOUT_SESSION_ID}`,
      // };

    //   return NextResponse.json(
    //     { msg: data },
    //     {
    //       status: 200,
    //     }
    //   );
    } catch (error:any) {
        return NextResponse.json({error:error.message},{
            status:500
        })
    }
}