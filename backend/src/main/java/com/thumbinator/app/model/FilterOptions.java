package com.thumbinator.app.model;

import java.util.List;
import java.util.Set;

public record FilterOptions(Set<String> categories, Set<String> tags, List<String> resolutionLabels, long totalImages) {
}
