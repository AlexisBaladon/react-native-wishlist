import React, { useRef, useState } from 'react'
import { Modal, View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, ScrollView } from 'react-native';
import { MAIN_COLOR } from '../../constants/styles';
import getUniqueId from '../../helpers/idProvider';
import { getItemImagesIds } from '../../helpers/imageHandler';
import DtItem from '../../interfaces/item';
import ImageSlider from './imageSlider';

interface IProps {
    modalVisible: boolean,
    setModalVisible(visible: boolean): void;
    addItem(item: DtItem): void;
}

const CreatorModal: React.FC<IProps> = ({modalVisible, setModalVisible, addItem}) => {
    const MAX_TITLE_LENGTH = 20;
    const MAX_DESCRIPTION_LENGTH = 100;
    const MAX_PRICE_LENGTH = 10;
    const MAX_AMOUNT_LENGTH = 10;

    const titleRef = useRef<string>('');
    const descriptionRef = useRef<string>('');
    const priceDollarsRef = useRef<string>('');
    const amountRef = useRef<string>('');
    const imageURLRef = useRef<string>('');
    
    const sanitizeInputs = (): DtItem => {
        let title = titleRef.current;
        let priceDollars: string | number = priceDollarsRef.current;
        let amount: string | number = amountRef.current;

        if (!title.length) title = 'Item';
        if (!priceDollars.length) priceDollars = 0;
        priceDollars = +priceDollars;
        if (Number.isNaN(priceDollars)) priceDollars = 0;
        if (!amount.length) amount = 0;
        amount = +amount;
        if (Number.isNaN(amount)) amount = 0;

        return {
            id: getUniqueId(),
            title: title,
            description: descriptionRef.current,
            priceDollars: priceDollars,
            amount: amount,
            imageURL: imageURLRef.current,
        }
    }

    const cleanRefs = () => {
        titleRef.current = '';
        descriptionRef.current = '';
        priceDollarsRef.current = '';
        amountRef.current = '';
        imageURLRef.current = '';
    }

    const handleCreateItem = () => {
        const item = sanitizeInputs();
        setModalVisible(!modalVisible);
        cleanRefs();
        addItem(item);
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {setModalVisible(!modalVisible)}}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(!modalVisible)}>
                        <Text style={[styles.textStyle, styles.closeButtonText]}>x</Text>
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.title}>Agregar item</Text>
                        <ScrollView>
                            <View style={styles.inputTitleContainer}>
                                <Text style={styles.subtitle}>Imagen:</Text>
                                <ImageSlider imageUrlRef={imageURLRef} />
                            </View>
                            <View style={styles.inputTitleContainer}>
                                <Text style={styles.subtitle}>Nombre</Text>
                                <TextInput 
                                    style={styles.inputBox}
                                    defaultValue=''
                                    placeholder='...' 
                                    onChange={e => titleRef.current = e.nativeEvent.text}
                                    maxLength={MAX_TITLE_LENGTH}
                                    keyboardType='default'
                                />
                            </View>
                            <View style={styles.inputTitleContainer}>
                                <Text style={styles.subtitle}>Descripción</Text>
                                <TextInput
                                    style={styles.inputBox}
                                    defaultValue=''
                                    placeholder='...'
                                    multiline = {true}
                                    numberOfLines = {2}
                                    onChange={e => descriptionRef.current = e.nativeEvent.text}
                                    maxLength={MAX_DESCRIPTION_LENGTH}
                                />
                            </View>
                            <View style={[styles.doubleInput, styles.inputTitleContainer]}>
                                <View style={styles.doubleInputColumn}>
                                    <Text style={styles.subtitle}>Precio</Text>
                                    <TextInput
                                        style={[styles.inputBox, styles.priceInput]} 
                                        defaultValue='0' 
                                        placeholder='US$' 
                                        onChange={e => priceDollarsRef.current = e.nativeEvent.text}
                                        maxLength={MAX_PRICE_LENGTH}
                                        keyboardType='numeric'
                                    />
                                </View>
                                <View style={styles.doubleInputColumn}>
                                    <Text style={styles.subtitle}>Cantidad</Text>
                                    <TextInput 
                                        style={styles.inputBox}
                                        defaultValue='1' 
                                        placeholder='1' 
                                        onChange={e => {amountRef.current = e.nativeEvent.text}}
                                        maxLength={MAX_AMOUNT_LENGTH}
                                        keyboardType='numeric'
                                    />
                                </View>
                            </View>
                        </ScrollView>
                        <View  style={styles.buttons}>
                            <TouchableOpacity style={[styles.acceptButton, styles.button]} onPress={handleCreateItem}>
                                <Text style={styles.buttonText}>Añadir</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.cancelButton, styles.button]} onPress={() => setModalVisible(!modalVisible)}>
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
  )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        width: '80%',
        backgroundColor: "white",
        borderRadius: 20,
        padding: 25,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    closeButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        margin: 15,
    },
    closeButtonText: {
        fontSize: 30,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
    inputTitleContainer: {
        marginVertical: 10,
    },
    subtitle: {
        fontSize: 15,
        fontWeight: "bold",
        paddingBottom: 5,
    },
    doubleInput: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    doubleInputColumn: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',

    },
    priceInput: {
        width: '85%',
    },
    inputBox: {
        borderColor: '#d3d3d3',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        padding: 2,
    },
    buttons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 15,
    },
    button: {
        borderRadius: 15,
        padding: 12,
        marginLeft: 15,
        elevation: 2 //TODO: IOS
    },
    acceptButton: {
        backgroundColor: MAIN_COLOR,
    },
    cancelButton: {
        backgroundColor: 'gray',
    },
    buttonText: {
        color: 'white',
        textAlign: "center",
    },
    textStyle: {
        color: MAIN_COLOR,
        fontWeight: "bold",
        textAlign: "center"
    },
});

export default CreatorModal;