import React, { useEffect ,useState, useCallback} from 'react';
import { Text, View, ScrollView, StyleSheet, Button, Pressable, Dimensions, Image, TextInput, } from 'react-native';
import { useFonts, Poppins_500Medium, Poppins_600SemiBold} from '@expo-google-fonts/poppins';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

const Stack = createNativeStackNavigator();

let count = 0;

//works perfect
const handleSubmit=(text, heading, id)=>{

  console.log(text, id);
  const newNote = {
    _id: id,
    heading: heading,
    text: text
  }
  console.log("Handling submit");
  axios.post('http://192.168.29.196:5001/updatedata', newNote).then(res=>{console.log(res.data)}).catch(e=>{console.log(e);});
}

const addNewNote = (navigation) => {
  axios.post('http://192.168.29.196:5001/adddata')
    .then(res => {
      console.log("ADDING A NEW NOTE, Received from backend:", res.data);
      console.log( res.data.data._id);
      navigation.navigate("NoteScreen", { _id: res.data.data._id });
    })
    .catch(e => console.log("AXIOS ERROR", e));
};

//works perfect
const deletenote=(index)=>{
  console.log("Deleting a note");
  axios
    .delete(`http://192.168.29.196:5001/deletedata/${index}`)
    .then(res => {
      axios.get('http://192.168.29.196:5001/data')
      .then(res => setNotes(res.data));
    })
    .catch(err => console.error('Error deleting note:', err));
}













function NoteScreen({route, navigation}) {
  const [notes, setNotes] = useState([]);
  
  const { _id } = route.params || {};    
  const [text, setText] = useState('');
  const [heading, setHeading] = useState('');
  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_600SemiBold,
  });
  useEffect(() => {
    axios.get('http://192.168.29.196:5001/data')
      .then((response) => {
        setNotes(response.data);
        const foundNote = response.data.find(note => note._id === _id);
        if (foundNote) {
          console.log("Mil gya oyee");
          setText(foundNote.text);
          setHeading(foundNote.heading);
        } else {
          console.log("Note not found");
        }
      })
      .catch((err) => console.error('Error fetching note:', err));
  }, [_id]);
  if (!notes.find(n => n._id === _id)) {
    return <Text>Note not found!</Text>;
  }

  return (
    <View style = {{flex:1}}>
      <ScrollView style={styles.body}>

      <View style={styles.navbar}>
      <Text style = {styles.logo}>MyNotes</Text>
      </View>

      <TextInput style={{fontSize:28, fontWeight:500,  marginLeft:15, marginRight:15, maxWidth: 500, textAlignVertical: 'top',}} multiline={true} value = {heading} placeholder="Title" onChangeText={(newHeading) => { handleSubmit(text, newHeading, _id); setHeading(newHeading); }} />
      <TextInput style={{fontSize:18, padding: 10, marginLeft:10, marginRight:10, maxWidth: 500, textAlignVertical: 'top',}} multiline={true} value = {text} placeholder="Type here..." onChangeText={(newText) => {handleSubmit(newText, heading, _id); setText(newText); }} />

    </ScrollView>

    <View>
      <View style={styles.addoptions}>
      <Image source={require('../../images/gallery.png')} style={{ width: 30, height: 30 }}/>
      <Image source={require('../../images/mic.png')} style={{ width: 30, height: 30 }}/>
      <Image source={require('../../images/file.png')} style={{ width: 30, height: 30 }}/>

      </View>
    </View>
    </View>
  );
}



function HomeScreen() {
  const [notes, setNotes] = useState([]);
  useFocusEffect(
    useCallback(() => {
      axios
        .get('http://192.168.29.196:5001/data')
        .then(res => setNotes(res.data))
        .catch(err => console.error(err));
    }, [])
  );
  useFocusEffect(
    () => {
      Refreshpage(); 
    }
  );
  const Refreshpage = () => {
    axios
      .get('http://192.168.29.196:5001/data')
      .then(res => {
        console.log("Fetched notes:", res.data);
        setNotes(res.data); 
      })
      .catch(err => {
        console.error('Error refreshing notes:', err);
      });
  };
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_600SemiBold
  }); if (!fontsLoaded) {
    return <Text>Loading...</Text>;}
    let isLastNoteEmpty= 0;
    const lastNote = notes[notes.length - 1];
    if(lastNote !=null){
      isLastNoteEmpty =  !lastNote.heading.trim() && !lastNote.text.trim();
    }
    

    
   
  return (
    <View style = {{flex:1}}>
    <ScrollView style={styles.body}>

      
      <View style={styles.navbar}>
      <Text style = {styles.logo}>MyNotes</Text>
      </View>

      {notes.map((note, i) => (
        
          <Pressable key={note._id} onPress={() => navigation.navigate('NoteScreen', { _id: note._id })}>
            <View style={{ flex: 1, flexDirection: "column" }}>
              <View style={styles.note}>
                <View style = {{flex: 1, flexDirection: "row", justifyContent: "space-between"}}>
                <Text style={styles.noteHeading}>{note.heading}</Text>
                <Pressable onPress={()=>{deletenote(note._id);console.log("done")}}><Image source={require('../../images/delete.png')} style={{ width: 20, height: 20, marginEnd:5 }}/></Pressable>
                </View>
                <Text style={styles.noteContent} numberOfLines={3}>{note.text}</Text>
                <View style={styles.borderbottom} />
              </View>
            </View>
          </Pressable>
        ))}
          
    </ScrollView>
      <View style= {{ alignItems:"flex-end", marginEnd:20, position: 'absolute', bottom:40, right: 20, }}>
      <Pressable style={styles.addbtn} onPressIn={()=>{ if (isLastNoteEmpty) {console.log('Last note is empty, cannot add new note');} else {addNewNote(navigation);
}}}>
        <Text style={{color:"white", fontSize:40, fontWeight:400, bottom:3}}>+</Text>
      </Pressable>
      </View>
    </View>
  )}


export default function App() {
  
  return (
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="HomeScreen">
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="NoteScreen" component={NoteScreen} />
      </Stack.Navigator>
  );
}


const styles = StyleSheet.create({
  body:{flex:1, backgroundColor:"#FFECDB"},
  navbar: {backgroundColor:"#131010", minheight:200},
  logo:{color: "white", margin:"5%", fontSize:20, fontWeight:600, fontFamily: 'Poppins_600SemiBold'},
  note:{minheight:100, padding:15, justifyContent:"space-between"},
  noteHeading:{fontSize: 22, fontWeight: 600, fontFamily: 'Poppins_500Medium', marginLeft:40},
  noteContent:{fontSize: 10, fontFamily: 'Poppins_500Medium', marginLeft:40, color:"gray"},
  borderbottom:{width:"90%", borderBottomWidth:2, borderColor:"#d5cabd", alignSelf:"flex-end", marginTop:10},
  addbtn:{backgroundColor:"black", height: 80, width: 80, borderRadius:50, justifyContent:"center", alignItems:"center", shadowColor:"#000"},
  addoptions:{backgroundColor:"white", height: 60, width:Dimensions.get('window').width, justifyContent:"space-around", alignItems:"center", shadowColor:"#000", flexDirection:"row"}
  
})
