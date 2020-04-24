//
//  AppDelegate.swift
//  Blackwater Billing 1
//
//  Created by Robyn and Nick on 1/13/20.
//  Copyright © 2020 The Gines Bros. All rights reserved.
//

import UIKit
import IQKeyboardManagerSwift
import SQLite
import SQLite3

var databaseLocal: Connection!

// MARK: Companies Table

let companiesLDBTable = Table("companies")
let companyLID = Expression<Int>("companyID")
let companyLDBName = Expression<String>("companyName")
let companyLDBImage = Expression<String>("companyImage")

// MARK: Users Table

let usersLDBTable = Table("users")
let userLID = Expression<Int>("userID")
let userLFKCompany = Expression<Int>("userFKCompany")
let userLDBFirstName = Expression<String>("userFirstName")
let userLDBLastName = Expression<String>("userLastName")
let userLDBEmail = Expression<String>("userEmail")

// MARK: Clients Table

let clientsLDBTable = Table("clients")
let clientLID = Expression<Int>("clientsID")
let clientLFKCompany = Expression<Int>("clientFKCompany")
let clientLDBFirstName = Expression<String>("firstName")
let clientLDBLastName = Expression<String>("lastName")
let clientLDBDOB = Expression<String>("dob")
let clientLDBPhone = Expression<String>("phone")
let clientLDBEmail = Expression<String>("email")
let clientLDBAddress = Expression<String>("address")
let clientLDBCity = Expression<String>("city")
let clientLDBState = Expression<String>("state")
let clientLDBZIP = Expression<String>("zip")
let clientLDBJSAddress = Expression<String>("JSaddress")
let clientLDBJSCity = Expression<String>("JScity")
let clientLDBJSState = Expression<String>("JSstate")
let clientLDBJSZIP = Expression<String>("JSzip")
let clientLDBJSFN = Expression<String>("JSfirstName")
let clientLDBJSLN = Expression<String>("JSlastName")
let clientLDBJSPhone = Expression<String>("JSphone")
let clientLDBHasJob = Expression<Bool>("clinetHasJob")

// MARK: Jobs Table

let jobsLDBTable = Table("jobs")
let jobsLID = Expression<Int>("jobsID")
let jobsLFKClient = Expression<Int>("jobsFKClient")
let jobsLDBName = Expression<String>("name")
let jobsLDBType = Expression<String>("type")
let jobsLDBStatus = Expression<String>("status")
let jobsLDBLossDate = Expression<String>("lossDate")
let jobsLDBLossCat = Expression<String>("CAT")
let jobsLDBLossClass = Expression<String>("class")
let jobsLDBLossCause = Expression<String>("cause")
let jobsLDBBillWho = Expression<Int>("who")
let jobsLDBBillInsC = Expression<String>("insurance")
let jobsLDBBillClaim = Expression<String>("claim")
let jobsLDBAdjuster = Expression<String>("adjuster")
let jobsLDBCompleted = Expression<Bool>("completed")

// MARK: Invoice Table

let invoiceLDBTable = Table("invoices")
let invoiceLID = Expression<Int>("invoiceID")
let invoiceLFKJobs = Expression<Int>("invoiceFKJobs")
let invoiceLDBType = Expression<String>("invoiceType")

// MARK: Invoice Lines Table

let invLinesLDBTable = Table("invoiceLines")
let invLinesLID = Expression<Int>("invoiceLineID")
let invLinesLFKInv = Expression<Int>("invLinesFKInv")
let invLinesLDBRoom = Expression<String>("invLinesRoom")
let invLinesLDBItem = Expression<String>("invLinesItem")
let invLinesLDBQTY = Expression<Double>("invLinesQTY")
let invLinesLDBUnit = Expression<String>("invLinesUnit")
let invLinesLDBDate = Expression<String>("invLinesDate")
let invLinesLDBTakedown = Expression<Int>("invLinesTakedown")

// MARK: Dry Log Table

