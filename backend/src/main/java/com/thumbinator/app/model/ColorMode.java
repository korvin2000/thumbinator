package com.thumbinator.app.model;

public enum ColorMode {
    ALL,
    COLOR,
    BW;

    public static ColorMode fromValue(String value) {
        if (value == null || value.isBlank()) {
            return ALL;
        }
        try {
            return ColorMode.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException ex) {
            return ALL;
        }
    }

    public boolean matches(boolean isColor) {
        return switch (this) {
            case ALL -> true;
            case COLOR -> isColor;
            case BW -> !isColor;
        };
    }
}
