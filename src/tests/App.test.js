import React from 'react';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import App from '../App';
import testData from '../../cypress/mocks/testData';
import userEvent from '@testing-library/user-event';

test('Verifica se renderiza a tela corretamente', () => {
  render(<App />);
  const titleElement = screen.getByText(/Projeto Star Wars/i);
  const loading = screen.getByText(/loading.../i);
  expect(titleElement).toBeInTheDocument();
  expect(loading).toBeDefined();
  });

test('Verifica se a função fetch é chamada e os nomes dos planetas é renderizado', async() => {
  global.fetch = jest.fn(() => Promise.resolve({
    json: () => Promise.resolve(testData),
  }));
  render(<App />);
  expect(fetch).toBeCalled();
  const loading = screen.getByText(/loading.../i);
  await waitForElementToBeRemoved(loading);
  const planet1 = screen.getByText('Tatooine');
  expect(planet1).toBeDefined();
  global.fetch.mockClear();
})

test('Verifica se ao buscar pelo input, filtra o planeta', async () => {
  global.fetch = jest.fn(() => Promise.resolve({
    json: () => Promise.resolve(testData),
  }));
  render(<App />);
  const loading = screen.getByText(/loading.../i);
  await waitForElementToBeRemoved(loading);
  // const endorElement = screen.getByText(/endor/i);
  // expect(endorElement).toBeDefined();
  const inputText = screen.getByTestId('name-filter');
  userEvent.type(inputText, 'oo');
  const planetRows = screen.getAllByTestId('planet-row');
  expect(planetRows.length).toBe(2);
  global.fetch.mockClear();
})

test('Verifica se ao clicar no botao, filtra o planeta', async () => {
  global.fetch = jest.fn(() => Promise.resolve({
    json: () => Promise.resolve(testData),
  }));
  render(<App />);
  const loading = screen.getByText(/loading.../i);
  await waitForElementToBeRemoved(loading);
  const btnSearch = screen.getByTestId('button-filter');
  userEvent.click(btnSearch);
  const planetRows = screen.getAllByTestId('planet-row');
  expect(planetRows.length).toBe(8);
  global.fetch.mockClear();
})

test('Verifica se filtra os planetas com rotation_period === 23 e depois outro filtro', async () => {
  global.fetch = jest.fn(() => Promise.resolve({
    json: () => Promise.resolve(testData),
  }));
  render(<App />);
  const loading = screen.getByText(/loading.../i);
  await waitForElementToBeRemoved(loading);
  const colum = screen.getByTestId('column-filter');
  const comparison = screen.getByTestId('comparison-filter');
  const inputValue = screen.getAllByTestId('value-filter');
  userEvent.selectOptions(colum,'rotation_period');
  userEvent.selectOptions(comparison,'igual a')
  userEvent.type(inputValue, 23)
  const btnSearch = screen.getByText(/filtrar/i);
  userEvent.click(btnSearch);
  userEvent.selectOptions(colum,'population');
  userEvent.selectOptions(comparison,'menor que');
  userEvent.type(inputValue, 10000);
  userEvent.click(btnSearch);
  userEvent.selectOptions(colum,'diameter');
  userEvent.selectOptions(comparison,'maior que')
  userEvent.type(inputValue, 10000)
  userEvent.click(btnSearch);

  const filterRows = screen.getAllByTestId('filter-button');
  expect(filterRows.length).toBe(3);
  global.fetch.mockClear();
})

test('Se é possivel selecionar opção "menor que"', async () => {
  global.fetch = jest.fn(() => Promise.resolve({
    json: () => Promise.resolve(testData),
  }));
  render(<App />);
  const loading = screen.getByText(/loading.../i);
  await waitForElementToBeRemoved(loading);
  const colum = screen.getByTestId('column-filter');
  const comparison = screen.getByTestId('comparison-filter');
  const inputValue = screen.getAllByTestId('value-filter');
  userEvent.selectOptions(colum,'rotation_period');
  userEvent.selectOptions(comparison,'menor que')
  userEvent.type(inputValue, 23)
  const btnSearch = screen.getByText(/filtrar/i);
  userEvent.click(btnSearch);
  const filtro = screen.getByRole('button', {
    name: /excluir/i
  })
  expect(filtro).toBeDefined();

  global.fetch.mockClear();
});

test('Se ao selecionar opção de ordenação "population" e "ascendente" retorna tabela ordenada', async () => {
  global.fetch = jest.fn(() => Promise.resolve({
    json: () => Promise.resolve(testData),
  }));
  render(<App />);
  const loading = screen.getByText(/loading.../i);
  await waitForElementToBeRemoved(loading);
  const select = screen.getByTestId('column-sort');
  const radioAsc = screen.getByTestId('column-sort-input-asc');
  userEvent.selectOptions(select, 'population');
  userEvent.click(radioAsc);
  const btnSort = screen.getByRole('button', {
    name: /ordenar/i
  })
  userEvent.click(btnSort);
  const smallestPopulation = screen.getAllByTestId('planet-name');
  expect(smallestPopulation[0].innerHTML).toBe('Yavin IV');

  global.fetch.mockClear();
});

