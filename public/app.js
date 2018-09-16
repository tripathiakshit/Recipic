// Initialize Firebase
const config = {
    apiKey: "AIzaSyC9FIVEs7HokY4BmztnOKT4B-zfJIxG3hY",
    authDomain: "recipic-c491d.firebaseapp.com",
    databaseURL: "https://recipic-c491d.firebaseio.com",
    projectId: "recipic-c491d",
    storageBucket: "recipic-c491d.appspot.com",
    messagingSenderId: "991849897967"
};
firebase.initializeApp(config);

var ui = new firebaseui.auth.AuthUI(firebase.auth());

var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            return true;

        },
        uiShown: function () {
            document.getElementById('loader').style.display = 'none';
        }
    },
    signInFlow: 'popup',
    signInSuccessUrl: 'home.html',
    signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    tosUrl: '<your-tos-url>',
    privacyPolicyUrl: '<your-privacy-policy-url>'
};

let signinbutton = document.getElementById("signInBtn");
signinbutton.addEventListener("click", () => {
    ui.start('#firebaseui-auth-container', uiConfig);
});
