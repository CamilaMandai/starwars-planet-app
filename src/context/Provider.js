import React, { createContext, useState, useMemo } from 'react';

export const MyContext = createContext();

export default function Provider(prop) {
  const [planetList, setPlanetList] = useState([{ name: 'Loading...' }]);

  const [filterByNumericValues, setFilterByNumericValues] = useState([
    // {
    //   column: 'population',
    //   comparison: 'maior que',
    //   value: '0',
    // }
  ]);

  const addFilterByNumericValues = (newFilter) => {
    setFilterByNumericValues((prev) => [...prev, newFilter]);
  };

  const { children } = prop;

  const contextValue = useMemo(() => ({
    planetList,
    setPlanetList,
    filterByNumericValues,
    addFilterByNumericValues,
    setFilterByNumericValues,
  }), [filterByNumericValues, planetList]);

  return (
    <MyContext.Provider value={ contextValue }>
      {children}
    </MyContext.Provider>
  );
}
