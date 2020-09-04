import React from "react";
import { Alert, TextInput, View, StyleSheet, AsyncStorage } from "react-native";
import { Container, Header, Content, Button, Text, Label, Form,
  Item,
  Input } from "native-base";

// import DateTimePicker from '@react-native-community/datetimepicker';
import { Provider, connect } from "react-redux"; //connect lets you connect to the store
import { ScrollView } from "react-native-gesture-handler";

class Activities extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      err: "",
      id: 0,
      name: "",
      duration: 0.0,
      date: "",
      calories: 0.0
    };
  }

  render() {
    return (
      <View style={StyleSheet.container}>
        <ScrollView>
          <Text style={styles.header}>New Activity</Text>
          <Container>
            <Content>
            <Button rounded
            info
            bordered
            style={styles.button}
                    title="today"
                    onPress={() => this.setState({ date: new Date().toString() })}
                  ><Text>today</Text></Button>
              <Form>
                <Item floatingLabel>
                  <Label>Date</Label>
                 

                  <Input
                    value={this.state.date}
                    onChangeText={input => this.setState({ date: input })}
                  />
                </Item>
                <Item floatingLabel>
                  <Label>Activity ID</Label>

                  <Input
                  keyboardType={"numeric"}
                    value={this.state.id}
                    onChangeText={input => this.setState({ id: input })}
                  />
                </Item>
                <Item floatingLabel>
                  <Label>Name</Label>

                  <Input
                    value={this.state.name}
                    onChangeText={input => this.setState({ name: input })}
                  />
                </Item>
                <Item floatingLabel>
                <Label>Duration</Label>
        <Input
        keyboardType={"numeric"}
          value={this.state.duration}
          onChangeText={input => this.setState({ duration: input })}
        />
                </Item>
                <Item floatingLabel>
                <Label>Calories</Label>
        <Input
        keyboardType={"numeric"}
          value={this.state.calories}
          onChangeText={input => this.setState({ calories: input })}
        />
                </Item>
              </Form>


        <Button rounded info bordered
          style={styles.button}

          title="add"
          onPress={() => {
            AsyncStorage.getItem("userInformation").then(retrievedObject => {
              if (retrievedObject) {
                retrievedObject = JSON.parse(retrievedObject);
                if (retrievedObject.token) {
                  this.setState({
                    username: retrievedObject.username,
                    token: retrievedObject.token
                  });
                  const url = `https://mysqlcs639.cs.wisc.edu/users/${retrievedObject.username}`;
                  fetch(`https://mysqlcs639.cs.wisc.edu/activities/`, {
                    method: "POST",
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json",
                      "x-access-token": retrievedObject.token
                    },
                    body: JSON.stringify({
                      id: this.state.id,
                      name: this.state.name,
                      duration: this.state.duration,
                      date: this.state.date,
                      calories: this.state.calories
                    })
                  })
                    .then(response => {
                      if (!response.ok) throw new Error(response.status);
                      return response.json();
                    })
                    .then(data => {
                      this.setState({ err: "Changes Saved!" });
                      this.props.navigation.navigate("CurrentDay");
                    })
                    .catch(error => {
                      console.log(error);
                    });
                }
              }
            });
          }}
        ><Text>add</Text></Button>
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
    backgroundColor: "#ecf0f1",
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
  button: {
    color:"black",
    marginTop: 30,
    width: 165,
    justifyContent: "center", 
    alignItems: "center", //use flex-start, flex-end ,center to adjust horizontal position
    textAlign: "center",
    marginLeft: 95,
    fontFamily: "Courier"
  },
  header: {
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 2,
    fontFamily: "Courier",
    fontSize: 40,
    marginTop: 55

  }
});

export default connect()(Activities);
