import React from "react";
import {
  Alert,
  TextInput,
  View,
  StyleSheet,
  ScrollView,
  AsyncStorage
} from "react-native";
// import { Card } from 'react-native-paper';
import { Provider, connect } from "react-redux"; //connect lets you connect to the store
import {
  Container,
  Header,
  Content,
  Button,
  Card,
  CardItem,
  Text,
  Body
} from "native-base";
import { array } from "prop-types";
// import ActivityCard from "./AcivityCard"

class CurrentDay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      err: "",
      goalDailyActivity: 0,
      goalDailyCalories: 0,
      goalDailyCarbohydrates: 0,
      goalDailyFat: 0,
      goalDailyProtein: 0,
      totalFat: 0,
      id: 0,
      name: "",
      duration: 0.0,
      date: "",
      calories: 0.0,
      token: "",
      activities: [],
      meals: [],
      mealFoods: [],
      currMealMacros: []
    };
    this.getTotalCalories = this.getTotalCalories.bind(this);
    this.getTotalExcerciseTime = this.getTotalExcerciseTime.bind(this);
    this.getTotalProtein = this.getTotalProtein.bind(this);
    this.getTotalCarbs = this.getTotalCarbs.bind(this);
    this.getTotalFat = this.getTotalFat.bind(this);
    this.getActivities = this.getActivities.bind(this);
    this.getMeals = this.getMeals.bind(this);
    this.getMealFoods = this.getMealFoods.bind(this);
    this.getTotalCaloriesConsumed = this.getTotalCaloriesConsumed.bind(this);
    this.getPersonalGoals = this.getPersonalGoals.bind(this);
  }

  //first call to get all meals of  the day  /meals/
  //next for each meal, get all the foods  for each meal /meals/id/foods/
  // agrregate all of the foods after getting all of the foods, agrregate them
  // fetch data when component loads/mounts component didmount

  componentDidMount() {
    this.props.navigation.addListener("didFocus", payload => {
      AsyncStorage.getItem("userInformation").then(retrievedObject => {
        if (retrievedObject) {
          retrievedObject = JSON.parse(retrievedObject);
          if (retrievedObject.token) {
            this.setState({
              username: retrievedObject.username,
              token: retrievedObject.token
            });
            this.getActivities();
            this.getMeals();
            this.getPersonalGoals();
          }
        }
      });
    });
  }

  getActivities() {
    fetch("https://mysqlcs639.cs.wisc.edu/activities/", {
      method: "GET",
      headers: new Headers({
        "x-access-token": this.state.token
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then(json => {
        this.setState({ activities: json.activities });
      })
      .catch(err => {
        console.log(err);
      });
  }

  getMeals() {
    fetch("https://mysqlcs639.cs.wisc.edu/meals/", {
      method: "GET",
      headers: new Headers({
        "x-access-token": this.state.token
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then(json => {
        this.setState({ meals: json.meals }, () => {
          this.getMealFoods();
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  getMealFoods() {
    let promises = [];
    for (let i = 0; i < this.state.meals.length; i++) {
      promises.push(
        fetch(
          `https://mysqlcs639.cs.wisc.edu/meals/${this.state.meals[i].id}/foods/`,
          {
            method: "GET",
            headers: new Headers({
              "x-access-token": this.state.token
            })
          }
        ).then(response => {
          if (!response.ok) {

            throw new Error(response.status);
          } else {
            return response.json();
          }
        })
      );
    }
    Promise.all(promises)
      .then(json => {
        let foods = [];
        for (let j = 0; j < json.length; j++) {
          foods.push(...json[j].foods);
        }
        this.setState({ mealFoods: foods });
      })
      .catch(err => {
        console.log(err);
      });
  }

  getPersonalGoals() {
    fetch(`https://mysqlcs639.cs.wisc.edu/users/${this.state.username}`, {
      method: "GET",
      headers: new Headers({
        "x-access-token": this.state.token
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then(json => {
        this.setState({
          goalDailyActivity: json.goalDailyActivity,
          goalDailyCalories: json.goalDailyCalories,
          goalDailyCarbohydrates: json.goalDailyCarbohydrates,
          goalDailyFat: json.goalDailyFat,
          goalDailyProtein: json.goalDailyProtein
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  getTotalCalories() {
    //calories burned
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var date = today.getDate();

    let sumCalories = 0;
    for (let i = 0; i < this.state.activities.length; i++) {
      var other = this.state.activities[i].date.split("T")[0].split("-");
      if (other[0] == year && other[1] == month && other[2] == date) {
        sumCalories += this.state.activities[i].calories;
      }
    }
    return sumCalories;
  }
  getTotalExcerciseTime() {
    let time = 0;
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var date = today.getDate();

    for (let j = 0; j < this.state.activities.length; j++) {
      var other = this.state.activities[j].date.split("T")[0].split("-");
      if (other[0] == year && other[1] == month && other[2] == date) {
        time += this.state.activities[j].duration;
      }
    }
    return time;
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
  calcGoals(dailyGoal, currentDailyTotal) {
    return dailyGoal - currentDailyTotal;
  }

  render() {
    const { navigation } = this.props;
    let mealMacros = [];
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var date = today.getDate();
    return (
      <View style={StyleSheet.container}>
        <ScrollView>
          <Container>
            <Content>
              <Card style={styles.carditem}>
                <CardItem header bordered>
                  <Text style={styles.header}>TODAY</Text>
                </CardItem>
                <CardItem header bordered>
                  <Text style={styles.date}>
                    {month}/{date}/{year}
                  </Text>
                </CardItem>
                <CardItem>
                  <Body style={styles.sumBorder}>
                    <Text style={styles.header1}>CALORIES</Text>
                    <Text></Text>
                    <Text style={styles.header2}>
                    {" "}Consumed: {this.getTotalCaloriesConsumed()}{" "}
                    </Text>
                    <Text style={styles.header2}>
                    {" "}Burned: {this.getTotalCalories()}{" "}
                    </Text>
                    <Text style={styles.header2}>
                      {" "}Time Exercised: {this.getTotalExcerciseTime()} min
                    </Text>
                  </Body>
                </CardItem>
                <CardItem>
                  <Body style={styles.sumBorder}>
                    
                    <Text style={styles.header3}> WHAT'S LEFT </Text>
                    <Text></Text>
                    <Text style={styles.header2}>
                      {" "}
                      Protein:{" "}
                      {this.calcGoals(
                        this.state.goalDailyProtein,
                        this.getTotalProtein()
                      )}{" "}
                      g
                    </Text>
                    <Text style={styles.header2}>
                      {" "}
                      Carbohydrates:{" "}
                      {this.calcGoals(
                        this.state.goalDailyCarbohydrates,
                        this.getTotalCarbs()
                      )}{" "}
                      g
                    </Text>
                    <Text style={styles.header2}>
                      {" "}
                      Fat:{" "}
                      {this.calcGoals(
                        this.state.goalDailyFat,
                        this.getTotalFat()
                      )}{" "}
                    </Text>
                  </Body>
                </CardItem>
              </Card>
              <Text style={styles.header4}>Activities</Text>
              {this.state.activities.map(obj => {
                let currId = obj.id;

                var other = obj.date.split("T")[0].split("-");
                if (other[0] == year && other[1] == month && other[2] == date) {
                  return (
                    <Content>
                      <ActivityCard
                        navigation={navigation}
                        key={obj.id}
                        activity={obj}
                      />
                    </Content>
                  );
                }
              })}
              <Text style={styles.header4}>Meals</Text>
              {this.state.meals.map(meal => {
                var other = meal.date.split("T")[0].split("-");
                if (other[0] == year && other[1] == month && other[2] == date) {
                  return (
                    <View>
                      <MealCard
                        navigation={navigation}
                        key={meal.id}
                        meal={meal}
                        token={this.state.token}
                      />
                    </View>
                  );
                }
              })}
            </Content>
          </Container>
        </ScrollView>
      </View>
    );
  }
}

const MealCard = props => {
  const navigation = this.props;
  let macros = [0, 0, 0];
  let foods = [];
  fetch(`https://mysqlcs639.cs.wisc.edu/meals/${props.meal.id}/foods/`, {
    method: "GET",
    headers: new Headers({
      "x-access-token": props.token
    })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then(json => {
      foods = json.foods;

      let c = 0;
      let f = 0;
      let p = 0;

      for (let i = 0; i < foods.length; i++) {
        c += foods[i].carbohydrates;
        f += foods[i].fat;
        p += foods[i].protein;
      }
      macros[0] = c;
      macros[1] = f;
      macros[2] = p;

      return macros;
    })
    .catch(err => {
      console.log(err);
    });

  return (
    <Content>
      <Card style={styles.carditem}>
        <CardItem header bordered>
          <Text style={styles.mealactCard}>{props.meal.name}</Text>
        </CardItem>
        <CardItem>
          <Body>
            <Text></Text>
            <Text style={styles.infoNum}>See Details in Edit Meal</Text>
            <Text></Text>
          </Body>
        </CardItem>
        <CardItem
          footer
          button
          style={styles.editactbutton}
          onPress={() =>
            props.navigation.navigate("EditMeal", {
              id: props.meal.id
            })
          }
        >
          <Text style={styles.editButtonText}>edit meal</Text>
        </CardItem>
        <CardItem></CardItem>
      </Card>
    </Content>
  );
};

const ActivityCard = props => {
  const navigation = this.props;

  return (
    <Card style={styles.carditem}>
      <CardItem header bordered>
        <Text style={styles.mealactCard}>{props.activity.name}</Text>
      </CardItem>
      <CardItem>
        <Body>
          <Text></Text>
          <Text style={styles.infoNum}>
            Calories: {props.activity.calories} kcal
          </Text>
          <Text></Text>
          <Text style={styles.infoNum}>
            Duration: {props.activity.duration} min
          </Text>
          <Text></Text>
        </Body>
      </CardItem>
      <CardItem
        footer
        button
        rounded
        style={styles.editactbutton}
        onPress={() =>
          props.navigation.navigate("EditActivity", {
            id: props.activity.id
          })
        }
      >
        <Text style={styles.editButtonText}>edit activity</Text>
      </CardItem>
      <CardItem></CardItem>
    </Card>
  );
};

const styles = StyleSheet.create({
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
  field: {
    textAlign: "center",
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: "black",
    marginBottom: 10,
    color: "white"
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    // marginLeft: 95,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 2,
    fontFamily: "Courier",
    fontSize: 40,
    color: "black"
  },
  header1: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 95,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 2,
    fontFamily: "Courier",
    fontSize: 28,
    color: "#000059",
    marginTop: 10
  },
  header2: {
    alignItems: "center",
    justifyContent: "center",
    // marginLeft: 95,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 2,
    fontFamily: "Courier",
    fontSize: 20,
    color: "#000059"
  },
  header3: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 50,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 2,
    fontFamily: "Courier",
    fontSize: 28,
    color: "#000059"
  },
  header4: {
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    letterSpacing: 2,
    fontFamily: "Courier",
    fontSize: 20,
    marginTop: 23,
    marginBottom: 10,
    marginLeft: 55,
    height: 30,
    width: 250,
    borderColor: "darkblue",
    color: "darkblue",
    borderWidth: 3,
    marginTop: 10

  },
  date: {
    alignItems: "center",
    justifyContent: "center",
    // marginLeft: 90,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 2,
    fontFamily: "Courier",
    fontSize: 20,
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
  },
sumBorder:{
borderColor:"#000059",
borderWidth: 3,
borderRadius: 10

},
  carditem: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    color: "darkblue",
    borderColor: "darkblue",
    borderWidth: 2,
    fontFamily: "Courier",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    textAlign: "center"
  },
  mealactCard: {
    fontFamily: "Courier",
    color: "darkblue",
    fontSize: 20,
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
    textAlign: "center"
  },
  editButtonText: {
    fontFamily: "Courier",
    color: "#F26B38"
  },
  infoNum: {
    color: "darkblue",
    fontFamily: "Courier",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    fontWeight: "bold",
    textAlign: "center",
    marginLeft: 80
  },
  mainCard: {
    borderRadius: 15,
    color: "white",
    backgroundColor: "#29225e",
    justifyContent: "center",
    alignItems: "center",
    height: 300,
    marginVertical: 20,
    fontFamily: "Courier"
  },
  foodCard: {
    flex: 1
  }
});
export default connect()(CurrentDay);
