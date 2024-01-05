import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Button } from "react-native";
import MainScreen from "./screens/MainScreen";
import AdminScreen from "./screens/AdminScreen";
import TicketDetailScreen from "./screens/TicketDetailScreen";

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={({ navigation }) => ({
            headerRight: () => (
              <Button
                onPress={() => navigation.navigate("Admin")}
                title="Dashboard"
                color="#000"
              />
            ),
          })}
        />
        <Stack.Screen
          name="Admin"
          component={AdminScreen}
          options={({ navigation }) => ({
            headerLeft: () => (
              <Button
                onPress={() => navigation.navigate("Main")}
                title="Raise a Ticket"
                color="#000"
              />
            ),
          })}
        />
        <Stack.Screen name="TicketDetail" component={TicketDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
