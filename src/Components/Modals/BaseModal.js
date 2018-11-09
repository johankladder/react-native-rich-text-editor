import React from 'react';
import Modal from 'react-native-modal';
import {Button, StyleSheet, View} from "react-native";

export default class BaseModal extends React.Component {

    render = () => {
        return (
            <Modal
                avoidKeyboard={true}
                isVisible={true}
            >
                <View style={[styles.main]}>
                    <View style={[styles.contentArea]}>
                        {this.props.children}
                    </View>
                    <View style={[styles.buttonsArea]}>
                        <Button
                            title={'Cancel'}
                            color={'red'}
                            onPress={this.props.onCancel.bind(this)}
                        />
                        <Button
                            title={'Submit'}
                            onPress={this.props.onSubmit.bind(this)}
                        />
                    </View>
                </View>
            </Modal>
        )
    }

}

const styles = StyleSheet.create({
    main: {
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },
    contentArea: {
        width: '100%',
        backgroundColor: '#f6f7f8'
    },
    buttonsArea: {
        height: 50,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 20,
        alignItems: 'center'
    },
});