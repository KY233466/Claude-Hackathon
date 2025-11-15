import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// 导入页面
import HomeScreen from './screens/HomeScreen';
import ImageScreen from './screens/ImageScreen';
import SearchScreen from './screens/SearchScreen';
import ItemDetailScreen from './screens/ItemDetailScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#ffffff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#e0e0e0',
          },
          headerTintColor: '#1a1a1a',
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
          },
          headerBackTitleVisible: false,
        }}
      >
        {/* 首页 */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false, // 首页隐藏导航栏
          }}
        />

        {/* Image Recognition Screen */}
        <Stack.Screen
          name="ImageScreen"
          component={ImageScreen}
          options={{
            title: 'Scan Item',
          }}
        />

        {/* Semantic Search Screen */}
        <Stack.Screen
          name="SearchScreen"
          component={SearchScreen}
          options={{
            title: 'Search Items',
          }}
        />

        {/* Item Detail Screen */}
        <Stack.Screen
          name="ItemDetail"
          component={ItemDetailScreen}
          options={{
            title: 'Item Details',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
