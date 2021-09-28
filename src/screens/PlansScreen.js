import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import db from "../firebase";
import {
  doc,
  query,
  collection,
  where,
  onSnapshot,
  add,
} from "firebase/firestore";
import "./PlansScreen.css";
import { loadStripe } from "@stripe/stripe-js";

function PlansScreen() {
  const [products, setProducts] = useState([]);
  const user = useSelector(selectUser);

  useEffect(() => {
    const ql = query(collection(db, "products"), where("active", "==", true));
    const unsub = onSnapshot(ql, (querySnapshot) => {
      const products = {};
      querySnapshot.forEach(async (productDoc) => {
        products[productDoc.id] = productDoc.data();
      });
      setProducts(products);
    });
  }, []);

  //   console.log(products);

  const loadCheckout = async (priceId) => {
    const docRef = await db
      .collection("customers")
      .doc(user.uid)
      .collection("checkout_sessions")
      .add({
        price: priceId,
        success_url: window.location.origin,
        cancel_url: window.location.origin,
      });
    docRef.onSnapshot(async (snap) => {
      const { error, sessionId } = snap.data();
      if (error) {
        // Show an error to your customer and inspect your Cloud Function logs in the Firebase console
        alert(`An error occured: ${error.message}`);
      }
      if (sessionId) {
        // We have session, let's redirect to Checkout
        // Init Stripe
        const stripe = await loadStripe(
          "pk_test_51JcP7nLkJYEnGxKTChuoRifuMtMmnFJL8fMAWVUQnLeKDCFzipsUrJoAP3ggGi4aLrRbjVivOqu4WILnkL8ZSL7S00y4ml2JcH"
        );
        stripe.redirectToCheckout({ sessionId });
      }
    });
  };

  return (
    <div className="plansScreen">
      {Object.entries(products).map(([productId, productData]) => {
        //add some logic to check if the user's subscription is active...
        return (
          <div className="plansScreen__plan">
            <div className="plansScreen__info">
              <h5>{productData.name}</h5>
              <h6>{productData.description}</h6>
            </div>
            <button onClick={() => loadCheckout(productData.prices.productId)}>
              Subscribe
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default PlansScreen;
