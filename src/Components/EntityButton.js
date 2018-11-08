import React from 'react';
import {StyleSheet, View} from 'react-native';

export default class EntityButton extends React.Component {

    /**
     * @override
     */
    render = () => {
        return (
            <View style={[styles.button, this.props.style]}>
                {this.props.children}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    button: {
        height: 50,
        width: 50,
    }
});