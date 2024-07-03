import * as React from 'react';
import Svg, {Path, G, Defs, ClipPath, Use, Ellipse} from 'react-native-svg';

function Cancel(props) {
  return (
    // <Svg
    //   xmlns="http://www.w3.org/2000/svg"
    //   xmlnsXlink="http://www.w3.org/1999/xlink"
    //   viewBox="0 0 512 512"
    //   {...props}>
    //   <Path
    //     d="M256 485.08C129.69 485.08 26.92 382.31 26.92 256 26.92 129.69 129.69 26.92 256 26.92c126.31 0 229.08 102.77 229.08 229.08 0 126.31-102.77 229.08-229.08 229.08zM256 7C118.47 7 7 118.47 7 256s111.47 249 249 249 249-111.47 249-249S393.53 7 256 7z"
    //     fill="#243b7c"
    //   />
    //   <Defs>
    //     <Path fill="#243b7c" id="prefix__a" d="M0 0h512v512H0z" />
    //   </Defs>
    //   <ClipPath id="prefix__b">
    //     <Use xlinkHref="#prefix__a" overflow="visible" />
    //   </ClipPath>
    //   <Path
    //     clipPath="url(#prefix__b)"
    //     fill="#243b7c"
    //     d="M368.55 157.07l-14.09-14.08-98.6 98.6-98.13-98.13-14.08 14.08 98.13 98.13-98.13 98.14 14.08 14.08 98.13-98.14 98.6 98.61 14.09-14.09-98.6-98.6z"
    //   />
    // </Svg>

    <Svg
      xmlns="http://www.w3.org/2000/svg"
      id="close-5758"
      width="24"
      height="24"
      viewBox="0 0 24 24">
      <G id="Group_1196" data-name="Group 1196" transform="translate(0 0)">
        <Ellipse
          id="Ellipse_63"
          data-name="Ellipse 63"
          cx="12"
          cy="12"
          rx="12"
          ry="12"
          fill="#233c7e"
        />
        <Path
          id="Path_426"
          data-name="Path 426"
          d="M74.248,68.724a.8.8,0,0,1-.566-.234L62.843,57.65a.8.8,0,0,1,1.131-1.131L74.814,67.358a.8.8,0,0,1-.566,1.366Z"
          transform="translate(-56.648 -50.926)"
          fill="#fff"
        />
        <Path
          id="Path_427"
          data-name="Path 427"
          d="M63.409,68.721a.8.8,0,0,1-.566-1.366L73.682,56.516a.8.8,0,1,1,1.131,1.131L63.975,68.487A.8.8,0,0,1,63.409,68.721Z"
          transform="translate(-56.648 -50.923)"
          fill="#fff"
        />
      </G>
    </Svg>
  );
}

export default Cancel;
