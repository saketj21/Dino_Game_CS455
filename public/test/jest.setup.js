// jest.setup.js

// Mock the canvas element with ID "game"
const canvas = document.createElement('canvas');
canvas.id = 'game';
canvas.width = 800;
canvas.height = 300;
document.body.appendChild(canvas);

// Mock the getContext method for the canvas element
canvas.getContext = (contextType) => {
  if (contextType === '2d') {
    return {
      fillRect: jest.fn(),
      clearRect: jest.fn(),
      getImageData: jest.fn(() => ({ data: [] })),
      putImageData: jest.fn(),
      createImageData: jest.fn(() => []),
      setTransform: jest.fn(),
      drawImage: jest.fn(),
      fillText: jest.fn(),
      measureText: jest.fn(() => ({ width: 0 })),
      strokeText: jest.fn(),
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      closePath: jest.fn(),
      stroke: jest.fn(),
      translate: jest.fn(),
      scale: jest.fn(),
      rotate: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      strokeRect: jest.fn(),
      save: jest.fn(),
      restore: jest.fn(),
    };
  }
  return null;
};

// Mock the decode method for HTMLImageElement
HTMLImageElement.prototype.decode = () => Promise.resolve();
