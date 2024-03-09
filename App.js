import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Animated, Dimensions } from 'react-native';

const halfUnit = ((Dimensions.get('window').width - 40) / 4) / 2;
const fullUnit = (Dimensions.get('window').width - 40) / 4;
const unit = (Dimensions.get('window').width - 40) / 20;
const player = '(O:';
const opponent = ')O:';

const platforms = {
    start: {pos: {x: (fullUnit * 2) - 25, y: -40}},
    row1: {
        p1: {x: halfUnit - 25, y: -530},
        p2: {x: fullUnit + halfUnit - 25, y: -530},
        p3: {x: (fullUnit * 2) + halfUnit - 25, y: -530},
        p4: {x: (fullUnit * 3) + halfUnit - 25, y: -530},
    },
    row2: {
        p5: {x: fullUnit - 25, y: -460},
        p6: {x: (fullUnit * 2) - 25, y: -460},
        p7: {x: (fullUnit * 3) - 25, y: -460},
    },
    row3: {
        p8: {x: halfUnit - 25, y: -390},
        p9: {x: fullUnit + halfUnit - 25, y: -390},
        p10: {x: (fullUnit * 2) + halfUnit - 25, y: -390},
        p11: {x: (fullUnit * 3) + halfUnit - 25, y: -390},
    },
    row4: {
        p12: {x: fullUnit - 25, y: -320},
        p13: {x: (fullUnit * 2) - 25, y: -320},
        p14: {x: (fullUnit * 3) - 25, y: -320},
    },
    row5: {
        p15: {x: halfUnit - 25, y: -250},
        p16: {x: fullUnit + halfUnit - 25, y: -250},
        p17: {x: (fullUnit * 2) + halfUnit - 25, y: -250},
        p18: {x: (fullUnit * 3) + halfUnit - 25, y: -250},
    },
    row6: {
        p19: {x: fullUnit - 25, y: -180},
        p20: {x: (fullUnit * 2) - 25, y: -180},
        p21: {x: (fullUnit * 3) - 25, y: -180},
    },
    row7: {
        p22: {x: halfUnit - 25, y: -110},
        p23: {x: fullUnit + halfUnit - 25, y: -110},
        p24: {x: (fullUnit * 2) + halfUnit - 25, y: -110},
        p25: {x: (fullUnit * 3) + halfUnit - 25, y: -110},
    },
    finish: {pos: {x: (fullUnit * 2) - 25, y: -600}},
}

const validMoves = {
    start: [22,23,24,25],
    p1: [2, 5],
    p2: [1,3,5,6],
    p3: [2,4,6,7],
    p4: [3,7],
    p5: [1,2,6,8,9],
    p6: [2,3,5,7,9,10],
    p7: [3,4,6,10,11],
    p8: [5,9,12],
    p9: [5,6,8,10,12,13],
    p10: [6,7,9,11,13,14],
    p11: [7,10,14],
    p12: [8,9,13,15,16],
    p13: [9,10,12,14,16,17],
    p14: [10,11,13,167,18],
    p15: [12,16,19],
    p16: [12,13,15,17,19,20],
    p17: [13,14,16,18,20,21],
    p18: [14,17,21],
    p19: [15,16,20,22,23],
    p20: [16,17,19,21,23,24],
    p21: [17,18,20,24,25],
    p22: [19,23],
    p23: [19,20,22,24],
    p24: [20,21,23,25],
    p25: [21,24],
};

export default function App() {
    const slide = useRef(new Animated.Value(0)).current;
    const [selectedRow, setSelectedRow] = useState('start');
    const [selectedPlatfom, setSelectedPlatfom] = useState('pos');
    const [playerPosition, setPlayerPosition] = useState([(fullUnit * 2) - 25, -40]);
    const [currentPos, setCurrentPos] = useState('start');

    const traverse = () => {
        slide.setValue(0);

        Animated.timing(slide, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    };

    const getGem = () => {
        if (['p1','p2','p3','p4'].includes(selectedPlatfom)) {
            setSelectedRow('finish');
            setSelectedPlatfom('pos');
            setPlayerPosition([platforms[selectedRow][selectedPlatfom].x, platforms[selectedRow][selectedPlatfom].y]);

            traverse();
        }
    };

    const movePlayer = (row, pNum) => {
        if (!validMoves[currentPos].includes(parseInt(pNum.replace('p', '')))) {
            return;
        }

        setSelectedRow(row);
        setSelectedPlatfom(pNum);
        setPlayerPosition([platforms[selectedRow][selectedPlatfom].x, platforms[selectedRow][selectedPlatfom].y]);
        setCurrentPos(pNum);

        traverse();
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={{...styles.zone, ...styles.endZone}} onPress={getGem}>
                <View style={styles.gem}></View>
            </TouchableOpacity>
            <View style={{...styles.character, ...styles.opponent}}>
                <Text style={styles.characterFace}>{opponent}</Text>
            </View>
            <View style={styles.void}>
                {Object.entries(platforms).map(([key, row], i) => {
                    const rowSize = i % 2 === 0 ? 'rowOf3' : 'rowOf4';
                    return (key !== 'start' && key!== 'finish') && <View key={key} style={{...styles.platformRow, ...styles[rowSize]}}>
                        {
                            Object.keys(row).map(pNum => {
                                return <TouchableOpacity key={pNum} style={styles.platformWrapper} onPress={() => movePlayer(key, pNum)}>
                                                                <View style={styles.platform}></View>
                                                            </TouchableOpacity>;
                            })
                        }
                    </View>
                })}
            </View>
            <Animated.View style={{...styles.character, ...styles.player,
                ...{transform: [{
                        translateX: slide.interpolate({
                        inputRange: [0, 1],
                        outputRange: [playerPosition[0], platforms[selectedRow][selectedPlatfom].x]})},
                    {   translateY: slide.interpolate({
                        inputRange: [0, 1],
                        outputRange: [playerPosition[1], platforms[selectedRow][selectedPlatfom].y]})
                    }]}
            }}>
                <Text style={styles.characterFace}>{player}</Text>
            </Animated.View>
            <View style={{...styles.zone, ...styles.startZone}}>
            </View>
        <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        paddingTop: 50,
    },
    zone: {
        backgroundColor: 'gold',
        height: 70,
        justifyContent: 'center',
    },
    startZone: {
        backgroundColor: 'grey',
        transform: [{translateY: -100}],
    },
    endZone: {
        alignItems: 'center',
        backgroundColor: 'gold'
    },
    gem: {
        backgroundColor: '#c57',
        height: 30,
        transform: [{rotate: '45deg'}],
        width: 30,
    },
    void: {
        transform: [{translateY: -50}],
    },
    rowOf3: {
        paddingLeft: halfUnit,
    },
    platformRow: {
        flexDirection: 'row',
    },
    platformWrapper: {
        alignItems: 'center',
        height: 70,
        justifyContent: 'center',
        width: fullUnit,
    },
    platform: {
        backgroundColor: 'orange',
        borderRadius: 15,
        height: 30,
        width: 30,
    },
    character: {
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 25,
        height: 50,
        justifyContent: 'center',
        width: 50,
        zIndex: 1,
    },
    characterFace: {
        transform: [{rotate: '-90deg'}],
    },
    player: {
        backgroundColor: 'yellow',
    },
    opponent: {
        backgroundColor: 'red',
        transform: [
            {translateX: (fullUnit * 2) - 25},
            {translateY: -60},
        ]
    }
});
