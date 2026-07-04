package com.smartspirit.exception;

import com.smartspirit.dto.ErrorResponse;
import com.smartspirit.entity.SystemError;
import com.smartspirit.repository.SystemErrorRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;


@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    private static final int MAX_DETAIL_LENGTH = 1000; // SystemError.details kolonunun sınırıyla aynı

    private final SystemErrorRepository systemErrorRepository;

    public GlobalExceptionHandler(SystemErrorRepository systemErrorRepository) {
        this.systemErrorRepository = systemErrorRepository;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationErrors(MethodArgumentNotValidException ex,
                                                                   HttpServletRequest request) {
        String message = ex.getBindingResult()
                .getFieldErrors()
                .get(0)
                .getDefaultMessage();

        ErrorResponse error = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Validation Error",
                message,
                request.getRequestURI()
        );
        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(MissingRequestHeaderException.class)
    public ResponseEntity<ErrorResponse> handleMissingHeader(MissingRequestHeaderException ex,
                                                                HttpServletRequest request) {
        ErrorResponse error = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Bad Request",
                "Gerekli header eksik: " + ex.getHeaderName(),
                request.getRequestURI()
        );
        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<ErrorResponse> handleInvalidToken(InvalidTokenException ex,
                                                               HttpServletRequest request) {
        ErrorResponse error = new ErrorResponse(
                HttpStatus.UNAUTHORIZED.value(),
                "Unauthorized",
                ex.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleUnexpectedError(Exception ex, HttpServletRequest request) {
        logger.error("Beklenmeyen hata - path: {}", request.getRequestURI(), ex);
        persistSystemError(ex, request);

        ErrorResponse error = new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Internal Server Error",
                "Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
                request.getRequestURI()
        );
        return ResponseEntity.internalServerError().body(error);
    }

    private void persistSystemError(Exception ex, HttpServletRequest request) {
        try {
            String rawDetails = request.getRequestURI() + " - " + ex;
            String details = rawDetails.length() > MAX_DETAIL_LENGTH
                    ? rawDetails.substring(0, MAX_DETAIL_LENGTH)
                    : rawDetails;

            systemErrorRepository.save(new SystemError(details, LocalDateTime.now()));
        } catch (Exception persistFailure) {
            logger.error("SystemError DB'ye yazılamadı", persistFailure);
        }
    }
}
