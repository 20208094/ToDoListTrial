import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, Dimensions, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { LineChart } from "react-native-chart-kit";
import { Calendar } from "react-native-calendars";
import CalendarStrip from "react-native-calendar-strip";
import BottomNavigation from "../navigation/BottomNav";
import { getCheckedItems, getUncheckedItems } from "./Database";

const AnalyticsScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [checkedItems, setCheckedItems] = useState([]);
  const [uncheckedItems, setUncheckedItems] = useState([]);
  const [selectedWeekStart, setSelectedWeekStart] = useState(null);
  const [selectedWeekEnd, setSelectedWeekEnd] = useState(null);

  const fetchItems = useCallback(() => {
    getCheckedItems((allCheckedItems) => {
      setCheckedItems(allCheckedItems);
    });

    getUncheckedItems((allUncheckedItems) => {
      setUncheckedItems(allUncheckedItems);
    });
  }, []);

  useEffect(() => {
    fetchItems();
    const unsubscribe = navigation.addListener("focus", () => {
      fetchItems();
    });
    return unsubscribe;
  }, [fetchItems]);

  // Generate data for LineChart based on items and selected week
  const generateChartData = () => {
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const getItemsForWeek = (items, start, end) => {
      return items.filter((item) => {
        const itemDate = new Date(item.duedate);
        return itemDate >= start && itemDate <= end;
      });
    };

    const checkedData = weekdays.map((day) => {
      const dayItems = getItemsForWeek(
        checkedItems,
        selectedWeekStart,
        selectedWeekEnd
      ).filter((item) => {
        const itemDay = new Date(item.duedate).getDay();
        return weekdays[itemDay] === day;
      });
      return dayItems.length;
    });

    const uncheckedData = weekdays.map((day) => {
      const dayItems = getItemsForWeek(
        uncheckedItems,
        selectedWeekStart,
        selectedWeekEnd
      ).filter((item) => {
        const itemDay = new Date(item.duedate).getDay();
        return weekdays[itemDay] === day;
      });
      return dayItems.length;
    });

    return { checked: checkedData, unchecked: uncheckedData };
  };
  
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: "10%" }}>
        <LinearGradient
          colors={["#FC5858", "pink"]}
          style={styles.newContainer}
        >
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
              labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
              datasets: [
                {
                  data: generateChartData().checked,
                  strokeWidth: 2,
                },
                {
                  data: generateChartData().unchecked,
                  strokeWidth: 2,
                  color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Red color for unchecked items
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
        </LinearGradient>
      </ScrollView>
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
  newContainer: {
    borderRadius: 15,
    padding: 20,
  },
});

export default AnalyticsScreen;
