import React, { useContext, useEffect, useState } from 'react';
import SearchInput from '../components/SearchInput';
import Selects from '../components/Selects';
import Table from '../components/Table';
import { MyContext } from '../context/Provider';
import DropDown from '../components/DropDown';

export default function Home() {
  const { planetList,
    setPlanetList,
    // addFilterByNumericValues,
    filterByNumericValues,
    setFilterByNumericValues,
  } = useContext(MyContext);

  const [filteredList, setFilteredList] = useState(planetList);

  const [inputCategories, setInputCategories] = useState({
    column: ['population',
      'orbital_period',
      'diameter',
      'rotation_period',
      'surface_water'],
    comparison: ['maior que', 'menor que', 'igual a'],
  });

  const [filterCategories, setFilterCategories] = useState({
    columnFilter: inputCategories.column[0],
    comparisonFilter: inputCategories.comparison[0],
    valueFilter: '0',
  });

  // Solucao indicada pelo Anderson Nunes para que o select possa reconhecer o primeiro valor de options como selected
  useEffect(() => {
    const setInitialFilter = () => {
      setFilterCategories({
        columnFilter: inputCategories.column[0],
        comparisonFilter: inputCategories.comparison[0],
        valueFilter: '0',
      });
    };
    setInitialFilter();
  }, [inputCategories]);

  const deleteFilterByNumericValues = (columnFilter, all) => {
    if (all) {
      setFilterByNumericValues([]);
    } else {
      const uptFilter = filterByNumericValues.filter(
        (e) => e.columnFilter !== columnFilter,
      );
      setFilterByNumericValues(uptFilter);
    }
  };

  useEffect(() => {
    const fetchPlanets = async () => {
      const req = await fetch('https://swapi.dev/api/planets');
      const res = await req.json();
      const { results } = res;
      results.forEach((planet) => { delete planet.residents; });
      setPlanetList(results);
    };
    fetchPlanets();
  }, [setPlanetList]);

  useEffect(() => {
    setFilteredList(planetList);
  }, [planetList]);

  const checkFilterLength = () => {
    if (filterByNumericValues.length === 1) {
      setFilteredList(planetList);
    } else {
      const newPlanetList = planetList.filter(
        (planet) => filterByNumericValues.some((filter) => {
          switch (filter.comparisonFilter) {
          case 'maior que':
            return planet[filter.columnFilter] > Number(filter.valueFilter);
          case 'menor que':
            return planet[filter.columnFilter] < Number(filter.valueFilter);
          case 'igual a':
            return planet[filter.columnFilter] === filter.valueFilter;
          default:
            return true;
          }
        }),
      );
      setFilteredList(newPlanetList);
    }
  };

  const deleteClick = (element) => {
    const { columnFilter, comparisonFilter, valueFilter } = element;
    setFilterCategories({ columnFilter, comparisonFilter, valueFilter });
    deleteFilterByNumericValues(columnFilter);
    setInputCategories((prev) => ({
      column: [...prev.column, columnFilter],
      comparison: [...prev.comparison, comparisonFilter],
    }));

    checkFilterLength();// funcao chamada para voltar a lista completa caso o filtro fique vazio
    // upFilteredListAfterRmClick(columnFilter, comparisonFilter, valueFilter);
  };

  const rmFilters = () => {
    deleteFilterByNumericValues(null, true);
    setInputCategories({
      column: ['population',
        'orbital_period',
        'diameter',
        'rotation_period',
        'surface_water'],
      comparison: ['maior que', 'menor que', 'igual a'],
    });
    setFilteredList(planetList);
  };

  return (
    <div>
      <h1>Projeto Star Wars</h1>
      <div>
        <SearchInput setFilteredList={ setFilteredList } />
        <Selects
          setFilterCategories={ setFilterCategories }
          filterCategories={ filterCategories }
          filteredList={ filteredList }
          setFilteredList={ setFilteredList }
          setInputCategories={ setInputCategories }
          inputCategories={ inputCategories }
        />
      </div>
      <div>
        {filterByNumericValues.map((element, index) => (
          <p key={ index } data-testid="filter">
            <span data-testid="filter-column">{element.columnFilter}</span>
            {' '}
            <span data-testid="filter-comparison">{element.comparisonFilter}</span>
            {' '}
            <span data-testid="filter-value">{element.valueFilter}</span>
            <button
              type="button"
              data-testid="filter-button"
              onClick={ () => deleteClick(element) }
            >
              Excluir
            </button>
          </p>
        ))}
      </div>
      <button
        type="button"
        data-testid="button-remove-filters"
        onClick={ rmFilters }
      >
        Remover Filtragens
      </button>
      <DropDown filteredList={ filteredList } setFilteredList={ setFilteredList } />
      <Table filteredList={ filteredList } />
    </div>
  );
}
