package com.transit.sqlite;

import android.content.Context;
import android.database.Cursor;
import android.util.Log;
import com.facebook.common.internal.ByteStreams;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.transit.R;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.concurrent.TimeUnit;

/**
 * Native module to enable access to SQLite databases.  From JavaScript, you can access this module
 * using {@code React.NativeModules.Sqlite}
 *
 * @see <a href="https://facebook.github.io/react-native/docs/native-modules-android.html">
 * https://facebook.github.io/react-native/docs/native-modules-android.html</a>
 */
public class SqliteModule extends ReactContextBaseJavaModule {

  private static final String TAG = SqliteModule.class.getName();
  private static final String GTFS_DB = "gtfs.sqlite";
  private final ReactContext reactContext;
  private final HashMap<String, SqliteHelper> dbHelpers;

  @Override public String getName() {
    return "Sqlite";
  }

  public SqliteModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
    this.dbHelpers = new HashMap<>();
    copyDatabase(reactContext.getApplicationContext());
  }

  /**
   * Executes sql on a specified database. The return method is void because we return the results
   * to React Native by emitting an event.
   *
   * @param dbName name of the database
   * @param sql a sql query sent from the react native app
   * @param callback a javascript callback
   */
  @ReactMethod public void executeSql(String dbName, String sql, Callback callback) {
    Log.v(TAG, String.format("Received request from JS: query db %s with %s", dbName, sql));
    long startTime = System.currentTimeMillis();
    Cursor cursor = getDbHelper(dbName).getReadableDatabase().rawQuery(sql, null);
    long endTime = System.currentTimeMillis();
    double elapsedTime = (double) (endTime - startTime) / 1000;
    Log.v(TAG, String.format("Request took %f seconds", elapsedTime));
    WritableMap event = Arguments.createMap();
    WritableArray results = mapResults(cursor);
    event.putInt("total", results.size());
    event.putArray("results", results);
    Log.v(TAG, String.format("Sending event to JS: %s", event.toHashMap().toString()));
    callback.invoke(event);
  }

  /**
   * Gets the SqliteHelper for this database or creates one and adds it to dbHelpers.
   */
  private SqliteHelper getDbHelper(String dbName) {
    if (dbHelpers.containsKey(dbName)) {
      return dbHelpers.get(dbName);
    }
    dbHelpers.put(dbName, new SqliteHelper(reactContext.getApplicationContext(), dbName));
    return dbHelpers.get(dbName);
  }

  /**
   * Copies the GTFS db from the application's resources to the databases folder if it doesn't
   * already exist.
   */
  private void copyDatabase(Context context) {
    File dbDirectory = context.getDatabasePath(GTFS_DB).getParentFile();
    if (!dbDirectory.exists()) {
      dbDirectory.mkdir();
    }
    String dbPath = String.format("/data/data/%s/databases/%s", context.getPackageName(), GTFS_DB);
    File dbFile = new File(dbPath);
    if (!dbFile.exists()) {
      copyDatabase(dbPath);
    } else {
      // data integrity check to ensure db was copied correctly from resources directory
      InputStream is = context.getResources().openRawResource(R.raw.gtfs);
      String resourceChecksum = FileUtils.getMD5Checksum(is);
      String dbFileChecksum = FileUtils.getMD5Checksum(dbFile);
      try {
        is.close();
      } catch (IOException e) {
        Log.w(TAG, "Could not close resource stream");
      }
      if (resourceChecksum.equalsIgnoreCase(dbFileChecksum)) {
        Log.d(TAG, "Database already copied over");
      } else {
        // delete the previous files before copying
        if (dbFile.delete() & new File(dbPath + "-journal").delete()) {
          Log.d(TAG, "Re-copying database to data directory");
          copyDatabase(dbPath);
        } else {
          Log.e(TAG, "Failed to delete database file");
        }
      }
    }
  }

  private void copyDatabase(String dbPath) {
    Log.d(TAG, "Copying database to " + dbPath);
    long startTime = System.nanoTime();
    try {
      // copy db from (src/main/res/raw) directory, to the databases folder for this app
      InputStream is = reactContext.getResources().openRawResource(R.raw.gtfs);
      FileOutputStream fos = new FileOutputStream(dbPath);
      ByteStreams.copy(is, fos);
      is.close();
      fos.close();
    } catch (FileNotFoundException e) {
      Log.e(TAG, "Failed to copy database", e);
    } catch (IOException e) {
      Log.e(TAG, "Failed to copy database", e);
    }
    long difference = System.nanoTime() - startTime;
    Log.d(TAG, String.format("copyDatabase took %d ms", TimeUnit.NANOSECONDS.toMillis(difference)));
  }

  /**
   * Loops over every row in the Cursor and maps it to a JavaScript object (WritableMap).
   *
   * @return an array of mapped rows
   */
  private WritableArray mapResults(Cursor cursor) {
    WritableArray rows = Arguments.createArray();
    while (cursor.moveToNext()) {
      WritableMap row = Arguments.createMap();
      for (String columnName : cursor.getColumnNames()) {
        int idx = cursor.getColumnIndex(columnName);
        int colType = cursor.getType(idx);
        switch (colType) {
          case Cursor.FIELD_TYPE_NULL:
            row.putNull(columnName);
            break;
          case Cursor.FIELD_TYPE_INTEGER:
            row.putInt(columnName, cursor.getInt(idx));
            break;
          case Cursor.FIELD_TYPE_FLOAT:
            row.putDouble(columnName, cursor.getDouble(idx));
            break;
          case Cursor.FIELD_TYPE_STRING:
            row.putString(columnName, cursor.getString(idx));
            break;
        }
      }
      rows.pushMap(row);
    }
    cursor.close();
    return rows;
  }
}
