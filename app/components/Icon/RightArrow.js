import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function RightArrow(props) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 195 263" {...props}>
      <Path
        d="M47.8 21.8l102.31 101.57c4.46 4.42 4.46 11.63 0 16.05L55.8 233.06c-4.42 4.39-11.56 4.38-15.97-.03-4.43-4.43-4.41-11.62.03-16.03l78.23-77.57c4.46-4.42 4.46-11.64 0-16.06L39.87 45.8c-4.45-4.41-4.46-11.6-.03-16.03l7.96-7.97"
        fill="#4e4e4e"
      />
    </Svg>
  );
}

export default RightArrow;
