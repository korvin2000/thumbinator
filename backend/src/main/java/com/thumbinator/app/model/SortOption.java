package com.thumbinator.app.model;

import java.util.Comparator;

public enum SortOption {
    NEWEST,
    OLDEST,
    LARGEST,
    SMALLEST,
    NAME_ASC,
    NAME_DESC,
    RESOLUTION;

    public Comparator<com.thumbinator.app.model.ImageMetadata> comparator() {
        return switch (this) {
            case NEWEST -> Comparator.comparing(ImageMetadata::dateCreated).reversed();
            case OLDEST -> Comparator.comparing(ImageMetadata::dateCreated);
            case LARGEST -> Comparator.comparing(ImageMetadata::fileSize).reversed();
            case SMALLEST -> Comparator.comparing(ImageMetadata::fileSize);
            case NAME_ASC -> Comparator.comparing(ImageMetadata::name, String.CASE_INSENSITIVE_ORDER);
            case NAME_DESC -> Comparator.comparing(ImageMetadata::name, String.CASE_INSENSITIVE_ORDER).reversed();
            case RESOLUTION -> Comparator
                    .comparingLong((ImageMetadata img) -> (long) img.width() * img.height())
                    .reversed();
        };
    }

    public static SortOption fromValue(String value) {
        if (value == null) {
            return NEWEST;
        }
        try {
            return SortOption.valueOf(value.toUpperCase().replace('-', '_'));
        } catch (IllegalArgumentException ex) {
            return NEWEST;
        }
    }
}
