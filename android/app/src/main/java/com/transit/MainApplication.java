package com.transit;

import android.app.Application;

import com.crashlytics.android.Crashlytics;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.facebook.react.BuildConfig;
import com.facebook.react.ReactApplication;
import com.joshblour.reactnativepermissions.ReactNativePermissionsPackage;
import com.smixx.fabric.FabricPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.oblador.vectoricons.VectorIconsPackage;
import com.transit.sqlite.SqlitePackage;
import java.util.Arrays;
import java.util.List;

import io.fabric.sdk.android.Fabric;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new ReactNativePermissionsPackage(),
          new FabricPackage(),
          new ReactNativePushNotificationPackage(),
          new VectorIconsPackage(),
          new MapsPackage(),
          new SqlitePackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    Fabric.with(this, new Crashlytics());
    SoLoader.init(this, /* native exopackage */ false);
  }
}
