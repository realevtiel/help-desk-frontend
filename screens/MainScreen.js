import React, { useState } from "react";
import axios from "axios";
import { View, StyleSheet, Button, Image, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { HelperText } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextInput, Card, Title } from "react-native-paper";

const MainScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);

  const initialValues = { name: "", email: "", description: "" };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    description: Yup.string().required("Description is required"),
  });

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.canceled) {
      console.log("User cancelled image picker");
    } else {
      const imageUri = result.assets && result.assets[0].uri;
      if (imageUri) {
        setImage({ uri: imageUri });
      }
    }
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("description", values.description);

    if (image) {
      try {
        const response = await fetch(image.uri);
        const blob = await response.blob();
        formData.append("photo", blob);
      } catch (error) {
        console.error("Error while fetching the image:", error);
      }
    }

    console.log("FormData:", Array.from(formData));

    try {
      const response = await axios.post(
        "https://boiling-garden-12959-fce2b00bce97.herokuapp.com/api/tickets",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      navigation.navigate("Admin");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Help Desk</Title>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View>
                <TextInput
                  label="Name"
                  style={styles.input}
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  value={values.name}
                  error={touched.name && errors.name}
                />
                <HelperText
                  style={styles.errorMessage}
                  type="error"
                  visible={touched.name && errors.name}
                >
                  {errors.name}
                </HelperText>
                <TextInput
                  label="Email"
                  style={styles.input}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  error={touched.email && errors.email}
                />
                <HelperText
                  style={styles.errorMessage}
                  type="error"
                  visible={touched.email && errors.email}
                >
                  {errors.email}
                </HelperText>
                <Button
                  title="Select Photo"
                  onPress={handleImagePicker}
                  style={styles.button}
                />
                {image && <Image source={image} style={styles.image} />}
                <TextInput
                  label="Description"
                  onChangeText={handleChange("description")}
                  onBlur={handleBlur("description")}
                  value={values.description}
                  style={[styles.input, styles.descriptionInput]}
                  error={touched.description && errors.description}
                  multiline
                  numberOfLines={4}
                />
                <HelperText
                  style={styles.errorMessage}
                  type="error"
                  visible={touched.description && errors.description}
                >
                  {errors.description}
                </HelperText>
                <Button
                  style={styles.button}
                  onPress={handleSubmit}
                  title="Submit"
                />
              </View>
            )}
          </Formik>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 500,
    padding: 16,
    elevation: 4,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#6200ee",
  },
  input: {
    marginBottom: 10,
    backgroundColor: "white",
  },
  descriptionInput: {
    height: 100,
  },
  errorMessage: {
    marginBottom: 15,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    alignSelf: "center",
    marginVertical: 10,
  },
});

export default MainScreen;
