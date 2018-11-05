import React, { Component } from 'react'
import { Page, Button, TextField, Select, ChoiceList, Tooltip, Link } from '@shopify/polaris'
import { Redirect } from 'react-router-dom'
import axios from 'axios'

export default class Products extends Component {
    state = {
        redirect: false,
        product: '',
        description: '',
        selectedSchool: '',
        productType: '',
        grade: [],
        tax: 'false',
        allSelected: true,
        price: '',
        stock: '',
        taxCredit: 'false',
        shipping: 'false',
        trackInventory: 'false',
        prefix: '',
        SKU: 'Please Select a School and Prefix',
        productSKU: {
            'ATF: ': '2048-73012-7301-000',
            'BK: ': '2052-73010-7311-000',
            'CL: ': '2052-73010-7311-000',
            'EC: ': '2001-73010-7311-000',
            'SO: ': '2001-73010-7311-000',
            'BP: ': '2001-73010-7311-000',
            'FT: ': '2052-73010-7311-000',
            'KG: ': '2048-73010-7305-000',
            'LB: ': '2052-73010-7311-000',
            'ME: ': '2052-73010-7311-000',
            'EV: ': '2052-73010-7311-000',
            'SD: ': '2036-43020-7311-000',
            'SP: ': '2001-73010-7311-000',
            'TP: ': '2052-73010-7311-000',
            'TE: ': '2052-73010-7311-000',
            'TX: ': '2048-20180-7311-000',
            'OP: ': '2052-73010-7311-000',
        },
        schoolID: {
            'BASIS San Antonio Medical Center Primary': '101',
            'BASIS San Antonio North Central Primary': '102',
            'BASIS San Antonio Shevano Campus': '103',
            'BASIS Washington DC': '201',
            'BASIS Ahwatukee': '401',
            'BASIS Chandler': '402',
            'BASIS Chandler Primary South': '403',
            'BASIS Chandler Primary North': '404',
            'BASIS Flagstaff': '405',
            'BASIS Goodyear': '406',
            'BASIS Mesa': '407',
            'BASIS Oro Valley': '408',
            'BASIS Peoria': '409',
            'BASIS Phoenix': '410',
            'BASIS Phoenix Central': '411',
            'BASIS Prescott': '412',
            'BASIS Scottsdale': '413',
            'BASIS Scottsdale Primary East': '414',
            'BASIS Tucson North': '415',
            'BASIS Tucson Primary': '416',
            'BASIS Goodyear Primary': '417',
            'BASIS Oro Valley Primary': '418',
            'BASIS Peoria Primary': '419',
            'BASIS Phoenix South Primary': '420',
            'BASIS Phoenix Primary': '421',
            'BASIS Scottsdale Primary West': '422',
            'BASIS Baton Rouge': '701',
        },
        errorPrefix: '',
        errorPrice: '',
        errorDescription: '',
        errorProduct: '',
        errorSchool: '',
        errorProductType: '',
        errorPrice: '',
        errorGrade: '',
        errorStock: '',
    }

    handleRouteChange = () => {
        this.setState({ redirect: true })
    }
    handleProductValueChange = (value) => {
        this.setState({ product: value })
    }
    handleDescriptionChange = (value) => {
        this.setState({ description: value })
    }
    handleSchoolChange = (value) => {
        this.setState({ selectedSchool: value }, this.setSKU)
    }
    handleProductTypeChange = (value) => {
        this.setState({ productType: value })
    }
    handleGradeChange = (value) => {
        for(let i=0;i<value.length; i++) {
            console.log(value[i])
            if(value[i] == 'All') {
                this.setState({allSelected: false, grade: 'All'})
            } else {
                this.setState({allSelected: true, grade: value});
            }
        }
    }
    handlePriceChange = (value) => {
        this.setState({ price: value })
    }
    handleTaxCreditChange = (value) => {
        this.setState({ taxCredit: value }, () => console.log(this.state.taxCredit))
    }
    handleShippingChange = (value) => {
        this.setState({ shipping: value })
    }
    handleTrackInventoryChange = (value) => {
        this.setState({ trackInventory: value})
    }
    handlePrefixChange = (value) => {
        this.setState({ prefix: value }, this.setSKU)
    }
    handleTaxChange = (value) => {
        this.setState({ tax: value})
    }
    handleStockChange = (value) => {
        this.setState({ stock: value })
    }

