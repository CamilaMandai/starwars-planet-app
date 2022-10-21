import React, { useState } from 'react';
import PropTypes from 'prop-types';

export default function DropDown({ setFilteredList }) {
  const [order, setOrder] = useState({ column: 'population', sort: 'ASC' });

  const sortColumn = ({ target }) => {
    const { name, value } = target;
    setOrder((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const compare = (a, b) => {
    const { column, sort } = order;
    const NEGATIVE = -1;
    const POSITIVE = 1;
    if (sort === 'ASC') {
      if (b[column] === 'unknown') { return NEGATIVE; }
      if (Number(a[column]) < Number(b[column])) {
        return NEGATIVE;
      }
      if (Number(a[column]) > Number(b[column])) {
        return POSITIVE;
      }
      return 0;
    }
    if (sort === 'DESC') {
      if (Number(a[column]) < Number(b[column])) {
        return POSITIVE;
      }
      if (Number(a[column]) > Number(b[column])) {
        return NEGATIVE;
      }
      return 0;
    }
  };

  const orderClick = () => {
    setFilteredList((prev) => [...prev].sort(compare));
  };

  return (
    <div>
      <select name="column" data-testid="column-sort" onChange={ sortColumn }>
        <option value="population">population</option>
        <option value="orbital_period">orbital_period</option>
        <option value="diameter">diameter</option>
        <option value="rotation_period">rotation_period</option>
        <option value="surface_water">surface_water</option>
      </select>

      <label htmlFor="asc-sort">
        <input
          type="radio"
          id="asc-sort"
          data-testid="column-sort-input-asc"
          name="sort"
          value="ASC"
          onClick={ sortColumn }
        />
        Ascendente

      </label>

      <label htmlFor="desc-sort">
        <input
          type="radio"
          id="desc-sort"
          name="sort"
          value="DESC"
          data-testid="column-sort-input-desc"
          onClick={ sortColumn }
        />
        Descendente

      </label>
      <button
        type="button"
        data-testid="column-sort-button"
        onClick={ orderClick }
      >
        Ordenar
      </button>
    </div>
  );
}

DropDown.propTypes = {
  setFilteredList: PropTypes.func,
}.isRequired;
