package org.example.backend.leave;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.lang.reflect.Field;
import java.time.LocalDate;
import java.util.Optional;

import org.example.backend.leave.dto.LeaveRequestDto;
import org.example.backend.user.AppUser;
import org.example.backend.user.AppUserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class LeaveServiceTest {

    @Mock
    private AppUserRepository appUserRepository;

    @Mock
    private LeaveRequestRepository leaveRequestRepository;

    @Mock
    private LeaveBalanceRepository leaveBalanceRepository;

    @InjectMocks
    private LeaveService leaveService;

    private AppUser user;
    private LeaveRequest pendingRequest;

    @BeforeEach
    void setUp() throws Exception {
        user = new AppUser();
        user.setEmail("employee@example.com");
        user.setFullName("Employee User");
        setUserId(user, 1L);

        pendingRequest = new LeaveRequest();
        pendingRequest.setUserId(1L);
        pendingRequest.setStartDate(LocalDate.of(2026, 4, 8));
        pendingRequest.setEndDate(LocalDate.of(2026, 4, 22));
        pendingRequest.setTotalDays(15);
        pendingRequest.setStatus(LeaveStatus.PENDING);
    }

    @Test
    void cancelPendingRequest_shouldNotImpactUsedDaysCalculation() {
        LeaveBalance existingBalance = new LeaveBalance();
        existingBalance.setUserId(1L);

        when(appUserRepository.findByEmailIgnoreCase("employee@example.com"))
                .thenReturn(Optional.of(user));
        when(leaveRequestRepository.findById(13L)).thenReturn(Optional.of(pendingRequest));
        when(leaveRequestRepository.save(any(LeaveRequest.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(leaveRequestRepository.sumTotalDaysByUserIdAndStatusAndStartDateBetween(
                eq(1L),
                eq(LeaveStatus.APPROVED),
                eq(LocalDate.of(2026, 1, 1)),
                eq(LocalDate.of(2026, 12, 31))))
                .thenReturn(2);
        when(leaveBalanceRepository.findByUserId(1L)).thenReturn(Optional.of(existingBalance));

        LeaveRequestDto result = leaveService.cancelLeaveRequest(13L, "employee@example.com");

        assertEquals(LeaveStatus.CANCELLED, result.status());

        ArgumentCaptor<LeaveBalance> balanceCaptor = ArgumentCaptor.forClass(LeaveBalance.class);
        verify(leaveBalanceRepository).save(balanceCaptor.capture());

        LeaveBalance savedBalance = balanceCaptor.getValue();
        assertEquals(12, savedBalance.getTotalDays());
        assertEquals(2, savedBalance.getUsedDays());
        assertEquals(10, savedBalance.getRemainingDays());
    }

    @Test
    void cancelNonPendingRequest_shouldRejectAndNotSyncBalance() {
        pendingRequest.setStatus(LeaveStatus.APPROVED);

        when(appUserRepository.findByEmailIgnoreCase("employee@example.com"))
                .thenReturn(Optional.of(user));
        when(leaveRequestRepository.findById(13L)).thenReturn(Optional.of(pendingRequest));

        assertThrows(IllegalArgumentException.class,
                () -> leaveService.cancelLeaveRequest(13L, "employee@example.com"));
    }

    private static void setUserId(AppUser appUser, Long idValue) throws Exception {
        Field idField = AppUser.class.getDeclaredField("id");
        idField.setAccessible(true);
        idField.set(appUser, idValue);
    }
}
