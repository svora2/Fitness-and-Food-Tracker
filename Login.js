import React from "react";
import { View, TextInput, StyleSheet, AsyncStorage } from "react-native";
import { stringify } from "qs";
import { TOKEN_FETCHED, tokenFetched } from "./actionTypes";
import { Provider, connect } from "react-redux"; //connect lets you connect to the store
import base64 from "base-64";
import { Container, Header, Content, Button, Text,Label, Form,
  Item,
  Input } from "native-base";
import { ScrollView } from "react-native-gesture-handler";
  

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      err: ""
    };
  }

  setLoginInfo() {
    this.setState({ err: "" });
    fetch("https://mysqlcs639.cs.wisc.edu/login", {
      method: "GET",
      headers: new Headers({
        Authorization: `Basic ${base64.encode(
          `${this.state.username}:${this.state.password}`
        )}`
      })
    })
      .then(response => {
        if (!response.ok) {
          this.setState({ err: "Username/Password Incorrect" });
          throw new Error(response.status);
        }
        return response.json();
      })
      .then(json => {
        let userInformation = {
          username: this.state.username,
          token: json.token
        };
        AsyncStorage.setItem(
          "userInformation",
          JSON.stringify(userInformation)
        ).then(() => {
          if (json.token) {
            this.props.navigation.navigate("CurrentDay");
          }
        });
      })
      .catch(err => {
        this.setState({ err: "Username/Password Incorrect" });
      });
  }

  render() {
    return (
      <View style={StyleSheet.container}>
        <ScrollView>
        <Text style={styles.header}>Fitness Tracker</Text>
        <Container>
          <Content>
            <Form>
              <Item floatingLabel>
                <Label>username</Label>
                <Input
                  value={this.state.username}
                  onChangeText={usernameEntered =>
                    this.setState({ username: usernameEntered })
                  }
                  placeholder={"username"}
                />
              </Item>
              <Item floatingLabel>
                <Label>password</Label>
                <Input
                  value={this.state.password}
                  onChangeText={passwordEntered => {
                    this.setState({ password: passwordEntered });
                  }}
                  placeholder={"password"}
                  secureTextEntry={true}
                />
              </Item>
            </Form>
            <Text>{this.state.err}</Text>
            <Button
              bordered
              rounded
              info
              style={styles.button}
              title="Enter"
              variant="default"
              onPress={() => this.setLoginInfo()}
            >
              <Text>Enter</Text>
            </Button>
          </Content>
        </Container>
        </ScrollView>
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
  loginField: {
    textAlign: "center",
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: "black",
    marginBottom: 10,
    fontFamily: "Courier"
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
    color: "black",
    marginTop: 30,
    width: 165,
    justifyContent: "center",
    alignItems: "center", //use flex-start, flex-end ,center to adjust horizontal position
    textAlign: "center",
    marginLeft: 95
  }
});

const mapStateToProps = store => {
  return {
    username: store.username,
    token: store.token
  };
};

export default connect(mapStateToProps)(Login);
