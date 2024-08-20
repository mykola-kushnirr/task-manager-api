const {
  calcTip,
  fahrenheitToCelsius,
  celsiusToFahrenheit,
  add,
} = require('../src/math');

test('Checking of total + tip', () => {
  const total = calcTip(10, 0.3);

  expect(total).toBe(13);
});

test('Should calc total + tip with default tip', () => {
  const total = calcTip(100);

  expect(total).toBe(115);
});

test('Should convert 32 F to 0 C', () => {
  expect(fahrenheitToCelsius(32)).toBe(0);
});
test('Should convert 0 C to 32 F', () => {
  expect(celsiusToFahrenheit(0)).toBe(32);
});

// test('Async test', anyName => {
//   setTimeout(() => {
//     expect(1).toBe(2);
//     anyName();
//   }, 2000);
// });

test('Should add two numbers', async () => {
  const sum = await add(2, 3);
  expect(sum).toBe(5);
});
