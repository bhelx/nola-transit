package com.transit.sqlite;

import android.content.Context;
import android.database.Cursor;
import android.util.Log;
import com.facebook.common.internal.ByteStreams;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.transit.R;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

/**
 * Native module to enable access to sqlite.  From Javascript, you can access this module using
 * {@code React.NativeModules.Sqlite}
 *
 * @see <a href="https://facebook.github.io/react-native/docs/native-modules-android.html">
 * https://facebook.github.io/react-native/docs/native-modules-android.html</a>
 */
public class SqliteModule extends ReactContextBaseJavaModule {

  private static final String LOG_TAG = SqliteModule.class.getSimpleName();
  private static final String GTFS_DB = "gtfs.sqlite";
  private final ReactContext reactContext;

  public SqliteModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
    copyDatabase(reactContext.getApplicationContext());
  }

  /**
   * Executes a query on a specified database. The return method is void because we return the results to React Native
   * by emitting an event.
   *
   * @param sql a sql query sent from the react native app
   */
  @ReactMethod public void query(String databaseName, String sql) {
    Log.d(LOG_TAG, String.format("Received request from JS: query %s%n with %s", databaseName, sql));
    SqliteHelper sqliteHelper = new SqliteHelper(reactContext.getApplicationContext(), databaseName);
    Cursor cursor = sqliteHelper.getReadableDatabase().rawQuery(sql, null);
    WritableMap event = Arguments.createMap();
    WritableArray results = mapResults(cursor);
    event.putInt("total", results.size());
    event.putArray("payload", results);
    this.reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("results", event);
  }

  /**
   * Copies the GTFS db from the application's resources to the databases folder if it doesn't already exist.
   */
  private void copyDatabase(Context context) {
    String dbPath = String.format("/data/data/%s/databases/%s", context.getPackageName(), GTFS_DB);
    File dbDirectory = context.getDatabasePath(GTFS_DB).getParentFile();
    if (!dbDirectory.exists()) {
      dbDirectory.mkdir();
    }
    if (!new File(dbPath).exists()) {
      // copy db from (src/main/res/raw) directory, to the databases folder for this app
      InputStream is = context.getResources().openRawResource(R.raw.gtfs);
      FileOutputStream fos = null;
      try {
        fos = new FileOutputStream(dbPath);
        ByteStreams.copy(is, fos);
      } catch (FileNotFoundException e) {
        e.printStackTrace();
      } catch (IOException e) {
        e.printStackTrace();
      }
    }
  }

  /**
   * Loops over every row in the Cursor and maps it to a javascript object (WritableMap).
   *
   * @return an array of mapped rows
   */
  private WritableArray mapResults(Cursor cursor) {
    WritableArray rows = Arguments.createArray();
    while (cursor.moveToNext()) {
      WritableMap row = Arguments.createMap();
      for (String columnName : cursor.getColumnNames()) {
        String columnValue = cursor.getString(cursor.getColumnIndex(columnName));
        row.putString(columnName, columnValue);
      }
      rows.pushMap(row);
    }
    cursor.close();
    return rows;
  }

  @Override public String getName() {
    return "Sqlite";
  }
}
