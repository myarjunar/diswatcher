# DISWATCHER
## What is this about
A web map application that visualize near real-time OSM building data and earthquake hazard events based on GDACS.

## Architecture
There are 3 main components for this application to run:
1. docker-osm service: A docker service that will populate PostGIS database based on OSM pbf file and stream the data periodically from live OSM instance.
2. backend service: This component will provide the API that will be used by the frontend application. Some data that will be provided are: osm buildings, osm landuse and GDACS earthquake data (last 3 months). This backend service will also run a cron job that will crawl GDACS Earthquake RSS feed periodically and save it to the database so that we will have near real-time eq hazard data based on GDACS.
3. frontend application: A react based web application that utilize mapbox library to show geospatial data.

### Docker-OSM
This is an orchestrated osm tools which will provide a mirror of OSM live database instance to our PostGIS database. This service consist of 3 main libraries:
- imposm: A library to import OSM data from pbf file to PostGIS database.
- osmupdate: A library that will periodically fetch latest OSM data from planet.openstreetmap.org which then will be imported to the database.
- osmenrich: A library that will fetch OSM changeset metadata from OSM API that are not provided by the pbf file. 

## How to use
### Manual
1.  First of all, we need to run the database locally and populate it with OSM data using docker-osm. Make sure you have `make`, `docker` and `docker-compose` installed on your machine.
    Go to `docker-osm` directory and run `make deploy`. This will build and spin up docker containers using docker-compose to set up our mirror of OSM database.
    This process will take around 10-20 minutes, you can periodically check the progress by running `make logs` from the same directory.
2.  After we are sure that the database has been set up completely, we can check by connecting to it using your favorite clients (QGIS, psql, pgadmin, etc). The connection configuration is as follow:
    - host=localhost
    - port=35432
    - database=gis
    - user=docker
    - password=docker
3.  We can then proceed by running the backend service, but first of all you might as well want to run the cronjob to populate the seeder data and stream for the latest earthquake hazard data from GDACS. From the project directory, go to `diswatcher/backend` directory and run `npm install`, then run migration command to setup `disasters` table which will contains the earthquake data from GDACS `npx sequelize-cli db:migrate` and lastly run the actual command to start the cronjob `node src/interfaces/services/gdacsEarthquakeDataCrawler.js`. Wait for a few seconds and your earthquake data should be ready.
4.  Next step is to run the backend api service. From the same directory, run `npm run start:api`. This will spin up the api service listening at `localhost:8010`. This will be the endpoint that we use for the frontend application.
5. To run the frontend application, from the project directory go to `diswatcher/frontend` and run `npm install` then `npm run start`. You can open the web application from `localhost:8080`.

### Docker
*Under development*
