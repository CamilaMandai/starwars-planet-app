import React, { useContext, useEffect, useState } from 'react';
import { MyContext } from '../context/Provider';

export default function Home() {
  const { planetList, setPlanetList } = useContext(MyContext);

  const [filteredList, setFilteredList] = useState(planetList);

  const [filterCategories, setFilterCategories] = useState({
    columnFilter: 'population',
    comparisonFilter: 'maior que',
    valueFilter: 0,
  });

  useEffect(() => {
    const fetchPlanets = async () => {
      const req = await fetch('https://swapi.dev/api/planets');
      const res = await req.json();
      const { results } = res;
      results.forEach((planet) => { delete planet.residents; });
      setPlanetList(results);
    };
    // const asynFetch = async () => fetchPlanets();
    // asynFetch();
    fetchPlanets();
  }, [setPlanetList]);

  useEffect(() => {
    setFilteredList(planetList);
  }, [planetList]);

  const handleChange = ({ target }) => {
    const { value } = target;
    const searchedPlanet = planetList.filter(
      (planet) => planet.name.toLowerCase().includes(value),
    );
    setFilteredList(searchedPlanet);
  };

  const handleFilter = ({ target }) => {
    const { name, value } = target;
    setFilterCategories((prevCategories) => ({ ...prevCategories, [name]: value }));
  };

  const clickFilter = () => {
    const { columnFilter, comparisonFilter, valueFilter } = filterCategories;

    const searchedPlanet = planetList.filter((planet) => {
      switch (comparisonFilter) {
      case 'maior que':
        return planet[columnFilter] > Number(valueFilter);
      case 'menor que':
        return planet[columnFilter] < Number(valueFilter);
      default:
        return planet[columnFilter] === valueFilter;
      }
    });
    setFilteredList(searchedPlanet);
  };

  return (
    <div>
      <div>
        <input
          type="text"
          data-testid="name-filter"
          placeholder="Search"
          onChange={ handleChange }
        />
        <div>
          <select
            data-testid="column-filter"
            name="columnFilter"
            onChange={ handleFilter }
          >
            <option value="population" selected>population</option>
            <option value="orbital_period">orbital_period</option>
            <option value="diameter">diameter</option>
            <option value="rotation_period">rotation_period</option>
            <option value="surface_water">surface_water</option>
          </select>
          <select
            data-testid="comparison-filter"
            name="comparisonFilter"
            onChange={ handleFilter }
          >
            <option value="maior que" selected>maior que</option>
            <option value="menor que">menor que</option>
            <option value="igual a">igual a</option>
          </select>
          <input
            name="valueFilter"
            value={ filterCategories.valueFilter }
            type="number"
            data-testid="value-filter"
            onChange={ handleFilter }
          />
          <button
            type="button"
            data-testid="button-filter"
            onClick={ clickFilter }
          >
            Filtrar
          </button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Rotation Period</th>
            <th>Orbital Period</th>
            <th>Diameter</th>
            <th>Climate</th>
            <th>Gravity</th>
            <th>Terrain</th>
            <th>Surface Water</th>
            <th>Population</th>
            <th>Films</th>
            <th>Created</th>
            <th>Edited</th>
            <th>URL</th>
          </tr>
        </thead>
        <tbody>
          {
            filteredList.map((planet) => (
              <tr key={ planet.name }>
                <td>{planet.name}</td>
                <td>{planet.rotation_period}</td>
                <td>{planet.orbital_period}</td>
                <td>{planet.diameter}</td>
                <td>{planet.climate}</td>
                <td>{planet.gravity}</td>
                <td>{planet.terrain}</td>
                <td>{planet.surface_water}</td>
                <td>{planet.population}</td>
                <td>{planet.films}</td>
                <td>{planet.created}</td>
                <td>{planet.edited}</td>
                <td>{planet.url}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}