test('Se ao selecionar opção de ordenação "population" e "descendent" retorna tabela ordenada', async () => {
  global.fetch = jest.fn(() => Promise.resolve({
    json: () => Promise.resolve(testData),
  }));
  render(<App />);
  const loading = screen.getByText(/loading.../i);
  await waitForElementToBeRemoved(loading);
  const select = screen.getByTestId('column-sort');
  const radioDesc = screen.getByTestId('column-sort-input-desc');
  userEvent.selectOptions(select, 'diameter');
  userEvent.click(radioDesc);
  const btnSort = screen.getByRole('button', {
    name: /ordenar/i
  })
  userEvent.click(btnSort);
  const smallestPopulation = screen.getAllByTestId('planet-name');
  expect(smallestPopulation[0].innerHTML).toBe('Bespin');

  global.fetch.mockClear();
});

test('Se ao selecionar opção de ordenação "rotation_period" e "descendent" retorna tabela ordenada', async () => {
  global.fetch = jest.fn(() => Promise.resolve({
    json: () => Promise.resolve(testData),
  }));
  render(<App />);
  const loading = screen.getByText(/loading.../i);
  await waitForElementToBeRemoved(loading);
  const select = screen.getByTestId('column-sort');
  const radioDesc = screen.getByTestId('column-sort-input-desc');
  userEvent.selectOptions(select, 'rotation_period');
  userEvent.click(radioDesc);
  const btnSort = screen.getByRole('button', {
    name: /ordenar/i
  })
  userEvent.click(btnSort);
  const smallestPopulation = screen.getAllByTestId('planet-name');
  expect(smallestPopulation[0].innerHTML).toBe('Kamino');

  global.fetch.mockClear();
});

test('Se ao aplicar um filtro, é possível excluí-lo depois', async () => {
  global.fetch = jest.fn(() => Promise.resolve({
    json: () => Promise.resolve(testData),
  }));
  render(<App />);
  const loading = screen.getByText(/loading.../i);
  await waitForElementToBeRemoved(loading);
  const colum = screen.getByTestId('column-filter');
  const comparison = screen.getByTestId('comparison-filter');
  const inputValue = screen.getAllByTestId('value-filter');
  userEvent.selectOptions(colum,'rotation_period');
  userEvent.selectOptions(comparison,'menor que')
  userEvent.type(inputValue, 23)
  const btnSearch = screen.getByText(/filtrar/i);
  userEvent.click(btnSearch);
  expect(comparison.length).toBe(2);
  const filtro = screen.getByRole('button', {
    name: /excluir/i
  })
  userEvent.click(filtro);
  expect(comparison.length).toBe(3);

  
  global.fetch.mockClear();
});

test('Se ao aplicar três filtros, é possível excluí-los todos de uma vez com o botão "Remover Filtragens"', async () => {
  global.fetch = jest.fn(() => Promise.resolve({
    json: () => Promise.resolve(testData),
  }));
  render(<App />);
  const loading = screen.getByText(/loading.../i);
  await waitForElementToBeRemoved(loading);
  const colum = screen.getByTestId('column-filter');
  const comparison = screen.getByTestId('comparison-filter');
  const inputValue = screen.getAllByTestId('value-filter');
  userEvent.selectOptions(colum,'rotation_period');
  userEvent.selectOptions(comparison,'menor que')
  userEvent.type(inputValue, 23)
  const btnSearch = screen.getByText(/filtrar/i);
  userEvent.click(btnSearch);
  userEvent.selectOptions(colum,'population');
  userEvent.selectOptions(comparison,'maior que');
  userEvent.type(inputValue, 10000);
  userEvent.click(btnSearch);
  userEvent.selectOptions(colum,'diameter');
  userEvent.selectOptions(comparison,'igual a');
  userEvent.type(inputValue, 10000);
  userEvent.click(btnSearch);
  const Removerfiltros = screen.getByRole('button', {
    name: /remover filtragens/i
  })
  userEvent.click(Removerfiltros);
  expect(comparison.length).toBe(3);

  
  global.fetch.mockClear();
});

test('Se ao aplicar três filtros, e excluir um por um, se a tabela renderiza corretamente', async () => {
  global.fetch = jest.fn(() => Promise.resolve({
    json: () => Promise.resolve(testData),
  }));
  render(<App />);
  const loading = screen.getByText(/loading.../i);
  await waitForElementToBeRemoved(loading);
  const colum = screen.getByTestId('column-filter');
  const comparison = screen.getByTestId('comparison-filter');
  const inputValue = screen.getAllByTestId('value-filter');
  userEvent.selectOptions(colum,'rotation_period');
  userEvent.selectOptions(comparison,'menor que')
  userEvent.type(inputValue, 23)
  const btnSearch = screen.getByText(/filtrar/i);
  userEvent.click(btnSearch);
  userEvent.selectOptions(colum,'population');
  userEvent.selectOptions(comparison,'maior que');
  userEvent.type(inputValue, 10000);
  userEvent.click(btnSearch);
  userEvent.selectOptions(colum,'diameter');
  userEvent.selectOptions(comparison,'igual a');
  userEvent.type(inputValue, 10000);
  userEvent.click(btnSearch);
  const filtro = screen.getAllByRole('button', {
    name: /excluir/i
  })

  userEvent.click(filtro[0]);
  const firstPlanet = screen.getAllByTestId('planet-name');
  // expect(comparison.length).toBe(1);
  userEvent.click(filtro[1]);
  // expect(comparison.length).toBe(2);
  userEvent.click(filtro[2]);
  expect(firstPlanet[0].innerHTML).toBe('Tatooine');
  
  global.fetch.mockClear();
});