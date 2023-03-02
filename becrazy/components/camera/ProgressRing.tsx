import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, G } from "react-native-svg";

type Props = {
  size: number;
  strokeWidth: number;
  progress: number;
};

const ProgressRing: FC<Props> = ({ size, strokeWidth, progress }) => {
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	const progressOffset = circumference * (1 - progress);

	return (
		<View style={styles.container}>
			<Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
				<G transform={`rotate(-90 ${size / 2} ${size / 2})`}>
					<Circle
						cx={size / 2}
						cy={size / 2}
						r={radius - strokeWidth / 2}
						stroke="#D8D8D8"
						strokeWidth={strokeWidth}
						fill="red"
					/>
					<Circle
						cx={size / 2}
						cy={size / 2}
						r={radius - strokeWidth / 2}
						stroke="blue"
						strokeWidth={strokeWidth}
						strokeDasharray={`${circumference} ${circumference}`}
						strokeDashoffset={progressOffset}
						strokeLinecap="round"
						fill="none"
					/>
				</G>
			</Svg>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		justifyContent: "center",
	},
});

export default ProgressRing;
