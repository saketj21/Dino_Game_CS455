import { createPlayerForm } from './../nameForm.js';

describe('createPlayerForm', () => {
  let formContainer;

  beforeEach(() => {
    // Set up a DOM element as a render target
    document.body.innerHTML = '';
    formContainer = createPlayerForm();
    document.body.appendChild(formContainer);
  });

  afterEach(() => {
    // Clean up the DOM
    document.body.innerHTML = '';
  });

  test('should create a form container with correct id and styles', () => {
    expect(formContainer.id).toBe('nameFormContainer');
    expect(formContainer.style.position).toBe('absolute');
    expect(formContainer.style.top).toBe('0px');
    expect(formContainer.style.left).toBe('0px');
    expect(formContainer.style.width).toBe('100%');
    expect(formContainer.style.height).toBe('100%');
    expect(formContainer.style.background).toBe('rgba(0, 0, 0, 0.5)');
    expect(formContainer.style.display).toBe('flex');
    expect(formContainer.style.justifyContent).toBe('center');
    expect(formContainer.style.alignItems).toBe('center');
  });

  test('should create a form with correct styles', () => {
    const form = formContainer.querySelector('form');
    expect(form).not.toBeNull();
    expect(form.style.background).toBe('white');
    expect(form.style.padding).toBe('20px');
    expect(form.style.borderRadius).toBe('10px');
    expect(form.style.boxShadow).toBe('0 0 10px rgba(0, 0, 0, 0.1)');
    expect(form.style.display).toBe('flex');
    expect(form.style.flexDirection).toBe('column');
    expect(form.style.alignItems).toBe('center');
  });

  test('should create a label with correct attributes and styles', () => {
    const label = formContainer.querySelector('label');
    expect(label).not.toBeNull();
    expect(label.htmlFor).toBe('playerName');
    expect(label.innerText).toBe('Enter your name:');
    expect(label.style.marginBottom).toBe('10px');
    expect(label.style.fontSize).toBe('16px');
    expect(label.style.fontWeight).toBe('bold');
  });

  test('should create an input with correct attributes and styles', () => {
    const input = formContainer.querySelector('input');
    expect(input).not.toBeNull();
    expect(input.type).toBe('text');
    expect(input.id).toBe('playerName');
    expect(input.required).toBe(true);
    expect(input.style.marginBottom).toBe('20px');
    expect(input.style.padding).toBe('10px');
    expect(input.style.border).toBe('1px solid #ccc');
    expect(input.style.borderRadius).toBe('5px');
    expect(input.style.width).toBe('100%');
    expect(input.style.boxSizing).toBe('border-box');
  });

  test('should create a button with correct attributes and styles', () => {
    const button = formContainer.querySelector('button');
    expect(button).not.toBeNull();
    expect(button.type).toBe('submit');
    expect(button.innerText).toBe('Start Game');
    expect(button.style.padding).toBe('10px 20px');
    expect(button.style.border).toBe('');
    expect(button.style.borderRadius).toBe('5px');
    expect(button.style.backgroundColor).toBe('rgb(237, 201, 175)');
    expect(button.style.color).toBe('white');
    expect(button.style.fontSize).toBe('16px');
    expect(button.style.cursor).toBe('pointer');
    expect(button.style.transition).toBe('background-color 0.3s');
  });

  test('should change button background color on hover', () => {
    const button = formContainer.querySelector('button');
    expect(button).not.toBeNull();

    // Simulate mouseover event
    const mouseOverEvent = new Event('mouseover');
    button.dispatchEvent(mouseOverEvent);
    expect(button.style.backgroundColor).toBe('rgb(210, 180, 140)');

    // Simulate mouseout event
    const mouseOutEvent = new Event('mouseout');
    button.dispatchEvent(mouseOutEvent);
    expect(button.style.backgroundColor).toBe('rgb(237, 201, 175)');
  });
});