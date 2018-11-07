const axios = require('axios')
const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')
const sql = require('mssql')
const app = express()


app.use(cors())
app.use(bodyParser.json())
app.use(express.static(`${__dirname}/../build`))

require('dotenv').config()
const sk = process.env.SHOPIFY_API_KEY
const ss = process.env.SHOPIFY_API_SECRET
const store = process.env.STORE

app.post('/submitNewCustomer', (req, res) => {
    console.log('New Customer Data', req.body)

    let obj = {
        "customer": {
            "first_name": req.body.first_name,
            "last_name": req.body.last_name,
            "email": req.body.email,
            "verified_email": true,
            "phone": req.body.phone,
            "addresses": [
                {
                    "address1": req.body.address1,
                    "address2": req.body.address2,
                    "city": req.body.city,
                    "province": "Arizona",
                    "zip": req.body.zip,
                    "last_name": req.body.last_name,
                    "first_name": req.body.first_name,
                    "country": "United States"
                }
            ],
            "metafields": getMetafields()   
        }
    }

    function getMetafields() {
        let arr = []
        for(let i = 0; i < req.body.students.length; i++) {
            arr.push(
              {
                "key": "child" + (req.body.students[i].id + 1) + "_grade",
                "value": req.body.students[i].grade,
                "value_type": "string",
                "namespace": "children"
              },
              {
                "key": "child" + (req.body.students[i].id + 1) + "_value",
                "value": req.body.students[i].value,
                "value_type": "string",
                "namespace": "children_names"
              },
              {
                "key": "child" + (req.body.students[i].id + 1) + "_school",
                "value": req.body.students[i].school,
                "value_type": "string",
                "namespace": "children_school"
              }
            )
        }
        return (
         arr   
        )
    }
    console.log(obj.customer)
    console.dir("here", obj.customer.addresses[0])
    res.send('ok')
    axios.post(`https://${sk}:${ss}@${store}.myshopify.com/admin/customers.json`, obj).then(response => {
    }).catch(error => console.log('get customer error'))
})

app.post('/submitProduct', (req, res) => {
    console.log(req.body)
    const obj = req.body
    let image
    if(obj.school === 'BASIS Chandler Primary North') {
        image = 'https://s3-us-west-1.amazonaws.com/thene/chandler.png'
    } else if (obj.school === 'BASIS Ahwatukee') {
        image = 'https://s3-us-west-1.amazonaws.com/thene/ahwatukee.png'
    } else if (obj.school === 'BASIS Scottsdale Primary - West Campus') {
        image = 'https://s3-us-west-1.amazonaws.com/thene/scottsdale.png'
    }

    let product = {
        "product": {
            "title": obj.title,
            "body_html": obj.description,
            "vendor": obj.school,
            "product_type": obj['product-type'],
            "tags": `${obj.school},${ obj.grade.join() }${obj['tax-credit'][0] !== 'false' ? ',tax credit' : ''}`,
            "images": [
                {
                    "src": image
                }
            ],
            "variants": [
                {
                    "option1": obj.title,
                    "price": obj.price,
                    "sku": obj.SKU,
                    "taxable": JSON.parse(obj.tax),
                    "inventory_management": `${obj['track-inventory'] !== 'false' ? 'shopify' : ''}`,
                    "requires_shipping": JSON.parse(obj.tax),
                }
            ]
        }
    }
    axios.post(`https://${sk}:${ss}@${store}.myshopify.com/admin/products.json`, product).then(response => {
        console.log(res.data)
        console.log(response.data.product.variants[0].id)
        const id = response.data.product.variants[0].inventory_item_id
        res.send('ok')

        if(obj['track-inventory'] !== 'false') {
            axios.get(`https://${sk}:${ss}@${store}.myshopify.com/admin/inventory_levels.json?inventory_item_ids=${id}`).then(response => {
                console.log(response.data)
                const inventory = {
                    "inventory_item_id": id,
                    "available": obj.stock,
                    "location_id": response.data.inventory_levels[0].location_id
                }
                axios.post(`https://${sk}:${ss}@${store}.myshopify.com/admin/inventory_levels/set.json`, inventory).then(response => {
                    console.log(response.data)
                }).catch(error => console.log('get product error', error))
            })
        }
    }).catch(error => console.log('get product error', error))
})

// const path = require('path')
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname + '..build/index.html'))
// })




const port = process.env.PORT || 3005
app.listen(port, function() {
    console.log(`Listening on port ${port}`)
})