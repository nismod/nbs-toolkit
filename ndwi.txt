
// Define the date range for 2020
var startDate2020 = '2020-01-01';
var endDate2020 = '2020-12-31';

// Load Landsat 8 image collection for the year 2020
var collection2020 = ee.ImageCollection('LANDSAT/LC08/C01/T1_SR')
  .filterBounds(table)
  .filterDate(startDate2020, endDate2020);

// Calculate the median image for 2020 to reduce noise
var image2020 = collection2020.median().clip(table);

// Compute the Modified Normalized Difference Water Index (MNDWI)
var mndwi2020 = image2020.normalizedDifference(['B3', 'B6']).rename('MNDWI_2020');

// Create a binary land mask using a threshold (adjust threshold as needed)
var landMask2020 = mndwi2020.lt(0); // Negative MNDWI values represent land

// Display the land mask for 2020 on the map
Map.centerObject(table, 8);
Map.addLayer(landMask2020, {palette: ['000000', 'FFFFFF'], min: 0, max: 1}, 'Land Mask (2020)');