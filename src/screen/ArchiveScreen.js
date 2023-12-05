import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  Dimensions,
  Image,
  Pressable,
  Modal,
  TextInput,
} from "react-native";
import { IconButton, Checkbox } from "react-native-paper";
import { deleteItem, updateItemStatus, getCheckedItems } from "./Database";
import { LinearGradient } from "expo-linear-gradient";
import BottomNavigation from "../navigation/BottomNav";
import { SwipeListView } from "react-native-swipe-list-view";
import { Calendar } from "react-native-calendars";

const ArchiveScreen = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
  const [deleteConfirmTodo, setDeleteConfirmTodo] = useState(null);
  const [modalViewVisible, setModalViewVisible] = useState(false);
  const [viewTaskDetails, setViewTaskDetails] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { height, width } = Dimensions.get("window");
  const taskCon = height / 1.5;

  const fetchItems = useCallback(() => {
    getCheckedItems((allItems) => {
      const filteredItems = allItems.filter((item) => {
        const itemDate = new Date(item.duedate);
        const selectedDateObj = new Date(selectedDate);
        return (
          itemDate.getFullYear() === selectedDateObj.getFullYear() &&
          itemDate.getMonth() === selectedDateObj.getMonth()
        );
      });
      setItems(filteredItems);
    });
  }, [selectedDate]);

  useEffect(() => {
    fetchItems();
    const unsubscribe = navigation.addListener("focus", () => {
      fetchItems();
    });
    return unsubscribe;
  }, [fetchItems, selectedDate]);

  const deleteItemById = (id) => {
    deleteItem(id, () => {
      console.log("Item deleted successfully");
      fetchItems();
      setDeleteConfirmTodo(null);
      setModalDeleteVisible(false);
    });
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button title="Refresh" onPress={() => fetchItems()} />
      ),
    });
  }, [fetchItems]);

  const handleDeleteConfirmTodo = (itemId) => {
    setDeleteConfirmTodo(itemId);
    setModalDeleteVisible(true);
  };

  const handleViewTask = (itemId) => {
    const taskToView = items.find((item) => item.id === itemId);
    setViewTaskDetails(taskToView);
    setModalViewVisible(true);
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

  const renderTodoItem = ({ item, index }) => (
    <View style={{ marginBottom: 10 }}>
      <SwipeListView
        data={[item]}
        renderItem={(data, rowMap) => (
          <View
            style={{
              backgroundColor: "#66d966",
              borderRadius: 4,
              width: "100%",
              justifyContent: "center",
              padding: 5,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Checkbox
                status="checked"
                onPress={() => {
                  const updatedItems = [...items];
                  updatedItems[index].checked = !updatedItems[index].checked;
                  setItems(updatedItems);

                  // Update the status in the SQLite database
                  updateItemStatus(
                    item.id,
                    item.name,
                    item.description,
                    item.mins,
                    item.duedate,
                    item.duetime,
                    "unchecked",
                    item.submission,
                    () => {
                      console.log("Item status updated successfully");
                      fetchItems();
                    }
                  );
                }}
                style={{ alignSelf: "center" }}
                checkedIcon="checkbox-marked"
              />
              <View style={{ flex: 1, paddingStart: 10 }}>
                <Text
                  style={{
                    color: "black",
                    fontSize: 30,
                    fontWeight: "800",
                    marginBottom: 6,
                    textDecorationLine: "line-through",
                  }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {data.item.name}
                </Text>
                <Text
                  style={{
                    color: "black",
                    fontSize: 12,
                    textDecorationLine: "line-through",
                  }}
                >
                  DUE DATE: {data.item.duedate}
                </Text>
                <Text
                  style={{
                    color: "black",
                    fontSize: 12,
                    textDecorationLine: "line-through",
                  }}
                >
                  DUE TIME: {data.item.duetime}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <IconButton
                  style={{ margin: 0 }}
                  icon="eye"
                  iconColor="#3498db"
                  onPress={() => handleViewTask(item.id)}
                />
              </View>
            </View>
          </View>
        )}
        renderHiddenItem={(data, rowMap) => (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
              backgroundColor: "gray",
              height: 100,
              width: "100%",
              position: "absolute",
              right: 0,
              borderRadius: 4,
            }}
          >
            {/* <Pressable style={{ backgroundColor: '#f39c12', width: 60, height: 100, alignItems: 'center', justifyContent: 'center' }} >
                            <IconButton style={{ margin: 0, backgroundColor: '#f39c12', marginEnd: 5 }} icon="pencil" iconColor='black' onPress={() => navigation.navigate('Edit', { itemId: data.item.id })} />
                        </Pressable> */}
            <Pressable
              style={{
                backgroundColor: "#e74c3c",
                width: 60,
                height: 100,
                alignItems: "center",
                justifyContent: "center",
                borderTopEndRadius: 4,
                borderBottomEndRadius: 4,
              }}
              onPress={() => handleDeleteConfirmTodo(data.item.id)}
            >
              <IconButton
                style={{ margin: 0, backgroundColor: "#e74c3c" }}
                icon="trash-can"
                iconColor="black"
              />
            </Pressable>
          </View>
        )}
        rightOpenValue={-60}
      />
    </View>
  );

  return (
    <>
      <View style={{ marginHorizontal: 16, marginTop: 200, fontSize: 20 }}>
        <View
          style={{
            flexDirection: "row",
            borderColor: "#FC5858",
            backgroundColor: "#dbdbdb",
            borderWidth: 5,
            marginStart: -30,
            paddingStart: 40,
            alignItems: "center",
            borderTopRightRadius: 50,
            borderBottomRightRadius: 50,
            justifyContent: "flex-end",
            width: width * 0.7,
            marginTop: -150,
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Assigment Application
          </Text>
          <Image
            source={require("../../assets/splash.png")}
            style={{ height: 60, width: 60, marginBottom: 5, marginEnd: 10 }}
          />
        </View>
        <View>
          <Text
            style={{
              fontSize: 35,
              textAlign: "center",
              fontWeight: "bold",
              marginBottom: 10,
              marginTop: 15,
            }}
          >
            ARCHIVE
          </Text>
        </View>

        <Calendar
          style={{ height: 50 }}
          onMonthChange={(day) => {
            setSelectedDate(day.dateString);
          }}
        />

        <LinearGradient
          colors={["#FC5858", "pink"]}
          style={{
            borderTopRightRadius: 40,
            borderBottomLeftRadius: 40,
            height: height / 1.5,
            marginTop: 5,
            padding: 20,
            fontSize: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "#dbdbdb",
              padding: 10,
              height: taskCon - 50,
              borderRadius: 6,
              borderColor: "#fff",
              borderWidth: 5,
            }}
          >
            {/* RENDER TO DO LIST */}
            <FlatList
              data={items}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderTodoItem}
              ListEmptyComponent={
                <Text
                  style={{
                    fontSize: 35,
                    textAlign: "center",
                    fontWeight: "bold",
                    marginBottom: 10,
                    marginTop: 15,
                  }}
                >
                  It appears you haven't completed any tasks yet!
                </Text>
              }
            />
          </View>
        </LinearGradient>

        {/* Add Button */}
        {/* <Pressable style={{ position: 'absolute', bottom: 1, right: 1, }} onPress={() => navigation.navigate('Add')}>
                    <View style={{
                        backgroundColor: '#FC5858',
                        width: 80,
                        height: 80,
                        borderRadius: 80,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 7,
                        borderColor: 'white',
                        bottom: 8,
                        right: 8,
                    }}>
                        <Text style={{ fontSize: 50, color: 'white', }}>+</Text>
                    </View>
                </Pressable> */}

        {/* DELETE MODAL */}
        <Modal
          transparent={true}
          visible={modalDeleteVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalDeleteVisible(!modalDeleteVisible);
          }}
        >
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <View
              style={{
                margin: 10,
                marginTop: 290,
                width: 330,
                height: 220,
                backgroundColor: "white",
                padding: 35,
                alignItems: "center",
                elevation: 10,
                fontSize: 20,
                borderColor: "#FC5858",
                borderTopRightRadius: 50,
                borderBottomLeftRadius: 50,
                borderWidth: 5,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  backgroundColor: "white",
                  fontWeight: "bold",
                  padding: 5,
                  width: 300,
                  textAlign: "center",
                  borderRadius: 20,
                  marginTop: 20,
                  borderColor: "#FC5858",
                  borderWidth: 3,
                  marginBottom: 25,
                }}
              >
                Do you really want to delete this task?
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignContent: "center",
                  overflow: "hidden",
                  paddingStart: 30,
                }}
              >
                <Pressable
                  style={{
                    backgroundColor: "#FB3854",
                    width: "60%",
                    height: 40,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 30,
                    zIndex: 1,
                  }}
                  onPress={() => {
                    if (deleteConfirmTodo !== null) {
                      deleteItemById(deleteConfirmTodo);
                    }
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    Delete
                  </Text>
                </Pressable>

                <Pressable
                  style={{
                    backgroundColor: "white",
                    width: "60%",
                    height: 40,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 30,
                    position: "relative",
                    left: -30,
                    borderColor: "#FB3854",
                    borderWidth: 2,
                  }}
                  onPress={() => setModalDeleteVisible(!modalDeleteVisible)}
                >
                  <Text style={{ color: "#FC5858", fontWeight: "bold" }}>
                    Cancel
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {/* VIEW DETAILS MODAL */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalViewVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setViewTaskDetails(null);
            setModalViewVisible(!modalViewVisible);
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(51, 13, 13, 0.7)",
              height: "100%",
            }}
          >
            <View
              style={{
                margin: 20,
                width: 390,
                backgroundColor: "white",
                padding: 35,
                paddingTop: 10,
                alignItems: "center",
                elevation: 10,
                fontSize: 20,
                borderColor: "#FC5858",
                borderTopRightRadius: 50,
                borderBottomLeftRadius: 50,
                borderWidth: 5,
              }}
            >
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: "bold",
                  padding: 5,
                  textAlign: "center",
                  borderRadius: 20,
                }}
              >
                View Task
              </Text>

              <View
                style={{
                  borderColor: "#FC5858",
                  borderWidth: 3,
                  padding: 10,
                  margin: 10,
                  borderRadius: 20,
                  marginBottom: 30,
                  width: "100%",
                }}
              >
                {/* TITLE */}
                <View
                  style={{
                    borderColor: "#FC5858",
                    borderWidth: 1,
                    borderRadius: 20,
                    padding: 5,
                    marginTop: 5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      marginBottom: 10,
                      marginStart: 10,
                    }}
                  >
                    Title:{" "}
                  </Text>
                  <Text
                    style={{
                      fontSize: 20,
                      marginBottom: 10,
                      textAlign: "center",
                    }}
                  >
                    {viewTaskDetails ? viewTaskDetails.name : ""}
                  </Text>
                </View>
                {/* DESCRIPTION */}
                <View
                  style={{
                    borderColor: "#FC5858",
                    borderWidth: 1,
                    borderRadius: 20,
                    padding: 5,
                    marginTop: 5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      marginBottom: 10,
                      marginStart: 10,
                    }}
                  >
                    Description:{" "}
                  </Text>
                  <Text
                    style={{
                      fontSize: 20,
                      marginBottom: 10,
                      textAlign: "center",
                    }}
                  >
                    {viewTaskDetails ? viewTaskDetails.description : ""}
                  </Text>
                </View>
                {/* DUE DATE */}
                <View
                  style={{
                    borderColor: "#FC5858",
                    borderWidth: 1,
                    borderRadius: 20,
                    padding: 5,
                    marginTop: 5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      marginBottom: 10,
                      marginStart: 10,
                    }}
                  >
                    Due Date:{" "}
                  </Text>
                  <Text
                    style={{
                      fontSize: 20,
                      marginBottom: 10,
                      textAlign: "center",
                    }}
                  >
                    {viewTaskDetails ? viewTaskDetails.duedate : ""}
                  </Text>
                </View>
                {/* DUE TIME */}
                <View
                  style={{
                    borderColor: "#FC5858",
                    borderWidth: 1,
                    borderRadius: 20,
                    padding: 5,
                    marginTop: 5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      marginBottom: 10,
                      marginStart: 10,
                    }}
                  >
                    Due Time:{" "}
                  </Text>
                  <Text
                    style={{
                      fontSize: 20,
                      marginBottom: 10,
                      textAlign: "center",
                    }}
                  >
                    {viewTaskDetails ? viewTaskDetails.duetime : ""}
                  </Text>
                </View>
                {/* NOTIF MINS */}
                <View
                  style={{
                    borderColor: "#FC5858",
                    borderWidth: 1,
                    borderRadius: 20,
                    padding: 5,
                    marginTop: 5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      marginBottom: 10,
                      marginStart: 10,
                    }}
                  >
                    Minutes Until Notification:{" "}
                  </Text>
                  <Text
                    style={{
                      fontSize: 20,
                      marginBottom: 10,
                      textAlign: "center",
                    }}
                  >
                    {viewTaskDetails ? viewTaskDetails.mins : ""}
                  </Text>
                </View>
                {/* Submission Item */}
                <View
                  style={{
                    borderColor: "#FC5858",
                    borderWidth: 1,
                    borderRadius: 20,
                    padding: 5,
                    marginTop: 5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      marginBottom: 10,
                      marginStart: 10,
                    }}
                  >
                    Submission Type:{" "}
                  </Text>
                  <Text
                    style={{
                      fontSize: 20,
                      marginBottom: 10,
                      textAlign: "center",
                    }}
                  >
                    {viewTaskDetails ? viewTaskDetails.submission : ""}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignContent: "center",
                  overflow: "hidden",
                }}
              >
                <Pressable
                  style={{
                    backgroundColor: "white",
                    width: "60%",
                    height: 40,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 30,
                    position: "relative",
                    borderColor: "#FB3854",
                    borderWidth: 2,
                  }}
                  onPress={() => setModalViewVisible(!modalViewVisible)}
                >
                  <Text style={{ color: "#FC5858", fontWeight: "bold" }}>
                    Close
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
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
    </>
  );
};

export default ArchiveScreen;
