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

app.post('/submitNewCustomer', (req, res) => {
    console.log('New Customer Data', req.body)

    let obj = {
        "customer": {
            "first_name": req.body.firstname,
            "last_name": req.body.lastname,
            "email": req.body.email,
            "verified_email": true,
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
                "key": "child" + (req.body.students[i].id + 1) + "school",
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

    axios.post(`https://${sk}:${ss}@basis-ed.myshopify.com/admin/customers.json`, obj).then(res => {
    }).catch(error => console.log('get customer error', error))
})

// const path = require('path')
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname + '..build/index.html'))
// })



const port = process.env.PORT || 3005
app.listen(port, function() {
    console.log(`Listening on port ${port}`)
})