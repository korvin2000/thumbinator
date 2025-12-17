package com.thumbinator.app.service;

import com.thumbinator.app.model.ImageMetadata;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Repository
public class ImageRepository {

    private final List<ImageMetadata> images;

    public ImageRepository(ImageDataFactory factory) {
        this.images = factory.generate(80);
    }

    public List<ImageMetadata> findAll() {
        return images;
    }

    public long count() {
        return images.size();
    }

    public Set<String> categories() {
        return images.stream().map(ImageMetadata::category).collect(Collectors.toSet());
    }

    public Set<String> tags() {
        return images.stream().flatMap(img -> img.tags().stream()).collect(Collectors.toSet());
    }
}
