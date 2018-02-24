/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "RCTPushNotificationManager.h"

// Fabric
#import <Fabric/Fabric.h>
#import <Crashlytics/Crashlytics.h>

@import GoogleMaps;
@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;
  
  // Copy over GTFS database file
  NSFileManager *fileManager = [NSFileManager defaultManager];
  NSError *error;
  NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
  NSString *documentsDirectory = [paths objectAtIndex:0];
  NSString *txtPath = [documentsDirectory stringByAppendingPathComponent:@"gtfs.sqlite"];
  NSString *resourcePath = [[NSBundle mainBundle] pathForResource:@"www/gtfs" ofType:@"sqlite"];
  [fileManager copyItemAtPath:resourcePath toPath:txtPath error:&error];
  
  // notifications
  // TODO will probably want to remove this code when we change decide we want to requrest permissions
  // inside the app (only when needed) instead
  if ([UIApplication instancesRespondToSelector:@selector(registerUserNotificationSettings:)]){
    [application registerUserNotificationSettings:[UIUserNotificationSettings settingsForTypes:UIUserNotificationTypeAlert|UIUserNotificationTypeBadge|UIUserNotificationTypeSound categories:nil]];
  }
  
  // google maps
  [GMSServices provideAPIKey:@"AIzaSyC1e0DWpUMGm6azrprIHomo4diBm3ei9Uw"];

  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"transit"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  // Fabric stuff and Fabric logging
  [Fabric with:@[[Crashlytics class]]];
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

// Required to register for notifications
- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
{
  NSLog(@"push-notification received: %@", notificationSettings);
  [RCTPushNotificationManager didRegisterUserNotificationSettings:notificationSettings];
}
// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  [RCTPushNotificationManager didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
// Required for the notification event. You must call the completion handler after handling the remote notification.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  [RCTPushNotificationManager didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}
// Required for the registrationError event.
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
  [RCTPushNotificationManager didFailToRegisterForRemoteNotificationsWithError:error];
}
// Required for the localNotification event.
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
{
  NSLog(@"push-notification received: %@", notification);
  [RCTPushNotificationManager didReceiveLocalNotification:notification];
}

// Fabric logging function
//RCTLogFunction CrashlyticsReactLogFunction = ^(
//                                               RCTLogLevel level,
//                                               __unused RCTLogSource source,
//                                               NSString *fileName,
//                                               NSNumber *lineNumber,
//                                               NSString *message
//                                               )
//{
//  NSString *log = RCTFormatLog([NSDate date], level, fileName, lineNumber, message);
//  
//#ifdef DEBUG
//  fprintf(stderr, "%s\n", log.UTF8String);
//  fflush(stderr);
//#else
//  CLS_LOG(@"REACT LOG: %s", log.UTF8String);
//#endif
//  
//  int aslLevel;
//  switch(level) {
//    case RCTLogLevelTrace:
//      aslLevel = ASL_LEVEL_DEBUG;
//      break;
//    case RCTLogLevelInfo:
//      aslLevel = ASL_LEVEL_NOTICE;
//      break;
//    case RCTLogLevelWarning:
//      aslLevel = ASL_LEVEL_WARNING;
//      break;
//    case RCTLogLevelError:
//      aslLevel = ASL_LEVEL_ERR;
//      break;
//    case RCTLogLevelFatal:
//      aslLevel = ASL_LEVEL_CRIT;
//      break;
//  }
//  asl_log(NULL, NULL, aslLevel, "%s", message.UTF8String);
//  
//  
//};

@end
