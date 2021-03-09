import React, { useContext, useState, useEffect } from "react";
import { auth, db } from "./../Comm/firebase";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const [getUserFullName, setUserFullName] = useState(null);
  const [getUserOrgs, setUserOrgs] = useState(null);
  const [getDefaultOrgID, setDefaultOrgID] = useState(null);

  function signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  function login(email, password) {
    setDefaultOrgID(null);
    return auth.signInWithEmailAndPassword(email, password);
  }

  function logout() {
    return auth.signOut();
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email);
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      fGetUserDetails(user);
    });
    return unsubscribe;
  }, []);

  const fGetUserDetails = (user) => {
    try {
      const usrEmail = user.email.toLowerCase();
      var ref = db.ref("users");
      ref
        .orderByChild("email")
        .equalTo(usrEmail)
        .on("child_added", function (dataSnapshot) {
          if (dataSnapshot.toJSON() != null) {
            const res = dataSnapshot.toJSON();
            console.log("Logged in user email:");
            /* SET THE TITLE + FULL NAME */
            setUserFullName(
              res.title + " " + res.privateName + " " + res.familyName
            );

            /* DOES THE USER HAS ORGS WHICH MEANS CAN GET INSIDE SYSTEM */
            if (res.orgs !== undefined) {
              /* SET DEFAULT ORGS */
              var defaultOrg;
              var tmpKey;
              Object.keys(res.orgs).map(function (key) {
                tmpKey = key;
                if (res.orgs[key].default === true) defaultOrg = key;
                setDefaultOrgID(defaultOrg);
                return null;
              });

              if (defaultOrg === undefined) setDefaultOrgID(tmpKey);
              setUserOrgs(res.orgs);
            } 

            setLoading(false);
          } else {
            console.log("User corrupted!");
          }
        });
    } catch (e) {
      console.log("error " + e);
      setLoading(false);
    }
  };

  const setNewDefaultOrgID = (id) => {
    setDefaultOrgID(id);
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    getUserFullName,
    getUserOrgs,
    getDefaultOrgID,
    setNewDefaultOrgID,

  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
