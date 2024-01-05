import React, { useState, useRef } from "react";
import { View, Text, TextInput, StyleSheet, Button, Modal } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import ConfettiCannon from "react-native-confetti-cannon";

const TicketDetailScreen = ({ route }) => {
  const { ticket } = route.params;
  const [status, setStatus] = useState(ticket.status);
  const [response, setResponse] = useState("");
  const [currentResponse, setCurrentResponse] = useState(ticket.response || "");
  const [isModalVisible, setModalVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiRef = useRef();

  const handleSubmit = async () => {
    const updatedTicket = {
      ...ticket,
      status,
      response,
    };

    try {
      const fetchResponse = await fetch(
        `https://boiling-garden-12959-fce2b00bce97.herokuapp.com/api/tickets/${ticket._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTicket),
        }
      );

      if (!fetchResponse.ok) {
        throw new Error("Network response was not ok");
      }

      setModalVisible(true);
      setCurrentResponse(response);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    } catch (error) {
      console.error("There was a problem with the submit operation:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{ticket.name}</Text>
      <Text style={styles.email}>{ticket.email}</Text>
      <Text style={styles.info}>{ticket.description}</Text>
      <Text style={styles.label}>Status:</Text>
      <RNPickerSelect
        onValueChange={(value) => setStatus(value)}
        items={[
          { label: "New", value: "new" },
          { label: "In Progress", value: "in progress" },
          { label: "Resolved", value: "resolved" },
        ]}
        style={pickerSelectStyles}
        value={status}
      />
      {currentResponse && (
        <View>
          <Text style={styles.label}>Previous response:</Text>
          <Text style={styles.previousResponse}>{currentResponse}</Text>
        </View>
      )}
      <Text style={styles.label}>Response:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setResponse}
        value={response}
        multiline
        placeholder="Type your response here"
      />
      <Button title="Submit" onPress={handleSubmit} />
      <Modal
        animationType="slide"
        transparent={false}
        visible={isModalVisible}
        onRequestClose={() => {
          setModalVisible(!isModalVisible);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Ticket Details:</Text>
          <Text>Name: {ticket.name}</Text>
          <Text>Email: {ticket.email}</Text>
          <Text>Description: {ticket.description}</Text>
          <Text>Status: {status}</Text>
          <Text>Response: {currentResponse}</Text>
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
        {showConfetti && (
          <ConfettiCannon
            count={300}
            origin={{ x: -10, y: 0 }}
            ref={confettiRef}
          />
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  email: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
  },
  previousResponse: {
    padding: 10,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 5,
    height: 200,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    backgroundColor: "white",
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30,
    marginTop: 10,
  },
  inputAndroid: {
    backgroundColor: "white",
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: "black",
    paddingRight: 30,
    marginTop: 10,
  },
});

export default TicketDetailScreen;