let drylogLDBTable = Table("drylog")
let drylogLID = Expression<Int>("drylogID")
let drylogLFKJobs = Expression<Int>("drylogFKJobs")
let drylogLDBTestNum = Expression<Int>("drylogTestNum")
let drylogLDBTestDate = Expression<String>("drylogTestDate")
let drylogLDBTestTime = Expression<String>("drylogTestTime")
let drylogLOCT = Expression<Double?>("drylogOCT")
let drylogLOCRH = Expression<Double?>("drylogOCRH")
let drylogLOCGP = Expression<Double?>("dylogOCGP")
let drylogLUAT = Expression<Double?>("dylogUAT")
let drylogLUARH = Expression<Double?>("dylogUARH")
let drylogLUAGP = Expression<Double?>("dylogUAGP")

// MARK: Rooms Table

let roomsLDBTable = Table("rooms")
let roomLID = Expression<Int>("roomID")
let roomLFKjobs = Expression<Int>("roomFKjobs")
let roomLDBName = Expression<String>("roomName")
let roomLDBDimensions = Expression<String>("dimensions")

// MARK: Dry Log Room Environment

let dlrEnvLDBTable = Table("dlrEnv")
let dlrEnvLID = Expression<Int>("dlrEnvID")
let dlrEnvLFKRooms = Expression<Int>("dlrEnvFKRooms")
let dlrEnvLTestNum = Expression<Int>("dlrEnvTestNum")
let dlrEnvLRmName = Expression<String>("dlrEnvRoomName")
let dlrEnvLAAT = Expression<Double?>("dlrEnvAAT")
let dlrEnvLAARH = Expression<Double?>("dlrEnvAARH")
let dlrEnvLAAGP = Expression<Double?>("dlrEnvAAGP")
let dlrEnvLDOT = Expression<Double?>("dlrEnvDOT")
let dlrEnvLDORH = Expression<Double?>("dlrEnvDORH")
let dlrEnvLDOGP = Expression<Double?>("dlrEnvDOGP")

// MARK: Dry Log Room Moisture

let dlrMoistLDBTable = Table("dlrMst")
let dlrMoistLID = Expression<Int>("dlrMstID")
let dlrMoistLFKRooms = Expression<Int>("dlrMstFKRooms")
let dlrMoistLDBTestNum = Expression<Int>("dlrMstTestNum")
let dlrMoistLDBMaterial  = Expression<String>("dlrMstMaterial")
let dlrMoistLDBGoal = Expression<Double?>("dlrMstGoal")
let dlrMoistLDBMatNum = Expression<Int>("dlrMstMaterialNum")

// MARK: Dry Log Room Moisture Tests

let dlrMTestLDBTable = Table("dlrMTest")
let dlrMTestLID = Expression<Int>("dlrMTestID")
let dlrMTestLFKMoisture = Expression<Int>("dlrMTestFKMoisture")
let dlrMTestLDBTestNum = Expression<Int>("dlrMTestNum")
let dlrMTestLDBReading  = Expression<Double?>("dlrMTestReading")

// MARK: Visits Table

let visitsLDBTable = Table("visits")
let visitsLID = Expression<Int>("visitsID")
let visitsLFKjobs = Expression<Int>("visitsFKJobs")
let visitsLDBNumber = Expression<Int>("visitNumber")
let visitsLDBDate = Expression<String>("visitDate")
let visitsLDBTime = Expression<String>("visitTime")

// MARK: Photos Main Table

let photosLDBTable = Table("photos")
let photoLID = Expression<Int>("photosID")
let photosLFKVisits = Expression<Int>("photosFKVisits")
let photosLDBImages = Expression<String>("images")

// MARK: Service List Table

let serviceLDBTable = Table("serviceList")
let serviceLID = Expression<Int>("serviceID")
let serviceLDBName = Expression<String>("serviceName")
let serviceLDBUnit = Expression<String>("serviceUnit")
let serviceLDBType = Expression<Int>("serviceType")

// MARK: Insurance Companies Table

