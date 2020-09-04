import React from "react";
import { Alert, TextInput, View, StyleSheet, AsyncStorage } from "react-native";
import {
  Container,
  Header,
  Content,
  Button,
  Text,
  Input,
  Label,
  Form,
  Item,
  Card,
  CardItem,
  Body
} from "native-base";

// import DateTimePicker from '@react-native-community/datetimepicker';
import { Provider, connect } from "react-redux"; //connect lets you connect to the store
import { ScrollView } from "react-native-gesture-handler";

// delete foods after deleting meals?

class EditMeal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      token: "",
      err: "",
      id: 0,
      name: "",
      date: "",
      mealFoods: []
    };
    this.getMealFoods = this.getMealFoods.bind(this);
    this.getTotalCaloriesConsumed = this.getTotalCaloriesConsumed.bind(this);
    this.getTotalProtein = this.getTotalProtein.bind(this);
    this.getTotalCarbs = this.getTotalCarbs.bind(this);
    this.getTotalFat = this.getTotalFat.bind(this);
  }

  componentDidMount() {
    this.setState({ err: "" });
    this.props.navigation.addListener("didFocus", payload => {
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
            )}`;
            fetch(url, {
              headers: new Headers({
                "x-access-token": retrievedObject.token
              })
            })
              .then(response => response.json())
              .then(data => {
                {
                  this.setState({
                    id: data.id,
                    name: data.name,
                    date: data.date
                  });
                }
                this.getMealFoods();
              })
              .catch(err => {
                err.json().then(e => {
                  this.setState({ err: e.message });
                });
              });
          }
        }
      });
    });
  }

  getTotalCaloriesConsumed() {
    let calories = 0;
    for (let k = 0; k < this.state.mealFoods.length; k++) {
      calories += this.state.mealFoods[k].calories;
    }
    return calories;
  }
  getTotalProtein() {
    let protein = 0;
    for (let k = 0; k < this.state.mealFoods.length; k++) {
      protein += this.state.mealFoods[k].protein;
    }
    return protein;
  }
  getTotalFat() {
    let fat = 0;
    for (let k = 0; k < this.state.mealFoods.length; k++) {
      fat += this.state.mealFoods[k].fat;
    }
    return fat;
  }
  getTotalCarbs() {
    let carbs = 0;
    for (let k = 0; k < this.state.mealFoods.length; k++) {
      carbs += this.state.mealFoods[k].carbohydrates;
    }
    return carbs;
  }

  getMealFoods() {
    fetch(`https://mysqlcs639.cs.wisc.edu/meals/${this.state.id}/foods/`, {
      method: "GET",
      headers: new Headers({
        "x-access-token": this.state.token
      })
    })
      .then(response => {
        if (!response.ok) {
          // console.log(response);
          //  this.setState({ err: "Username/Password Incorrect" });
          throw new Error(response.status);
        } else {
          return response.json();
        }
      })
      .then(foodArray => {
        this.setState({ mealFoods: foodArray.foods });
      });
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={StyleSheet.container}>
        <ScrollView>
          <Text style={styles.header}>Edit Meal</Text>
          <Container>
            <Content>
              <Form>
                <Item floatingLabel>
                  <Label>Name </Label>
                  <Input
                    value={this.state.name}
                    onChangeText={input => this.setState({ name: input })}
                  />
                </Item>
                <Item floatingLabel>
                  <Label>Date</Label>
                  <Input
                    value={this.state.date}
                    onChangeText={input => this.setState({ date: input })}
                  />
                </Item>
              </Form>
              <Button
                rounded
                bordered
                success
                style={styles.button}
                title="Save"
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
                          const { navigation } = this.props;
                          const url = `https://mysqlcs639.cs.wisc.edu/meals/${JSON.stringify(
                            navigation.getParam("id", "no-id")
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
                              date: this.state.date
                            })
                          })
                            .then(response => {
                              if (!response.ok)
                                throw new Error(response.status);
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
                    }
                  );
                }}
              >
                <Text>Save</Text>
              </Button>
              <Button
                rounded
                bordered
                danger
                title="Delete Meal"
                style={styles.button}
                onPress={() => {
                  const { navigation } = this.props;
                  fetch(
                    `https://mysqlcs639.cs.wisc.edu/meals/${JSON.stringify(
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
                      console.log("meal not deleted");
                      if (!response.ok) throw new Error(response.status);
                      return response.json();
                    })
                    .then(data => this.props.navigation.navigate("CurrentDay"));
                }}
              >
                <Text>Delete Meal</Text>
              </Button>
              <Card>
                <CardItem header bordered>
                  <Text style={styles.mealSumCardHeader}>Meal Summary</Text>
                </CardItem>
                <CardItem bordered>
                  <Body>
                  <Text></Text>
                    <Text style={styles.mealSummaryNumbers}>
                      calories: {this.getTotalCaloriesConsumed()}{" "}
                    </Text>
                    <Text></Text>
                    <Text style={styles.mealSummaryNumbers}>
                      carbohydrates: {this.getTotalCarbs()}{" "}
                    </Text>
                    <Text></Text>
                    <Text style={styles.mealSummaryNumbers}>
                      fat: {this.getTotalFat()}{" "}
                    </Text>
                    <Text></Text>
                    <Text style={styles.mealSummaryNumbers}>
                      protein: {this.getTotalProtein()}{" "}
                    </Text>
                    <Text></Text>
                  </Body>
                </CardItem>
                <CardItem>
                <Button
                rounded
                warning
                bordered
                title="addFood"
                style={styles.buttonAddFood}
                onPress={() =>
                  this.props.navigation.navigate("AddFood", {
                    id: this.state.id
                  })
                }
              >
                <Text>Add Food</Text>
              </Button>
                </CardItem>
              </Card>
             

              {this.state.mealFoods.map(details => {
                return (
                  <View>
                    <FoodCard
                      key={details.id}
                      food={details}
                      mealId={this.state.id}
                      navigation={navigation}
                    />
                  </View>
                );
              })}

              {/* {console.log(this.state.mealFoods)} */}
            </Content>
          </Container>
        </ScrollView>
      </View>
    );
  }
}

