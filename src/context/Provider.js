import React, { createContext, useState, useMemo } from 'react';

export const MyContext = createContext();

export default function Provider(prop) {
  const [planetList, setPlanetList] = useState([{ name: 'ola' }]);
  const { children } = prop;

  const fetchPlanets = async () => {
    const req = await fetch('https://swapi.dev/api/planets');
    const res = await req.json();
    const { results } = res;
    results.forEach((planet) => { delete planet.residents; });
    setPlanetList(results);
  };

  const contextValue = useMemo(() => ({ planetList, fetchPlanets }), [planetList]);

  return (
    <MyContext.Provider value={ contextValue }>
      { children }
    </MyContext.Provider>
  );
}
