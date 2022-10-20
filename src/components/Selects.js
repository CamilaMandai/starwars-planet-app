import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { MyContext } from '../context/Provider';

export default function Selects(
// lista de props
  {
    setFilterCategories,
    filterCategories,
    filteredList,
    setFilteredList,
    setInputCategories,
    inputCategories,
  },
) {
  const {
    addFilterByNumericValues,
  } = useContext(MyContext);

  const handleFilter = ({ target }) => {
    const { name, value } = target;
    setFilterCategories((prevCategories) => ({ ...prevCategories, [name]: value }));
  };

  const updateInputCategories = (columnFilter, comparisonFilter) => {
    const { column, comparison } = inputCategories;
    const newColumn = column.filter((element) => element !== columnFilter);
    const newComparison = comparison.filter((element) => element !== comparisonFilter);
    setInputCategories({ column: newColumn, comparison: newComparison });
  };

  const clickFilter = () => {
    const { columnFilter, comparisonFilter, valueFilter } = filterCategories;
    const searchedPlanet = filteredList.filter((planet) => {
      switch (comparisonFilter) {
      case 'maior que':
        return planet[columnFilter] > Number(valueFilter);
      case 'menor que':
        return planet[columnFilter] < Number(valueFilter);
      case 'igual a':
        return planet[columnFilter] === valueFilter;
      default:
        return true;
      }
    });
    addFilterByNumericValues(filterCategories);
    setFilteredList(searchedPlanet);
    updateInputCategories(columnFilter, comparisonFilter);
  };

  return (
    <div>
      <select
        data-testid="column-filter"
        name="columnFilter"
        onChange={ handleFilter }
      >
        {
          inputCategories.column.map(
            (e) => <option key={ e } value={ e }>{e}</option>,
          )
        }
      </select>
      <select
        data-testid="comparison-filter"
        name="comparisonFilter"
        onChange={ handleFilter }
      >
        {
          inputCategories.comparison.map(
            (e) => <option key={ e } value={ e }>{e}</option>,
          )
        }
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
  );
}

Selects.propTypes = {
  setFilterCategories: PropTypes.func,
  filterCategories: PropTypes.arrayOf,
  filteredList: PropTypes.arrayOf,
  setFilteredList: PropTypes.func,
  setInputCategories: PropTypes.func,
  inputCategories: PropTypes.arrayOf,
}.isRequired;
