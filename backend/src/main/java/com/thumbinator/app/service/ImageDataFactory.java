package com.thumbinator.app.service;

import com.thumbinator.app.model.ImageMetadata;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
public class ImageDataFactory {

    private static final String[] CATEGORIES = {"Landscape", "Portrait", "Architecture", "Nature", "Travel", "Urban", "Macro"};
    private static final String[] TAGS = {"sunset", "travel", "city", "mountain", "beach", "night", "portrait", "forest", "sky", "minimal", "architecture", "macro"};
    private static final String[] CAMERAS = {"Canon EOS R5", "Nikon Z7 II", "Sony A7 IV", "Fujifilm X-T5", "Leica Q3"};
    private static final String[] LOCATIONS = {"Paris, France", "New York, USA", "Tokyo, Japan", "Reykjavik, Iceland", "Banff, Canada", "Sydney, Australia"};

    private static final Resolution[] RESOLUTIONS = {
            new Resolution("HD", 1280, 720),
            new Resolution("FHD", 1920, 1080),
            new Resolution("2K", 2560, 1440),
            new Resolution("4K", 3840, 2160),
            new Resolution("6K", 6016, 3384),
            new Resolution("8K", 7680, 4320)
    };

    private final Random random = new Random();

    public List<ImageMetadata> generate(int count) {
        List<ImageMetadata> images = new ArrayList<>(count);
        LocalDateTime now = LocalDateTime.now();

        for (int i = 0; i < count; i++) {
            long id = i + 1;
            Resolution resolution = RESOLUTIONS[random.nextInt(RESOLUTIONS.length)];
            boolean isColor = random.nextDouble() > 0.2;
            String category = CATEGORIES[random.nextInt(CATEGORIES.length)];
            List<String> tags = randomTags();
            int daysAgo = random.nextInt(365);
            double fileSize = random.nextDouble() * 50 + 1;

            ImageMetadata image = new ImageMetadata(
                    id,
                    "IMG_" + String.format("%04d", id) + "_" + category.toLowerCase() + ".jpg",
                    "https://picsum.photos/seed/" + id + "/640/360",
                    "https://picsum.photos/seed/" + id + "/" + resolution.width + "/" + resolution.height,
                    resolution.width,
                    resolution.height,
                    resolution.label,
                    fileSize,
                    String.format("%.1f MB", fileSize),
                    now.minusDays(daysAgo),
                    now.minusDays(Math.max(daysAgo - random.nextInt(30), 0)),
                    category,
                    tags,
                    isColor,
                    CAMERAS[random.nextInt(CAMERAS.length)],
                    "f/" + String.format("%.1f", random.nextDouble() * 14 + 1.4),
                    switch (random.nextInt(6)) {
                        case 0 -> 100;
                        case 1 -> 200;
                        case 2 -> 400;
                        case 3 -> 800;
                        case 4 -> 1600;
                        default -> 3200;
                    },
                    new String[]{"1/30s", "1/60s", "1/125s", "1/250s", "1/500s", "1/1000s"}[random.nextInt(6)],
                    random.nextInt(180) + 20 + "mm",
                    LOCATIONS[random.nextInt(LOCATIONS.length)],
                    "Beautiful " + category.toLowerCase() + " photograph captured with " +
                            CAMERAS[random.nextInt(CAMERAS.length)] + " in " +
                            LOCATIONS[random.nextInt(LOCATIONS.length)] + "."
            );

            images.add(image);
        }

        return images;
    }

    private List<String> randomTags() {
        int count = random.nextInt(4) + 2;
        List<String> result = new ArrayList<>(count);
        while (result.size() < count) {
            String tag = TAGS[random.nextInt(TAGS.length)];
            if (!result.contains(tag)) {
                result.add(tag);
            }
        }
        return result;
    }

    private record Resolution(String label, int width, int height) {
    }
}
