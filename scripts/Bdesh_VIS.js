
//https://martinedoesgis.github.io/floods/index.html
//https://link.springer.com/article/10.1007/s11269-017-1568-y 
//https://rstudio-pubs-static.s3.amazonaws.com/418842_ed7abc941cdb45799c0c9593411be9ab.html


var dataset = ee.FeatureCollection("FAO/GAUL/2015/level0");

var c = dataset.filter(ee.Filter.eq('ADM0_NAME', 'Bangladesh'))

var label = 'Class';

Map.addLayer(c);

/**
 * Function to mask clouds using the Sentinel-2 QA band
 * @param {ee.Image} image Sentinel-2 image
 * @return {ee.Image} cloud masked Sentinel-2 image
 */
function maskS2clouds(image) {
  var qa = image.select('QA60');

  // Bits 10 and 11 are clouds and cirrus, respectively.
  var cloudBitMask = 1 << 10;
  var cirrusBitMask = 1 << 11;

  // Both flags should be set to zero, indicating clear conditions.
  var mask = qa.bitwiseAnd(cloudBitMask).gte(0)
      .and(qa.bitwiseAnd(cirrusBitMask).gte(0));

  return image.updateMask(mask).divide(10000);
}

var imageNotClipped = ee.ImageCollection('COPERNICUS/S2_SR')
                  .filterDate('2019-10-26','2019-10-28')   // set dates here
                  // Pre-filter to get less cloudy granules.
                  //.filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',20))
                  .map(maskS2clouds)
                  .median();


var image = imageNotClipped.clip(c);

var rgbVis = {
  min: 0.0,
  max: 0.3,
  bands: ['B4', 'B3', 'B2'],
};


Map.addLayer(image, rgbVis, 'Raw Image');

// Formulas from https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6111878/
var ndwi_gao = image.expression('(nir - swir) / (nir + swir)' ,{
  'nir':image.select('B8'),
  'swir':image.select('B11'),
}).rename('NDWIGao')
var visNDWIGao = {
  min: 0,
  max: 1,
  bands: ['NDWIGao'],
  palette: ['blue']
};

var ndwi_mcfeeters = image.expression('(green - nir) / (green + nir)' ,{
  'green':image.select('B3'),
  'nir':image.select('B8'),
}).rename('NDWIMCF')
var visNDWIMCF = {
  min: 0,
  max: 1,
  bands: ['NDWIMCF'],
  palette: ['blue']
};

var MNDWI = image.expression('(green - swir) / (green + swir)' ,{
  'green':image.select('B3'),
  'swir':image.select('B11'),
}).rename('MNDWI')
var visMNDWI = {
  min: 0,
  max: 1,
  bands: ['MNDWI'],
  palette: ['blue']
};


var aweish = image.expression('(blue + 2.5 * green - 1.5 * (nir - swir1) - (0.25 * swir2))/(blue + green + nir + swir1 + swir2)' ,{
  'green':image.select('B3'),
  'blue':image.select('B2'),
  'nir':image.select('B8'),
  'swir1':image.select('B11'),
  'swir2':image.select('B12')
}).rename('AWEIsh')
var visAweish = {
  min: 0,
  max: 1,
  bands: ['AWEIsh'],
  palette: ['blue']
};

var ndfi = image.expression('(red - swir2) / (red + swir2)' ,{
  'red':image.select('B4'),
  'swir2':image.select('B12')
}).rename('NDFI')
var visNDFI = {
  min: 0,
  max: 1,
  bands: ['NDFI'],
  palette: ['blue']
};



                       
//NDWI Gao
var ndwiGaoMasked = ndwi_gao.updateMask(ndwi_gao.gte(0.3));
Map.addLayer(ndwiGaoMasked, visNDWIGao, 'NDWI Gao');

// NDVI McFeeters
var ndwiMcFeetersMasked = ndwi_mcfeeters.updateMask(ndwi_mcfeeters.gte(0));
Map.addLayer(ndwiMcFeetersMasked, visNDWIMCF, 'NDWI McFeeters');

// MNDWI
var ndwiMNDWIMasked = MNDWI.updateMask(MNDWI.gte(0));
Map.addLayer(ndwiMNDWIMasked, visMNDWI, 'MNDWI');

// Aweish
var aweishMasked = aweish.updateMask(aweish.gte(0.6)); //adjust AWEISH threshold here
Map.addLayer(aweishMasked, visAweish, 'AWEIsh');

// NDFI
var ndfiMasked = ndfi.updateMask(ndfi.gte(0));
Map.addLayer(ndfiMasked, visNDFI, 'NDFI');
