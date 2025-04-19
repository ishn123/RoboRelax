// services/cartService.js
import { doc, setDoc, getDoc,collection,query,updateDoc,deleteField } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function saveUserCart(userId, cartId) {
    await setDoc(doc(db, "userCarts", userId), {
        cartId,
        updatedAt: new Date().toISOString()
    },
        {merge:true});
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

export async function saveEmailTemplateForCurrentUser(userId, key,emailTemplate) {
    try {
        const docRef = doc(db, "userCarts",userId);
        const field = "emailTemplate" + key;
        await setDoc(
            docRef,
            { [field]: emailTemplate },
            { merge: true }
        );

        console.log(`Saved emailTemplate for ${userId}`);
    } catch (error) {
        console.error("Failed to save emailTemplate:", error);
        throw error;
    }
}

export async function removeEmailTemplateForCurrentUser(userId,key) {
    try {
        const field = "emailTemplate" + key;
        const docRef = doc(db, "userCarts", userId); // email is the document ID
        await updateDoc(docRef, {
            [field]: deleteField(),
        });
        console.log(`emailTemplate field removed from ${userId}`);
    } catch (error) {
        console.error("Failed to remove emailTemplate:", error);
        throw error;
    }
}

export async function checkIfAppointmentExists(userId,key) {
    const docSnap = await getDoc(doc(db, "userCarts", userId));
    const field = "emailTemplate" + key;
    if (docSnap.exists()) {
        const docData = docSnap.data();

        if (docData.hasOwnProperty(field)) {
            return docData[field];  // or do something with the emailTemplate
        } else {
            return null;
        }
    } else {
        return null;  // Document doesn't exist
    }
}

export async function getAllFieldsForUser(userId) {
    const docSnap = await getDoc(doc(db, "userCarts", userId));
    return docSnap.data();
}

export async function getGuestCart(guestId) {
    const docSnap = await getDoc(doc(db, "guestCarts", guestId));
    return docSnap.exists() ? docSnap.data().cartId : null;
}