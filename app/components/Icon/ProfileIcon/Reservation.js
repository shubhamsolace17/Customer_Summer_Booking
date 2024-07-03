import themeConfig from 'configurations/Theme.configuration';
import * as React from 'react';
import Svg, {Path, G} from 'react-native-svg';

function ProfileReservationIcon(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      id="briefcase-5745"
      width="23.162"
      height="21.259"
      viewBox="0 0 23.162 21.259">
      <G id="Group_1147" data-name="Group 1147">
        <Path
          id="Path_408"
          data-name="Path 408"
          d="M60.6,125.28c0,.023.007.044.007.067a2.049,2.049,0,0,1-4.1,0c0-.023.006-.045.007-.067H46.978v8.38a.867.867,0,0,0,.865.865H69.275a.867.867,0,0,0,.865-.865v-8.38Z"
          transform="translate(-46.978 -113.265)"
          fill={themeConfig.colors.primary}
        />
        <Path
          id="Path_409"
          data-name="Path 409"
          d="M70.14,79.7V74.657a.867.867,0,0,0-.865-.865H47.843a.867.867,0,0,0-.865.865V79.7Z"
          transform="translate(-46.978 -69.284)"
          fill={themeConfig.colors.primary}
        />
        <Path
          id="Path_410"
          data-name="Path 410"
          d="M106.331,52.776H104.7V46.609a2.115,2.115,0,0,0-2.113-2.113h-.775A2.115,2.115,0,0,0,99.7,46.609v6.167H98.064V46.609a3.75,3.75,0,0,1,3.746-3.746h.775a3.75,3.75,0,0,1,3.746,3.746Z"
          transform="translate(-90.617 -42.863)"
          fill={themeConfig.colors.primary}
        />
      </G>
    </Svg>
  );
}

export default ProfileReservationIcon;
