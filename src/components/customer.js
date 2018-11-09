import React, { Component } from 'react';
import { Page, FormLayout, TextField, Button, Layout, Card, Select, Tooltip, Link } from '@shopify/polaris';
import { Redirect } from 'react-router-dom'
import '../App.css';
import axios from 'axios';

class Customer extends Component {
  state = {
    value: '',
    value2: '',
    value3: '',
    value5: '',
    isStudentAdded: false,
    studentCount: 0,
    selectedGrade: '',
    selectedSchool: '',
    dynamicValue: '',
    dynamicArr: [],
    redirect: false,
    submit: true,
    address1: '',
    address2: '',
    zip: '',
    city: '',
    errorFirst: '',
    errorLast: '',
    errorEmail: '',

  }

  handleChange = (value) => {
    this.setState({ value })
  }
  handleChange2 = (value) => {
    this.setState({ value2: value })
  }
  handleChange3 = (value) => {
    this.setState({ value3: value })
  }
  handleAddress1Change = (value) => {
    this.setState({ address1: value })
  }
  handleAddress2Change = (value) => {
    this.setState({ address2: value })
  }
  handleZipChange = (value) => {
    this.setState({ zip: value })
  }
  handleCityChange = (value) => {
    this.setState({ city: value })
  }
  handleChange5 = (value) => {
    this.setState({ value5: value })
  }
  handleSelectGradeChange = (e, i) => {
    console.log(e)
    let arr = this.state.dynamicArr
    arr[i].grade = e
    this.setState({dynamicArr: arr, selectedGrade: e}, () => console.log(this.state.dynamicArr))
  }
  handleSelectSchoolChange = (e, i) => {

    console.log(e)
    let arr = this.state.dynamicArr
    arr[i].school = e
    this.setState({dynamicArr: arr, selectedSchool: e}, () => console.log(this.state.dynamicArr))
  }

  handleAddStudent = () => {
    if(this.state.isStudentAdded === false) {
      this.setState({ isStudentAdded: true })
    } 
    this.setState({ studentCount: this.state.studentCount + 1})
    let arr = this.state.dynamicArr
    arr.push({id: this.state.studentCount, value: '', grade: '', school: '', errorSchool: '', errorGrade: '', errorStudentName: ''})
    this.setState({dynamicArr: arr})
    console.log(this.state.dynamicArr)
  
  }
  
  cancelStudent = (e, i) => {
    let arr = this.state.dynamicArr
    arr.splice(i, 1)
    for(let i=0; i<arr.length; i++) {
      arr[i].id = i
    }
    this.setState({ dynamicArr: arr, studentCount: this.state.studentCount -1 })
  }

  handleDynamicChange = (e, i) => {
    console.log(e)
    let arr = this.state.dynamicArr
    arr[i].value = e
    this.setState({dynamicArr: arr}, () => console.log(this.state.dynamicArr))
  }

  handleSubmit = () => {
    this.setState({ errorFirst: '', errorLast: '', errorEmail: ''})
    let canSubmit = true
    if(!this.state.value) {
      this.setState({ errorFirst: 'Please enter a first name' })
      canSubmit = false
    }
    if(!this.state.value2) {
      this.setState({ errorLast: 'Please enter a last name' })
      canSubmit = false
    }
    if(!this.state.value3) {
      this.setState({ errorEmail: 'Please enter an email' })
      canSubmit = false
    }
    if(this.state.dynamicArr.length > 0) {
      for(let i = 0; i<this.state.dynamicArr.length; i++) {
        let arr = this.state.dynamicArr
        arr[i].errorStudentName = ''
        arr[i].errorSchool = ''
        arr[i].errorGrade = ''
        this.setState({ dynamicArr: arr })

        if(!this.state.dynamicArr[i].value) {
          arr[i].errorStudentName = 'Please enter a student name'
          this.setState({ dynamicArr: arr })
          canSubmit = false
        }
        if(!this.state.dynamicArr[i].school) {
          arr[i].errorSchool = 'Please enter a school'
          this.setState({ dynamicArr: arr })
          canSubmit = false
        }
        if(!this.state.dynamicArr[i].grade) {
          arr[i].errorGrade = 'Please enter a grade'
          this.setState({ dynamicArr: arr })
          canSubmit = false
        }
      }
    }

    if(canSubmit) {
      const obj = {
        'first_name': this.state.value,
        'last_name': this.state.value2,
        'email': this.state.value3,
        'phone': this.state.value5,
        "address1": this.state.address1,
        "address2": this.state.address2,
        "city": this.state.city,
        "zip": this.state.zip,
        'students': this.state.dynamicArr
      }
      axios.post(`http://localhost:3455/submitNewCustomer`, obj).then(res => {
        console.log(res.data)
      })   
    }
  }

  handleRouteChange = () => {
      this.setState({redirect: true})
  }

