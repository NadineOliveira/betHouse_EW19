import mock from "./mock.json";
import { DataStore } from "../data-store.js";
// import "firebase/firestore";
// import firebase from "firebase/app";

// // Initialize Firebase
// const config = {
//     authDomain: "uminho-2019.firebaseapp.com",
//     databaseURL: "https://uminho-2019.firebaseio.com",
//     projectId: "uminho-2019",
//     storageBucket: "uminho-2019.appspot.com",
//     messagingSenderId: "803005561200"
// };

// firebase.initializeApp(config);

let globalDataMock = mock;

const get = async (path, params) => {
    // const docsRef = await firebase.firestore().collection(path).get();
    // const data = docsRef.docs.map(doc => doc.data())

    // return data;
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                resolve(globalDataMock[path]);
            } catch (error) {
                reject(error);
            }
        }, 0);
    });
};

window.update = (data) => {
    DataStore.destroy();
    globalDataMock = data;
    DataStore.update();
}

export { get };
