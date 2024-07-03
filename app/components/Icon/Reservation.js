import themeConfig from 'configurations/Theme.configuration';
import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function Reservation(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 594.983 594.983"
      {...props}>
      <Path
        fill={props.color || themeConfig.colors.grey}
        d="M36.534 542.792h46.971v36.533H36.534zM516.695 542.792h46.972v36.533h-46.972zM287.052 365.34h31.317c20.875 0 26.097-8.803 26.097-26.096v-52.193h250.518V135.697c0-17.293-14.019-31.312-31.316-31.312h-86.115V67.851c0-28.778-23.414-52.192-52.192-52.192H169.625c-28.778 0-52.192 23.414-52.192 52.192v36.534H31.317C14.023 104.385 0 118.403 0 135.697v151.355h260.956v52.193c0 17.293 5.221 26.095 26.096 26.095zM159.187 104.385V67.851c0-5.757 4.686-10.438 10.438-10.438h255.74c5.757 0 10.438 4.681 10.438 10.438v36.534H159.187z"
      />
      <Path
        fill={props.color || themeConfig.colors.grey}
        d="M594.983 485.377V323.586H375.777v46.971c0 17.293-14.019 31.312-31.312 31.312H255.74c-17.294 0-31.312-14.02-31.312-31.312v-46.971H0v161.791c0 17.295 14.019 31.312 31.317 31.312h532.354c17.294.007 31.312-14.013 31.312-31.312z"
      />
    </Svg>
  );
}

export default Reservation;
