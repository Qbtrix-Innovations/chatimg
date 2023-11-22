// // @ts-nocheck

// import { db } from "$lib/firebase/firebase";
// import {
//   addDoc,
//   arrayRemove,
//   arrayUnion,
//   collection,
//   deleteDoc,
//   doc,
//   getDoc,
//   getDocs,
//   onSnapshot,
//   orderBy,
//   limit,
//   query,
//   serverTimestamp,
//   setDoc,
//   updateDoc,
//   where,
// } from "firebase/firestore";
// import {user, users, userData} from "./userStore"
// import {errorStore , quantity} from "../globalStore"
// import {toast} from "svelte-french-toast"
// import {get} from "svelte/store"
// import { goto } from "$app/navigation";
// const today = new Date();

// export const getUsers = async () => {
//   try {
//     const response = await getDocs(collection(db, "users"));
//     const ordersData = response?.docs.map((doc) => ({
//       ...doc.data(),
//       id: doc.id,
//     }));
//     users.set(ordersData)
//     console.log(get(users))
//   } catch (error) {
//     errorStore.set(error);
//   }
// };

// export const getUser = async (id) => {
//   const docRef = doc(db, "users", id);
//   try {
//     const docSnap = await getDoc(docRef);
//     if(docSnap.exists()) {
//       let res = docSnap.data()
//       res.id = docSnap.id
//       user.set(res)
//       console.log('user', res)
//       return res
//     } else {
//         console.log("Document does not exist")
//     }
//   } catch(error) {
//       console.log(error)
//   }
// };

// export const createUser = async(data)=>{
//   await getUsers()
//   let names = get(users).map((user)=> user.name)
//   console.log(names, get(userData).name)
//   try{
//     for(let i=0; i<names.length; i++){
//       if(get(userData).name !== names[i].name){
//         // const docSnap = await addDoc(collection(db, "users"), data);
//         toast.success("Document added successfully!") 
//         goto("/app/membershipform")
//         return "docSnap.data()"
//       }
//       toast.error("Document already exists!")
//     }  
//   }catch(error){
//     console.log(error)
//     goto("/")
//   }  
// }

