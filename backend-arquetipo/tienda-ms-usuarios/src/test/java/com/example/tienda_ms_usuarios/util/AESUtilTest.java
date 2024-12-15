package com.example.tienda_ms_usuarios.util;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;

public class AESUtilTest {

    private static final String TEST_DATA = "TestData123";
    private String encryptedData;

    @BeforeEach
    void setUp() throws Exception {
        encryptedData = AESUtil.encrypt(TEST_DATA);
    }

    @Test
    void encrypt_ValidData_ShouldEncryptSuccessfully() throws Exception {
        // Act
        String result = AESUtil.encrypt(TEST_DATA);

        // Assert
        assertNotNull(result);
        assertNotEquals(TEST_DATA, result);
    }

    @Test
    void decrypt_ValidData_ShouldDecryptSuccessfully() throws Exception {
        // Act
        String decrypted = AESUtil.decrypt(encryptedData);

        // Assert
        assertEquals(TEST_DATA, decrypted);
    }

    @Test
    void encryptAndDecrypt_ShouldMatchOriginalData() throws Exception {
        // Arrange
        String originalData = "SensitiveInfo123!";

        // Act
        String encrypted = AESUtil.encrypt(originalData);
        String decrypted = AESUtil.decrypt(encrypted);

        // Assert
        assertNotEquals(originalData, encrypted);
        assertEquals(originalData, decrypted);
    }

    @Test
    void encrypt_NullData_ShouldThrowException() {
        assertThrows(Exception.class, () -> {
            AESUtil.encrypt(null);
        });
    }

    @Test
    void decrypt_InvalidData_ShouldThrowException() {
        assertThrows(Exception.class, () -> {
            AESUtil.decrypt("InvalidEncryptedData");
        });
    }
}