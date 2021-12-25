const {MongoClient,ObjectId} = require('mongodb')

const DATABASE_URL = 'mongodb+srv://quanle:quanle2001@cluster0.xwr9t.mongodb.net/test'
const DATABASE_NAME = 'atnstore'

async function getDatabase() {
    const client = await MongoClient.connect(DATABASE_URL)
    const dbo = client.db(DATABASE_NAME)
    return dbo
}
async function insertObjectToCollection(collectionName,objectValue){
    const dbo = await getDatabase()
    const result = await dbo.collection(collectionName).insertOne(objectValue)
    console.log("Gia tri id moi duoc insert la: ", result.insertedId.toHexString());
}
async function getAllDocumentsFromCollection(collectionName) {
    const dbo = await getDatabase()
    //const results = await dbo.collection("Products").find({}).sort({name:1}).limit(7).toArray()   
    const results = await dbo.collection(collectionName).find({}).toArray()
    return results
}
async function deleteDocumentById(collectionName, id) {
    const dbo = await getDatabase()
    await dbo.collection(collectionName).deleteOne({ _id: ObjectId(id)})
}
async function updateCollection(collectionName, id, newvalues) {
    const dbo = await getDatabase()
    await dbo.collection(collectionName).updateOne({ _id: ObjectId(id)}, newvalues)
}

async function getDocumentById(collectionName, id) {
    const dbo = await getDatabase()
    const productToEdit = await dbo.collection(collectionName).findOne({ _id: ObjectId(id) })
    return productToEdit
}
async function SortupPrice(collectionName,) {
    const dbo = await getDatabase()
    const results = await dbo.collection("Products").find({}).sort({price:1}).toArray()   
    return results
}
async function SortdownPrice(collectionName,) {
    const dbo = await getDatabase()
    const results = await dbo.collection("Products").find({}).sort({price:-1}).toArray()   
    return results
}

async function dosearch(condition,collectionName){
    const dbo = await getDatabase();
    const searchCondition = new RegExp(condition,'i')
    var results = await dbo.collection(collectionName).find({name:searchCondition}).toArray();
    return results;
}

module.exports ={getDatabase,insertObjectToCollection,
    getAllDocumentsFromCollection,deleteDocumentById,
    updateCollection,getDocumentById,SortupPrice,SortdownPrice,dosearch}