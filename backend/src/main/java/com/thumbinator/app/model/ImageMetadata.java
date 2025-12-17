package com.thumbinator.app.model;

import java.time.LocalDateTime;
import java.util.List;

public record ImageMetadata(
        long id,
        String name,
        String thumbnail,
        String fullImage,
        int width,
        int height,
        String resolutionLabel,
        double fileSize,
        String fileSizeFormatted,
        LocalDateTime dateCreated,
        LocalDateTime dateModified,
        String category,
        List<String> tags,
        boolean isColor,
        String camera,
        String aperture,
        int iso,
        String exposureTime,
        String focalLength,
        String location,
        String description
) {
}
