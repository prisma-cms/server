
const sharp = require('sharp');
var fs = require('fs');


const resizeMax = async function (img, width, height) {
  return await img
    .metadata()
    .then(function (metadata) {

      const {
        width: originWidth,
        height: originHeight,
      } = metadata;

      // console(chalk.green());

      if (width < originWidth || height < originHeight) {

        img.max()
          .resize(width, height)
          .max()
          ;

      }

    })
}


const ImageThumbMiddleware = async (req, res, next) => {

  const {
    0: src,
    type,
  } = req.params;


  let path = `/uploads/${src}`;

  // const abthPath = __dirname + path;
  const abthPath = process.cwd() + path;


  if (fs.existsSync(abthPath)) {
    // Do something


    const img = await sharp(abthPath)
    // .flatten()
    // .background('#ff6600')
    // // .overlayWith('overlay.png', { gravity: sharp.gravity.southeast } )
    // .sharpen()


    switch (type) {

      case 'origin':

        break;

      case 'avatar':

        img
          .resize(200, 200);

        break;

      case 'logo':

        img
          .resize(55, 55);
        break;

      case 'map-icon':

        img
          .resize(30, 30);
        break;

      case 'slider_thumb':

        img
          .resize(400, 300)
          .crop();

        break;

      case 'middle':

        img
          .resize(170)
          .max();

        break;

      case 'big':

        img.max();

        resizeMax(img, 1000)

        break;

      case 'action_cover':

        img
          .resize(300, 170)
          .crop();

        break;

      case 'thumb':

        img
          .resize(150, 150)
          // .max()
          .crop(sharp.strategy.entropy);

        break;

      case 'gallery_thumb':

        img
          .resize(600, 850)
          // .max()
          .crop(sharp.strategy.entropy);


        break;

      case 'middle_thumb':

        img
          .resize(405, 576)
          // .resize(225)
          // .max()
          .crop(sharp.strategy.entropy);

        break;

      case 'dot_thumb':

        img
          .resize(40, 30)
          // .max()
          .crop(sharp.strategy.entropy);

        break;


      default:

        res.status(500);
        res.send(`Wrong image type '${type}'`);

    }

    await img
      .withMetadata()
      // .toFormat('jpeg', {
      //   quality: 100,
      // })
      .toBuffer({ resolveWithObject: true })
      .then(({ data, info }) => {
        // console.log('shape result', data);
        // console.log('shape result info', info);

        const {
          format,
        } = info;

        res.status(200);
        res.contentType(`image/${format}`);
        res.setHeader("Cache-Control", "public, max-age=2592000");
        res.setHeader("Expires", new Date(Date.now() + 2592000000).toUTCString());
        res.send(data);

      })
      .catch(e => {
        console.error(e);

        res.status(500);
        res.send(e);

      });

  }
  else {
    console.error("File not exists");

    res.status(404).send('File not found');
  }


}

module.exports = ImageThumbMiddleware;