import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Animated, Dimensions } from 'react-native';
import { Grid, Astar } from "fast-astar";

const halfWUnit = ((Dimensions.get('window').width) / 4) / 2;
const fullWUnit = (Dimensions.get('window').width) / 4;
const fullHUnit = (Dimensions.get('window').height) / 9;
const playerSize = 50;
const wOffset = playerSize / 2;
const hOffset = (fullHUnit - playerSize) / 2;
// Temp characters
const player = '(O:';
const opponent = ')O:';
const gridSize = {col: 4,row: 7};
const setMissingRowPlatforms = grid => {
    // For 3 platforms in row
    [[3,1],[3,3],[3,5]].forEach(item => {
        grid.set(item,'value', 1);
    });
};
const searchOptions = {
    optimalResult:true,
    rightAngle:true
};
const rowData = {
    start: {playerY:  0, opponentY: 0},
    row1: {platforms: ['p1','p2','p3','p4'], playerY: -(fullHUnit * 7), opponentY: fullHUnit},
    row2: {platforms: ['p5','p6','p7'], playerY: -(fullHUnit * 6), opponentY: fullHUnit * 2},
    row3: {platforms: ['p8','p9','p10','p11'], playerY: -(fullHUnit * 5), opponentY: fullHUnit * 3},
    row4: {platforms: ['p12','p13','p14'], playerY: -(fullHUnit * 4), opponentY: fullHUnit * 4},
    row5: {platforms: ['p15','p16','p17','p18'], playerY: -(fullHUnit * 3), opponentY: fullHUnit * 5},
    row6: {platforms: ['p19','p20','p21'], playerY: -(fullHUnit * 2), opponentY: fullHUnit * 6},
    row7: {platforms: ['p22','p23','p24','p25'], playerY: -fullHUnit, opponentY: fullHUnit * 7},
    finish: {playerY: -(fullHUnit * 8)}
};
const PlatformData = {
    start: {x: (fullWUnit * 2) - wOffset, validMoves: [22,23,24,25]},
    p1: {x: halfWUnit - wOffset, validMoves: [2, 5], mapsTo: [0,0]},
    p2: {x: fullWUnit + halfWUnit - wOffset, validMoves: [1,3,5,6], mapsTo: [1,0]},
    p3: {x: (fullWUnit * 2) + halfWUnit - wOffset, validMoves: [2,4,6,7], mapsTo: [2,0]},
    p4: {x: (fullWUnit * 3) + halfWUnit - wOffset, validMoves: [3,7], mapsTo: [3,0]},
    p5: {x: fullWUnit - wOffset, validMoves: [1,2,6,8,9], mapsTo: [0,1]},
    p6: {x: (fullWUnit * 2) - wOffset, validMoves: [2,3,5,7,9,10], mapsTo: [1,1]},
    p7: {x: (fullWUnit * 3) - wOffset, validMoves: [3,4,6,10,11], mapsTo: [2,1]},
    p8: {x: halfWUnit - wOffset, validMoves: [5,9,12], mapsTo: [0,2]},
    p9: {x: fullWUnit + halfWUnit - wOffset, validMoves: [5,6,8,10,12,13], mapsTo: [1,2]},
    p10: {x: (fullWUnit * 2) + halfWUnit - wOffset, validMoves: [6,7,9,11,13,14], mapsTo: [2,2]},
    p11: {x: (fullWUnit * 3) + halfWUnit - wOffset, validMoves: [7,10,14], mapsTo: [3,2]},
    p12: {x: fullWUnit - wOffset, validMoves: [8,9,13,15,16], mapsTo: [0,3]},
    p13: {x: (fullWUnit * 2) - wOffset, validMoves: [9,10,12,14,16,17], mapsTo: [1,3]},
    p14: {x: (fullWUnit * 3) - wOffset, validMoves: [10,11,13,17,18], mapsTo: [2,3]},
    p15: {x: halfWUnit - wOffset, validMoves: [12,16,19], mapsTo: [0,4]},
    p16: {x: fullWUnit + halfWUnit - wOffset, validMoves: [12,13,15,17,19,20], mapsTo: [1,4]},
    p17: {x: (fullWUnit * 2) + halfWUnit - wOffset, validMoves: [13,14,16,18,20,21], mapsTo: [2,4]},
    p18: {x: (fullWUnit * 3) + halfWUnit - wOffset, validMoves: [14,17,21], mapsTo: [3,4]},
    p19: {x: fullWUnit - wOffset, validMoves: [15,16,20,22,23], mapsTo: [0,5]},
    p20: {x: (fullWUnit * 2) - wOffset, validMoves: [16,17,19,21,23,24], mapsTo: [1,5]},
    p21: {x: (fullWUnit * 3) - wOffset, validMoves: [17,18,20,24,25], mapsTo: [2,5]},
    p22: {x: halfWUnit - wOffset, validMoves: [19,23], mapsTo: [0,6]},
    p23: {x: fullWUnit + halfWUnit - wOffset, validMoves: [19,20,22,24], mapsTo: [1,6]},
    p24: {x: (fullWUnit * 2) + halfWUnit - wOffset, validMoves: [20,21,23,25], mapsTo: [2,6]},
    p25: {x: (fullWUnit * 3) + halfWUnit - wOffset, validMoves: [21,24], mapsTo: [3,6]},
    endzone: {x: (fullWUnit * 2) - wOffset}
};

