import React from "react";
import { View, TextInput, StyleSheet, AsyncStorage } from "react-native";
import { connect } from "react-redux"; //connect lets you connect to the store
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

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      admin: false,
      firstName: "",
      goalDailyActivity: 0,
      goalDailyCalories: 0,
      goalDailyCarbohydrates: 0,
      goalDailyFat: 0,
      goalDailyProtein: 0,
      lastName: "",
      username: "",
      err: "",
      token: ""
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
          const url = `https://mysqlcs639.cs.wisc.edu/users/${retrievedObject.username}`;
          fetch(url, {
            headers: new Headers({
              "x-access-token": retrievedObject.token
            })
          })
            .then(response => response.json())
            .then(data => {
              this.setState({
                admin: data.admin,
                firstName: data.firstName,
                lastName: data.lastName,
                goalDailyActivity: data.goalDailyActivity,
                goalDailyCalories: data.goalDailyCalories,
                goalDailyCarbohydrates: data.goalDailyCarbohydrates,
                goalDailyFat: data.goalDailyFat,
                goalDailyProtein: data.goalDailyProtein
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
          <Text style={styles.header}>My Profile</Text>
          <Container>
            <Content>
              <Form>
                <Text style={styles.header1}>My Information</Text>

                <Item floatingLabel>
                  <Label>First Name</Label>
                  <Input
                    value={this.state.firstName}
                    placeholder={this.state.firstName}
                    style={styles.field}
                    onChangeText={input => this.setState({ firstName: input })}
                  />
                </Item>
                <Item floatingLabel>
                  <Label>Last Name</Label>
                  <Input
                    value={this.state.lastName}
                    placeholder={this.state.lastName}
                    style={styles.field}
                    onChangeText={input => this.setState({ lastName: input })}
                  />
                </Item>
                <Text style={styles.header1}>My Goals</Text>
                <Item floatingLabel>
                  <Label>Activity (minutes)</Label>
                  <Input
                    value={this.state.goalDailyActivity}
                    placeholder={this.state.goalDailyActivity}
                    style={styles.field}
                    onChangeText={input =>
                      this.setState({ goalDailyActivity: input })
                    }
                  />
                </Item>
                <Item floatingLabel>
                  <Label>Calories</Label>
                  <Input
                    value={this.state.goalDailyCalories}
                    placeholder={this.state.goalDailyCalories}
                    style={styles.field}
                    onChangeText={input =>
                      this.setState({ goalDailyCalories: input })
                    }
                  />
                </Item>
                <Item floatingLabel>
                  <Label>Carbohydrates (g)</Label>
                  <Input
                    value={this.state.goalDailyCarbohydrates}
                    placeholder={this.state.goalDailyCarbohydrates}
                    style={styles.field}
                    onChangeText={input =>
                      this.setState({ goalDailyCarbohydrates: input })
                    }
                  />
                </Item>
                <Item floatingLabel>
                  <Label>Protein (g)</Label>
                  <Input
                    value={this.state.goalDailyProtein}
                    placeholder={this.state.goalDailyProtein}
                    style={styles.field}
                    onChangeText={input =>
                      this.setState({ goalDailyProtein: input })
                    }
                  />
                </Item>
                <Item floatingLabel>
                  <Label>Fat (g)</Label>
                  <Input
                    value={this.state.goalDailyFat}
                    placeholder={this.state.goalDailyFat}
                    style={styles.field}
                    onChangeText={input =>
                      this.setState({ goalDailyFat: input }, () => {
                        console.log(this.state.goalDailyFat);
                      })
                    }
                  />
                </Item>
                <Text>{this.state.err}</Text>
              </Form>
              <Button
                bordered
                rounded
                success
                style={styles.button}
                title="save"
                onPress={() => {
                  fetch(
                    `https://mysqlcs639.cs.wisc.edu/users/${this.state.username}`,
                    {
                      method: "PUT",
                      headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "x-access-token": this.state.token
                      },
                      body: JSON.stringify({
                        firstName: this.state.firstName,
                        lastName: this.state.lastName,
                        goalDailyActivity: this.state.goalDailyActivity,
                        goalDailyCalories: this.state.goalDailyCalories,
                        goalDailyCarbohydrates: this.state
                          .goalDailyCarbohydrates,
                        goalDailyFat: this.state.goalDailyFat,
                        goalDailyProtein: this.state.goalDailyProtein
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
                <Text>Save</Text>
              </Button>
              <Button
                bordered
                rounded
                info
                style={styles.button}
                title="Logout"
                onPress={() => this.props.navigation.navigate("Home")}
              >
                <Text>Logout</Text>
              </Button>
              <Button
                bordered
                rounded
                danger
                style={styles.button}
                title="Delete Account"
                onPress={() => {
                  fetch(
                    `https://mysqlcs639.cs.wisc.edu/users/${this.state.username}`,
                    {
                      method: "DELETE",
                      headers: {
                        "x-access-token": this.state.token
                      }
                    }
                  )
                    .then(response => {
                      console.log("user not deleted");
                      if (!response.ok) throw new Error(response.status);
                      return response.json();
                    })
                    .then(data => this.props.navigation.navigate("Login"));
                }}
              >
                <Text>Delete</Text>
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
    backgroundColor: "#363636"
  },
  name: {
    fontSize: 20,
    fontWeight: "bold"
  },
  
  field: {
    textAlign: "center",
    height: 44,
    //padding: 10,
    // borderWidth: 1,
    borderColor: "black",
    marginBottom: 10
  },
  header: {
    
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 2,
    fontFamily: "Courier",
    fontSize: 40
  },
  header1: {
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    letterSpacing: 2,
    fontFamily: "Courier",
    fontSize: 20,
    marginTop: 45,
    marginLeft: 55,
    height: 30,
    width: 250,
    borderColor: "darkblue",
    color: "darkblue",
    borderWidth: 1,
    borderRadius: 15
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

export default connect(mapStateToProps)(UserProfile);
