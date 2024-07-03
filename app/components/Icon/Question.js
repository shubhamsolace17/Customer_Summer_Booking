import themeConfig from 'configurations/Theme.configuration';
import * as React from 'react';
import Svg, {G, Path, Circle} from 'react-native-svg';

function Question(props) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <G data-name="Layer 2">
        <G data-name="menu-arrow-circle">
          <Path
            fill={themeConfig.colors.grey}
            d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 18a8 8 0 118-8 8 8 0 01-8 8z"
          />
          <Path
            fill={themeConfig.colors.grey}
            d="M12 6a3.5 3.5 0 00-3.5 3.5 1 1 0 002 0A1.5 1.5 0 1112 11a1 1 0 00-1 1v2a1 1 0 002 0v-1.16A3.49 3.49 0 0012 6z"
          />
          <Circle fill={themeConfig.colors.grey} cx={12} cy={17} r={1} />
        </G>
      </G>
    </Svg>
  );
}

export default Question;
