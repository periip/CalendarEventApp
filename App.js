import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Dimensions, Switch, FlatList, TouchableOpacity, Modal, TextInput, Alert, SafeAreaView, TouchableWithoutFeedback, Keyboard } from "react-native";
import * as Calendar from "expo-calendar";
import DateTimePicker from "@react-native-community/datetimepicker";
import EventButton from './components/EventButton.js'

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function App() {
  const [mounted, setMounted] = useState(false)
  const [events, setEvents] = useState([])
  const [id, setId] = useState()
  const [pressed, setPressed] = useState(false)
  const [dateCheck, setDateCheck] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [title, onChangeTitle] = useState("");
  const [notes, onChangeNotes] = useState("")
  const [location, onChangeLocation] = useState("")
  const [startCalendarDate, setStartCalendarDate] = useState(new Date());
  const [endCalendarDate, setEndCalendarDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() + 1)))
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date())
  const [eventID, setEventID] = useState()
  const [isAllDay, setIsAllDay] = useState(false);
  
  const onChangeStart = (event, selectedDate) => {
    setStartDate(selectedDate);
  };

  const onChangeEnd = (event, selectedDate) => {
    setEndDate(selectedDate)
  }

  const onChangeStartCalendar = (event, selectedDate) => {
    setStartCalendarDate(selectedDate);
  };
  
  const onChangeEndCalendar = (event, selectedDate) => {
    setEndCalendarDate(selectedDate);
  };

  function closeModal() {
    setModalVisible(false)
    onChangeTitle("")
    onChangeNotes("")
    onChangeLocation("")
    setEventID("")
    setStartDate(new Date())
    setEndDate(new Date())
  }
  
  const toggleSwitch = () => setIsAllDay((previousState) => !previousState);

  useEffect(() => {
    
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        const calendar = await Calendar.getDefaultCalendarAsync()
        setId(calendar.id)
        /* const calendars = await Calendar.getCalendarsAsync(
          Calendar.EntityTypes.EVENT

          -Gets all calendars (including the other pre-installed calendars)
        ); */

        const tempEvents = await Calendar.getEventsAsync(
          [calendar.id],
          startCalendarDate,
          endCalendarDate
        );
        setEvents(tempEvents)

        /* console.log("Here are all your calendars:");
        console.log({ calendar }); */

        /* console.log("----------------------------EVENTS-----------------------------------")
        console.log({ tempEvents }) */
      }
    })();

    setMounted(true)
  }, [modalVisible, startCalendarDate, endCalendarDate]);

  useEffect(() => {
    if (compareDate(startDate, endDate)) {
      setDateCheck(true)
    } else {
      setDateCheck(false)
    }

    if (compareDate(startCalendarDate, endCalendarDate)) {
      alert("Make sure your start window date is before the end window date");
    }
  }, [startCalendarDate, endCalendarDate, startDate, endDate])

  function editEvent(title, notes, location, startDate, endDate, allDay, eventID) {
    onChangeTitle(title);
    onChangeNotes(notes);
    onChangeLocation(location);
    setStartDate(new Date(startDate));
    setEndDate(new Date(endDate));
    setEventID(eventID)
    setIsAllDay(allDay)
    setModalVisible(true);
  }

  async function updateEvent() { 
    if (!dateCheck) {
      let properties = {
        title: title,
        notes: notes,
        location: location
      } 

      let details = {
        startDate: startDate,
        endDate: endDate,
        allDay: isAllDay,
      };

      for (let x in properties) { //note to self: for (let x in obj), the variable (x) is the object's property's name not an index
        if (properties[x]) {
          details[x] = properties[x];
        }
      }

      await Calendar.updateEventAsync(eventID, details);
      setModalVisible(false);

    } else {
      alert("Make sure your start date is before the end date")
    }
  }

  const renderItem = ({ item }) => {
    if (mounted) {
      return (
        <EventButton
          title={item.title}
          notes={item.notes}
          location={item.location}
          startDate={item.startDate}
          endDate={item.endDate}
          eventID={item.id}
          editEvent={editEvent}
          allDay={item.allDay}
          pressed={pressed}
        />
      );
    } 
  };

  function compareDate(date1, date2) {
    return date1 > date2
  }

  async function createEvent() { 
    if (!dateCheck) {
      await Calendar.createEventAsync(id, {
        title: title,
        startDate: startDate,
        endDate: endDate,
        location: location,
        notes: notes,
        allDay: isAllDay,
      });
      setModalVisible(false);
    } else {
      alert("Make sure your start date is before the end date")
    }
  }

  function confirmDelete() {
    return Alert.alert(
      "Are you sure?",
      "Forever lost in the abyss if deleted",
      [
        {
          text: "Yes",
          onPress: () => deleteEvent()
        },
        {
          text: "No",
        },
      ]
    );
  }

  async function deleteEvent() {
    console.log("lol you thought (placeholder)")
    // await Calendar.deleteEventAsync(eventID)
    setModalVisible(false)
  }

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={[styles.container, { backgroundColor: "rgba(0,0,0,.15)" }]}>
            <View style={styles.modalView}>
              <View style={styles.buttonContainer}>
                <View style={styles.leftContainer}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => closeModal()}
                  >
                    <Text style={styles.buttonText}> Cancel </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.rightContainer}>
                  <TouchableOpacity
                    style={{ ...styles.button, alignItems: "flex-end" }}
                    onPress={pressed ? updateEvent : createEvent}
                  >
                    <Text style={styles.buttonText}> Done </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.textInput}
                  onChangeText={onChangeTitle}
                  value={title}
                  placeholder="Title"
                />
              </View>

              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.textInput}
                  onChangeText={onChangeLocation}
                  value={location}
                  placeholder="Location"
                />
              </View>

              <View style={styles.switchContainer}>
                <View
                  style={{ ...styles.leftContainer, justifyContent: "center"}}
                >
                  <Text style={styles.showDateText}>All-Day</Text>
                </View>
                <View
                  style={{ ...styles.rightContainer, justifyContent: "center"}}
                >
                  <Switch
                    trackColor={{ false: "#767577", true: "#642CA9" }}
                    thumbColor={"#E5D9F2"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isAllDay}
                  />
                </View>
              </View>
              <View style={styles.calendarPickerContainer}>
                <View
                  style={{ ...styles.leftContainer, justifyContent: "center", width: '25%' }}
                >
                  <Text style={styles.showDateText}>Start</Text>
                </View>

                <View
                  style={{ ...styles.rightContainer, width: '75%' }}
                >
                  <View style={styles.calendarButton}>
                    <DateTimePicker
                      value={startDate}
                      mode={"datetime"}
                      is24Hour={false}
                      onChange={onChangeStart}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.calendarPickerContainer}>
                <View
                  style={{ ...styles.leftContainer, justifyContent: "center", width: '25%' }}
                >
                  <Text style={styles.showDateText}>End</Text>
                </View>

                <View
                  style={{ ...styles.rightContainer, width: '75%' }}
                >
                  <View style={styles.calendarButton}>
                    <DateTimePicker
                      value={endDate}
                      mode={"datetime"}
                      is24Hour={false}
                      onChange={onChangeEnd}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.notesInputContainer}>
                <TextInput
                  multiline
                  style={styles.textInput}
                  onChangeText={onChangeNotes}
                  value={notes}
                  placeholder="Notes"
                />
              </View>
            </View>
            {pressed ? (
              <View style={styles.deleteButtonContainer}>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => confirmDelete()}
                >
                  <Text style={styles.deleteButtonText}> Delete Event </Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Your Upcoming Events</Text>
        </View>

        <View style={styles.showDateContainer}>
          <View
            style={{ ...styles.showDate, width: "35%", alignItems: "center" }}
          >
            <Text style={styles.showDateText}> Show events from </Text>
          </View>

          <View style={styles.showDate}>
            <DateTimePicker
              value={startCalendarDate}
              mode={"date"}
              is24Hour={false}
              themeVariant="dark"
              onChange={onChangeStartCalendar}
            />
          </View>

          <View
            style={{ ...styles.showDate, width: "10%", alignItems: "flex-end" }}
          >
            <Text style={styles.showDateText}> to </Text>
          </View>

          <View style={styles.showDate}>
            <DateTimePicker
              value={endCalendarDate}
              mode={"date"}
              is24Hour={false}
              themeVariant="dark"
              onChange={onChangeEndCalendar}
            />
          </View>
        </View>
        <View style={{ ...styles.buttonContainer, height: "25%" }}>
          <View style={styles.leftContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setPressed(!pressed)}
            >
              <Text style={styles.buttonText}>
                {pressed ? "Cancel" : "Edit"}
              </Text>
            </TouchableOpacity>
          </View>
          {pressed ? null : (
            <View style={styles.rightContainer}>
              <TouchableOpacity
                style={{ ...styles.button, alignItems: "flex-end" }}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.buttonText}> + </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <View style={styles.list}>
        <FlatList
          data={events}
          renderItem={renderItem}
          keyExtractor={({ id }, index) => id}
          scrollEnabled={true}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7371FC",
  },
  headerContainer: {
    height: "18%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    width: "100%",
    height: "82%",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  header: {
    height: "45%",
    width: "100%",
    justifyContent: "center",
    paddingLeft: screenWidth * 0.025,
  },
  headerText: {
    fontSize: 30,
    color: "#F5EFFF",
    fontWeight: "bold",
  },
  buttonText: {
    color: "#E5D9F2",
    fontSize: 20,
  },
  calendarButton: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
  },
  button: {
    height: "100%",
    width: "50%",
    justifyContent: "center",
  },
  modalView: {
    height: "60%",
    width: "80%",
    alignItems: "center",
    backgroundColor: "#BE9FE1",
    borderRadius: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
  deleteButtonContainer: {
    width: "80%",
    height: "6%",
    backgroundColor: "#BE9FE1",
    borderRadius: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
  deleteButton: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#642CA9",
    fontWeight: "bold",
    fontSize: 17,
  },
  showDateContainer: {
    height: "30%",
    width: "100%",
    flexDirection: "row",
  },
  showDate: {
    height: "100%",
    width: "25%",
    justifyContent: "center",
    paddingLeft: screenWidth * 0.025,
  },
  showDateText: {
    color: "#E5D9F2",
    fontSize: 16.5,
  },
  buttonContainer: {
    height: "10%",
    width: "100%",
    flexDirection: "row",
  },
  textInputContainer: {
    height: "10%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  notesInputContainer: {
    height: "40%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    height: "90%",
    width: "80%",
    color: "#352D39",
    borderWidth: 1,
    padding: screenWidth * 0.025,
    borderRadius: 10,
    borderColor: "#CDC1FF",
  },
  calendarPickerContainer: {
    height: "10%",
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  switchContainer: {
    height: "10%",
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  leftContainer: {
    left: 0,
    width: "50%",
    height: "100%",
    paddingLeft: screenWidth * 0.04672897196,
  },
  rightContainer: {
    right: 0,
    width: "50%",
    height: "100%",
    alignItems: "flex-end",
    paddingRight: screenWidth * 0.04672897196,
  },
});
