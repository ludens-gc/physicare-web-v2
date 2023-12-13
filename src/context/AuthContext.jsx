import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore } from "../lib/firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = doc(firestore, "users", user.uid);
        const unsubSnapshot = onSnapshot(userRef, (docSnapshot) => {
          setCurrentUser(docSnapshot.data());
        });
        return unsubSnapshot;
      }
    });

    return () => {
      unsubAuth();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
