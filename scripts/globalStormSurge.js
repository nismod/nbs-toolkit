{\rtf1\ansi\ansicpg1252\cocoartf2759
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 \
\
//https://gee-community-catalog.org/projects/gssr/\
Map.setCenter(-24.67,18.63,3)\
\
Map.addLayer(surge_era_5)\
\
function getSysTime(feature) \{\
    return feature.set('system:time_start',ee.Date.parse("yyyy-MM-dd HH:mm:ss",ee.String(feature.get('date')).replace("T"," ")))\
\}\
\
var timed = surge_era_5.filterBounds(geometry).map(getSysTime)\
print('Total Features in AOI',timed.size())\
print('Start Date',ee.Feature(timed.sort('system:time_start').first().get('system:time_start')))\
print('End Date',ee.Feature(timed.sort('system:time_start',false).first()).get('system:time_start'))\
\
// Define the chart and print it to the console.\
var chart =\
    ui.Chart.feature\
        .histogram(\{features: timed, property: 'surge_reconsturcted', maxBuckets: 50\})\
        .setOptions(\{\
          title: 'Daily maximum surge (m)',\
          hAxis: \{\
            title: 'Daily maximum surge (m)',\
            titleTextStyle: \{italic: false, bold: true\}\
          \},\
          vAxis: \{\
            title: 'Observation count',\
            titleTextStyle: \{italic: false, bold: true\}\
          \},\
          colors: ['1d6b99'],\
          legend: \{position: 'none'\}\
        \});\
print(chart);\
}