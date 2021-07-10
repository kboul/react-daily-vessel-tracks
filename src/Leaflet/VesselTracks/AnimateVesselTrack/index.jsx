import React from 'react';
import 'leaflet.animatedmarker/src/AnimatedMarker';
import L from 'leaflet';
import PropTypes from 'prop-types';
import { useLeaflet } from 'react-leaflet';
import Control from 'react-leaflet-control';

import { customMarker } from '../../constants';
import styles from './index.module.sass';

let line;
let animatedMarker;

const AnimateVesselTrack = ({ latlngs }) => {
    console.log(latlngs);
    const { map } = useLeaflet();

    const stopAnimAndRemovePath = () => {
        if (animatedMarker) {
            console.log('ending animation...');
            animatedMarker.stop();
            map.removeLayer(animatedMarker);
            line.removeFrom(map);
        }
    };

    const startAnimation = () => () => {
        line = L.polyline(latlngs, {
            color: '#02929b',
            weight: 1.5,
        }).addTo(map);

        animatedMarker = L.animatedMarker(line.getLatLngs(), {
            icon: customMarker,
            distance: 500,
            interval: 2000,
            onEnd: () => stopAnimAndRemovePath(),
        });

        map.addLayer(animatedMarker);

        animatedMarker.on('move', () => {
            console.log('moving....');
        });
    };

    const stopAnimation = () => () => stopAnimAndRemovePath();

    return (
        <>
            <Control position="topleft">
                <button
                    type="button"
                    className={styles.animateControl}
                    onClick={startAnimation()}>
                    Start animation
                </button>
            </Control>
            <Control position="topleft">
                <button
                    type="button"
                    className={styles.animateControl}
                    onClick={stopAnimation()}>
                    Stop animation
                </button>
            </Control>
        </>
    );
};

AnimateVesselTrack.propTypes = {
    latlngs: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
};

export default AnimateVesselTrack;
