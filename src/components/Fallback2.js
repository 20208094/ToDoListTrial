import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";

const Fallback2 = () => {
	return (
		<View style={{ alignItems: "center" }}>
			<Image
				source={require("../../assets/to-do-list.png")}
				style={{ height: 230, width: 230 }}
			/>
			<View
				style={{
					backgroundColor: "#ebebeb",
					paddingVertical: 12,
					paddingHorizontal: 12,
					borderRadius: 6,
					shadowColor: "black",
					shadowOffset: { width: 5, height: 5 },
					shadowOpacity: 5,
					shadowRadius: 4,
				}}
			>
				<Text style={{ color: "black", fontSize: 20, textAlign: "center"}}>Task Archived here!</Text>
			</View>
		</View>
	);
};

export default Fallback2;

const styles = StyleSheet.create({});
