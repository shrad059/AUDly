import { StatusBar } from 'expo-status-bar';
import { Text, View, TouchableOpacity,StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AUDly</Text>
      <StatusBar style="auto" />
      <Link href="/login" style={styles.link}>
        <Text style={styles.linkText}>Login/SignUp</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ebeccf',
    padding: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    fontFamily: 'Roboto', 
  },
  link: {
    
    paddingVertical: 15,
    paddingHorizontal: 35,
    backgroundColor: '#59885d', 
    borderRadius: "30px",
    alignItems: 'center',
    marginTop: 20,
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 5 },  
    shadowOpacity: 0.3, 
    shadowRadius: 10, 
  },
  linkText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
});
