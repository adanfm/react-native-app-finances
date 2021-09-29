import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { Dashboard } from '../screens/Dashboard';
import { Register } from '../screens/Register';
import theme from "../global/styles/theme";
import {Platform} from "react-native";

const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoutes() {
  return (
    <Navigator screenOptions={{
      tabBarActiveTintColor: theme.colors.secondary,
      tabBarInactiveTintColor: theme.colors.text,
      tabBarLabelPosition: 'beside-icon',
      headerShown: false,
      tabBarStyle: {
        paddingVertical: Platform.OS === 'ios' ? 20 : 0,
        height: 60,
      }
    }}>
      <Screen name="Listagem" component={Dashboard} options={{
        tabBarIcon: (({ size, color }) => (
          <MaterialIcons size={size} color={color} name="format-list-bulleted"/>
        ))
      }}/>
      <Screen name="Cadastrar" component={Register} options={{
        tabBarIcon: (({ size, color }) => (
          <MaterialIcons size={size} color={color} name="attach-money"/>
        ))
      }}/>
      <Screen name="Resumo" component={Register} options={{
        tabBarIcon: (({ size, color }) => (
          <MaterialIcons size={size} color={color} name="pie-chart"/>
        ))
      }}/>
    </Navigator>
  );
}
