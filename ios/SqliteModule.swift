//
//  SqliteModule.swift
//  transit
//
//  Created by Ben Eckel on 3/27/17.
//

import Foundation
import SQLite

@objc(Sqlite)
class SqliteModule: NSObject {
  @objc func executeSql(_ database: String, query: String, callback: RCTResponseSenderBlock) -> Void {
    debugPrint("executeSql [" + database + "] " + query)
    copyDatabase()

    do {
      let documentsPath = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true)[0]
      let db = try Connection(documentsPath + "/" + database)
      let stmt = try db.prepare(query)
      var rows = [Dictionary<String, Any>]()
      for row in stmt {
        var obj = Dictionary<String, Any>()
        for (index, name) in stmt.columnNames.enumerated() {
          obj[name] = row[index]
        }
        rows.append(obj)
      }
      callback([["results": rows]])
    } catch {
      debugPrint("error")
      print("Error info: \(error)")
    }
  }
  
  func copyDatabase() {
    let bundlePath = Bundle.main.path(forResource: "www/gtfs", ofType: ".sqlite")
    let destPath = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true).first!
    let fileManager = FileManager.default
    let fullDestPath = URL(fileURLWithPath: destPath).appendingPathComponent("gtfs.sqlite")
    if fileManager.fileExists(atPath: fullDestPath.path){
      print("Database file is exist")
      print(fileManager.fileExists(atPath: bundlePath!))
    }else{
      do{
        try fileManager.copyItem(atPath: bundlePath!, toPath: fullDestPath.path)
      }catch{
        print("\n",error)
      }
    }
  }
}
