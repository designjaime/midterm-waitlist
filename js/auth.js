// Initialize Firebase
var config = {
    apiKey: "AIzaSyCBS_WuiEX-W4K0ZZWgJRt9iLIgbHhE8-M",
    authDomain: "waitlist-f06ba.firebaseapp.com",
    databaseURL: "https://waitlist-f06ba.firebaseio.com",
    projectId: "waitlist-f06ba",
    storageBucket: "waitlist-f06ba.appspot.com",
    messagingSenderId: "926147234882"
};
firebase.initializeApp(config);

function handleSignUp() {
    //step 1 : Get the email/ password entered by users
    var email = document.getElementById('form-email').value;
    var password = document.getElementById('form-password').value;
    //step 2 : Validate
    if (email.length < 4) {
        alert("Please enter a valid email address");
        return;
    }
    if (password.length < 4) {
        alert("Please use a stronger password");
        return;
    }
    //Step 3 : Create 
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(
            //success
            function() {
                alert("user created");
                window.location.href = 'index.html';
            }
        )
        .catch(
            function(error) {
                alert(error.message);
            }


        )
}
//step 2 : signed in
function handleSignIn() {
    var email = document.getElementById('form-email').value;
    var password = document.getElementById('form-password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(
            function() {
                alert("signed in");
                console.log(user);
                window.location.href = 'index.html';
            }
        )

        .catch(
            function(error) {
                alert(error.message);

            }
        )

}


function handleSignOut() {
    firebase.auth().signOut()
        .then(
            function() {
                alert("signed out");
                console.log(user);
                window.location.href = 'index.html';
            }
        )
        .catch(
            function(error) {
                alert(error.message);

            }
        )
}

function handleFBLogin() {
    if (!firebase.auth().currentUser) {
        var provider = new firebase.auth.FacebookAuthProvider();

        firebase.auth().signInWithPopup(provider)
            .then(function(result) {
                var token = result.credential.accessToken;
                var user = result.user;
                console.log(user);
                window.open('index.html');
            })
            .catch(
                function(error) {
                    alert(error.message);

                });
    } else {
        handleSignOut();
    }
}

function handlegoogleLogin() {
    if (!firebase.auth().currentUser) {
        var provider = new firebase.auth.GoogleAuthProvider();

        firebase.auth().signInWithPopup(provider)
            .then(function(result) {
                var token = result.credential.accessToken;
                var user = result.user;
                console.log(user);
                window.open('index.html');
            })
            .catch(
                function(error) {
                    alert(error.message);

                });
    } else {
        handleSignOut();
    }
}

function handletwitterLogin() {
    if (!firebase.auth().currentUser) {
        var provider = new firebase.auth.TwitterAuthProvider();

        firebase.auth().signInWithPopup(provider)
            .then(function(result) {
                var token = result.credential.accessToken;
                var user = result.user;
                console.log(user);
                window.open('index.html')
            })
            .catch(
                function(error) {
                    alert(error.message)

                });
    } else {
        handleSignOut();
    }
}