  render() {
    if(this.state.redirect) {
        return <Redirect to={{pathname: '/products'}} />
    }

    const options = [
      {label: 'Select a grade', value: ''},
      {label: 'Kindergarten', value: 'K'},
      {label: '1st Grade', value: '1'},
      {label: '2nd Grade', value: '2'},
      {label: '3rd Grade', value: '3'},
      {label: '4th Grade', value: '4'},
      {label: '5th Grade', value: '5'},
      {label: '6th Grade', value: '6'},
      {label: '7th Grade', value: '7'},
      {label: '8th Grade', value: '8'},
      {label: '9th Grade', value: '9'},
      {label: '10th Grade', value: '10'},
      {label: '11th Grade', value: '11'},
      {label: '12th Grade', value: '12'},
    ];
    const options2 = [
      {label: 'Select a school', value: ''},
      {label: 'BASIS Chandler Primary North', value: 'BASIS Chandler Primary North'},
      {label: 'BASIS Scottsdale Primary West', value: 'BASIS Scottsdale Primary - West Campus'},
      {label: 'BASIS Ahwatukee', value: 'BASIS Ahwatukee'},
    ];
    let addStudentSection = []
    for(let i = 0; i<this.state.studentCount; i++) {
      addStudentSection.push(
        <div key={i} className='Add-Student-Section'>
          <Layout>
            <Layout.AnnotatedSection
              title={`Add Student ${i + 1}`}
              description='Please enter student information'
            >
            <Card sectioned>
              <FormLayout>
                <div className='Flex Dynamic-Options'>
                  <TextField label="Enter Student Name" value={this.state.dynamicArr[i].value} onChange={e=> this.handleDynamicChange(e, i)} error={this.state.dynamicArr[i].errorStudentName} />
                  <div className='Close'>
                    <div onClick={e => this.cancelStudent(e, i)} className="X">X</div>
                  </div>
                </div>
                <div className='Add-Student-Select'>
                  <Select
                    label="Grade"
                    options={options}
                    onChange={(e) => this.handleSelectGradeChange(e, i)}
                    value={this.state.dynamicArr[i].grade}
                    error={this.state.dynamicArr[i].errorGrade}
                  />
                </div>
                <div className='Add-Student-Select'>
                  <Select
                    label="School"
                    options={options2}
                    onChange={(e) => this.handleSelectSchoolChange(e, i)}
                    value={this.state.dynamicArr[i].school}
                    error={this.state.dynamicArr[i].errorSchool}
                  />
                </div>
              </FormLayout>
            </Card>
            </Layout.AnnotatedSection>
          </Layout>
        </div>
      )
    }


    return (
      <Page
        breadcrumbs={[{content: 'Products', url: '/products'}]}
        title="Add New Parent"
        primaryAction={{content: 'Add Product', disabled: false, onAction: this.handleRouteChange}}
        secondaryActions={[ {content: '* These fields are required'}]}
        pagination={{
          hasPrevious: true,
          hasNext: true,
        }}
      >
      <div className='Form'>
        <div className='Text-Field'>
          <TextField
          label="First Name *"
          value={this.state.value}
          onChange={this.handleChange}
          error={this.state.errorFirst}
        />
          <TextField
          label="Last Name *"
          value={this.state.value2}
          onChange={this.handleChange2}
          error={this.state.errorLast}
        />
        </div>
        <div>
          <TextField
          label="Email Address *"
          value={this.state.value3}
          onChange={this.handleChange3}
          error={this.state.errorEmail}
          />
        </div>
        <div className='Flex Dynamic-Options'>
          <TextField
          label="Address Line 1"
          value={this.state.address1}
          onChange={this.handleAddress1Change}
          />
            <div className='Tooltip'>
                <Tooltip content="Address and phone number are not required, but are appreciated.">
                    <Link>Learn More</Link>
                </Tooltip>
            </div>
        </div>
        <div>
          <TextField
          label="Address Line 2 (Apartment, suite, unit, building, floor, etc.)"
          value={this.state.address2}
          onChange={this.handleAddress2Change}
          />
        </div>
        <div className='Flex Address'>
          <TextField
          label="ZIP / Postal code"
          value={this.state.zip}
          onChange={this.handleZipChange}
          />
          <TextField
          label="City"
          value={this.state.city}
          onChange={this.handleCityChange}
          />
        </div>
        <div>
          <TextField
          label="Phone Number"
          type="number"
          value={this.state.value5}
          onChange={this.handleChange5}
          />
        </div>
        </div>
          {this.state.isStudentAdded && 
            <div>
              {addStudentSection}
            </div>
            }
        <div className='Add-Student-Button'>
          {this.state.submit && <Button primary onClick={this.handleSubmit}>Submit</Button>}
          <Button secondary onClick={this.handleAddStudent}>Add Student</Button>
        </div>
      </Page>
    );
  }
}

export default Customer;
