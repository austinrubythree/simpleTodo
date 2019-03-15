/**
 * @format
 */

import React, { Component } from 'react';
import {AppRegistry, Platform, StyleSheet, Text, View, FlatList, 
    AsyncStorage, Button, TextInput, Keyboard} from 'react-native';

const isAndroid = Platform.OS == 'android';
const viewPadding = 10;

export default class TodoList extends Component {
    state= {
        tasks: [],
        text: ""
    };

    changeTextHandler = text => {
        this.setState({
            text: text
        });
    };

    addTask = () => {
        let notEmpty = this.state.text.trim().length > 0;
        
        if(notEmpty){
            this.setState(
                prevState => {
                    let { tasks, text } = prevState;
                    return {
                        tasks: tasks.concat({
                            key: tasks.length,
                            text:text
                        }),
                        text: ""
                    };
                },
                () => Tasks.save(this.state.tasks)
            );
        }
    };

    deleteTask = i => {
        this.setState(
            prevState => {
                let tasks = prevState.tasks.slice();

                tasks.splice(i, 1);

                return { tasks: tasks };
            },
            () => Tasks.save(this.state.tasks)
        );
    };

    componentDidMount() {
        Keyboard.addListener(
            isAndroid ? "keyboardDidShow" : "keyboardWillShow",
            e => this.setState({ 
                viewMargin: e.endCoordinates.height + viewPadding
            })
        );

        Keyboard.addListener(
            isAndroid ? "keyboardDidHide" : "keyboardWillHide",
            () => this.setState({ viewmargin: viewPadding})
            );
            Tasks.all(tasks => this.setState({task: tasks || [] }));
    }


    render(){
        return(
            <View style = {[styles.container, { paddingBottom: this.state.viewMargin }]}>

            <FlatList
                style = {styles.list}
                data = {this.state.tasks}
                renderItem = { ({item, index}) => 
                    <View>
                        <View style = {styles.listItemCont}>
                            <Text style = {styles.listItem}>
                                {item.text}
                            </Text>
                            <Button title = "X" onPress = {() => this.deleteTask(index)} />
                        </View>
                         <View style = {styles.hr}/>
                    </View>} 
                />

                <TextInput
                    style ={styles.textInput}
                    onChangeText = {this.changeTextHandler}
                    onSubmitEditing = { this.addTask}
                    value = { this.state.text }
                    placeholder = "Add Tasks"
                    returnKeyType = "done"
                    returnkeyLabel = "done"
                />
            </View>
        );
    }
}

let Tasks = {
    convertToArrayOfObject(tasks, callback){
        return callback(
            tasks ? tasks.split("||").map((task, i) => ({key: i, text: task})) : []
        );
    },
    convertToStringWithSeperators(tasks){
        return tasks.map(task => task.text).join("||");
    },
    all(callback){
        return AsyncStorage.getItem("TASKS", (err, tasks) =>
            this.convertToArrayOfObject(tasks, callback)
        );
    },
    save(tasks){
        AsyncStorage.setItem("TASKS", this.convertToStringWithSeperators(tasks));
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF",
        padding: viewPadding,
        paddingTop: 20
    },
    list: {
        width: "100%"
    },
    listItem: {
        paddingTop: 2,
        paddingBottom: 2,
        fontSize: 18
    },
    hr: {
        height: 1,
        backgroundColor: "grey"
        },
    listItemCont: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    textinput: {
        height: 40,
        paddingRight: 10,
        paddingLeft: 10,
        borderColor: "grey",
        borderWidth: isAndroid ? 0 : 1,
        width: "100%"
    }
});




AppRegistry.registerComponent('simpleTodo', () => TodoList);
