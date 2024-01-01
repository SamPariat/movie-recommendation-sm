import { createContext } from 'react';

const AuthContext = createContext({
  isAuth: false,
});

export { AuthContext };
