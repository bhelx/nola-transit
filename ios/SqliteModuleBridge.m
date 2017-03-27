//
//  SqliteModuleBridge.m
//  transit
//
//  Created by Ben Eckel on 3/27/17.
//

#import <Foundation/Foundation.h>

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(Sqlite, NSObject)

RCT_EXTERN_METHOD(executeSql:(NSString *)database query:(NSString *)query callback: (RCTResponseSenderBlock)callback)

@end
