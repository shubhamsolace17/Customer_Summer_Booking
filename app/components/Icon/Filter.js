import themeConfig from 'configurations/Theme.configuration';
import * as React from 'react';
import Svg, {G, Path} from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: style */

function Filter(props) {
  return (
    //   <Svg
    //     id="prefix__Layer_1"
    //     xmlns="http://www.w3.org/2000/svg"
    //     x={0}
    //     y={0}
    //     viewBox="0 0 27 28"
    //     xmlSpace="preserve"
    //     {...props}>
    //     <G id="filter-6551" transform="translate(122.709 126.036)">
    //   <G id="Group_2077" data-name="Group 2077" transform="translate(-122.709 -126.036)">
    //     <Path id="Path_705" data-name="Path 705" d="M157.645,151.932H148.19a.938.938,0,0,1,0-1.876h9.455a.938.938,0,0,1,0,1.876Z" transform="translate(-131.184 -133.303)" fill="#233c7e"/>
    //     <Path id="Path_706" data-name="Path 706" d="M109.726,136.113a3.212,3.212,0,1,1,3.212-3.212A3.216,3.216,0,0,1,109.726,136.113Zm0-4.548a1.336,1.336,0,1,0,1.336,1.336A1.337,1.337,0,0,0,109.726,131.564Z" transform="translate(-94.994 -115.209)" fill="#233c7e"/>
    //     <Path id="Path_707" data-name="Path 707" d="M15.786,151.932H4.265a.938.938,0,0,1,0-1.876h11.52a.938.938,0,1,1,0,1.876Z" transform="translate(-3.327 -133.303)" fill="#233c7e"/>
    //     <Path id="Path_708" data-name="Path 708" d="M89.093,87.088H71.023a.938.938,0,0,1,0-1.876H89.093a.938.938,0,0,1,0,1.876Z" transform="translate(-62.631 -75.698)" fill="#233c7e"/>
    //     <Path id="Path_709" data-name="Path 709" d="M32.556,71.266a3.212,3.212,0,1,1,3.212-3.212A3.216,3.216,0,0,1,32.556,71.266Zm0-4.548a1.336,1.336,0,1,0,1.336,1.336A1.338,1.338,0,0,0,32.556,66.717Z" transform="translate(-26.439 -57.602)" fill="#233c7e"/>
    //     <Path id="Path_710" data-name="Path 710" d="M7.17,87.088h-2.9a.938.938,0,1,1,0-1.876h2.9a.938.938,0,1,1,0,1.876Z" transform="translate(-3.327 -75.698)" fill="#233c7e"/>
    //     <Path id="Path_711" data-name="Path 711" d="M20.979,22.246H4.265a.938.938,0,1,1,0-1.876H20.979a.938.938,0,0,1,0,1.876Z" transform="translate(-3.327 -18.096)" fill="#233c7e"/>
    //     <Path id="Path_712" data-name="Path 712" d="M156.239,6.425a3.212,3.212,0,1,1,3.212-3.212A3.216,3.216,0,0,1,156.239,6.425Zm0-4.548a1.336,1.336,0,1,0,1.336,1.336A1.338,1.338,0,0,0,156.239,1.876Z" transform="translate(-136.314)" fill="#233c7e"/>
    //     <Path id="Path_713" data-name="Path 713" d="M198.968,22.246h-4.262a.938.938,0,0,1,0-1.876h4.262a.938.938,0,1,1,0,1.876Z" transform="translate(-172.506 -18.096)" fill="#233c7e"/>
    //     <Path id="Path_714" data-name="Path 714" d="M89.093,216.776H71.023a.938.938,0,0,1,0-1.876H89.093a.938.938,0,0,1,0,1.876Z" transform="translate(-62.631 -190.907)" fill="#233c7e"/>
    //     <Path id="Path_715" data-name="Path 715" d="M32.556,200.954a3.212,3.212,0,1,1,3.212-3.212A3.216,3.216,0,0,1,32.556,200.954Zm0-4.548a1.336,1.336,0,1,0,1.336,1.336A1.338,1.338,0,0,0,32.556,196.405Z" transform="translate(-26.439 -172.811)" fill="#233c7e"/>
    //     <Path id="Path_716" data-name="Path 716" d="M7.17,216.776h-2.9a.938.938,0,0,1,0-1.876h2.9a.938.938,0,0,1,0,1.876Z" transform="translate(-3.327 -190.907)" fill="#233c7e"/>
    //   </G>
    // </G>

    //   </Svg>
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      id="Group_2077"
      data-name="Group 2077"
      width="27.4"
      height="28.143"
      viewBox="0 0 27.4 28.143">
      <Path
        id="Path_705"
        data-name="Path 705"
        d="M157.645,151.932H148.19a.938.938,0,0,1,0-1.876h9.455a.938.938,0,0,1,0,1.876Z"
        transform="translate(-131.184 -133.303)"
        fill="#233c7e"
      />
      <Path
        id="Path_706"
        data-name="Path 706"
        d="M109.726,136.113a3.212,3.212,0,1,1,3.212-3.212A3.216,3.216,0,0,1,109.726,136.113Zm0-4.548a1.336,1.336,0,1,0,1.336,1.336A1.337,1.337,0,0,0,109.726,131.564Z"
        transform="translate(-94.994 -115.209)"
        fill="#233c7e"
      />
      <Path
        id="Path_707"
        data-name="Path 707"
        d="M15.786,151.932H4.265a.938.938,0,0,1,0-1.876h11.52a.938.938,0,1,1,0,1.876Z"
        transform="translate(-3.327 -133.303)"
        fill="#233c7e"
      />
      <Path
        id="Path_708"
        data-name="Path 708"
        d="M89.093,87.088H71.023a.938.938,0,0,1,0-1.876H89.093a.938.938,0,0,1,0,1.876Z"
        transform="translate(-62.631 -75.698)"
        fill="#233c7e"
      />
      <Path
        id="Path_709"
        data-name="Path 709"
        d="M32.556,71.266a3.212,3.212,0,1,1,3.212-3.212A3.216,3.216,0,0,1,32.556,71.266Zm0-4.548a1.336,1.336,0,1,0,1.336,1.336A1.338,1.338,0,0,0,32.556,66.717Z"
        transform="translate(-26.439 -57.602)"
        fill="#233c7e"
      />
      <Path
        id="Path_710"
        data-name="Path 710"
        d="M7.17,87.088h-2.9a.938.938,0,1,1,0-1.876h2.9a.938.938,0,1,1,0,1.876Z"
        transform="translate(-3.327 -75.698)"
        fill="#233c7e"
      />
      <Path
        id="Path_711"
        data-name="Path 711"
        d="M20.979,22.246H4.265a.938.938,0,1,1,0-1.876H20.979a.938.938,0,0,1,0,1.876Z"
        transform="translate(-3.327 -18.096)"
        fill="#233c7e"
      />
      <Path
        id="Path_712"
        data-name="Path 712"
        d="M156.239,6.425a3.212,3.212,0,1,1,3.212-3.212A3.216,3.216,0,0,1,156.239,6.425Zm0-4.548a1.336,1.336,0,1,0,1.336,1.336A1.338,1.338,0,0,0,156.239,1.876Z"
        transform="translate(-136.314)"
        fill="#233c7e"
      />
      <Path
        id="Path_713"
        data-name="Path 713"
        d="M198.968,22.246h-4.262a.938.938,0,0,1,0-1.876h4.262a.938.938,0,1,1,0,1.876Z"
        transform="translate(-172.506 -18.096)"
        fill="#233c7e"
      />
      <Path
        id="Path_714"
        data-name="Path 714"
        d="M89.093,216.776H71.023a.938.938,0,0,1,0-1.876H89.093a.938.938,0,0,1,0,1.876Z"
        transform="translate(-62.631 -190.907)"
        fill="#233c7e"
      />
      <Path
        id="Path_715"
        data-name="Path 715"
        d="M32.556,200.954a3.212,3.212,0,1,1,3.212-3.212A3.216,3.216,0,0,1,32.556,200.954Zm0-4.548a1.336,1.336,0,1,0,1.336,1.336A1.338,1.338,0,0,0,32.556,196.405Z"
        transform="translate(-26.439 -172.811)"
        fill="#233c7e"
      />
      <Path
        id="Path_716"
        data-name="Path 716"
        d="M7.17,216.776h-2.9a.938.938,0,0,1,0-1.876h2.9a.938.938,0,0,1,0,1.876Z"
        transform="translate(-3.327 -190.907)"
        fill="#233c7e"
      />
    </Svg>
  );
}

export default Filter;