let insuranceLDBTable = Table("insurance")
let insuranceLID = Expression<Int>("insuranceID")
let insuranceLDBComp = Expression<String>("insuranceComp")
let insuranceLDBPhone = Expression<String>("insurancePhone")
let insuranceLDBEmail = Expression<String>("insuranceEmail")
let insuranceLDBFax = Expression<String>("insuranceFax")
let insuranceLDBNotes = Expression<String>("insuranceNotes")

// MARK: Adjusters Table

let adjusterLDBTable = Table("adjusters")
let adjusterLID = Expression<Int>("adjusterID")
let adjusterLFKIns = Expression<Int>("adjusterFKIns")
let adjusterLDBFirst = Expression<String>("adjusterFirst")
let adjusterLDBLast = Expression<String>("adjusterLast")
let adjusterLDBPhone = Expression<String>("adjusterPhone")
let adjusterLDBEmail = Expression<String>("adjusterEmail")
let adjusterLDBNotes = Expression<String>("adjusterNotes")

// MARK: Partner Companies

let partnerLDBTable = Table("partners")
let partnerLID = Expression<Int>("partnerID")
let partnerLDBComp = Expression<String>("partnerComp")
let partnerLDBNotes = Expression<String>("partnerNotes")

// MARK: User Default Selection Table

let defaultLDBTable = Table("defaults")
let defaultLID = Expression<Int>("defaultID")
let defaultLFKJob = Expression<Int>("defaultFKJobs")
let defaultLDBSegment = Expression<Int>("defaultSegment")
let defaultLDBRoom = Expression<Int>("defaultRoom")
let defaultLDBVisit = Expression<Int>("defaultVisit")

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    func createPaths(table: String) {
        do {
            let documentDirectory = try FileManager.default.url(for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: true)
            let fileUrl = documentDirectory.appendingPathComponent(table).appendingPathExtension("sqlite3")
            let tryDatabase = try Connection(fileUrl.path)
            databaseLocal = tryDatabase
        } catch {
            print(error)
        }
    }
    
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Override point for customization after application launch.
        IQKeyboardManager.shared.enable = true
        
