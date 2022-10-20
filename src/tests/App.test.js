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

test('Verifica se filtra os planetas com rotation_period === 23', async () => {
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
  // const planetRows = await screen.findAllByTestId('planet-row');
  // expect(planetRows.length).toBe(3);
  console.log(planetRows.length)
  global.fetch.mockClear();
})

test('Se é possivel selecionar opção "maior que"', async () => {
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
  userEvent.selectOptions(comparison,'maior que')
  userEvent.type(inputValue, 23)
  const btnSearch = screen.getByText(/filtrar/i);
  userEvent.click(btnSearch);

  global.fetch.mockClear();
})