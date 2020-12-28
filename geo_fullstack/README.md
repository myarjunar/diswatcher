# Geospatial Fullstack

## Instructions

Geospatial fullstack (in my opinion) is all about creating functional, useful geospatial applications that leverage html/javascript on the frontend and can connect to geospatial databases and sources on the backend. Show us your creativity in the form of a functional web application.

* Address all questions below.
* Your webapp should use Mapbox, Leaflet, Plotly, Google Earth Engine, or equivalent.
* Please clone this repo and address the required components below. 
* To submit, please provide all links, script, and code in a google drive or dropbox link and email back to your HR contact email. 
* Ensure the shared location is externally visible.
* Do not spend more than a few hours on this task.


## Task(s)

1. Create a web application that ingests Open Street Map (OSM) data for the neighborhood in Tokyo (provided in this repo) and allow for user interactivity. The neighborhood is provided in the [tokyo.geojson](https://github.com/shaystrong/assessment/blob/main/geo_fullstack/tokyo.geojson) file in this repo. Perform the following actions:  
   1. Query and download OSM data for the Tokyo region. Save the data in a local or cloud database. If you can stream from OSM directly great! Avoid the use of static files (e.g. shapefiles, xls).
   1. Enable a user to query your data interactively through a map by drawing a polygon. The output of the polygon should be the number of unique buildings. Report the number of buildings and the fraction of building area to landuse area in that user-queried polygon.
  
1. Discuss or demonstrate how you would store the data in a persistent cloud environment. How frequently would you capture this information? What is required for storing this info for an entire country? What are the limitations or considerations?

1. Add additional functionality on the web app for charting or plotting useful or insightful information. Be creative.

1. (Optional) Add an additional data source that may be valuable for overlay as a vector layer. Why is it useful?
