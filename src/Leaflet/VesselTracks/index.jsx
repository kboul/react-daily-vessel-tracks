import React, { useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import L from 'leaflet';
import 'leaflet.markercluster/dist/leaflet.markercluster';
import 'leaflet.animatedmarker/src/AnimatedMarker';
import { useLeaflet } from 'react-leaflet';

import AnimateVesselTrack from './AnimateVesselTrack';
import PopupContent from './PopupContent';
import Spinner from '../../Spinner';
import useVesselTracksFetcher from './hooks';
import { customMarker } from '../constants';

const mcg = L.markerClusterGroup();
const latlngs = [];

const VesselTracks = () => {
    const { map } = useLeaflet();
    const [vesselTracks, loading] = useVesselTracksFetcher();

    useEffect(() => {
        vesselTracks.forEach((vesselTrack) => {
            const lat = parseFloat(vesselTrack.LAT);
            const lon = parseFloat(vesselTrack.LON);

            L.marker(new L.LatLng(lat, lon), {
                icon: customMarker,
            })
                .addTo(mcg)
                .bindPopup(
                    ReactDOMServer.renderToString(
                        <PopupContent vesselTrack={vesselTrack} />
                    )
                );

            latlngs.push([lat, lon]);

            // fit the map bounds to the mcg relative coords
            map.fitBounds(mcg.getBounds());
            // add the marker cluster group to the map
            map.addLayer(mcg);
        });
    }, [vesselTracks, map]);

    if (loading) return <Spinner />;

    return <AnimateVesselTrack latlngs={latlngs} />;
};

export default VesselTracks;
