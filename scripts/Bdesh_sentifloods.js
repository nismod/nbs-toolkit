

var dataset = ee.FeatureCollection("FAO/GAUL/2015/level0");

var c = dataset.filter(ee.Filter.eq('ADM0_NAME', 'Bangladesh'))

var label = 'Class';

Map.addLayer(c);

//select the VV band

var sent=ee.ImageCollection('COPERNICUS/S1_GRD') //sentinel-1
.filterBounds(c)
.filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
.select('VV'); //only the vv band

//dry season
var before = sent.filterDate('2020-05-05', '2020-05-10').mosaic();

//wet season
var after = sent.filterDate('2020-05-15', '2020-05-22').mosaic();

//Focal_median
//morphological filtering- highlights/segments features

// take radar intensities

var SMOOTHING_RADIUS = 100; 

//apply focal_median on radar intensititioes

var before_smoothed = before.focal_median(SMOOTHING_RADIUS, 'circle', 'meters')

var after_smoothed = after.focal_median(SMOOTHING_RADIUS, 'circle', 'meters')

Map.addLayer(after_smoothed,{min:-30,max:0},'before');

//Subtract the two rasters 
var diff=after_smoothed-before_smoothed

Map.addLayer(diff,{min:-30,max:0}, 'diff smoothed', 0);
//Map.addLayer(after.subtract(before), {min:-10,max:10}, 'After - before', 0);