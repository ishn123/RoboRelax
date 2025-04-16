// services/cartService.js
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function saveUserCart(userId, cartId) {
    await setDoc(doc(db, "userCarts", userId), {
        cartId,
        updatedAt: new Date().toISOString()
    });
}

export async function getUserCart(userId) {
    const docSnap = await getDoc(doc(db, "userCarts", userId));
    console.log(docSnap.data())
    return docSnap.exists() ? docSnap.data().cartId : null;
}

export async function saveGuestCart(guestId, cartId) {
    await setDoc(doc(db, "guestCarts", guestId), {
        cartId,
        updatedAt: new Date().toISOString()
    });
}

export async function getGuestCart(guestId) {
    const docSnap = await getDoc(doc(db, "guestCarts", guestId));
    return docSnap.exists() ? docSnap.data().cartId : null;
}