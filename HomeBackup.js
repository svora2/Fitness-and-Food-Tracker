import React from "react";
import { View, TextInput, StyleSheet, Text, AsyncStorage, TouchableOpacity } from "react-native";
import base64 from "base-64";
import { Button } from "native-base";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      err: ""
    };
  }
  render() {
    return (
      <View style={StyleSheet.container}>
        <Text style={styles.header}>Fitness Tracker</Text>
      
        <Text>{this.state.err}</Text>
        <TouchableOpacity bordered info
          style={styles.button}
          title="Login"
          variant="default"
          onPress={() => this.props.navigation.navigate("Login")}
        ><Text>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          title="Signup"
          variant="default"
          style={styles.button}
          onPress={() => this.props.navigation.navigate("Signup")}
        >
        <Text>Signup</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    display: "flex",
    justifyContent: "center", //use flex-start, flex-end ,center to adjust vertical position
    alignItems: "center", //use flex-start, flex-end ,center to adjust horizontal position
    backgroundColor: "#83bec4",
    textAlign: "center"
  },
 
  title: {
    textAlign: "center",
    marginVertical: 8,
    width: 200,
    height: 44
  },
  header: {
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 2,
    fontFamily: "Courier",
    fontSize: 40

  },
  button:{
      
  }
//   button: {
//     justifyContent: "center", //use flex-start, flex-end ,center to adjust vertical position
//      backgroundColor: "#65cfb1",
//     color:"white",
//     marginTop: 20,
//     fontFamily: "Courier",
//     fontColor:"white",
//     fontSize: 24,
//     letterSpacing: 2,
//     borderRadius: 8,
//     borderColor: "black",
//     height: 40,
//     width: 150,
//     alignItems: "center",
//  	display: "flex",
//     fontSize: 22,
//     marginLeft: 110,
// 	textAlign: "center",

//   }
});
export default (Home);
