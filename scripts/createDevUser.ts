interface FirebaseAuthError extends Error {
  code?: string;
}
import dotenv from 'dotenv';
dotenv.config();

import { adminAuth } from '@/lib/firebaseAdmin'; 

async function createOrVerifyDefaultUser() {
  const defaultEmail = 'minzdev@minz.com';
  const defaultPassword = 'minz123'; 

  try {
    const userRecord = await adminAuth.getUserByEmail(defaultEmail);
    console.log('Default user already exists:', userRecord.uid);
    return userRecord;
  } catch (error) {
    if (error instanceof Error && 'code' in error) {
      const firebaseError = error as FirebaseAuthError;
      if (firebaseError.code === 'auth/user-not-found') {
        try {
          const newUser = await adminAuth.createUser({
            email: defaultEmail,
            password: defaultPassword,
            emailVerified: true,
            displayName: 'Dev Minz',
          });
          console.log('생성 성공 :', newUser.uid);
          return newUser;
        } catch (createError) {
          console.error('생성 실패:', createError);
          throw createError;
        }
      } else {
        console.error('에러 이유:', firebaseError);
        throw firebaseError;
      }
    } else {
      console.error('Unknown error occurred:', error);
      throw error;
    }
  }
}

createOrVerifyDefaultUser()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    process.exit(1);
  });