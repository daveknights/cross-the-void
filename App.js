import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Animated, Dimensions } from 'react-native';

const halfWUnit = ((Dimensions.get('window').width) / 4) / 2;
const fullWUnit = (Dimensions.get('window').width) / 4;
const halfHUnit = ((Dimensions.get('window').height) / 9) / 2;
const fullHUnit = (Dimensions.get('window').height) / 9;
const playerSize = 50;
const wOffset = playerSize / 2;
const hOffset = -(fullHUnit - 50) / 2;
// Temp characters
const player = '(O:';
const opponent = ')O:';

const platforms = {
    finish: {pos: {x: (fullWUnit * 2) - wOffset, y: -((fullHUnit * 4) + halfHUnit + hOffset)}},
    row1: {
        p1: {x: halfWUnit - wOffset, y: -((fullHUnit * 3) + halfHUnit + hOffset)},
        p2: {x: fullWUnit + halfWUnit - wOffset, y: -((fullHUnit * 3) + halfHUnit + hOffset)},
        p3: {x: (fullWUnit * 2) + halfWUnit - wOffset, y: -((fullHUnit * 3) + halfHUnit + hOffset)},
        p4: {x: (fullWUnit * 3) + halfWUnit - wOffset, y: -((fullHUnit * 3) + halfHUnit + hOffset)},
    },
    row2: {
        p5: {x: fullWUnit - wOffset, y: -((fullHUnit * 2) + halfHUnit + hOffset)},
        p6: {x: (fullWUnit * 2) - wOffset, y: -((fullHUnit * 2) + halfHUnit + hOffset)},
        p7: {x: (fullWUnit * 3) - wOffset, y: -((fullHUnit * 2) + halfHUnit + hOffset)},
    },
    row3: {
        p8: {x: halfWUnit - wOffset, y: -(fullHUnit + halfHUnit + hOffset)},
        p9: {x: fullWUnit + halfWUnit - wOffset, y: -(fullHUnit + halfHUnit + hOffset)},
        p10: {x: (fullWUnit * 2) + halfWUnit - wOffset, y: -(fullHUnit + halfHUnit + hOffset)},
        p11: {x: (fullWUnit * 3) + halfWUnit - wOffset, y: -(fullHUnit + halfHUnit + hOffset)},
    },
    row4: {
        p12: {x: fullWUnit - wOffset, y: -(halfHUnit + hOffset)},
        p13: {x: (fullWUnit * 2) - wOffset, y: -(halfHUnit + hOffset)},
        p14: {x: (fullWUnit * 3) - wOffset, y: -(halfHUnit + hOffset)},
    },
    row5: {
        p15: {x: halfWUnit - wOffset, y: fullHUnit - (halfHUnit + hOffset)},
        p16: {x: fullWUnit + halfWUnit - wOffset, y: fullHUnit - (halfHUnit + hOffset)},
        p17: {x: (fullWUnit * 2) + halfWUnit - wOffset, y: fullHUnit - (halfHUnit + hOffset)},
        p18: {x: (fullWUnit * 3) + halfWUnit - wOffset, y: fullHUnit - (halfHUnit + hOffset)},
    },
    row6: {
        p19: {x: fullWUnit - wOffset, y: (fullHUnit * 2) - (halfHUnit + hOffset)},
        p20: {x: (fullWUnit * 2) - wOffset, y: (fullHUnit * 2) - (halfHUnit + hOffset)},
        p21: {x: (fullWUnit * 3) - wOffset, y: (fullHUnit * 2) - (halfHUnit + hOffset)},
    },
    row7: {
        p22: {x: halfWUnit - wOffset, y: (fullHUnit * 3) - (halfHUnit + hOffset)},
        p23: {x: fullWUnit + halfWUnit - wOffset, y: (fullHUnit * 3) - (halfHUnit + hOffset)},
        p24: {x: (fullWUnit * 2) + halfWUnit - wOffset, y: (fullHUnit * 3) - (halfHUnit + hOffset)},
        p25: {x: (fullWUnit * 3) + halfWUnit - wOffset, y: (fullHUnit * 3) - (halfHUnit + hOffset)},
    },
    start: {pos: {x: (fullWUnit * 2) - wOffset, y: (fullHUnit * 3) + (halfHUnit - hOffset)}},
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
    const [playerPosition, setPlayerPosition] = useState([(fullWUnit * 2) - wOffset, (fullHUnit * 3) + (halfHUnit - hOffset)]);
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
            <StatusBar hidden style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        height: Dimensions.get('window').height,
        justifyContent: 'center',
        padding: 0,
    },
    zone: {
        backgroundColor: 'gold',
        justifyContent: 'center',
        position: 'absolute',
        width: '100%',
    },
    startZone: {
        backgroundColor: 'grey',
        bottom: 0,
        height: fullHUnit,
    },
    endZone: {
        alignItems: 'center',
        backgroundColor: 'gold',
        height: fullHUnit,
        top: 0,
    },
    gem: {
        backgroundColor: '#c57',
        height: 30,
        transform: [{rotate: '45deg'}],
        width: 30,
    },
    void: {
        height: fullHUnit * 7,
        position: 'absolute',
    },
    rowOf3: {
        paddingLeft: halfWUnit,
    },
    platformRow: {
        flexDirection: 'row',
    },
    platformWrapper: {
        alignItems: 'center',
        height: fullHUnit,
        justifyContent: 'center',
        width: fullWUnit,
    },
    platform: {
        backgroundColor: 'orange',
        borderRadius: 15,
        height: 40,
        width: 40,
    },
    character: {
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 25,
        height: playerSize,
        justifyContent: 'center',
        width: playerSize,
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
            {translateX: (fullWUnit * 2) - wOffset},
            {translateY: -((fullHUnit * 3) + halfHUnit - hOffset)},
        ]
    }
});
