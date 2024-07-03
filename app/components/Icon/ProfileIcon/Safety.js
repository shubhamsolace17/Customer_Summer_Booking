import themeConfig from 'configurations/Theme.configuration';
import * as React from 'react';
import Svg, {Path, G} from 'react-native-svg';

function ProfileSafetyIcon(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="27.934"
      viewBox="0 0 22 27.934">
      <G id="black-padlock-11724" transform="translate(0)">
        <G id="Group_1716" data-name="Group 1716" transform="translate(0)">
          <Path
            id="Path_557"
            data-name="Path 557"
            d="M55.449,10.945h-1.3V6.256C54.149,2.8,51.073,0,47.278,0H46.047c-3.795,0-6.871,2.8-6.871,6.256v4.689h-1.3a2.121,2.121,0,0,0-2.213,2.015V25.919a2.121,2.121,0,0,0,2.213,2.015H55.449a2.121,2.121,0,0,0,2.213-2.015V12.96A2.121,2.121,0,0,0,55.449,10.945Zm-7.577,8.526v2.972a1.215,1.215,0,0,1-2.419,0V19.471a1.94,1.94,0,0,1-.949-2.125,2.11,2.11,0,0,1,1.681-1.526,2.167,2.167,0,0,1,2.687,1.967A1.972,1.972,0,0,1,47.872,19.471ZM41.9,10.945V7.114a4.877,4.877,0,0,1,5.089-4.633,4.25,4.25,0,0,1,4.435,4.038v4.426Z"
            transform="translate(-35.663 0)"
            fill={themeConfig.colors.primary}
          />
        </G>
      </G>
    </Svg>
  );
}

export default ProfileSafetyIcon;
