import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { LineChart } from "react-native-chart-kit";
import CalendarStrip from "react-native-calendar-strip";
import BottomNavigation from "../navigation/BottomNav";

const MyLineChart = () => {
  const [selectedWeekStart, setSelectedWeekStart] = useState(null);
  const [selectedWeekEnd, setSelectedWeekEnd] = useState(null);
  const chartWidth = Dimensions.get("window").width - 40; // Adjusted width
  const chartHeight = 200; // Adjusted height
  return (
    <>
      {/* <Text style={styles.header}>Line Chart</Text> */}
      <CalendarStrip
        scrollable
        style={{ height: 60, borderRadius: 10 }}
        calendarColor={"white"}
        calendarHeaderStyle={{ color: "black" }}
        dateNumberStyle={{ color: "black" }}
        dateNameStyle={{ color: "black" }}
        iconContainer={{ flex: 0.1 }}
        onWeekChanged={(start, end) => {
          setSelectedWeekStart(start);
          setSelectedWeekEnd(end);
        }}
      />

      <LineChart
        data={{
          labels: ["Mon", "Tue", "Wed", "Thurs", "Fri", "Sat", "Sun"],
          datasets: [
            {
              data: [1, 3, 5, 7, 9, 10],
              strokeWidth: 2,
            },
          ],
        }}
        width={Dimensions.get("window").width - 80}
        height={510}
        chartConfig={{
          backgroundColor: "white",
          backgroundGradientFrom: "white",
          backgroundGradientTo: "white",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        style={{
          marginVertical: 16,
          borderRadius: 16,
        }}
      />
    </>
  );
};

const AnalyticsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: "10%" }}>
        {/* Title Container */}
        {/* <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Assignment Apps</Text>
        </View> */}

        {/* Add Task Note Container
        <View style={styles.noteContainer}>
          <Text style={styles.noteText}>Analytics</Text>
          <Text style={styles.noteText}>Activities Done for this Week</Text>
        </View> */}

        {/* New Container */}
        <LinearGradient
          colors={["#FC5858", "pink"]}
          style={styles.newContainer}
        >
          {/* Title */}
          {/* <Text style={styles.subtitle}>October</Text> */}

          {/* chart */}
          <View>
            <MyLineChart />
          </View>
        </LinearGradient>
      </ScrollView>

      {/* Bottom Navigation Container */}
      <BottomNavigation navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  titleContainer: {
    backgroundColor: "pink",
    borderRadius: 15,
    padding: 10,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  titleText: {
    color: "black",
    fontSize: 20,
  },
  noteContainer: {
    backgroundColor: "pink",
    borderRadius: 15,
    padding: 10,
    alignSelf: "center",
    marginBottom: 10,
  },
  noteText: {
    color: "black",
    fontSize: 18,
  },
  newContainer: {
    borderRadius: 15,
    padding: 20,
  },
  subtitle: {
    color: "black",
    fontSize: 20,
    marginBottom: 10,
    alignSelf: "center",
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addButton: {
    backgroundColor: "#B94D4D",
    borderRadius: 15,
    padding: 10,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 10,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
  },
  cancelbuttonText: {
    color: "black",
  },
  plusbuttonText: {
    color: "white",
    fontSize: 30,
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    backgroundColor: "pink",
    borderRadius: 15,
    padding: 10,
    alignItems: "center",
  },
  iconContainer: {
    alignItems: "center",
    borderRadius: 50,
    padding: 10,
  },
  icon: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  addButtonContainer: {
    backgroundColor: "#B94D4D",
    borderRadius: 50,
    padding: 10,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "white",
  },
});

export default AnalyticsScreen;
