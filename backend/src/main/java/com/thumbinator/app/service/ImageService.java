package com.thumbinator.app.service;

import com.thumbinator.app.model.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Stream;

@Service
public class ImageService {

    private static final List<String> RESOLUTION_LABELS = List.of("Any", "HD+", "FHD+", "4K+", "8K+");
    private static final List<Long> RESOLUTION_THRESHOLDS = List.of(0L, 1280L * 720, 1920L * 1080, 3840L * 2160, 7680L * 4320);

    private final ImageRepository repository;

    public ImageService(ImageRepository repository) {
        this.repository = repository;
    }

    public FilterOptions filterOptions() {
        return new FilterOptions(repository.categories(), repository.tags(), RESOLUTION_LABELS, repository.count());
    }

    public Stream<ImageMetadata> search(ImageSearchCriteria criteria) {
        Stream<ImageMetadata> stream = repository.findAll().stream();

        if (criteria.search() != null && !criteria.search().isBlank()) {
            String term = criteria.search().toLowerCase();
            stream = stream.filter(img -> matchesSearch(img, term));
        }

        if (criteria.colorMode() != null && criteria.colorMode() != ColorMode.ALL) {
            stream = stream.filter(img -> criteria.colorMode().matches(img.isColor()));
        }

        if (criteria.minResolution() > 0 && criteria.minResolution() < RESOLUTION_THRESHOLDS.size()) {
            long minPixels = RESOLUTION_THRESHOLDS.get(criteria.minResolution());
            stream = stream.filter(img -> (long) img.width() * img.height() >= minPixels);
        }

        if (criteria.minSize() != null) {
            stream = stream.filter(img -> img.fileSize() >= criteria.minSize());
        }
        if (criteria.maxSize() != null) {
            stream = stream.filter(img -> img.fileSize() <= criteria.maxSize());
        }

        if (criteria.categories() != null && !criteria.categories().isEmpty()) {
            Set<String> categories = criteria.categories();
            stream = stream.filter(img -> categories.contains(img.category()));
        }

        if (criteria.tags() != null && !criteria.tags().isEmpty()) {
            List<String> tags = criteria.normalizedTags();
            stream = stream.filter(img -> img.tags().stream().map(String::toLowerCase).anyMatch(tags::contains));
        }

        if (criteria.dateFrom() != null) {
            LocalDate from = criteria.dateFrom();
            stream = stream.filter(img -> !img.dateCreated().toLocalDate().isBefore(from));
        }

        if (criteria.dateTo() != null) {
            LocalDate to = criteria.dateTo();
            stream = stream.filter(img -> !img.dateCreated().toLocalDate().isAfter(to));
        }

        if (criteria.aspectRatio() != null && criteria.aspectRatio() != AspectRatio.ALL) {
            AspectRatio ratio = criteria.aspectRatio();
            stream = stream.filter(img -> ratio.matches(img.width(), img.height()));
        }

        SortOption sort = criteria.sortOption() == null ? SortOption.NEWEST : criteria.sortOption();
        Comparator<ImageMetadata> comparator = sort.comparator();
        stream = stream.sorted(comparator);

        return stream;
    }

    private boolean matchesSearch(ImageMetadata img, String term) {
        return img.name().toLowerCase().contains(term)
                || img.description().toLowerCase().contains(term)
                || img.category().toLowerCase().contains(term)
                || img.location().toLowerCase().contains(term)
                || img.tags().stream().anyMatch(tag -> tag.toLowerCase().contains(term));
    }
}
