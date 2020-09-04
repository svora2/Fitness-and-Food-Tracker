import React from "react";
import { Alert, TextInput, View, StyleSheet, AsyncStorage } from "react-native";
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
import { connect } from "react-redux"; //connect lets you connect to the store
import { ScrollView } from "react-native-gesture-handler";

class EditActivity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      admin: false,
      username: "",
      err: "",
      token: "",
      id: 0,
      name: "",
      duration: 0.0, // Minutes
      date: "",
      calories: 0.0
    };
  }
  componentDidMount() {
    this.setState({ err: "" });
    AsyncStorage.getItem("userInformation").then(retrievedObject => {
      if (retrievedObject) {
        retrievedObject = JSON.parse(retrievedObject);
        if (retrievedObject.token) {
          this.setState({
            username: retrievedObject.username,
            token: retrievedObject.token
          });
          const { navigation } = this.props;
          const url = `https://mysqlcs639.cs.wisc.edu/activities/${JSON.stringify(
            navigation.getParam("id", "no-id")
          )}`;
          fetch(url, {
            headers: new Headers({
              "x-access-token": retrievedObject.token
            })
          })
            .then(response => response.json())
            .then(data => {
              console.log(data);
              this.setState({
                id: data.id,
                name: data.name,
                duration: data.duration,
                date: data.date,
                calories: data.calories
              });
            })
            .catch(err => {
              err.json().then(e => {
                this.setState({ err: e.message });
              });
            });
        } else {
          window.location = "/";
        }
      } else {
        window.location = "/";
      }
    });
  }

  render() {
    return (
      <View style={StyleSheet.container}>
        <ScrollView>
          <Text style={styles.header}>Edit Activity</Text>
          <Container>
            <Content>
              <Form>
                <Item floatingLabel>
                  <Label>Date</Label>
                  <Button
                    title="today"
                    onPress={() => this.setState({ date: new Date() })}
                  ></Button>
                  <Input
                    value={this.state.date}
                    placeholder={this.state.date}
                    onChangeText={input => this.setState({ date: input })}
                  />
                </Item>
                <Item floatingLabel>
                  <Label>Name</Label>
                  <Input
                    value={this.state.name}
                    placeholder={this.state.name}
                    onChangeText={input => this.setState({ name: input })}
                  />
                </Item>
                <Item floatingLabel>
                  <Label>Duration</Label>
                  <Input
                    keyboardType={"numeric"}
                    value={this.state.duration}
                    placeholder={this.state.duration}
                    onChangeText={input => this.setState({ duration: input })}
                  />
                </Item>
                <Item floatingLabel>
                  <Label>Calories</Label>
                  <Input
                    keyboardType={"numeric"}
                    value={this.state.calories}
                    placeholder={this.state.calories}
                    onChangeText={input => this.setState({ calories: input })}
                  />
                </Item>
              </Form>
              <Text>{this.state.err}</Text>
              <Button
                rounded
                success
                bordered
                style={styles.button}
                title="Save Changes"
                onPress={() => {
                  const { navigation } = this.props;

                  fetch(
                    `https://mysqlcs639.cs.wisc.edu/activities/${JSON.stringify(
                      navigation.getParam("id", "no-id")
                    )}`,
                    {
                      method: "PUT",
                      headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "x-access-token": this.state.token
                      },
                      body: JSON.stringify({
                        id: this.state.id,
                        name: this.state.name,
                        duration: this.state.duration,
                        date: this.state.date,
                        calories: this.state.calories
                      })
                    }
                  )
                    .then(response => {
                      if (!response.ok) throw new Error(response.status);
                      return response.json();
                    })
                    .then(data => {
                      this.setState({ err: "Changes Saved!" });
                      this.props.navigation.navigate("CurrentDay");
                    });
                }}
              >
                <Text>save</Text>
              </Button>
              <Button
                rounded
                danger
                bordered
                style={styles.button}
                title="Delete Activity"
                onPress={() => {
                  const { navigation } = this.props;

                  fetch(
                    `https://mysqlcs639.cs.wisc.edu/activities/${JSON.stringify(
                      navigation.getParam("id", "no-id")
                    )}`,
                    {
                      method: "DELETE",
                      headers: {
                        "x-access-token": this.state.token
                      }
                    }
                  )
                    .then(response => {
                      console.log("activity not deleted");
                      if (!response.ok) throw new Error(response.status);
                      return response.json();
                    })
                    .then(data => this.props.navigation.navigate("CurrentDay"));
                }}
              >
                <Text>delete</Text>
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
    backgroundColor: "#ecf0f1"
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Courier"
  },
  field: {
    textAlign: "center",
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: "black",
    marginBottom: 10,
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
    marginLeft: 95,
    fontFamily: "Courier"
  }
});

const mapStateToProps = store => {
  return {
    username: store.username,
    token: store.token
  };
};

export default connect(mapStateToProps)(EditActivity);
