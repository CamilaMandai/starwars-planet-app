import React, { createContext, useState, useMemo } from 'react';

export const MyContext = createContext();

export default function Provider(prop) {
  const [planetList, setPlanetList] = useState([{ name: 'Loading...' }]);
  const { children } = prop;

  const contextValue = useMemo(() => ({ planetList, setPlanetList }), [planetList]);

  return (
    <MyContext.Provider value={ contextValue }>
      { children }
    </MyContext.Provider>
  );
}
