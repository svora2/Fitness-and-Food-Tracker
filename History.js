//fetch meals from today -7 days
//aggregate data
//display onto cards
import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  AsyncStorage,
  TouchableOpacity
} from "react-native";
import base64 from "base-64";
import { Container, Header, Content, Button, Text, Card } from "native-base";
import { ScrollView } from "react-native-gesture-handler";

//fetch data
// add to an array
//use .map and display onto a card
//agregate calories and excercise

class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      token: "",
      password: "",
      err: "",
      meals: [],
      activities: [],
      mealFoods: [],
      filteredMeals: [],
      filteredActs: [],
      currMealFoods: []
    };
    this.getTotalCalories = this.getTotalCalories.bind(this);
    this.getTotalExcerciseTime = this.getTotalExcerciseTime.bind(this);
    this.getTotalProtein = this.getTotalProtein.bind(this);
    this.getTotalCarbs = this.getTotalCarbs.bind(this);
    this.getTotalFat = this.getTotalFat.bind(this);
    this.getData = this.getData.bind(this);
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
          Promise.all([
            fetch(`https://mysqlcs639.cs.wisc.edu/meals/`, {
              headers: new Headers({
                "x-access-token": retrievedObject.token
              })
            }),
            fetch(`https://mysqlcs639.cs.wisc.edu/activities/`, {
              headers: new Headers({
                "x-access-token": retrievedObject.token
              })
            })
          ])
            .then(([res1, res2]) => Promise.all([res1.json(), res2.json()]))
            .then(([data1, data2]) => {
              {
                this.setState({
                  meals: data1.meals,
                  activities: data2.activities
                });
                this.getData();
              }
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
  //get meals if it matches date

 
  getTotalCalories(mealFoods) {
    let sumCalories = 0;
    for (let i = 0; i < this.state.activities.length; i++) {
      sumCalories += this.state.activities[i].calories;
    }
    return sumCalories;
  }
  getTotalExcerciseTime(mealFoods) {
    let time = 0;
    for (let j = 0; j < this.state.activities.length; j++) {
      time += this.state.activities[j].duration;
    }
    return time;
  }
  getTotalCaloriesConsumed(mealFoods) {
    let calories = 0;
    for (let k = 0; k < this.state.mealFoods.length; k++) {
      calories += this.state.mealFoods[k].calories;
    }
    return calories;
  }
  getTotalProtein(mealFoods) {
    let protein = 0;
    for (let k = 0; k < this.state.mealFoods.length; k++) {
      protein += this.state.mealFoods[k].protein;
    }
    return protein;
  }
  getTotalFat(mealFoods) {
    let fat = 0;
    for (let k = 0; k < this.state.mealFoods.length; k++) {
      fat += this.state.mealFoods[k].fat;
    }
    return fat;
  }
  getTotalCarbs(mealFoods) {
    let carbs = 0;
    for (let k = 0; k < this.state.mealFoods.length; k++) {
      carbs += this.state.mealFoods[k].carbohydrates;
    }
    return carbs;
  }

  getData(){

    let allMeals = [];
    let allActs = [];
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var date = today.getDate();
    var daysPrior = 7;
    let index = [];
    for (let i = 0; i < 7; i++) {
      index = [];
      today.setDate(today.getDate() - i);
    //   console.log(daysPrior);
      daysPrior--;

      for (let j = 0; j < this.state.meals.length; j++) {
        index = [];
          var mdate = (new Date(this.state.meals[j].date));
        var mealYear = mdate.getFullYear();
        var mealMonth = mdate.getMonth() + 1;
        var mealDate = mdate.getDate();
        
        if (
          mealYear == today.getFullYear() &&
          mealMonth == today.getMonth() + 1 &&
          mealDate == today.getDate()
        ) {
        //   console.log("meal added");
          allMeals.push(this.state.meals[j]);
        }

      }
      for (let j = 0; j < this.state.activities.length; j++) {
        index = [];
          var adate = (new Date(this.state.activities[j].date));
        var actYear = adate.getFullYear();
        var actMonth = adate.getMonth() + 1;
        var actDate = adate.getDate();
        // console.log(actDate, actMonth, actYear);
        if (
          actYear == today.getFullYear() &&
          actMonth == today.getMonth() + 1 &&
          actDate == today.getDate()
        ) {
          allActs.push(this.state.activities[j]);
        //   console.log("act added");
        }
      }
       today.setDate(today.getDate() + i);
    }
    this.setState({filteredMeals: allMeals});
    this.setState({filteredActs: allActs});
  }
  getMealFoods(mealId) {
    fetch(`https://mysqlcs639.cs.wisc.edu/meals/${mealId}/foods/`, {
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
        this.setState({currMealFoods: foodArray.foods})
        return foodArray.foods;
      });
  }
  render() {

    return (
      <View style={StyleSheet.container}>
        <ScrollView>
          <Container>
            <Content>
               
                {this.state.filteredMeals.map((meal) => {
                  //  {console.log(meal)}
                  // {console.log(this.getMealFoods(meal.id))}
                // {console.log(this.getTotalProtein(this.state.currMealFoods))}
                  <Text>{this.getMealFoods(meal.id)}
                 { this.getTotalProtein(this.state.currMealFoods)}
                {this.getTotalCarbs(this.state.currMealFoods)}
                  {this.getTotalFat(this.state.currMealFoods)}
                  </Text>

                  // <MealFoods key={meal.id} obj={meal} />
                })}
                {this.state.filteredActs.map(activity => {
                  
                })}
            </Content>
          </Container>
        </ScrollView>
      </View>
    );
  }
}
export default History;





const MealFoods = props => {
    fetch(`https://mysqlcs639.cs.wisc.edu/meals/${props.obj.id}/foods/`, {
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
  

  return (

            <Card>
              <CardItem header bordered>
                <Text>{props.food.name}</Text>
              </CardItem>
              <CardItem bordered>
                <Body>
                  <Text>Calories: {props.food.calories} g</Text>
                  <Text>Carbohydrates: {props.food.carbohydrates} g</Text>
                  <Text>Fat: {props.food.fat} g</Text>
                  <Text>Protein: {props.food.protein} g</Text>
                </Body>
                
              </CardItem>
            </Card>

      );
    };


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
    marginLeft: 95,
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
  },
  cardRow: {
    borderRadius: 20,
    textAlign: "center",
    color: "white",
    backgroundColor: "#827bb8",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    height: 180,
    marginVertical: 20,
    fontFamily: "Courier"
  },
  cardTitle: {
    color: "#ffffff",
    fontSize: 24,
    paddingTop: 12,
    fontFamily: "Courier"
  },
  cardNumbers: {
    color: "#ffffff",
    fontSize: 16,
    paddingTop: 12
  },
  mainCard: {
    borderRadius: 15,
    color: "white",
    backgroundColor: "#29225e",
    justifyContent: "center",
    alignItems: "center",
    //  flexDirection: "",
    height: 300,
    marginVertical: 20,
    fontFamily: "Courier"
  }
});
