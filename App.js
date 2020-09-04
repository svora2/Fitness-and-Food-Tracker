import React from "react";
import { Alert, TextInput, View, StyleSheet, Button, AsyncStorage } from "react-native";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Provider, connect } from "react-redux"; //connect lets you connect to the store
import { createStore } from "redux";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createAppContainer, createSwitchNavigator } from "react-navigation";

import reducer from "./reducer";
import Home from "./Home";
import Login from "./Login";
import UserProfile from "./UserProfile";
import Signup from "./Signup";
import CurrentDay from "./CurrentDay";
import Activities from "./Activities";
import EditActivity from "./EditActivity";
import AddMeal from "./AddMeal";
import EditMeal from "./EditMeal";
import AddFood from "./AddFood";
import EditFood from "./EditFood";
import History from "./History";

// const Main = createBottonTabNavigation({
//   Home: Home,
//   UserProfile: UserProfile,
//   AddMeal: AddMeal,
//   AddFood: AddFood
// })
let store = createStore(reducer);
let RootStack = createStackNavigator({
  Home: Home,
  Login: Login,
  Signup: Signup,
  UserProfile: UserProfile,
  CurrentDay: CurrentDay,
  Activities: Activities,
  EditActivity: EditActivity,
  AddMeal: AddMeal,
  EditMeal: EditMeal,
  AddFood: AddFood,
  EditFood: EditFood
},
{
  initialRouteName: 'Home',
},
);


const Landing = createStackNavigator({
  
  CurrentDay: CurrentDay,
  Activities: Activities,
  EditActivity: EditActivity,
  AddMeal: AddMeal,
  EditMeal: EditMeal,
  AddFood: AddFood,
  EditFood: EditFood
},
{
  initialRouteName:"CurrentDay"
});
const Auth = createStackNavigator({
  Home:Home,
  Login:Login,
  Signup:Signup
},
{
  initialRouteName:"Home"
});


const Profile = createStackNavigator({
  UserProfile: UserProfile,
  Logout:Home
},
{
  initialRouteKey:"UserProfile"
})

const Main = createBottomTabNavigator({
  "My Profile": Profile,
  Today: Landing,
  "+ Activity": Activities,
  "+ Meal": AddMeal,
  History: History,
},
{
  initialRouteName:"Today",
  activeColor: '#f0edf6',
    inactiveColor: '#3e2465',
    barStyle: { backgroundColor: '#694fad' },
})

const MainApp = createSwitchNavigator({
  Auth:Auth,
  Main:Main
},
{
initialRouteName: "Auth"
})

const Navigation = createAppContainer(MainApp);
// const Main = createBottomTabNavigator({
//   Profile: UserProfile,
//   AddMeal: AddMeal,
//   AddActivity: Activities,
//   Logout: Home
// });

// const AllNavigator = createrSwitchNavigator(
//   {
//     Auth: RootStack,
//     Main:Main
//   },
//   {
//     initialRouteName: "Main"
//   }
// )

// let Navigation = createAppContainer(RootStack);
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
      AsyncStorage.getItem("userInformation").then((retrievedObject) => {
      if (retrievedObject) {
        retrievedObject = JSON.parse(retrievedObject);
        if (retrievedObject.token) {
          window.path = "/users";
        }
      }
    });
  }

  render() {
    return (
      <Provider store={store}>
        <Navigation />
      </Provider>
    );
  }
}

export default App;
