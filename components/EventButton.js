import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { AntDesign } from "@expo/vector-icons"; 

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function EventButton(props) {
  function fetchDate(date) { 
    let d = new Date(date)
    let temp = (d.getMonth() + 1) + "/" + d.getDate() + "/" + String(d.getFullYear()).substring(2)
    return temp
  }

  function fetchTime(date) {
    let d = new Date(date);
    let hours = d.getHours();
    let minutes = d.getMinutes();
    let ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  }

  if (props.pressed) {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => props.editEvent(props.title, props.notes, props.location, props.startDate, props.endDate, props.allDay, props.eventID)}
      >
        <View style={styles.titleContainer}>
          <View style={{...styles.leftContainer, width: '85%'}}>
            <Text style={styles.titleText} numberOfLines={1}>{props.title}</Text>
          </View>
          <View style={{...styles.rightContainer, width: '15%'}}>
            <AntDesign name="caretright" size={24} color="#E5D9F2" />
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.dateTimeLocText}>
            {fetchDate(props.startDate)}{" "}
            {fetchDate(props.startDate) != fetchDate(props.endDate)
              ? "- " + fetchDate(props.endDate) || ""
              : ""}
          </Text>
          {props.allDay ? (
            <Text style={styles.dateTimeLocText}>All-Day</Text>
          ) : (
            <Text style={styles.dateTimeLocText}>
              {fetchTime(props.startDate)} - {fetchTime(props.endDate)}
            </Text>
          )}
          <Text style={styles.dateTimeLocText} numberOfLines={1}>{props.location}</Text> 
          <Text style={styles.notesText} numberOfLines={2}>{props.notes}</Text>
        </View>
      </TouchableOpacity>
    );
  } else {
    return (
      <View style={styles.item}>
        <View style={{...styles.titleContainer, justifyContent: 'flex-start', alignItems: 'flex-start'}}>
          <Text style={styles.titleText} numberOfLines={1}>{props.title}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.dateTimeLocText}>
            {fetchDate(props.startDate)}{" "}
            {fetchDate(props.startDate) != fetchDate(props.endDate)
              ? "- " + fetchDate(props.endDate) || ""
              : ""}
          </Text>
          {props.allDay ? (
            <Text style={styles.dateTimeLocText}>All-Day</Text>
          ) : (
            <Text style={styles.dateTimeLocText}>
              {fetchTime(props.startDate)} - {fetchTime(props.endDate)}
            </Text>
          )}
          <Text style={styles.dateTimeLocText} numberOfLines={1}>{props.location}</Text>
          <Text style={styles.notesText} numberOfLines={2}>{props.notes}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  titleContainer: {
    height: "15%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    alignItems: "flex-start",
    borderWidth: 2,
    borderColor: "#CDC1FF",
    height: screenHeight * 0.85 * 0.18,
    width: screenWidth * 0.95,
    marginBottom: screenHeight * 0.02,
    marginLeft: screenWidth * 0.025,
    marginRight: screenWidth * 0.025,
    borderRadius: 10,
    padding: screenWidth * 0.025,
    backgroundColor: "#A594F9",
  },
  notesText: {
    color: "#575366",
  },
  titleContainer: {
    height: "25%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  titleText: {
    fontSize: 20,
    color: "#E5D9F2",
    fontWeight: "bold",
  },
  infoContainer: {
    height: '75%',
    width: '100%'
  },
  dateTimeLocText: {
    color: "#13293D",
  },
  leftContainer: {
    left: 0,
    width: "50%",
    height: "100%",
  },
  rightContainer: {
    right: 0,
    width: "50%",
    height: "100%",
    alignItems: "flex-end",
    paddingRight: screenWidth * 0.04672897196,
  },
});
