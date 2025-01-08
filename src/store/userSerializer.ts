interface SerializedUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  createdAt: string | null;
  lastLoginAt: string | null;
  isAnonymous: boolean;
}

export const serializeUser = (user: any): SerializedUser | null => {
  if (!user) return null;
  
  return {
    uid: user.uid,
    email: user.email || null,
    displayName: user.displayName || null,
    photoURL: user.photoURL || null,
    emailVerified: user.emailVerified || false,
    createdAt: user.metadata?.creationTime || null,
    lastLoginAt: user.metadata?.lastSignInTime || null,
    isAnonymous: user.isAnonymous || false
  };
};
