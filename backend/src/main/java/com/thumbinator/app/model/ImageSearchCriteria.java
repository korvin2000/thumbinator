package com.thumbinator.app.model;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

public record ImageSearchCriteria(
        String search,
        ColorMode colorMode,
        int minResolution,
        Double minSize,
        Double maxSize,
        LocalDate dateFrom,
        LocalDate dateTo,
        AspectRatio aspectRatio,
        Set<String> categories,
        Set<String> tags,
        SortOption sortOption
) {
    public List<String> normalizedTags() {
        return tags == null ? List.of() : tags.stream().map(String::toLowerCase).toList();
    }
}