    setSKU = () => {
        if(this.state.selectedSchool != '' && this.state.prefix != '') {
            let SKU
            let schoolID
            let keys = Object.keys(this.state.productSKU)
            let schoolKeys = Object.keys(this.state.schoolID)
            for(let i=0; i<keys.length; i++) {
                if(this.state.prefix === keys[i]) {
                    SKU = this.state.productSKU[keys[i]]
                }
            }
            for(let i=0; i<schoolKeys.length; i++) {
                if(this.state.selectedSchool === schoolKeys[i]) {
                    schoolID = this.state.schoolID[schoolKeys[i]]
                }
            }
            console.log(this.state.selectedSchool, this.state.prefix)
            this.setState({ SKU: schoolID + '-' + SKU }, () => console.log(this.state.SKU))
        }
    }

    submit = () => {
        let canSubmit=true
        this.setState({ errorProduct: '', errorDescription: '', errorSchool: '', errorProductType: '', errorPrice: '', errorStock: '', errorGrade: '', errorPrefix: ''}, () => {
            if(!this.state.product) {
                this.setState({ errorProduct: 'Please enter a product tile' })
                canSubmit=false
            }
            if(!this.state.description) {
                this.setState({ errorDescription: 'Please enter a description' })
                canSubmit=false
            }
            if(!this.state.selectedSchool) {
                this.setState({ errorSchool: 'Please select a school' })
                canSubmit=false
            }
            if(!this.state.productType) {
                this.setState({errorProductType: 'Please enter select a product type' })
                canSubmit=false
            }
            if(!this.state.price) {
                this.setState({ errorPrice: 'Please enter a price' })
                canSubmit=false
            }
            console.log(this.state.trackInventory, this.state.stock)
            if(this.state.trackInventory[0] === true && !this.state.stock) {
                this.setState({ errorStock: 'Enter Stock Number' })
                canSubmit=false
            }
            if(this.state.grade.length < 1) {
                this.setState({ errorGrade: 'Select a grade' })
                canSubmit=false
            }
            if(!this.state.prefix) {
                this.setState({ errorPrefix: 'Please select a catagory' })
                canSubmit=false
            }
            console.log(canSubmit)
            if(canSubmit) {
                let obj = {
                    "title": this.state.prefix + this.state.product,
                    "desription": this.state.description,
                    "school": this.state.school,
                    "product-type": this.state.productType,
                    "price": this.state.price,
                    "SKU": this.state.SKU,
                    "grade": this.state.grade,
                    "tax-credit": this.state.taxCredit,
                    "shipping": this.state.shipping,
                    "tax": this.state.tax,
                    "track-inventory": this.state.trackInventory,
                    "stock": this.state.stock

                }                
                axios.post('http://localhost:3455/submitProduct', obj).then(res => {
                    console.log(res.data)
                })
            }

        })
    }