const FoodCard = props => {
  return (
    // <Container>
    <Content>
      <Card>
        <CardItem header bordered>
          <Text style={style=styles.foodCardHeader}>{props.food.name}</Text>
        </CardItem>
        <CardItem bordered>
          <Body>
          <Text></Text>
            <Text style={styles.mealSummaryNumbers}>Calories: {props.food.calories} g</Text>
            <Text></Text>
            <Text style={styles.mealSummaryNumbers}>Carbohydrates: {props.food.carbohydrates} g</Text>
            <Text></Text>
            <Text style={styles.mealSummaryNumbers}>Fat: {props.food.fat} g</Text>
            <Text></Text>
            <Text style={styles.mealSummaryNumbers}>Protein: {props.food.protein} g</Text>
            <Text></Text>
          </Body>
          </CardItem>
          <CardItem
            footer
            button
            rounded
            style={styles.editactbutton}
            onPress={() =>
              props.navigation.navigate("EditFood", {
                id: props.mealId,
                foodId: props.food.id
              })
            }
          >
            <Text style={styles.editButtonText}>edit food</Text>
          </CardItem>
        <CardItem></CardItem>
      </Card>
    </Content>
    // </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ecf0f1"
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
    color: "black",
    marginTop: 30,
    width: 165,
    justifyContent: "center",
    alignItems: "center", //use flex-start, flex-end ,center to adjust horizontal position
    textAlign: "center",
    marginLeft: 95,
    fontFamily: "Courier",
    marginTop: 30
  },
  buttonAddFood: {
    color: "black",
    marginTop: 10,
    width: 165,
    justifyContent: "center",
    alignItems: "center", //use flex-start, flex-end ,center to adjust horizontal position
    textAlign: "center",
    marginLeft: 90,
    fontFamily: "Courier",
    marginTop: 30
  },
  header: {
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 2,
    fontFamily: "Courier",
    fontSize: 40
  },
  mealSummaryNumbers:{
    color: "darkblue",
    fontFamily: "Courier",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    fontWeight: "bold",
    textAlign: "center",
    marginLeft: 80
  },
  mealSumCardHeader:{
    fontFamily: "Courier",
    color: "darkblue",
    fontSize: 20,
    fontWeight: "bold"
  },
  foodCardHeader:{
      fontFamily: "Courier",
      color: "darkblue",
      fontSize: 16,
      fontWeight: "bold"
    },
    editactbutton: {
      color: "#F26B38",
      borderColor: "#F26B38",
      borderWidth: 2,
      fontFamily: "Courier",
      justifyContent: "center",
      alignItems: "center",
      fontWeight: "bold",
      textAlign: "center",
      width: 165,
      marginLeft: 90

    },
    editButtonText: {
      fontFamily: "Courier",
      color: "#F26B38"
    },
});

export default connect()(EditMeal);
