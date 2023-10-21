import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Button,
} from "react-native";
import { updateItem, getItemById } from "./Database";
import DateTimePicker from "@react-native-community/datetimepicker";
import BottomNavigation from "../navigation/BottomNav";

const EditScreen = ({ route, navigation }) => {
  const { itemId } = route.params;
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemMins, setItemMins] = useState("");
  const [itemDueDate, setItemDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [itemDueTime, setItemDueTime] = useState(new Date());
  const [showTimePicker, setshowTimePicker] = useState(false);
  const [minsError, setMinsError] = useState(null);

  useEffect(() => {
    getItemById(itemId, (item) => {
      setItemName(item.name);
      setItemDescription(item.description);
      setItemMins(item.mins.toString());
      setItemDueDate(item.duedate);
      setItemDueTime(item.duetime);
    });
  }, [itemId]);

  const stringTime = itemDueTime.toString();

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const toggleTimePicker = () => {
    setshowTimePicker(!showTimePicker);
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

    return `${("0" + hour).slice(-2)}:${("0" + min).slice(-2)}:${(
      "0" + seconds
    ).slice(-2)}`;
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
      const currentTime = selectedTime;
      setItemDueTime(formatTime(currentTime));

      if (Platform.OS === "android") {
        toggleTimePicker();
      }
    } else {
      toggleTimePicker();
    }
  };

  const editItem = () => {
    updateItem(
      itemId,
      itemName,
      itemDescription,
      itemMins,
      formatDate(itemDueDate),
      itemDueTime,
      () => {
        console.log("Item updated successfully");
        navigation.navigate("Todo", { refreshKey: "todo" + Math.random() });
      }
    );
  };

  const handleCancel = () => {
    // Navigate back to the previous screen
    navigation.goBack();
  };

  const validateMins = (input) => {
    const minsPattern = /^[0-9]*$/;

    if (!minsPattern.test(input) || input < 0 || input > 59) {
      setMinsError("Please enter a valid number between 0 and 59");
    } else {
      setMinsError(null);
      setItemMins(input);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.noteContainer}>
          <Text style={styles.noteText}>Edit Task</Text>
        </View>

        <View style={styles.newContainer}>
          {/* TITLE */}
          <Text style={styles.subtitle}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter item title"
            value={itemName}
            onChangeText={(text) => setItemName(text)}
          />

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
                onPress={toggleTimePicker}
                style={styles.input}
                value={stringTime || formatTime(itemDueTime)}
                onChangeText={setItemDueTime}
                onPressIn={toggleTimePicker}
              />
            </Pressable>
          )}

          {/* Minutes */}
          <Text style={styles.subtitle}>Minutes</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter item minutes"
            value={itemMins}
            onChangeText={(text) => validateMins(text)}
          />
          {minsError && <Text style={styles.errorText}>{minsError}</Text>}

          {/* DESCRIPTION */}
          <Text style={[styles.subtitle, { marginTop: 10 }]}>
            Task Description
          </Text>

          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: "top" }]}
            placeholder="Enter item description"
            multiline={true}
            value={itemDescription}
            onChangeText={(text) => setItemDescription(text)}
          />

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => editItem()}
            >
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleCancel()}
            >
              <Text style={styles.cancelbuttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>

        <BottomNavigation navigation={navigation} />
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
    justifyContent: "center",
    alignItems: "center",
  },
  noteContainer: {
    backgroundColor: "pink",
    borderRadius: 15,
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
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
});

export default EditScreen;
