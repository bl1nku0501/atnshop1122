const express = require('express')
const app = express();
const {ObjectId} = require('mongodb')

const {insertObjectToCollection, 
        getAllDocumentsFromCollection,deleteDocumentById,
    updateCollection,getDocumentById,SortupPrice,SortdownPrice,dosearch} = require('./databaseHandler')


app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))//đọc dữ liệu từ người d
app.use(express.static('./public'));// css trong nodejs
app.use('/css',express.static(__dirname+'/public/css'))
//URL mapping: server/view

app.get('/',async (req,res)=>{
    //1. lay du lieu tu Mongo
    const results = await getAllDocumentsFromCollection("Products")
    //2. hien thi du lieu qua HBS
    res.render('index',{products:results})
})

app.get('/edit/:id',async (req,res)=>{
    const id = req.params.id
    //truy cap database lay product co id o tren
    const productToEdit = await getDocumentById("Products", id)
    res.render('edit',{product:productToEdit})
})
app.post('/update',async (req,res)=>{
    const id = req.body.txtId
    const nameInput = req.body.txtName
    const priceInput = req.body.txtPrice
    const picURLInput = req.body.txtPicURL
    
    const newvalues = { $set: {name: nameInput, price: priceInput,picURL:picURLInput} }
    await updateCollection("Products", id, newvalues)
    res.redirect('/')
})


app.get('/addproduct', (req,res)=>{
    res.render('insert')
})
app.get('/delete/:id',async (req,res)=>{
    const id = req.params.id
    console.log("id can xoa:"+ id)
    // const collectionName = "Products"
    await deleteDocumentById("Products", id)
    res.redirect('/')
})

app.post('/insert',async (req,res)=>{
    const nameInput = req.body.txtName
    const priceInput = req.body.txtPrice
    const picURLInput = req.body.txtPicURL
    // const categoryId = req.body.cbCategory
    // console.log('CategoryId: ' + categoryId)
    if(picURLInput.trim().length == 0)
    {
        var results =await getAllDocumentsFromCollection("Products")
        res.render('insert', { products: results, urlError: 'Phai nhap Image URL!'})
    }
    else if (nameInput.trim().length == 0) {
        res.render('insert', { nameError: "You not input Name!" })}
    else if(isNaN(priceInput)==true){
        //Khong phai la so, bao loi, ket thuc ham
        res.render('insert',{errorPrice:' Gia Khong phai so'})
        return;
    }
    else
    {
        const newP = {name:nameInput,price:Number.parseFloat(priceInput),picURL:picURLInput}
                    // ,categoryId:categoryId}
        insertObjectToCollection("Products",newP)   
        res.redirect('/')
    }

})
app.get('/sapxeptang',async (req,res)=>{
    const sapxep= await SortupPrice("Products")
    res.render('index',{products: sapxep})
})
app.get('/sapxepgiam',async (req,res)=>{
    const sapxep= await SortdownPrice("Products")
    res.render('index',{products: sapxep})
})
app.post('/search', async (req, res) => {
    const searchText =req.body.txtName;
    const result = await dosearch(searchText,"Products")
    res.render('index',{products:result})
})
const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log('Server is running!')