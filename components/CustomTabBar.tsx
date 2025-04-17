import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';


const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  const iconMap: Record<string, string> = {
    Home: 'home',
    Packs: 'grid',
    Favorites: 'heart',
    More: 'menu',
  };

  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const iconName = iconMap[route.name] || 'ellipse';

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              onPress={() => navigation.navigate(route.name)}
              style={styles.tabButton}
            >
              <View style={[
                styles.iconWrapper,
                isFocused && styles.focusedIconWrapper,
              ]}>
                <Icon
                  name={isFocused ? iconName : `${iconName}-outline`}
                  size={22}
                  color={isFocused ? 'black' : 'white'}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#202124',
    borderRadius: 40,
    paddingHorizontal: 20,
    paddingVertical: 12,
    width: '80%',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    // transition: 'all 0.3s ease',  // Removed invalid property for React Native
  },
  focusedIconWrapper: {
    backgroundColor: 'white',
    borderRadius: 22,  // Ensure that the border radius is maintained during focus
  },
});

export default CustomTabBar;
