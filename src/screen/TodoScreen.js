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
import {
  deleteItem,
  initDatabase,
  updateItem,
  getUncheckedItems,
  updateItemStatus,
} from "./Database";
import { LinearGradient } from "expo-linear-gradient";
import BottomNavigation from "../navigation/BottomNav";
import { SwipeListView } from "react-native-swipe-list-view";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const TodoScreen = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
  const [deleteConfirmTodo, setDeleteConfirmTodo] = useState(null);
  const [modalViewVisible, setModalViewVisible] = useState(false);
  const [viewTaskDetails, setViewTaskDetails] = useState(null);
  const [scheduledNotifications, setScheduledNotifications] = useState({});

  const { height, width } = Dimensions.get("window");
  const taskCon = height / 1.5;

  const fetchItems = useCallback(() => {
    getUncheckedItems((items) => {
      setItems(items);
    });
  }, []);

  useEffect(() => {
    initDatabase();
    fetchItems();
    const unsubscribe = navigation.addListener("focus", () => {
      fetchItems();
    });
    return unsubscribe;
  }, []);

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

  useEffect(() => {
    const requestNotificationPermissions = async () => {
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission to receive notifications was denied");
        }
      } catch (error) {
        console.error("Error requesting notification permissions: ", error);
      }
    };

    requestNotificationPermissions();
  }, []);

  useEffect(() => {
    const checkDueNotifications = async () => {
      try {
        const notificationsToSchedule = [];
        items.forEach((item) => {
          // Skip checked tasks
          if (item.status == "checked") {
            return;
          }

          const taskId = item.id;
          if (!scheduledNotifications[taskId]) {
            const dueDate = new Date(item.duedate).getDate();
            const currentDate = new Date().getDate();

            if (currentDate === dueDate) {
              notificationsToSchedule.push(scheduleDateNotification(item));
              notificationsToSchedule.push(scheduleTimeNotification(item));

              setScheduledNotifications((prevState) => ({
                ...prevState,
                [taskId]: true,
              }));
            }
          }
        });

        await Promise.all(notificationsToSchedule);
      } catch (error) {
        console.error("Error scheduling notifications: ", error);
      }
    };

    checkDueNotifications();
  }, [items]);

  const scheduleDateNotification = async (item) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Task Reminder",
          body: `Your task "${item.name}" is due today!`,
        },
        trigger: null,
      });
    } catch (error) {
      console.error("Error scheduling notification:", error);
    }
  };

  const scheduleTimeNotification = async (item) => {
    try {
      const duetime = item.duetime;
      const [hours, minutes, seconds] = duetime.split(":");
      
      let notifMinutes = minutes - item.mins;
  
      // Ensure notifMinutes is within the valid range (0-59)
      if (notifMinutes < 0) {
        notifMinutes = 0;
      } else if (notifMinutes > 59) {
        notifMinutes = 59;
      }
  
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Task Reminder",
          body: `Your task "${item.name}" deadline is in "${item.mins}" minutes.!`,
        },
        trigger: {
          hour: parseInt(hours),
          minute: notifMinutes,
          repeats: true
        }
      });
    } catch (error) {
      console.error("Error scheduling notification:", error);
    }
  };

  const renderTodoItem = ({ item, index }) => (
    <View style={{ marginBottom: 10 }}>
      <SwipeListView
        data={[item]}
        renderItem={(data, rowMap) => (
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 4,
              width: "100%",
              justifyContent: "center",
              padding: 5,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Checkbox
                status="unchecked"
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
                    "checked",
                    () => {
                      fetchItems();
                    }
                  );
                }}
              />
              <View style={{ flex: 1, paddingStart: 10 }}>
                <Text
                  style={{
                    color: "black",
                    fontSize: 30,
                    fontWeight: "800",
                    marginBottom: 6,
                  }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {data.item.name}
                </Text>
                <Text style={{ color: "gray", fontSize: 12 }}>
                  DUE DATE: {data.item.duedate}
                </Text>
                <Text style={{ color: "gray", fontSize: 12 }}>
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
            <Pressable
              style={{
                backgroundColor: "#f39c12",
                width: 60,
                height: 100,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconButton
                style={{ margin: 0, backgroundColor: "#f39c12", marginEnd: 5 }}
                icon="pencil"
                iconColor="black"
                onPress={() =>
                  navigation.navigate("Edit", { itemId: data.item.id })
                }
              />
            </Pressable>
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
        rightOpenValue={-120}
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
            TASKS
          </Text>
        </View>
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
                  Begin adding tasks by pressing the + button!
                </Text>
              }
            />
          </View>
        </LinearGradient>

        {/* Add Button */}
        <Pressable
          style={{ position: "absolute", bottom: 1, right: 1 }}
          onPress={() => navigation.navigate("Add")}
        >
          <View
            style={{
              backgroundColor: "#FC5858",
              width: 80,
              height: 80,
              borderRadius: 80,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 7,
              borderColor: "white",
              bottom: 8,
              right: 8,
            }}
          >
            <Text style={{ fontSize: 50, color: "white" }}>+</Text>
          </View>
        </Pressable>

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
                    style={{ fontSize: 20, marginBottom: 10, marginStart: 10 }}
                  >
                    Title:{" "}
                  </Text>
                  <Text
                    style={{
                      fontSize: 35,
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
                    style={{ fontSize: 20, marginBottom: 10, marginStart: 10 }}
                  >
                    Description:{" "}
                  </Text>
                  <Text
                    style={{
                      fontSize: 35,
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
                    style={{ fontSize: 20, marginBottom: 10, marginStart: 10 }}
                  >
                    Due Date:{" "}
                  </Text>
                  <Text
                    style={{
                      fontSize: 35,
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
                    style={{ fontSize: 20, marginBottom: 10, marginStart: 10 }}
                  >
                    Due Time:{" "}
                  </Text>
                  <Text
                    style={{
                      fontSize: 35,
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
                    style={{ fontSize: 20, marginBottom: 10, marginStart: 10 }}
                  >
                    Minutes Until Notification:{" "}
                  </Text>
                  <Text
                    style={{
                      fontSize: 35,
                      marginBottom: 10,
                      textAlign: "center",
                    }}
                  >
                    {viewTaskDetails ? viewTaskDetails.mins : ""}
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

export default TodoScreen;
