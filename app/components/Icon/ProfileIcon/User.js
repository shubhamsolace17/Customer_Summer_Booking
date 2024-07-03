import themeConfig from 'configurations/Theme.configuration';
import * as React from 'react';
import Svg, {Path, G} from 'react-native-svg';

function ProfileUserIcon(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      id="user-3296"
      width="22"
      height="22"
      viewBox="0 0 22 22">
      <G id="Group_1561" data-name="Group 1561">
        <Path
          id="Path_22"
          data-name="Path 22"
          d="M11,0A11,11,0,1,0,22,11,11,11,0,0,0,11,0Zm0,5.379A3.945,3.945,0,1,1,7.055,9.325,3.95,3.95,0,0,1,11,5.379Zm0,15.115a9.092,9.092,0,0,1-6.834-3.086A7.884,7.884,0,0,1,7.6,14.148a1.8,1.8,0,0,1,1.573.01,4.232,4.232,0,0,0,3.653,0,1.8,1.8,0,0,1,1.573-.01,7.882,7.882,0,0,1,3.434,3.261A9.094,9.094,0,0,1,11,20.495Z"
          fill={themeConfig.colors.primary}
        />
      </G>
    </Svg>
  );
}

export default ProfileUserIcon;
