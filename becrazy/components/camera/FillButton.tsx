import React, { FC, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import ProgressRing from './ProgressRing';
import { Text } from '../Themed';



interface FillButtonProps {
    whenPressed: () => void;
    whenReleased: () => void;
    progressTimer: number;
  }


const FillButton: FC<FillButtonProps> = ({whenPressed, whenReleased, progressTimer}) => {
    const [progress, setProgress] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const handlePress = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        setProgress(0);
        const startTime = new Date().getTime();
        whenPressed();
        timerRef.current = setInterval(() => {
            const currentTime = new Date().getTime();
            const elapsedTime = currentTime - startTime;
            const newProgress = elapsedTime / progressTimer;
            if (newProgress >= 1) {
                clearInterval(timerRef.current!);
            }
            setProgress(newProgress);
        }, 1);
    };


    const handleRelease = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            setProgress(0);
            whenReleased();
        }
    };


    return (
        <TouchableOpacity activeOpacity={1} style={styles.container} onPressIn={handlePress} onPressOut={handleRelease}>
            <ProgressRing strokeWidth={10} size={125} progress={progress} />
            <Text style={styles.text}>Record</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    text: {
        position: 'absolute',
        top: 50,
        left: 0,
        width: '100%',
        height: '100%',
        textAlign: 'center',
        textAlignVertical: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        color: 'white',
    },
});
export default FillButton;
