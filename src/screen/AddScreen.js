import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  StyleSheet,
  Pressable,
} from "react-native";
import { insertItem } from "./Database";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import BottomNavigation from "../navigation/BottomNav";

const AddScreen = ({ navigation }) => {
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemMins, setItemMins] = useState("");
  const [itemDueDate, setItemDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [itemDueTime, setItemDueTime] = useState(new Date());
  const [showTimePicker, setshowTimePicker] = useState(false);
  const [minsError, setMinsError] = useState(null);
  const { height, width } = Dimensions.get("window");
  const [titleError, setTitleError] = useState(null);

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const toggleTimePicker = () => {
    setshowTimePicker(!showTimePicker);
  };

  const onChangeDate = (event, selectedDate) => {
    if (event.type === "set") {
      const currentDate = selectedDate || itemDueDate;
      const formattedDate = formatDate(currentDate);

      setItemDueDate(formattedDate);
      if (Platform.OS === "android") {
        toggleDatePicker();
      }
    } else {
      toggleDatePicker();
    }
  };

  const onChangeTime = ({ type, nativeEvent }, selectedTime) => {
    if (type === "set") {
      const currentTime = selectedTime || itemDueTime;
      setItemDueTime(new Date(currentTime));

      if (Platform.OS === "android") {
        toggleTimePicker();
      }
    } else {
      toggleTimePicker();
    }
  };

  const formatDate = (rawDate) => {
    let date = new Date(rawDate);

    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    return `${year}-${month < 10 ? "0" : ""}${month}-${
      day < 10 ? "0" : ""
    }${day}`;
  };

  const formatTime = (rawTime) => {
    let time = new Date(rawTime);
    let hour = time.getHours();
    let min = time.getMinutes();
    let seconds = time.getSeconds();

    return `${("0" + hour).slice(-2)}:${("0" + min).slice(-2)}:${("0" + seconds).slice(-2)}`;
  };

  const validateMins = (input) => {
    const minsPattern = /^[0-9]*$/;

    if (!minsPattern.test(input) || input < 0 || input > 59) {
      setMinsError("Please enter a valid number between 0 and 60");
    } else {
      setMinsError(null);
      setItemMins(input);
    }
  };

  const addItem = () => {
    if (!itemName.trim()) {  // Check if itemName is empty or just whitespace
      setTitleError('You need to write a title');
      return;  // Return early so the insert action doesn't proceed
    } else {
      setTitleError(null);  // Clear any previous error
    }

    insertItem(
      itemName,
      itemDescription,
      itemMins,
      formatDate(itemDueDate),
      formatTime(itemDueTime),
      (id) => {
        console.log("Item added with ID:", id);
        navigation.navigate("Todo", { refreshKey: "todo" + Math.random() });
      }
    );
  };

  const handleCancel = () => {
    // Navigate back to the previous screen
    navigation.goBack();
  };

  return (
    <>
      <View style={styles.container}>
        {/* Add Task Note Container */}
        <LinearGradient
          colors={["#FC5858", "pink"]}
          style={styles.noteContainer}
        >
          <Text style={styles.noteText}>Add Task</Text>
        </LinearGradient>

        {/* New Container */}
        <LinearGradient
          colors={["#FC5858", "pink"]}
          style={styles.newContainer}
        >
          {/* Title */}
          <Text style={styles.subtitle}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter item title"
            value={itemName}
            onChangeText={(text) => setItemName(text)}
          />
          {titleError && <Text style={styles.errorText}>{titleError}</Text>}

          {/* Due Date */}
          <Text style={styles.subtitle}>Due Date</Text>
          {showDatePicker && (
            <DateTimePicker
              mode="date"
              display="calendar"
              value={new Date()}
              minimumDate={new Date()}
              onChange={onChangeDate}
            />
          )}

          {!showDatePicker && (
            <Pressable onPress={toggleDatePicker}>
              <TextInput
                style={styles.input}
                value={formatDate(itemDueDate)}
                onChangeText={setItemDueDate}
                editable={false}
                onPressIn={toggleDatePicker}
              />
            </Pressable>
          )}

          {/* Due Time */}
          <Text style={styles.subtitle}>Due Time</Text>
          {showTimePicker && (
            <DateTimePicker
              mode="time"
              display="clock"
              value={new Date()}
              onChange={onChangeTime}
            />
          )}

          {!showTimePicker && (
            <Pressable onPress={toggleTimePicker}>
              <TextInput
                style={styles.input}
                value={formatTime(itemDueTime)}
                onChangeText={setItemDueTime}
                onPressIn={toggleTimePicker}
              />
            </Pressable>
          )}

          {/* Minutes */}
          <Text style={styles.subtitle}>Minutes</Text>
          <TextInput
            style={styles.input}
            placeholder="Minutes until notification"
            value={itemMins}
            onChangeText={(text) => validateMins(text)}
            keyboardType="numeric"
          />
          {minsError && <Text style={styles.errorText}>{minsError}</Text>}

          {minsError && <Text style={styles.errorText}>{minsError}</Text>}

          {/* Task Description */}
          <Text style={[styles.subtitle, { marginTop: 10 }]}>
            Task Description
          </Text>
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: "top" }]}
            placeholder="Enter item description"
            value={itemDescription}
            onChangeText={(text) => setItemDescription(text)}
          />

          {/* Buttons Container */}
          <View style={styles.buttonsContainer}>
            {/* Add Button */}
            <TouchableOpacity style={styles.addButton} onPress={addItem}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelbuttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Bottom Navigation Container */}
        <View
          style={{
            width: width,
            position: "absolute",
            right: 0,
            left: 0,
            bottom: 0,
            flex: 1,
          }}
        >
          <BottomNavigation navigation={navigation} />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    paddingTop: 40,
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
  },
  noteContainer: {
    borderRadius: 15,
    backgroundColor: "pink",
    padding: 10,
    alignItems: "center",
    marginBottom: 10,
    width: "40%",
  },
  noteText: {
    color: "black",
    fontSize: 18,
  },
  newContainer: {
    backgroundColor: "pink",
    borderRadius: 15,
    padding: 20,
    width: "90%",
  },
  subtitle: {
    color: "black",
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    color: "black",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addButton: {
    backgroundColor: "#FC5858",
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
  datePicker: {
    height: 120,
    marginTop: -10,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
});

export default AddScreen;