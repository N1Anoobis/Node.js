const Jimp = require('jimp');
const inquirer = require('inquirer');
const fs = require('fs');

const brightenImage = async function (inputFile) {
  const image = await Jimp.read(inputFile);
  image.brightness(0.6);

  image.quality(100).write(inputFile);
};

const increaseContrast = async function (inputFile) {
  const image = await Jimp.read(inputFile);
  image.contrast(0.4);

  image.quality(100).write(inputFile);
};

const makeGreyscale = async function (inputFile) {
  const image = await Jimp.read(inputFile);
  image.greyscale();

  image.quality(100).write(inputFile);
};

const invertImage = async function (inputFile) {
  const image = await Jimp.read(inputFile);
  image.invert();

  image.quality(100).write(inputFile);
};

const addTextWatermarkToImage = async function (inputFile, outputFile, text) {
  try {
    const image = await Jimp.read(inputFile);
    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
    const textData = {
      text: text,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
    };
    image.print(font, 0, 0, textData, image.getWidth(), image.getHeight());
    await image.quality(100).writeAsync(outputFile);
  } catch (error) {
    cconsole.log('Something went wrong... Try again');
  }
  console.log('Task complited. Files ready to use');
  startApp();
}

const addImageWatermarkToImage = async function (inputFile, outputFile, watermarkFile) {
  try {
    const image = await Jimp.read(inputFile);
    const watermark = await Jimp.read(watermarkFile);
    const x = image.getWidth() / 2 - watermark.getWidth() / 2;
    const y = image.getHeight() / 2 - watermark.getHeight() / 2;

    image.composite(watermark, x, y, {
      mode: Jimp.BLEND_SOURCE_OVER,
      opacitySource: 0.5,
    });
    await image.quality(100).writeAsync(outputFile);
  } catch (error) {
    console.log('Something went wrong... Try again');
  }
  console.log('Task complited. Files ready to use');
  startApp();
}

const prepareOutputFilename = (filename) => {
  const [name, ext] = filename.split('.');
  return `${name}-with-watermark.${ext}`;
};

const startApp = async () => {

  // Ask if user is ready
  const answer = await inquirer.prompt([{
    name: 'start',
    message: 'Hi! Welcome to "Watermark manager". Copy your image files to `/img` folder. Then you\'ll be able to use them in the app. Are you ready?',
    type: 'confirm'
  }]);

  // if answer is no, just quit the app
  if (!answer.start) process.exit();

  // ask about input file edit options and watermark type
  const options = await inquirer.prompt([{
      name: 'inputImage',
      type: 'input',
      message: 'What file do you want to mark?',
      default: 'test.jpg',
    },
    {
      name: 'edition',
      message: 'Do you want to edit your picture?',
      type: 'confirm',
    }

  ]);
  // if file is not there just quit the app
  if (!fs.existsSync(`./img/'${options.inputImage}`)) {
    process.exit();
  }
  // extra options block
  if (options.edition) {
    const editionOptions = await inquirer.prompt([{
      name: 'editionType',
      type: 'list',
      choices: ['Brighten', 'Increase contrast', 'Make image b&w', 'Invert colours'],
    }]);

    if (editionOptions.editionType === 'Brighten') {
      await brightenImage(`./img/${options.inputImage}`);
    }

    if (editionOptions.editionType === 'Increase contrast') {
      await increaseContrast(`./img/${options.inputImage}`);
    }

    if (editionOptions.editionType === 'Make image b&w') {
      await makeGreyscale(`./img/${options.inputImage}`);
    }

    if (editionOptions.editionType === 'Invert image') {
      await invertImage(`./img/${options.inputImage}`);
    }
  }
  // watermark block
  const watermark = await inquirer.prompt([{
    name: 'watermarkType',
    type: 'list',
    choices: ['Text watermark', 'Image watermark'],
  }]);
  if (watermark.watermarkType === 'Text watermark') {
    const text = await inquirer.prompt([{
      name: 'value',
      type: 'input',
      message: 'Type your watermark text:',
    }])
    options.watermarkText = text.value;
    if (fs.existsSync('./img/' + options.inputImage)) {
      addTextWatermarkToImage(`./img/${options.inputImage}`, `./img/ ${prepareOutputFilename(options.inputImage)}`, options.watermarkText);
    } else {
      console.log('Something went wrong... Try again');
    }
  } else {
    const image = await inquirer.prompt([{
      name: 'filename',
      type: 'input',
      message: 'Type your watermark name:',
      default: 'logo.png',
    }])
    options.watermarkImage = image.filename;
    if (fs.existsSync('./img/' + options.inputImage)) {
      addImageWatermarkToImage('./img/' + options.inputImage, './img/' + prepareOutputFilename(options.inputImage), './img/' + options.watermarkImage);
    } else {
      console.log('Something went wrong... Try again');
    }
  }
};

startApp();