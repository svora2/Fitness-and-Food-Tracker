import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  AsyncStorage,
  TouchableOpacity
} from "react-native";
import base64 from "base-64";
import { Container, Header, Content, Button, Text } from 'native-base';

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
        <Button rounded info
          bordered
          
          style={styles.button}
          title="Login"
          variant="default"
          onPress={() => this.props.navigation.navigate("Login")}
        ><Text>Login</Text>
        </Button>
        <Button bordered rounded info
          title="Signup"
          variant="default"
          style={styles.button}
          onPress={() => this.props.navigation.navigate("Signup")}
        ><Text>Signup</Text>
        </Button>
        
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
    backgroundColor: "#363636",
    textAlign: "center",
    
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
  button: {
    color:"black",
    marginTop: 30,
    width: 165,
    justifyContent: "center", 
    alignItems: "center", //use flex-start, flex-end ,center to adjust horizontal position
    textAlign: "center",
    marginLeft: 95
  }
});
export default Home;
