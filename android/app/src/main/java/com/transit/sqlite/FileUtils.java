package com.transit.sqlite;

import android.util.Log;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class FileUtils {

  private static final String TAG = FileUtils.class.getName();

  /**
   * Computes the MD5 digest and returns checksum as a hexadecimal String.
   */
  public static String getMD5Checksum(File file) {
    InputStream is;
    try {
      is = new FileInputStream(file);
    } catch (FileNotFoundException e) {
      Log.e(TAG, "Could not create FileInputStream", e);
      return null;
    }

    return getMD5Checksum(is);
  }

  /**
   * Computes the MD5 digest and returns checksum as a hexadecimal String.  Does not close or
   * flush the stream.
   */
  public static String getMD5Checksum(InputStream is) {
    MessageDigest md;
    try {
      md = MessageDigest.getInstance("MD5");
    } catch (NoSuchAlgorithmException e) {
      Log.e(TAG, "MD5 algorithm not found", e);
      return null;
    }

    final byte[] buffer = new byte[4096];
    int bytesRead = -1;
    try {
      while ((bytesRead = is.read(buffer)) != -1) {
        md.update(buffer, 0, bytesRead);
      }
    } catch (IOException e) {
      Log.e(TAG, "Could not calculate digest", e);
    }
    byte[] digest = md.digest();

    return bytesToHex(digest);
  }

  // https://stackoverflow.com/questions/9655181/how-to-convert-a-byte-array-to-a-hex-string-in-java
  private final static char[] hexArray = "0123456789ABCDEF".toCharArray();

  private static String bytesToHex(byte[] bytes) {
    char[] hexChars = new char[bytes.length * 2];
    for (int j = 0; j < bytes.length; j++) {
      int v = bytes[j] & 0xFF;
      hexChars[j * 2] = hexArray[v >>> 4];
      hexChars[j * 2 + 1] = hexArray[v & 0x0F];
    }
    return new String(hexChars);
  }
}
