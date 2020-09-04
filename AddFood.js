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
  Text
} from "native-base";
import { ScrollView } from "react-native-gesture-handler";

class AddFood extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      token: "",
      mealName: "",
      mealId: 0,
      foodId: 0,
      foodName: "",
      calories: 0,
      protein: 0,
      carb: 0,
      fat: 0
    };
  }

  render() {
    return (
      //   <ScrollView>
      <View>
        <ScrollView>
        <Text style={styles.header}>New Food</Text>

        <Container>
          <Content>
            <Form>
              <Item floatingLabel>
                <Label>Food Name</Label>
                <Input
                  onChangeText={input => this.setState({ foodName: input })}
                />
              </Item>
              <Item floatingLabel last>
                <Label>Calories</Label>
                <Input
                  keyboardType={'numeric'}
                  onChangeText={input => this.setState({ calories: input })}
                />
              </Item>
              <Item floatingLabel>
                <Label>Protein</Label>
                <Input
                  keyboardType={'numeric'}
                  onChangeText={input => this.setState({ protein: input })}
                />
              </Item>
              <Item floatingLabel>
                <Label>Carbohydrates</Label>
                <Input 
                  keyboardType={'numeric'}
                  onChangeText={input => this.setState({ carb: input })} />
              </Item>
              <Item floatingLabel>
                <Label>Fat</Label>
                <Input
                  keyboardType={'numeric'}
                  onChangeText={input => this.setState({ fat: input })} />
              </Item>
             
            </Form>
            <Button
           rounded
           bordered
           success
           style={styles.button}
            title="Add"
            onPress={() => {
              AsyncStorage.getItem("userInformation").then(retrievedObject => {
                if (retrievedObject) {
                  retrievedObject = JSON.parse(retrievedObject);
                  if (retrievedObject.token) {
                    this.setState({
                      username: retrievedObject.username,
                      token: retrievedObject.token
                    });
                    const { navigation } = this.props;
                    const url = `https://mysqlcs639.cs.wisc.edu/meals/${JSON.stringify(
                      navigation.getParam("id", "no-id")
                    )}/foods/`;
                    fetch(url, {
                      method: "POST",
                      headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "x-access-token": retrievedObject.token
                      },
                      body: JSON.stringify({
                        id: this.state.id,
                        name: this.state.foodName,
                        calories: this.state.calories,
                        protein: this.state.protein,
                        carbohydrates: this.state.carb,
                        fat: this.state.fat
                      })
                    })
                      .then(response => {
                        if (!response.ok) throw new Error(response.status);
                        return response.json();
                      })
                      .then(data => {
                        this.setState({ err: "Food Saved!" });
                        this.props.navigation.navigate("EditMeal");
                      })
                      .catch(error => {
                        console.log(error);
                      });
                  }
                }
              });
            }}
          ><Text>Save to Meal</Text></Button>
          </Content>
          
        </Container>
        </ScrollView>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0
    // width: 100%,
    // height: 2.5 ,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#363636"
  },
  scroll: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 45,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 2,
    fontFamily: "Courier",
    fontSize: 40,
    color: "black"
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

export default AddFood;


