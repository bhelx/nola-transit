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
   * Executes sql on a specified database. The return method is void because we return the results to React Native
   * by emitting an event.
   *
   * @param databaseName name of the database
   * @param sql a sql query sent from the react native app
   * @param callback a javascript callback
   */
  @ReactMethod public void executeSql(String databaseName, String sql, Callback callback) {
    Log.d(LOG_TAG, String.format("Received request from JS: query db %s with %s", databaseName, sql));
    SqliteHelper sqliteHelper = new SqliteHelper(reactContext.getApplicationContext(), databaseName);
    long startTime = System.currentTimeMillis();
    Cursor cursor = sqliteHelper.getReadableDatabase().rawQuery(sql, null);
    long endTime = System.currentTimeMillis();
    double elaspsedTime =  (double) (endTime - startTime) / 1000;
    Log.d(LOG_TAG,String.format("Request took %f seconds", elaspsedTime));
    WritableMap event = Arguments.createMap();
    WritableArray results = mapResults(cursor);
    event.putInt("total", results.size());
    event.putArray("results", results);
    callback.invoke(event);
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
      Log.d(LOG_TAG, "Copying database to data directory");
      // copy db from (src/main/res/raw) directory, to the databases folder for this app
      try {
        InputStream is = context.getResources().openRawResource(R.raw.gtfs);
        FileOutputStream fos = new FileOutputStream(dbPath);
        ByteStreams.copy(is, fos);
        is.close();
        fos.close();
      } catch (FileNotFoundException e) {
        e.printStackTrace();
      } catch (IOException e) {
        e.printStackTrace();
      }
    } else {
      Log.d(LOG_TAG, "Database already copied over");
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

  @Override public String getName() {
    return "Sqlite";
  }
}
