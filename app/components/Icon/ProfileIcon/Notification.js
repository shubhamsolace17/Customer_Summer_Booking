import themeConfig from 'configurations/Theme.configuration';
import * as React from 'react';
import Svg, {Path, G} from 'react-native-svg';

function ProfileNotificationIcon(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="21.25"
      height="23.614"
      viewBox="0 0 21.25 23.614">
      <G id="notification-bell-13114" transform="translate(0)">
        <G id="Group_1717" data-name="Group 1717" transform="translate(0)">
          <Path
            id="Path_558"
            data-name="Path 558"
            d="M51.909,46.827H37.542a1.476,1.476,0,0,1-1.5-1.453,2.929,2.929,0,0,1,1.071-2.257,1.458,1.458,0,0,0,.533-1.123V36.86a7.078,7.078,0,0,1,14.151,0v5.134a1.458,1.458,0,0,0,.533,1.123,2.929,2.929,0,0,1,1.071,2.257A1.477,1.477,0,0,1,51.909,46.827Z"
            transform="translate(-34.101 -27.179)"
            fill={themeConfig.colors.primary}
          />
          <Path
            id="Path_559"
            data-name="Path 559"
            d="M105.292,4.3a2.186,2.186,0,0,1-2.214-2.151,2.215,2.215,0,0,1,4.429,0A2.186,2.186,0,0,1,105.292,4.3Z"
            transform="translate(-94.667)"
            fill={themeConfig.colors.primary}
          />
          <Path
            id="Path_560"
            data-name="Path 560"
            d="M171.561,14.842a.757.757,0,0,1-.768-.746,8.78,8.78,0,0,0-4.871-7.819A.735.735,0,0,1,165.6,5.27a.779.779,0,0,1,1.037-.314,10.263,10.263,0,0,1,5.693,9.14A.757.757,0,0,1,171.561,14.842Z"
            transform="translate(-151.08 -4.415)"
            fill={themeConfig.colors.primary}
          />
          <Path
            id="Path_561"
            data-name="Path 561"
            d="M16.645,14.844a.757.757,0,0,1-.768-.746A10.262,10.262,0,0,1,21.57,4.959a.78.78,0,0,1,1.037.314.736.736,0,0,1-.323,1.007A8.78,8.78,0,0,0,17.413,14.1.757.757,0,0,1,16.645,14.844Z"
            transform="translate(-15.878 -4.417)"
            fill={themeConfig.colors.primary}
          />
          <Path
            id="Path_562"
            data-name="Path 562"
            d="M90.068,222.885a3.568,3.568,0,0,0,6.938,0Z"
            transform="translate(-82.913 -202.005)"
            fill={themeConfig.colors.primary}
          />
        </G>
      </G>
    </Svg>
  );
}

export default ProfileNotificationIcon;
