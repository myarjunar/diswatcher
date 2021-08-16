import * as React from 'react';
import { PieChart } from 'react-minimal-pie-chart';

function ControlPanel(props) {
  const {showEarthquake, onShowEarthquake, fractionData} = props;

  let buildingAreas;
  let landuseAreas;
  let totalBuildingArea;
  let totalLanduseArea;
  if(fractionData) {
    if (fractionData.buildings.features) {
      buildingAreas = fractionData.buildings.features.map((feature) => {
        return feature.properties[0].area;
      });
    } else {
      buildingAreas = [0];
    }

    if (fractionData.landusages.features) {
      landuseAreas = fractionData.landusages.features.map((feature) => {
        return feature.properties[0].area;
      });
    } else {
      landuseAreas = [0];
    }

    totalBuildingArea = buildingAreas.reduce((a, b) => a + b, 0);
    totalLanduseArea = landuseAreas.reduce((a, b) => a + b, 0);
  }

  return (
    <div className="control-panel">
      <h3>DISWATCHER</h3>
      <p>
        Map showing real-time earthquake data
      </p>
      <hr />
      <div className="input">
        <label>Show eq</label>
        <input
          type="checkbox"
          name="allday"
          checked={showEarthquake}
          onChange={evt => onShowEarthquake(evt.target.checked)}
        />
      </div>
      <hr />
      <p>
        Data source:{' '}
        <a href="https://gdacs.org">
          GDACS
        </a>
      </p>
      <hr />
      <p>
        Buildings to landuse fraction
      </p>
      {fractionData && (
        <PieChart
          data={[
            { title: 'Buildings', value: totalBuildingArea, color: '#E38627' },
            { title: 'Landuse', value: totalLanduseArea, color: '#C13C37' },
          ]}
          label={({ dataEntry }) => dataEntry.title}
          labelStyle={{
            fontSize: '5px',
            fontFamily: 'sans-serif',
          }}
        />
      )}
    </div>
  );
}

export default React.memo(ControlPanel);
