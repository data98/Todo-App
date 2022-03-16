var firebaseConfig = {
    apiKey: "AIzaSyBDnVjwSm-dJtUV6BpqDL6DWqG_-lPu-zE",
    authDomain: "todo-c4442.firebaseapp.com",
    projectId: "todo-c4442",
    storageBucket: "todo-c4442.appspot.com",
    messagingSenderId: "762644161463",
    appId: "1:762644161463:web:10cc7912b844198d143e32",
    measurementId: "G-PTDNFXV15P"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();
var db = firebase.firestore();