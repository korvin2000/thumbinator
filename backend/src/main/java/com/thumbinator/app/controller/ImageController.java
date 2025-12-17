package com.thumbinator.app.controller;

import com.thumbinator.app.model.*;
import com.thumbinator.app.service.ImageService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    private final ImageService imageService;
    private final ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();

    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    @GetMapping("/filters")
    public FilterOptions fetchFilters() {
        return imageService.filterOptions();
    }

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamImages(
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "ALL") String colorMode,
            @RequestParam(required = false, defaultValue = "0") int minResolution,
            @RequestParam(required = false) Double minSize,
            @RequestParam(required = false) Double maxSize,
            @RequestParam(required = false) String dateFrom,
            @RequestParam(required = false) String dateTo,
            @RequestParam(required = false) String aspectRatio,
            @RequestParam(required = false) String categories,
            @RequestParam(required = false) String tags,
            @RequestParam(required = false) String sort
    ) {
        ImageSearchCriteria criteria = new ImageSearchCriteria(
                search,
                ColorMode.fromValue(colorMode),
                minResolution,
                minSize,
                maxSize,
                dateFrom == null || dateFrom.isBlank() ? null : LocalDate.parse(dateFrom),
                dateTo == null || dateTo.isBlank() ? null : LocalDate.parse(dateTo),
                AspectRatio.fromLabel(aspectRatio),
                parseToSet(categories),
                parseToSet(tags),
                SortOption.fromValue(sort)
        );

        SseEmitter emitter = new SseEmitter(0L);

        executor.execute(() -> {
            final long[] filteredCount = {0L};
            try {
                imageService.search(criteria).forEach(image -> {
                    try {
                        emitter.send(SseEmitter.event().name("image").data(image));
                        filteredCount[0]++;
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                });
                emitter.send(SseEmitter.event().name("complete").data(new SearchSummary(imageService.filterOptions().totalImages(), filteredCount[0])));
                emitter.complete();
            } catch (IOException ex) {
                emitter.completeWithError(ex);
            } catch (RuntimeException ex) {
                emitter.completeWithError(ex);
            }
        });

        return emitter;
    }

    private Set<String> parseToSet(String value) {
        if (value == null || value.isBlank()) {
            return Set.of();
        }
        return Arrays.stream(value.split(","))
                .map(String::trim)
                .filter(part -> !part.isEmpty())
                .collect(java.util.stream.Collectors.toSet());
    }
}
