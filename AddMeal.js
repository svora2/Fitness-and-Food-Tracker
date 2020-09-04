import React from "react";
import { View, TextInput, StyleSheet, AsyncStorage } from "react-native";
import { connect } from "react-redux"; //connect lets you connect to the store
import {
  Container,
  Header,
  Content,
  Form,
  Item,
  Input,
  Label,
  Button,
  Text,
  DatePicker
} from "native-base";
import { ScrollView } from "react-native-gesture-handler";

class AddMeal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      token: "",
      mealName: "",
      date: ""
    };
    this.setDate = this.setDate.bind(this);
  }
  setDate(newDate) {
    this.setState({ date: newDate });
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.header}>New Meal</Text>
          <Container>
            <Content>
            <Button
                  rounded
                  info
                  bordered
                  style={styles.today}
                  title="today"
                  onPress={() => this.setState({ date: new Date().toString() })}
                >
                  <Text>today</Text>
                </Button>
              <Form>
                <Item floatingLabel>
                  <Label>Date and Time</Label>
                  <Input
                    value={this.state.date}
                    onChangeText={input => this.setState({ date: input })}
                  />
                </Item>
                <Item floatingLabel>
                  <Label>Meal Name</Label>
                  <Input
                  
                    onChangeText={input => this.setState({ mealName: input })}
                  />
                </Item>

              </Form>
              <Button
                rounded
                bordered
                info
                title="Add"
                style={styles.button}
                onPress={() => {
                  AsyncStorage.getItem("userInformation").then(
                    retrievedObject => {
                      if (retrievedObject) {
                        retrievedObject = JSON.parse(retrievedObject);
                        if (retrievedObject.token) {
                          this.setState({
                            username: retrievedObject.username,
                            token: retrievedObject.token
                          });
                          const url = `https://mysqlcs639.cs.wisc.edu/meals/`;
                          fetch(url, {
                            method: "POST",
                            headers: {
                              Accept: "application/json",
                              "Content-Type": "application/json",
                              "x-access-token": retrievedObject.token
                            },
                            body: JSON.stringify({
                              id: this.state.id,
                              name: this.state.mealName,
                              date: this.state.date
                            })
                          })
                            .then(response => {
                              if (!response.ok)
                                throw new Error(response.status);
                              return response.json();
                            })
                            .then(data => {
                              this.setState({ err: "Meal Saved!" });
                              this.props.navigation.navigate("CurrentDay");
                            })
                            .catch(error => {
                              console.log(error);
                            });
                        }
                      }
                    }
                  );
                }}
              >
                <Text>Add</Text>
              </Button>
            </Content>
          </Container>
        </ScrollView>
      </View>
    );
  }
}

export default AddMeal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // display: "flex"

    //backgroundColor: "#363636"
  },
  name: {
    fontSize: 20,
    fontWeight: "bold"
  },
  header: {
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 2,
    fontFamily: "Courier",
    fontSize: 40,
    marginTop: 55
  },
  button: {
    color: "black",
    marginTop: 30,
    width: 165,
    justifyContent: "center",
    alignItems: "center", //use flex-start, flex-end ,center to adjust horizontal position
    textAlign: "center",
    marginLeft: 30
  },
  today:{
    marginTop: 30,
    height: 40,
    width: 100,
    justifyContent: "center",
    alignItems: "center", //use flex-start, flex-end ,center to adjust horizontal position
    textAlign: "center",
    marginLeft: 45,
    marginBottom:0
  }
});
