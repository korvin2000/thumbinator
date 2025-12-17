package com.thumbinator.app.model;

import java.util.Map;

public enum AspectRatio {
    ALL(0),
    RATIO_16_9(16d / 9d),
    RATIO_4_3(4d / 3d),
    RATIO_1_1(1d),
    RATIO_3_2(3d / 2d),
    RATIO_21_9(21d / 9d);

    private static final Map<String, AspectRatio> FROM_LABEL = Map.of(
            "16:9", RATIO_16_9,
            "4:3", RATIO_4_3,
            "1:1", RATIO_1_1,
            "3:2", RATIO_3_2,
            "21:9", RATIO_21_9
    );

    private final double value;

    AspectRatio(double value) {
        this.value = value;
    }

    public boolean matches(double width, double height) {
        if (this == ALL) {
            return true;
        }
        double ratio = width / height;
        return Math.abs(ratio - value) < 0.1;
    }

    public static AspectRatio fromLabel(String label) {
        if (label == null || label.isBlank()) {
            return ALL;
        }
        return FROM_LABEL.getOrDefault(label, ALL);
    }
}
