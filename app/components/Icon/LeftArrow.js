import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function LeftArrow(props) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 195 263" {...props}>
      <Path
        d="M135.2 241L32.89 139.43c-4.46-4.42-4.46-11.63 0-16.05l94.32-93.63c4.42-4.39 11.56-4.38 15.97.03 4.43 4.43 4.41 11.62-.03 16.03L64.9 123.37c-4.46 4.42-4.46 11.64 0 16.06L143.13 217c4.45 4.41 4.46 11.6.03 16.03L135.2 241"
        fill="#fff"
      />
    </Svg>
  );
}

export default LeftArrow;