export default function App() {
    const [selectedRow, setSelectedRow] = useState('start');
    const [opponentRow, setOpponentRow] = useState('start');
    const [selectedPlatform, setselectedPlatform] = useState('start');
    const [opponentPlatform, setOpponentPlatform] = useState('start');
    const [playerPosition, setPlayerPosition] = useState([(fullWUnit * 2) - wOffset, 0]);
    const [opponentPosition, setOpponentPosition] = useState([(fullWUnit * 2) - wOffset, 0]);
    const [currentPos, setCurrentPos] = useState('start');
    const [playerMoved, setPlayerMoved] = useState(false);
    const [firstMove, setFirstMove] = useState(true);
    const [opponentMoved, setOpponentMoved] = useState(false);
    const playerComponent = new Animated.Value(0);
    const opponentComponent = new Animated.Value(0);
    const slidePlayer = useRef(playerComponent).current;
    const slideOpponent = useRef(opponentComponent).current;

    const traverse = (component, character) => {
        component.setValue(0);

        Animated.timing(component, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start(() => character === 'player' ? setPlayerMoved(true) : setOpponentMoved(true));
    };

    useEffect(() => {
        let thisPlatform;

        if (playerMoved & selectedPlatform !== 'endzone') {
            let row;

            if (firstMove) {
                thisPlatform = rowData.row1.platforms[Math.floor((Math.random() * 4))];
                setFirstMove(false);
                row = 'row1';
            } else {
                const grid = new Grid(gridSize);;
                setMissingRowPlatforms(grid);

                const astar = new Astar(grid);
                const aStarPath = astar.search(
                    PlatformData[opponentPlatform].mapsTo,
                    PlatformData[selectedPlatform].mapsTo,
                    searchOptions
                );

                thisPlatform = Object.keys(PlatformData).find(key => JSON.stringify(PlatformData[key].mapsTo) === JSON.stringify(aStarPath[1]));

                if (!PlatformData[thisPlatform].validMoves.includes(parseInt(opponentPlatform.replace('p', '')))) {
                    if (PlatformData[selectedPlatform].mapsTo[0] <= 1 && rowData[`row${aStarPath[1][1] + 1}`].platforms.length === 4) {
                        thisPlatform = Object.keys(PlatformData).find(key => JSON.stringify(PlatformData[key].mapsTo) === JSON.stringify([aStarPath[1][0] + 1, aStarPath[1][1]]));
                    } else if (PlatformData[selectedPlatform].mapsTo[0] <= 1 && rowData[`row${aStarPath[1][1] + 1}`].platforms.length === 3 || PlatformData[selectedPlatform].mapsTo[0] >= 2) {
                        thisPlatform = Object.keys(PlatformData).find(key => JSON.stringify(PlatformData[key].mapsTo) === JSON.stringify([aStarPath[1][0] - 1, aStarPath[1][1]]));
                    }
                }

                row = `row${aStarPath[1][1] + 1}`;
            }

            setOpponentRow(row);
            setOpponentPosition([PlatformData[opponentPlatform].x, rowData[opponentRow].opponentY]);
            setOpponentPlatform(thisPlatform);
            traverse(slideOpponent, 'opponent');
            setPlayerMoved(false);

            searchOptions.rightAngle ? searchOptions.rightAngle = false : searchOptions.rightAngle = true;
        }
    }, [playerMoved]);

    const getGem = () => {
        if (['p1','p2','p3','p4'].includes(selectedPlatform)) {
            setPlayerMoved(false);
            setPlayerPosition([PlatformData[selectedPlatform].x, rowData[selectedRow].playerY]);
            setSelectedRow('finish');
            setselectedPlatform('endzone');

            traverse(slidePlayer, 'player');
        }
    };

    const movePlayer = (row, pNum) => {
        if (!PlatformData[currentPos].validMoves.includes(parseInt(pNum.replace('p', '')))) {
            return;
        }

        setPlayerPosition([PlatformData[selectedPlatform].x, rowData[selectedRow].playerY]);
        setSelectedRow(row);
        setselectedPlatform(pNum);
        setCurrentPos(pNum);

        traverse(slidePlayer, 'player');
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={{...styles.zone, ...styles.endZone}} onPress={getGem}>
                <View style={styles.gem}></View>
            </TouchableOpacity>
            <Animated.View style={{...styles.character, ...styles.opponent,
                ...{transform: [
                    {   translateX: slideOpponent.interpolate({
                            inputRange: [0, 1],
                            outputRange: [opponentPosition[0], PlatformData[opponentPlatform].x]})},
                    {   translateY: slideOpponent.interpolate({
                            inputRange: [0, 1],
                            outputRange: [opponentPosition[1], rowData[opponentRow].opponentY]})},
                    {
                        scale: slideOpponent.interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: [1, 1.25, 1]})
                    }]}
            }}>
                <Text style={styles.characterFace}>{opponent}</Text>
            </Animated.View>
            <View style={styles.void}>
                {Object.entries(rowData).map(([row, data]) => {
                    const rowSize = data.platforms && data.platforms.length % 2 === 0 ? 'rowOf4' : 'rowOf3';
                    return (data.platforms && row !== 'start' && row!== 'finish') && <View key={row} style={{...styles.platformRow, ...styles[rowSize]}}>
                        {
                            data.platforms.map(pNum => {
                                return <TouchableOpacity key={pNum} style={styles.platformWrapper} onPress={() => movePlayer(row, pNum)}>
                                                                <View style={styles.platform}></View>
                                                            </TouchableOpacity>;
                            })
                        }
                    </View>
                })}
            </View>
            <Animated.View style={{...styles.character, ...styles.player,
                ...{transform: [
                    {   translateX: slidePlayer.interpolate({
                            inputRange: [0, 1],
                            outputRange: [playerPosition[0], PlatformData[selectedPlatform].x]})},
                    {   translateY: slidePlayer.interpolate({
                            inputRange: [0, 1],
                            outputRange: [playerPosition[1], rowData[selectedRow].playerY]})},
                    {
                        scale: slidePlayer.interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: [1, 1.25, 1]})
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
        justifyContent: 'space-between',
        paddingBottom: hOffset,
        paddingTop: hOffset,
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
        top: fullHUnit,
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
    }
});
