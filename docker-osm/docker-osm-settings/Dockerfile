# This image is intended to be used as a storage
# only container

FROM byrnedo/alpine-curl

RUN mkdir /settings
RUN wget https://download.geofabrik.de/asia/japan/kanto-latest.osm.pbf -O settings/country.pbf
ADD clip /settings/clip
ADD clip.geojson /settings/clip.geojson
ADD mapping.yml /settings/mapping.yml
ADD qgis_style.sql /settings/qgis_style.sql
