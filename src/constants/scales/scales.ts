import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const guidelineBaseWidth = 390;

export const scale = (size: number) =>
    (width / guidelineBaseWidth) * size;