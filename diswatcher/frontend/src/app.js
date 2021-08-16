import * as React from 'react';
import {useRef, useState, useEffect, useMemo, useCallback} from 'react';
import {render} from 'react-dom';
import MapGL, {Source, Layer} from 'react-map-gl';
import {Editor, DrawPolygonMode, EditingMode} from 'react-map-gl-draw';
import WKT from 'terraformer-wkt-parser';

import ControlPanel from './control-panel';
import {getFeatureStyle, getEditHandleStyle} from './style';
import {dataLayer} from './map-style.js';
import {heatmapLayer} from './heatmap-style.js';
import {updatePercentiles} from './utils';

const MAPBOX_TOKEN = 'pk.eyJ1IjoibXlhcmp1bmFyIiwiYSI6ImNrczkyNDJ4NDNlNm0ydm1zNmkzN2pxbTQifQ.80FFH9wK3b35p2GxP6J5cQ'; // Set your mapbox token here

export default function App() {
  const [viewport, setViewport] = useState({
    longitude: 139.75734,
    latitude: 35.68709,
    zoom: 15,
    bearing: 0,
    pitch: 0
  });
  const [mode, setMode] = useState(null);
  const [allData, setAllData] = useState(null);
  const [eqData, setEqData] = useState(null);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [showEarthquake, setShowEarthquake] = useState(false);
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(null);

  const editorRef = useRef(null);

  const data = useMemo(() => {
    return allData;
  }, [allData]);

  const hazardData = useMemo(() => {
    return eqData;
  }, [eqData]);

  const onHover = useCallback(event => {
    const {
      features,
      srcEvent: {offsetX, offsetY}
    } = event;
    const hoveredFeature = features && features[0];
    if (hoveredFeature) hoveredFeature.properties = JSON.parse(hoveredFeature.properties[0]);

    setHoverInfo(
      hoveredFeature
        ? {
            feature: hoveredFeature,
            x: offsetX,
            y: offsetY
          }
        : null
    );
  }, []);

  const onSelect = useCallback(options => {
    setSelectedFeatureIndex(options && options.selectedFeatureIndex);

    const features = editorRef.current.getFeatures();
    const boundary = features && (features[options.selectedFeatureIndex] || features[features.length - 1]);

    if (boundary) {
      const boundaryWkt = WKT.convert(boundary.geometry);
      fetch(
        `http://localhost:8010/analysis/area-fraction/?geometry=SRID=4326;${boundaryWkt}`
      )
        .then(resp => resp.json())
        .then(json => setAllData(json));
    };
  }, []);

  const onShowEarthquake = useCallback((showEarthquake) => {
    setShowEarthquake(showEarthquake);
    
    if (showEarthquake) {
      fetch(
        `http://localhost:8010/disasters`
      )
        .then(resp => resp.json())
        .then(json => setEqData(json));
    }
  }, []);

  const onDelete = useCallback(() => {
    if (selectedFeatureIndex !== null && selectedFeatureIndex >= 0) {
      editorRef.current.deleteFeatures(selectedFeatureIndex);
    }
  }, [selectedFeatureIndex]);

  const onUpdate = useCallback(({editType}) => {
    if (editType === 'addFeature') {
      setMode(new EditingMode());
    }
  }, []);

  const drawTools = (
    <div className="mapboxgl-ctrl-top-left">
      <div className="mapboxgl-ctrl-group mapboxgl-ctrl">
        <button
          className="mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_polygon"
          title="Polygon tool (p)"
          onClick={() => setMode(new DrawPolygonMode())}
        />
        <button
          className="mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_trash"
          title="Delete"
          onClick={onDelete}
        />
      </div>
    </div>
  );

  const features = editorRef.current && editorRef.current.getFeatures();
  const boundary = features && (features[selectedFeatureIndex] || features[features.length - 1]);

  return (
    <>
      <MapGL
        {...viewport}
        width="100%"
        height="100%"
        mapStyle="mapbox://styles/mapbox/dark-v9"
        onViewportChange={setViewport}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        interactiveLayerIds={['data']}
        onHover={onHover}
      >
        <Editor
          ref={editorRef}
          style={{width: '100%', height: '100%'}}
          clickRadius={12}
          mode={mode}
          onSelect={onSelect}
          onUpdate={onUpdate}
          editHandleShape={'circle'}
          featureStyle={getFeatureStyle}
          editHandleStyle={getEditHandleStyle}
        />
        {drawTools}
        {!showEarthquake && boundary && data && (
          <Source type="geojson" data={data.buildings}>
            <Layer {...dataLayer} />
          </Source>
        )}
        {showEarthquake && hazardData && (
          <Source type="geojson" data={hazardData}>
            <Layer {...heatmapLayer} />
          </Source>
        )}
        {hoverInfo && (
          <div className="tooltip" style={{left: hoverInfo.x, top: hoverInfo.y}}>
            <div>Name: {hoverInfo.feature.properties.name || 'unknown'}</div>
            <div>User: {hoverInfo.feature.properties.changeset_user || 'unknown'}</div>
            <div>Area: {hoverInfo.feature.properties.area}</div>
          </div>
        )}
      </MapGL>

      <ControlPanel showEarthquake={showEarthquake} onShowEarthquake={onShowEarthquake} fractionData={!showEarthquake && boundary && data}/>
    </>
  );
}

export function renderToDom(container) {
  render(<App />, container);
}