// MARK: Clients Local Database Creation 
        
        createPaths(table: "companies")
        createPaths(table: "users")
        createPaths(table: "clients")
        createPaths(table: "jobs")
        createPaths(table: "invoices")
        createPaths(table: "invoiceLines")
        createPaths(table: "serviceList")
        createPaths(table: "drylog")
        createPaths(table: "rooms")
        createPaths(table: "dlrEnv")
        createPaths(table: "dlrMst")
        createPaths(table: "dlrMTest")
        createPaths(table: "visits")
        createPaths(table: "photos")
        createPaths(table: "insurance")
        createPaths(table: "adjusters")
        createPaths(table: "defaults")
        createPaths(table: "partners")
        
        let createCompaniesTable = companiesLDBTable.create(ifNotExists: true) { (table) in
            table.column(companyLID, primaryKey: true)
            table.column(companyLDBName, unique: true)
            table.column(companyLDBImage)
        }
        let createUsersTable = usersLDBTable.create(ifNotExists: true) { (table) in
            table.column(userLID, primaryKey: true)
            table.column(userLDBFirstName)
            table.column(userLDBLastName)
            table.column(userLDBEmail, unique: true)
            table.column(userLFKCompany)
            table.foreignKey(userLFKCompany, references: companiesLDBTable, companyLID, delete: .cascade)
        }
        let createClientsTable = clientsLDBTable.create(ifNotExists: true) { (table) in
            table.column(clientLID, primaryKey: true)
            table.column(clientLDBFirstName)
            table.column(clientLDBLastName)
            table.column(clientLDBDOB)
            table.column(clientLDBPhone)
            table.column(clientLDBEmail)
            table.column(clientLDBAddress)
            table.column(clientLDBCity)
            table.column(clientLDBState)
            table.column(clientLDBZIP)
            table.column(clientLDBJSAddress)
            table.column(clientLDBJSCity)
            table.column(clientLDBJSState)
            table.column(clientLDBJSZIP)
            table.column(clientLDBJSFN)
            table.column(clientLDBJSLN)
            table.column(clientLDBJSPhone)
            table.column(clientLDBHasJob)
            table.column(clientLFKCompany)
            table.foreignKey(clientLFKCompany, references: companiesLDBTable, companyLID, delete: .cascade)
        }
        let createJobsTable = jobsLDBTable.create(ifNotExists: true) { (table) in
            table.column(jobsLID, primaryKey: true)
            table.column(jobsLDBName)
            table.column(jobsLDBType)
            table.column(jobsLDBStatus)
            table.column(jobsLDBLossDate)
            table.column(jobsLDBLossClass)
            table.column(jobsLDBLossCat)
            table.column(jobsLDBLossCause)
            table.column(jobsLDBBillWho)
            table.column(jobsLDBBillInsC)
            table.column(jobsLDBBillClaim)
            table.column(jobsLDBAdjuster)
            table.column(jobsLDBCompleted)
            table.column(jobsLFKClient)
            table.foreignKey(jobsLFKClient, references: clientsLDBTable, clientLID, delete: .cascade)
        }
        let createInvoicesTable = invoiceLDBTable.create(ifNotExists: true) { (table) in
            table.column(invoiceLID, primaryKey: true)
            table.column(invoiceLDBType)
            table.column(invoiceLFKJobs)
            table.foreignKey(invoiceLFKJobs, references: jobsLDBTable, jobsLID, delete: .cascade)
        }
        let createInvoiceLinesTable = invLinesLDBTable.create(ifNotExists: true) { (table) in
            table.column(invLinesLID, primaryKey: true)
            table.column(invLinesLDBRoom)
            table.column(invLinesLDBItem)
            table.column(invLinesLDBQTY)
            table.column(invLinesLDBUnit)
            table.column(invLinesLDBDate)
            table.column(invLinesLDBTakedown)
            table.column(invLinesLFKInv)
            table.foreignKey(invLinesLFKInv, references: invoiceLDBTable, invoiceLID, delete: .cascade)
        }
        let createDryLogTable = drylogLDBTable.create(ifNotExists: true) { (table) in
            table.column(drylogLID, primaryKey: true)
            table.column(drylogLDBTestNum)
            table.column(drylogLDBTestDate)
            table.column(drylogLDBTestTime)
            table.column(drylogLOCT)
            table.column(drylogLOCRH)
            table.column(drylogLOCGP)
            table.column(drylogLUAT)
            table.column(drylogLUARH)
            table.column(drylogLUAGP)
            table.column(drylogLFKJobs)
            table.foreignKey(drylogLFKJobs, references: jobsLDBTable, jobsLID, delete: .cascade)
        }
        let createDlrEnvTable = dlrEnvLDBTable.create(ifNotExists: true) { (table) in
            table.column(dlrEnvLID, primaryKey: true)
            table.column(dlrEnvLTestNum)
            table.column(dlrEnvLRmName)
            table.column(dlrEnvLAAT)
            table.column(dlrEnvLAARH)
            table.column(dlrEnvLAAGP)
            table.column(dlrEnvLDOT)
            table.column(dlrEnvLDORH)
            table.column(dlrEnvLDOGP)
            table.column(dlrEnvLFKRooms)
            table.foreignKey(dlrEnvLFKRooms, references: roomsLDBTable, roomLID, delete: .cascade)
        }
        let createDlrMoistTable = dlrMoistLDBTable.create(ifNotExists: true) { (table) in
            table.column(dlrMoistLID, primaryKey: true)
            table.column(dlrMoistLDBTestNum)
            table.column(dlrMoistLDBMaterial)
            table.column(dlrMoistLDBGoal)
            table.column(dlrMoistLDBMatNum)
            table.column(dlrMoistLFKRooms)
            table.foreignKey(dlrMoistLFKRooms, references: roomsLDBTable, roomLID, delete: .cascade)
        }
        let createDlrMTestTable = dlrMTestLDBTable.create(ifNotExists: true) { (table) in
            table.column(dlrMTestLID, primaryKey: true)
            table.column(dlrMTestLDBTestNum)
            table.column(dlrMTestLDBReading)
            table.column(dlrMTestLFKMoisture)
            table.foreignKey(dlrMTestLFKMoisture, references: dlrMoistLDBTable, dlrMoistLID, delete: .cascade)
        }
        let createRoomsTable = roomsLDBTable.create(ifNotExists: true) { (table) in
            table.column(roomLID, primaryKey: true)
            table.column(roomLDBName)
            table.column(roomLDBDimensions)
            table.column(roomLFKjobs)
            table.foreignKey(roomLFKjobs, references: jobsLDBTable, jobsLID, delete: .cascade)
        }
        let createVisitsTable = visitsLDBTable.create(ifNotExists: true) { (table) in
            table.column(visitsLID, primaryKey: true)
            table.column(visitsLDBNumber)
            table.column(visitsLDBDate)
            table.column(visitsLDBTime)
            table.column(visitsLFKjobs)
            table.foreignKey(visitsLFKjobs, references: jobsLDBTable, jobsLID, delete: .cascade)
        }
        let createPhotosTable = photosLDBTable.create(ifNotExists: true) { (table) in
            table.column(photoLID, primaryKey: true)
            table.column(photosLDBImages)
            table.column(photosLFKVisits)
            table.foreignKey(photosLFKVisits, references: visitsLDBTable, visitsLID, delete: .cascade)
        }
        let createServiceTable = serviceLDBTable.create(ifNotExists: true) { (table) in
            table.column(serviceLID, primaryKey: true)
            table.column(serviceLDBName, unique: true)
            table.column(serviceLDBUnit)
            table.column(serviceLDBType)
        }
        let createInsuranceTable = insuranceLDBTable.create(ifNotExists: true) { (table) in
            table.column(insuranceLID, primaryKey: true)
            table.column(insuranceLDBComp, unique: true)
            table.column(insuranceLDBPhone)
            table.column(insuranceLDBEmail)
            table.column(insuranceLDBFax)
            table.column(insuranceLDBNotes)
        }
        let createAdjusterTable = adjusterLDBTable.create(ifNotExists: true) { (table) in
            table.column(adjusterLID, primaryKey: true)
            table.column(adjusterLDBFirst)
            table.column(adjusterLDBLast)
            table.column(adjusterLDBPhone)
            table.column(adjusterLDBEmail, unique: true)
            table.column(adjusterLDBNotes)
            table.column(adjusterLFKIns)
            table.foreignKey(adjusterLFKIns, references: insuranceLDBTable, insuranceLID, delete: .cascade)
        }
        let createPartnerTable = partnerLDBTable.create(ifNotExists: true) { (table) in
            table.column(partnerLID, primaryKey: true)
            table.column(partnerLDBComp)
            table.column(partnerLDBNotes)
            
            
        }
        let createDefaultsTable = defaultLDBTable.create(ifNotExists: true) { (table) in
            table.column(defaultLID, primaryKey: true)
            table.column(defaultLDBSegment)
            table.column(defaultLDBVisit)
            table.column(defaultLDBRoom)
            table.column(defaultLFKJob)
            table.foreignKey(defaultLFKJob, references: jobsLDBTable, jobsLID, delete: .cascade)
        }
 
       
        do {
            try databaseLocal.execute("PRAGMA foreign_keys = ON;")
            
            try databaseLocal.run(createCompaniesTable)
            try databaseLocal.run(createUsersTable)
            try databaseLocal.run(createClientsTable)
            try databaseLocal.run(createJobsTable)
            try databaseLocal.run(createInvoicesTable)
            try databaseLocal.run(createInvoiceLinesTable)
            try databaseLocal.run(createDryLogTable)
            try databaseLocal.run(createRoomsTable)
            try databaseLocal.run(createDlrEnvTable)
            try databaseLocal.run(createDlrMoistTable)
            try databaseLocal.run(createDlrMTestTable)
            try databaseLocal.run(createVisitsTable)
            try databaseLocal.run(createPhotosTable)
            try databaseLocal.run(createServiceTable)
            try databaseLocal.run(createInsuranceTable)
            try databaseLocal.run(createAdjusterTable)
            try databaseLocal.run(createPartnerTable)
            try databaseLocal.run(createDefaultsTable)
            
            
            
            let image = UIImage.init(named: "favico")
            let image1 = UIImage.init(named: "ATP")
            let imageData = image?.pngData()
            let imageData1 = image1?.pngData()
            let strBase64 = imageData?.base64EncodedString(options: .lineLength64Characters)
            let strBase641 = imageData1?.base64EncodedString(options: .lineLength64Characters)
            
            let example = companiesLDBTable.insert(or: .abort, companyLDBName <- "Blackwater Billing", companyLDBImage <- strBase64!)
            let example2 = companiesLDBTable.insert(or: .abort, companyLDBName <- "Peppy Revival", companyLDBImage <- strBase641!)
            try databaseLocal.run(example)
            try databaseLocal.run(example2)
            
            let userEx = usersLDBTable.insert(or: .abort, userLDBFirstName <- "Nick", userLDBLastName <- "Gines", userLDBEmail <- "nick@blackwaterbilling.com", userLFKCompany <- 1)
            let userEx2 = usersLDBTable.insert(or: .abort, userLDBFirstName <- "Dan", userLDBLastName <- "Smith", userLDBEmail <- "dansmith@peppyrevival.net", userLFKCompany <- 2)
            try databaseLocal.run(userEx)
            try databaseLocal.run(userEx2)
            
            let testSupplies = ["Apply Antimicrobial", "PPE Suit", "Tear Out Carpet", "Tear out Drywall", "Muck out water", "Tear Out Tack Strips", "Apply Encapsulant", "Containment Barrier", "Decon Chamber", "Air Mover", "Dehu - Large"]
            let testUnits = ["SF", "Units"]
            
            for all in 0..<testSupplies.count {
                if (testSupplies[all] == "PPE Suit") {
                    let insertSupplies = serviceLDBTable.insert(or: .abort,  serviceLDBName <- testSupplies[all], serviceLDBUnit <- testUnits[1], serviceLDBType <- 0)
                    try databaseLocal.run(insertSupplies)
                } else if (testSupplies[all] == "Air Mover" || testSupplies[all] == "Dehu - Large") {
                    let insertSupplies = serviceLDBTable.insert(or: .abort,  serviceLDBName <- testSupplies[all], serviceLDBUnit <- testUnits[1], serviceLDBType <- 1)
                    try databaseLocal.run(insertSupplies)
                } else {
                    let insertSupplies = serviceLDBTable.insert(or: .abort,  serviceLDBName <- testSupplies[all], serviceLDBUnit <- testUnits[0], serviceLDBType <- 0)
                    try databaseLocal.run(insertSupplies)
                }
                
            }
          
            let insert = insuranceLDBTable.insert(or: .abort, insuranceLDBComp <- "Livin' Like Larry", insuranceLDBPhone <- "8675309", insuranceLDBEmail <- "claims@claims.com", insuranceLDBFax <- "Press the Star Key", insuranceLDBNotes <- "Liberty Biberty customizes your car insurance you you only pay for what you need")
            try databaseLocal.run(insert)
    
            
            
            print("created tables")
        } catch {
            print(error)
        }
        
        
        
        return true
    }

    // MARK: UISceneSession Lifecycle

    func application(_ application: UIApplication, configurationForConnecting connectingSceneSession: UISceneSession, options: UIScene.ConnectionOptions) -> UISceneConfiguration {
        // Called when a new scene session is being created.
        // Use this method to select a configuration to create the new scene with.
        return UISceneConfiguration(name: "Default Configuration", sessionRole: connectingSceneSession.role)
    }

    func application(_ application: UIApplication, didDiscardSceneSessions sceneSessions: Set<UISceneSession>) {
        // Called when the user discards a scene session.
        // If any sessions were discarded while the application was not running, this will be called shortly after application:didFinishLaunchingWithOptions.
        // Use this method to release any resources that were specific to the discarded scenes, as they will not return.
    }

   
}

