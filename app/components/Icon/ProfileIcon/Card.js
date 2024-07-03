import themeConfig from 'configurations/Theme.configuration';
import * as React from 'react';
import Svg, {Path, G} from 'react-native-svg';

function ProfileCardIcon(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="22.5"
      height="15.874"
      viewBox="0 0 22.5 15.874">
      <G id="credit-card-2015" transform="translate(126.287 88.314)">
        <G
          id="Group_1715"
          data-name="Group 1715"
          transform="translate(-126.036 -88.061)">
          <Path
            id="Path_552"
            data-name="Path 552"
            d="M61.11,163.389H53.563a.244.244,0,1,1,0-.489H61.11a.244.244,0,1,1,0,.489Z"
            transform="translate(-48.665 -151.997)"
            fill={themeConfig.colors.primary}
            stroke={themeConfig.colors.primary}
            stroke-width="0.5"
          />
          <Path
            id="Path_553"
            data-name="Path 553"
            d="M57.922,183.975H53.563a.244.244,0,1,1,0-.489h4.359a.244.244,0,1,1,0,.489Z"
            transform="translate(-48.665 -170.786)"
            fill={themeConfig.colors.primary}
            stroke={themeConfig.colors.primary}
            stroke-width="0.5"
          />
          <Path
            id="Path_554"
            data-name="Path 554"
            d="M118.6,183.975h-2.049a.244.244,0,0,1,0-.489H118.6a.244.244,0,1,1,0,.489Z"
            transform="translate(-106.158 -170.786)"
            fill={themeConfig.colors.primary}
            stroke={themeConfig.colors.primary}
            stroke-width="0.5"
          />
          <Path
            id="Path_555"
            data-name="Path 555"
            d="M183.708,165.186H180a.244.244,0,0,1-.244-.244v-1.8A.244.244,0,0,1,180,162.9h3.708a.244.244,0,0,1,.244.244v1.8A.245.245,0,0,1,183.708,165.186Zm-3.464-.489h3.219v-1.308h-3.219Z"
            transform="translate(-164.067 -151.997)"
            fill={themeConfig.colors.primary}
            stroke={themeConfig.colors.primary}
            stroke-width="0.5"
          />
          <Path
            id="Path_556"
            data-name="Path 556"
            d="M21.291,40.822H19.866l-.2-2.18a.735.735,0,0,0-.795-.664L.667,39.609A.732.732,0,0,0,0,40.4L.989,51.42a.734.734,0,0,0,.729.667l.066,0,.469-.042v.6a.71.71,0,0,0,.709.709H21.291A.71.71,0,0,0,22,52.637V41.531A.709.709,0,0,0,21.291,40.822ZM1.741,51.6a.242.242,0,0,1-.264-.221L.49,40.36A.244.244,0,0,1,.71,40.1L18.92,38.465a.244.244,0,0,1,.264.221l.191,2.136H2.962a.71.71,0,0,0-.709.709v10.02Zm1-7.977H21.511v2.927H2.742Zm18.769,9.017a.22.22,0,0,1-.22.22H2.962a.22.22,0,0,1-.22-.22v-5.6H21.511ZM2.742,43.131v-1.6a.22.22,0,0,1,.22-.22H21.291a.22.22,0,0,1,.22.22v1.6Z"
            transform="translate(0 -37.975)"
            fill={themeConfig.colors.primary}
            stroke={themeConfig.colors.primary}
            stroke-width="0.5"
          />
        </G>
      </G>
    </Svg>
  );
}

export default ProfileCardIcon;
