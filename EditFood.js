import React from "react";
import { View, TextInput, StyleSheet, AsyncStorage } from "react-native";
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

class EditFood extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      token: "",
      err: "",
      foodName: "",
      date: "",
      protein: 0,
      carb: 0,
      fat: 0,
      calories: 0
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
          const url = `https://mysqlcs639.cs.wisc.edu/meals/${JSON.stringify(
            navigation.getParam("id", "no-id")
          )}/foods/${JSON.stringify(
            navigation.getParam("foodId", "no-foodId")
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
                date: data.date,
                protein: data.protein,
                carb: data.carbohydrates,
                fat: data.fat,
                calories: data.calories
              });
            })
            .catch(err => {
              err.json().then(e => {
                this.setState({ err: e.message });
              });
            });
        }
      }
    });
  }

  render() {
    return (
      <View>
        <ScrollView>
        <Text style={styles.header}>Edit Food</Text>

          <Content>
            <Form>
              <Item floatingLabel>
                <Label>Food Name</Label>
                <Input
                  placeholder={this.state.foodName}
                  onChangeText={input => this.setState({ foodName: input })}
                />
              </Item>
              <Item floatingLabel last>
                <Label>Calories</Label>
                <Input
                keyboardType={'numeric'}
                  placeholder={this.state.calories}
                  onChangeText={input => this.setState({ calories: input })}
                />
              </Item>
              <Item floatingLabel>
                <Label>Carbohydrates</Label>
                <Input
                  keyboardType={'numeric'}
                  placeholder={this.state.carb}
                  onChangeText={input => this.setState({ carb: input })}
                />
              </Item>
              <Item floatingLabel>
                <Label>Protein</Label>
                <Input
                keyboardType={'numeric'}
                  placeholder={this.state.protein}
                  onChangeText={input => this.setState({ protein: input })}
                />
              </Item>
              <Item floatingLabel last>
                <Label>Fat</Label>
                <Input
                keyboardType={'numeric'}
                  placeholder={this.state.fat}
                  onChangeText={input => this.setState({ fat: input })}
                />
              </Item>
            </Form>
            <Button
            rounded
            bordered
            success
            style={styles.button}
            title="Save to meal"
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
                    )}/foods/${JSON.stringify(
                      navigation.getParam("foodId", "no-foodId")
                    )}`;
                    fetch(url, {
                      method: "PUT",
                      headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "x-access-token": retrievedObject.token
                      },
                      body: JSON.stringify({
                        id: this.state.id,
                        name: this.state.name,
                        protein: this.state.protein,
                        carbohydrates: this.state.carb,
                        fat: this.state.fat,
                        calories: this.state.calories
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
          <Button
            rounded
            bordered
            danger
            style={styles.button}
            title="Delete "
            onPress={() => {
              const { navigation } = this.props;
              const url = `https://mysqlcs639.cs.wisc.edu/meals/${JSON.stringify(
                navigation.getParam("id", "no-id")
              )}/foods/${JSON.stringify(
                navigation.getParam("foodId", "no-foodId")
              )}`;

              fetch(url, {
                method: "DELETE",
                headers: {
                  "x-access-token": this.state.token
                }
              })
                .then(response => {
                  console.log("food not deleted");
                  if (!response.ok) throw new Error(response.status);
                  return response.json();
                })
                .then(data => this.props.navigation.navigate("EditMeal"));
            }}
          ><Text>Delete</Text></Button>
          </Content>
       
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
  },
  cards: {
    alignItems: "center",
    marginHorizontal: 15,
    fontFamily: "Courier"
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    paddingTop: 30,
    fontFamily: "Courier"
  }
});

export default EditFood;
