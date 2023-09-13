import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";

const Fallback = () => {
	return (
		<View style={{ alignItems: "center" }}>
			<Image
				source={require("../../assets/to-do-list.png")}
				style={{ height: 300, width: 300 }}
			/>
			<View
				style={{
					backgroundColor: "white",
					paddingVertical: 12,
					paddingHorizontal: 12,
					borderRadius: 6,
					shadowColor: "black",
					shadowOffset: { width: 5, height: 5 },
					shadowOpacity: 5,
					shadowRadius: 4,
				}}
			>
				<Text style={{ color: "black" }}>Start Adding Your Task</Text>
			</View>
		</View>
	);
};

export default Fallback;

const styles = StyleSheet.create({});
