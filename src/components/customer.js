import React, { Component } from 'react';
import { Page, FormLayout, TextField, Button, Layout, Card, Select } from '@shopify/polaris';
import { Redirect } from 'react-router-dom'
import '../App.css';
import axios from 'axios';

class Customer extends Component {
  state = {
    value: '',
    value2: '',
    value3: '',
    value4: '',
    value5: '',
    isStudentAdded: false,
    studentCount: 0,
    selectedGrade: 'Kindergarten',
    selectedSchool: 'BASIS Chandler Primary North',
    dynamicValue: '',
    dynamicArr: [],
    redirect: false,
    submit: true,
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
  handleChange4 = (value) => {
    this.setState({ value4: value })
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
    arr.push({id: this.state.studentCount, value: '', grade: 'K', school: 'BASIS Chandler Primary North'})
    this.setState({dynamicArr: arr})
    console.log(this.state.dynamicArr)
  
  }
  handleDynamicChange = (e, i) => {
    let arr = this.state.dynamicArr
    arr[i].value = e.target.value
    this.setState({dynamicArr: arr}, () => console.log(this.state.dynamicArr))
  }

  handleSubmit = () => {
    const obj = {
      'firstname': this.state.value,
      'lastname': this.state.value2,
      'email': this.state.value3,
      'address': this.state.value4,
      'phonenumber': this.state.value5,
      'students': this.state.dynamicArr
      
    }
    axios.post(`http://localhost:3455/submitNewCustomer`, obj).then(res => {
      console.log(res.data)
    })   
  }

  handleRouteChange = () => {
      this.setState({redirect: true})
  }


  render() {
if(this.state.redirect) {
    return <Redirect to={{pathname: '/products'}} />
}

    let addStudentSection = []
    const options = [
      {label: 'Kindergarten', value: 'K'},
      {label: '1st Grade', value: '1'},
      {label: '2nd Grade', value: '2'},
      {label: '3rd Grade', value: '3'},
      {label: '4th Grade', value: '4'},
      {label: '5th Grade', value: '5'},
      {label: '6th Grade', value: '6'},
    ];
    const options2 = [
      {label: 'BASIS Chandler Primary North', value: 'BASIS Chandler Primary North'},
      {label: 'BASIS Scottsdale Primary West', value: 'BASIS Scottsdale Primary - West Campus'},
      {label: 'BASIS Ahwatukee', value: 'BASIS Ahwatukee'},
    ];
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
                <div className='Dynamic-Student-Name'>
                  <div>Enter Student Name</div>
                  <input  value={this.state.dynamicArr[i].value} onChange={e => this.handleDynamicChange(e, i)}/>
                </div>
                <div className='Add-Student-Select'>
                  <Select
                    label="Grade"
                    options={options}
                    onChange={(e) => this.handleSelectGradeChange(e, i)}
                    value={this.state.dynamicArr[i].grade}
                  />
                </div>
                <div className='Add-Student-Select'>
                  <Select
                    label="School"
                    options={options2}
                    onChange={(e) => this.handleSelectSchoolChange(e, i)}
                    value={this.state.dynamicArr[i].school}
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
        secondaryActions={[{content: 'Duplicate'}, {content: 'View on your store'}]}
        pagination={{
          hasPrevious: true,
          hasNext: true,
        }}
      >
      <div className='Form'>
        <div className='Text-Field'>
          <TextField
          label="Enter Customer First Name"
          value={this.state.value}
          onChange={this.handleChange}
        />
          <TextField
          label="Enter Customer Last Name"
          value={this.state.value2}
          onChange={this.handleChange2}
        />
        </div>
        <div>
          <TextField
          label="Enter Customer Email Address"
          value={this.state.value3}
          onChange={this.handleChange3}
          />
        </div>
        <div>
          <TextField
          label="Enter Customer Home Address (Optional)"
          value={this.state.value4}
          onChange={this.handleChange4}
          />
        </div>
        <div>
          <TextField
          label="Enter Customer Phone Number (Optional)"
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
          <Button primary onClick={this.handleAddStudent}>Add Student</Button>
        </div>
      </Page>
    );
  }
}

export default Customer;
