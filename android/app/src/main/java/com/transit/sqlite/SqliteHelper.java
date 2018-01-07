package com.transit.sqlite;

import android.content.Context;
import android.database.DatabaseErrorHandler;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

public class SqliteHelper extends SQLiteOpenHelper {

  private static final int DATABASE_VERSION = 1;

  public SqliteHelper(Context context, String databaseName) {
    super(context, context.getDatabasePath(databaseName).getPath(), null, DATABASE_VERSION, new DatabaseErrorHandler() {
      @Override public void onCorruption(SQLiteDatabase dbObj) {
        throw new RuntimeException("Database is corrupted!  Cannot create SqliteHelper.");
      }
    });
  }

  @Override public void onCreate(SQLiteDatabase db) {
  }

  @Override public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
  }

  @Override
  protected void finalize() throws Throwable {
    this.close();
    super.finalize();
  }
}
