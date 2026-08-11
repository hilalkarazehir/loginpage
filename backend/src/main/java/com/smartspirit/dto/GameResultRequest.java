package com.smartspirit.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class GameResultRequest {

    @NotNull(message = "Skor boş olamaz")
    @Min(value = -1000, message = "Geçersiz skor")
    @Max(value = 100000, message = "Geçersiz skor")
    private Integer score;

    @Min(value = 0, message = "Geçersiz doğru yakalama sayısı")
    private Integer correctCatches;

    @Min(value = 0, message = "Geçersiz kombo")
    private Integer maxCombo;

    @Min(value = 0, message = "Geçersiz süre")
    private Integer durationSeconds;
}