    render() {
        if(this.state.redirect) {return <Redirect to={{pathname: '/'}} />}

        const schoolOptions = [
            {label: 'Please Select a School', value: ''},
            {label: 'BASIS Chandler Primary North', value: 'BASIS Chandler Primary North'},
            {label: 'BASIS Scottsdale Primary West',  value: 'BASIS Scottsdale Primary West'},
            {label: 'BASIS Ahwatukee', value: 'BASIS Ahwatukee'}
        ]

        const productTypeOptions = [
            {label: 'Please Select a Product Type', value: ''},
            {label: 'Books', value: 'Books'},
            {label: 'Late Bird', value: 'Late Bird'},
            {label: 'Extracurricular Activities', value: 'Clubs'},
            {label: 'Fee', value: 'Fee'},
            {label: 'Optional', value: 'Optional Supplies'},
        ]

        const prefixOptions = [
            {label: 'Please Select a Catagory', value: ''},
            {label: 'Anything "ATF" Fundraising related', value: 'ATF: '},
            {label: 'Book Sales (non-textbook)', value: 'BK: '},
            {label: 'Elective Classes', value: 'CL: '},
            {label: 'Extracurricular Clubs/Activities', value: 'EC: '},
            {label: 'Fall/Winter/Spring Break Programs', value: 'BP: '},
            {label: 'Field Trips', value: 'FT: '},
            {label: 'Kindergarten Related', value: 'KG: '},
            {label: 'Late Bird', value: 'LB: '},
            {label: 'Meals', value: 'ME: '},
            {label: 'School Events', value: 'EV: '},
            {label: 'Student Security Deposit Fees', value: 'SD: '},
            {label: 'Summer Programs', value: 'SP: '},
            {label: 'Term Projects', value: 'TP: '},
            {label: 'Testing', value: 'TE: '},
            {label: 'Textbooks (Replacement)', value: 'TX: '},
            {label: 'Optional Items (not applicable elsewhere)', value: 'OP: '},
        ]


        return(
            <Page
                breadcrumbs={[{content: 'Products', url: '/products'}]}
                title="Add New Product"
                primaryAction={{content: 'Add Parent', disabled: false, onAction: this.handleRouteChange}}
                secondaryActions={[{content: 'Duplicate'}, {content: 'View on your store'}]}
                pagination={{
                hasPrevious: true,
                hasNext: true,
                }}
            >
                <div className='Body'>
                    <div className='Flex Dynamic-Options'>
                        <Select error={this.state.errorPrefix} label="Catagory" options={prefixOptions} value={this.state.prefix} onChange={this.handlePrefixChange} />
                        <div className='Tooltip'>
                            <Tooltip  content="This catagory ensures money is properly allocated. Select an option that associates best with the product.">
                                <Link>Learn More</Link>
                            </Tooltip>
                        </div>
                    </div>
                    <div className='Flex Dynamic-Options'>
                        <TextField error={this.state.errorProduct} label="Product Title" prefix={this.state.prefix} value={this.state.product} onChange={this.handleProductValueChange} />
                        <div className='Tooltip'>
                            <Tooltip  content="No need to add a prefix, it will be included automatically. Keep titles simple and identical to related products.">
                                <Link>Learn More</Link>
                            </Tooltip>
                        </div>
                    </div>
                    <div className='Flex Dynamic-Options'>
                        <TextField error={this.state.errorDescription} label="Product Description" value={this.state.description} onChange={this.handleDescriptionChange} />
                        <div className='Tooltip'>
                            <Tooltip content="The description parents will see when purchasing this product.">
                                <Link>Learn More</Link>
                            </Tooltip>
                        </div>
                    </div>
                    <div className='Flex Dynamic-Options'>
                        <Select error={this.state.errorSchool} label="School" options={schoolOptions} value={this.state.selectedSchool} onChange={this.handleSchoolChange} />
                        <div className='Tooltip'>
                            <Tooltip content="Only parents who have students who attend this school will see this product.">
                                <Link>Learn More</Link>
                            </Tooltip>
                        </div>
                    </div>
                    <div className='Flex Dynamic-Options'>
                        <Select error={this.state.errorProductType} label="Product Type" options={productTypeOptions} value={this.state.productType} onChange={this.handleProductTypeChange} /> 
                        <div className='Tooltip'>
                            <Tooltip content="These are the catagories shown on Shopify. To add a new catagory, please contact Matthew Werdean.">
                                <Link>Learn More</Link>
                            </Tooltip>
                        </div>
                        <div className='Fee'>
                            <Tooltip content="Attach/remove fees from customer accounts using the Fee App. Product won't be shown on the live store.">
                                <Link>About Fees</Link>
                            </Tooltip>
                        </div>
                    </div>
                    <div className='Flex Dynamic-Options'>
                        <TextField error={this.state.errorPrice} label="Price" type="number" value={this.state.price} onChange={this.handlePriceChange} prefix="$" />
                        <div className='Tooltip'>
                            <Tooltip content="If you enable 'Auto Add Tax', tax will be added through Shopify. Otherwise you must include tax in the total price.">
                                <Link>Learn More</Link>
                            </Tooltip>
                        </div>
                    </div>
                    <div className='Choice-List Flex'>
                        <div>
                            <ChoiceList
                                error={this.state.errorGrade}
                                allowMultiple={this.state.allSelected}
                                title={'Select Grade Level(s)'}
                                choices={[
                                {
                                    label: 'All',
                                    value: 'All',
                                },
                                {
                                    label: 'Pre-K',
                                    value: 'Pre-K',
                                },
                                {
                                    label: 'Kindergarten',
                                    value: 'K',
                                },
                                {
                                    label: '1st Grade',
                                    value: '1',
                                },
                                {
                                    label: '2nd Grade',
                                    value: '2',
                                },
                                {
                                    label: '3rd Grade',
                                    value: '3',
                                },
                                {
                                    label: '4th Grade',
                                    value: '4',
                                },
                                {
                                    label: '5th Grade',
                                    value: '5',
                                },
                                {
                                    label: '6th Grade',
                                    value: '6',
                                },
                                {
                                    label: '7th Grade',
                                    value: '7',
                                },
                                {
                                    label: '8th Grade',
                                    value: '8',
                                },
                                {
                                    label: '9th Grade',
                                    value: '9',
                                },
                                {
                                    label: '10th Grade',
                                    value: '10',
                                },
                                {
                                    label: '11th Grade',
                                    value: '11',
                                },
                                {
                                    label: '12th Grade',
                                    value: '12',
                                },
                                ]}
                                selected={this.state.grade}
                                onChange={this.handleGradeChange}
                            />
                            <Tooltip content="Select which grades should see this product.">
                                <Link>Learn More</Link>
                            </Tooltip>
                        </div>
                        <div>
                            <ChoiceList
                                title={'Tax Credit Eligible'}
                                choices={[
                                {label: 'True', value: true},
                                {label: 'False', value: false},
                                ]}
                                selected={this.state.taxCredit}
                                onChange={this.handleTaxCreditChange}
                            />
                            <Tooltip content="Select 'True' if you would like parents to be able to purchase this item using tax credit.">
                                <Link>Learn More</Link>
                            </Tooltip>
                        </div>
                        <div>
                            <ChoiceList
                                title={'Requires Shipping'}
                                choices={[
                                {label: 'True', value: true},
                                {label: 'False', value: false},
                                ]}
                                selected={this.state.shipping}
                                onChange={this.handleShippingChange}
                            />
                            <Tooltip content="Always defaults to false. Only select true if you plan on shipping the product. Parents will pay for shipping.">
                                <Link>Learn More</Link>
                            </Tooltip>
                        </div>
                        <div>
                            <ChoiceList
                                title={'Track Inventory'}
                                choices={[
                                {label: 'True', value: true},
                                {label: 'False', value: false},
                                ]}
                                selected={this.state.trackInventory}
                                onChange={this.handleTrackInventoryChange}
                            />
                            <Tooltip content="Whether parents are allowed to place an order for the product when it's out of stock. Keep 'False' for no limit.">
                                <Link>Learn More</Link>
                            </Tooltip>
                            {this.state.trackInventory == 'true' && <div className='Stock-Quantity'><TextField error={this.state.errorStock}label="Stock Quantity" type="number" value={this.state.stock} onChange={this.handleStockChange} /></div>}
                        </div>
                        <div>
                            <ChoiceList
                                title={'Auto Add Tax'}
                                choices={[
                                {label: 'True', value: true},
                                {label: 'False', value: false},
                                ]}
                                selected={this.state.tax}
                                onChange={this.handleTaxChange}
                            />
                            <Tooltip content="For Arizona: Adds a 5.6% State tax, and county, municipal and other taxes ranging from 0.25% to 5.3%.">
                                <Link>Learn More</Link>
                            </Tooltip>
                        </div>
                    </div> 
                    <div className='Flex Dynamic-Options'>
                        <TextField label="Auto Generated SKU" value={this.state.SKU} disabled />
                        <div className="Tooltip">
                            <Tooltip content="Auto generated based on the catagory and school you pick.">
                                <Link>Learn More</Link>
                            </Tooltip>
                        </div>
                    </div>
                </div>
                <div className='Product-Submit'><Button primary onClick={this.submit}>Submit</Button></div>
            </Page>
        )
    }
}
