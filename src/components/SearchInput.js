import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { MyContext } from '../context/Provider';

export default function SearchInput({ setFilteredList }) {
  const { planetList,
  } = useContext(MyContext);

  const handleChange = ({ target }) => {
    const { value } = target;
    const searchedPlanet = planetList.filter(
      (planet) => planet.name.toLowerCase().includes(value),
    );
    setFilteredList(searchedPlanet);
  };

  return (
    <input
      type="text"
      data-testid="name-filter"
      placeholder="Search"
      onChange={ handleChange }
    />
  );
}

SearchInput.propTypes = {
  setFilteredList: PropTypes.func.isRequired,
};
