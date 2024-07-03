import themeConfig from 'configurations/Theme.configuration';
import * as React from 'react';
import Svg, {Path, G} from 'react-native-svg';

function ProfileFavouriteIcon(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      id="heart-431"
      width="21.764"
      height="19.622"
      viewBox="0 0 21.764 19.622">
      <G id="Group_831" data-name="Group 831">
        <Path
          id="Union_13"
          data-name="Union 13"
          d="M10.882,19.622,6.511,15.251l-4.7-4.7a6.181,6.181,0,0,1,8.742-8.74l.33.33.331-.33a6.181,6.181,0,0,1,8.74,8.742l-4.7,4.7Z"
          fill={themeConfig.colors.primary}
        />
      </G>
    </Svg>
  );
}

export default ProfileFavouriteIcon;
