import React from "react";
import { View, TextInput, StyleSheet, AsyncStorage } from "react-native";
import { connect } from "react-redux"; //connect lets you connect to the store
import base64 from "base-64";
import {
  Container,
  Header,
  Content,
  Button,
  Text,
  Label,
  Form,
  Item,
  Input
} from "native-base";
import { ScrollView } from "react-native-gesture-handler";

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      err: ""
    };
  }

  createUser() {
    this.setState({ err: "" });
    fetch("https://mysqlcs639.cs.wisc.edu/users", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
        firstName: this.state.firstName,
        lastName: this.state.lastName
      })
    })
      .then(response => {
        if (!response.ok) throw response;
        return response.json();
      })
      .then(data => {
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
            //this.props.dispatch(tokenFetched(userInformation));
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
      })
      .catch(err => {
        err.json().then(e => {
          this.setState({ err: e.message });
        });
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
                <Form>
                <Item floatingLabel>
                    <Label>First Name</Label>
                    <Input
                      value={this.state.firstName}
                      placeholder={this.state.firstName}
                      onChangeText={input =>
                        this.setState({ firstName: input })
                      }
                    />
                  </Item>
                  <Item floatingLabel>
                    <Label>Last Name</Label>
                    <Input
                      value={this.state.lastName}
                      placeholder={this.state.lastName}
                      onChangeText={input => this.setState({ lastName: input })}
                    />
                  </Item>
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
              </Form>
              <Text>{this.state.err}</Text>
              <Button
                rounded
                bordered
                info
                style={styles.button}

                title="Signup"
                variant="default"
                // style={styles.title}
                onPress={() => this.createUser()}
              >
                <Text>Signup</Text>
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
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "green"
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
    height: 44,
    fontFamily: "Courier"
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

export default connect()(Signup);
