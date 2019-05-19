import { decodeToken } from './jwt';

export const resolveAuthContext = async ({ req }) => {
  let authToken = null;
  let currentUser = null;

  try {
    authToken = req.headers.Authorization || req.headers.authorization;

    if (authToken) {
      currentUser = await decodeToken(authToken);
    }
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.warn(`Unable to authenticate using auth token: ${authToken}`);
  }

  return {
    authToken,
    currentUser,
  };
};

export const retrieveUser = context => {
  try {
    const { currentUser } = context;
    return currentUser;
  } catch (e) {
    throw new Error('Invalid or missing authentication');
  }
};
