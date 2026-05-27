package com.hms.microservices.doctor;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {
    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DoctorResponse create(@Valid @RequestBody DoctorRequest request) {
        return doctorService.create(request);
    }

    @GetMapping
    public List<DoctorResponse> findAll() {
        return doctorService.findAll();
    }

    @GetMapping("/{id}")
    public DoctorResponse findById(@PathVariable Long id) {
        return doctorService.findById(id);
    }

    @PutMapping("/{id}")
    public DoctorResponse update(@PathVariable Long id, @Valid @RequestBody DoctorRequest request) {
        return doctorService.update(id, request);
    }

    @PatchMapping("/{id}/status")
    public DoctorResponse updateStatus(@PathVariable Long id, @Valid @RequestBody DoctorStatusRequest request) {
        return doctorService.updateStatus(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        doctorService.delete(id);
    }
}
