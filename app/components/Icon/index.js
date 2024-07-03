import React from 'react';
import BeachUmbrella from 'components/Icon/BeachUmbrella';
import Location from 'components/Icon/Location';
import Sort from 'components/Icon/Sort';
import Filter from 'components/Icon/Filter';
import Checked from 'components/Icon/Checked';
import Delete from 'components/Icon/Delete';
import Heart from 'components/Icon/Heart';
import HeartFill from 'components/Icon/HeartFill';
import RightArrow from 'components/Icon/RightArrow';
import LeftArrow from 'components/Icon/LeftArrow';
import Share from 'components/Icon/Share';
import Coffee from 'components/Icon/Coffee';
import Cocktail from 'components/Icon/Cocktail';
import Pool from 'components/Icon/Pool';
import VolleyBall from 'components/Icon/VolleyBall';
import Cancel from 'components/Icon/Cancel';
import Regulations from 'components/Icon/Regulations';
import Calender from 'components/Icon/Calender';
import Logo from 'components/Icon/Logo';
import Search from 'components/Icon/Search';
import Reservation from 'components/Icon/Reservation';
import User from 'components/Icon/User';
import Paw from 'components/Icon/Paw';
import Question from 'components/Icon/Question';
import Call from 'components/Icon/Call';
import Facebook from 'components/Icon/Facebook';
import Google from 'components/Icon/Google';
import Email from 'components/Icon/Email';
import Apple from 'components/Icon/Apple';
import Briefcase from 'components/Icon/Briefcase';
import Person from 'components/Icon/Person';
import Home from 'components/Icon/Home';
import BottomTabBar from 'components/Icon/bottomTab';
import Overlay from 'components/Icon/overlay';
import Hours from 'components/Icon/Hours';
import Card from 'components/Icon/ProfileIcon/Card';
import Notification from 'components/Icon/ProfileIcon/Notification';
import Safety from 'components/Icon/ProfileIcon/Safety';
import ProfileUser from 'components/Icon/ProfileIcon/User';
import BriefcaseFill from 'components/Icon/ProfileIcon/Reservation';
import Send from 'components/Icon/Send';
import Clipboard from 'components/Icon/Clipboard';
import FacebookRound from 'components/Icon/FacebookRound';
const IconFactory = {
  BeachUmbrella,
  Location,
  Sort,
  Filter,
  Checked,
  Delete,
  Heart,
  HeartFill,
  RightArrow,
  LeftArrow,
  Share,
  Coffee,
  Cocktail,
  Pool,
  VolleyBall,
  Cancel,
  Regulations,
  Calender,
  Logo,
  Search,
  Reservation,
  User,
  Paw,
  Question,
  Call,
  Facebook,
  Google,
  Email,
  Apple,
  BottomTabBar,
  Briefcase,
  Person,
  Home,
  Overlay,
  Hours,
  Card,
  Notification,
  Safety,
  ProfileUser,
  BriefcaseFill,
  Send,
  Clipboard,
  FacebookRound,
};
const SVGIcon = ({type, ...props}) => {
  const CurrentIcon = IconFactory[type];
  if (!CurrentIcon) {
    return null;
  }
  return <CurrentIcon {...props} />;
};

export default SVGIcon;
